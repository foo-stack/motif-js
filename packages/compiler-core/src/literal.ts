import * as t from '@babel/types';

/**
 * Try to evaluate a Babel AST expression node into a plain JS value.
 *
 * Handles the cases the compiler needs for static-extraction:
 * - String / numeric / boolean / null literals.
 * - Negative numeric literals (`-4` shows up as `UnaryExpression` over a
 *   numeric literal in Babel's AST).
 * - Template literals with no `${...}` substitutions.
 * - Object expressions whose keys are identifiers/strings/numerics and
 *   whose values are themselves literal-extractable.
 * - Array expressions whose elements are themselves literal-extractable.
 * - Identifiers bound (in scope) to a `const` initialiser that itself
 *   evaluates to a literal.
 *
 * Returns `{ ok: false }` for anything else (function calls, member
 * expressions on non-constant bindings, expressions involving `props`,
 * spread elements, etc.). The caller treats those as runtime-only.
 */
export interface LiteralOk {
  readonly ok: true;
  readonly value: unknown;
}
export interface LiteralFail {
  readonly ok: false;
}
export type LiteralResult = LiteralOk | LiteralFail;

const FAIL: LiteralFail = { ok: false };

/**
 * Babel scope handle as exposed by `@babel/traverse`. Typed loosely here
 * so this module can be consumed without dragging in the traverse types.
 */
interface PathLike {
  readonly node: t.Node;
  readonly parentPath: PathLike | null;
}
interface BindingLike {
  readonly kind: string;
  readonly constant: boolean;
  readonly path: { readonly node: t.Node };
  /**
   * Reference sites of the binding. Optional so a minimal `ScopeLike`
   * (without traverse) still type-checks; when absent the mutation guard
   * can't run and we fall back to the `constant`-only gate.
   */
  readonly referencePaths?: ReadonlyArray<PathLike>;
  /**
   * The scope in which the binding is declared. Used to resolve the
   * binding's initialiser in its OWN scope rather than the reference
   * site's — otherwise an identifier inside the initialiser that is
   * shadowed at the call site resolves to the shadow and bakes the wrong
   * value. Optional so a minimal `ScopeLike` still type-checks; falls back
   * to the reference-site scope.
   */
  readonly scope?: ScopeLike;
}
export interface ScopeLike {
  getBinding(name: string): BindingLike | null | undefined;
}

/**
 * Detect whether a `const` binding's object/array value is mutated in place
 * after initialisation. Babel's `binding.constant` only means the *binding*
 * is never reassigned — it stays `true` for `const o = {…}; o.x = 1` or
 * `const a = []; a.push(1)`. Baking the initialiser as a literal in those
 * cases ships stale values that diverge from what the runtime sees, so any
 * such reference makes the binding non-extractable.
 *
 * Conservative: flags member-assignment (`o.x =`, `o.x +=`), update
 * (`o.x++`), `delete o.x`, and any method call on the binding (`a.push()`,
 * `a.sort()` — can't tell mutating from pure, so assume mutating). Also
 * flags a reference passed as a call *argument* (`Object.assign(o, …)`,
 * `mutate(o)`), where the callee may mutate it out of view. Plain reads
 * (`<Box style={o} />`, `o.x` lookups, value copies via `const b = o.x`)
 * are untouched — including the `const A = B` chains the extractor relies
 * on to resolve a value through an intermediate binding.
 */
function bindingIsMutated(binding: BindingLike, seen: Set<BindingLike> = new Set()): boolean {
  // Guard against alias cycles when recursing through `const b = a` chains.
  if (seen.has(binding)) return false;
  seen.add(binding);
  const refs = binding.referencePaths;
  if (refs === undefined) return false;
  for (const ref of refs) {
    const parent = ref.parentPath;
    if (parent === null) continue;
    const p = parent.node;

    // Member access rooted at the binding: o, o.x, o.x.y, … Walk up the FULL
    // member chain so a write/update/delete/call at any depth is caught, not
    // just a direct `o.x =`. `const o = { x: { y: 1 } }; o.x.y = 2` mutates o
    // through a nested member and must make o non-extractable.
    if (t.isMemberExpression(p) && p.object === ref.node) {
      let memberPath: PathLike = parent;
      let member: t.MemberExpression = p;
      while (
        memberPath.parentPath !== null &&
        t.isMemberExpression(memberPath.parentPath.node) &&
        memberPath.parentPath.node.object === member
      ) {
        memberPath = memberPath.parentPath;
        member = memberPath.node as t.MemberExpression;
      }
      const outer = memberPath.parentPath?.node;
      if (outer === undefined || outer === null) continue;
      if (t.isAssignmentExpression(outer) && outer.left === member) return true;
      if (t.isUpdateExpression(outer) && outer.argument === member) return true;
      if (t.isUnaryExpression(outer) && outer.operator === 'delete' && outer.argument === member)
        return true;
      if (t.isCallExpression(outer) && outer.callee === member) return true;
      continue;
    }

    // Passed as an argument to a call — the callee may capture or mutate it
    // (`Object.assign(o, …)`, `mutate(o)`). Can't prove purity, so bail.
    if (t.isCallExpression(p) && p.arguments.some((a) => a === ref.node)) return true;

    // Aliased by `const alias = o`. A read-alias is safe *only if the alias
    // itself is never mutated* (`const a = o; a.p = 8` mutates o out of view).
    // Resolve the alias binding and recurse; bail if it can't be resolved.
    if (t.isVariableDeclarator(p) && p.init === ref.node && t.isIdentifier(p.id)) {
      const aliasBinding = binding.scope?.getBinding(p.id.name);
      if (aliasBinding === null || aliasBinding === undefined) return true;
      if (bindingIsMutated(aliasBinding, seen)) return true;
      continue;
    }
  }
  return false;
}

export function evaluateLiteral(node: t.Node | null | undefined, scope?: ScopeLike): LiteralResult {
  if (node === null || node === undefined) return FAIL;

  if (t.isStringLiteral(node)) return { ok: true, value: node.value };
  if (t.isNumericLiteral(node)) return { ok: true, value: node.value };
  if (t.isBooleanLiteral(node)) return { ok: true, value: node.value };
  if (t.isNullLiteral(node)) return { ok: true, value: null };

  // -4 / -1.5 etc.
  if (t.isUnaryExpression(node) && node.operator === '-' && node.prefix) {
    const inner = evaluateLiteral(node.argument, scope);
    if (inner.ok && typeof inner.value === 'number') {
      return { ok: true, value: -inner.value };
    }
    return FAIL;
  }

  // `foo` (no substitutions).
  if (t.isTemplateLiteral(node) && node.expressions.length === 0) {
    return { ok: true, value: node.quasis.map((q) => q.value.cooked ?? q.value.raw).join('') };
  }

  if (t.isObjectExpression(node)) {
    const out: Record<string, unknown> = {};
    for (const prop of node.properties) {
      if (!t.isObjectProperty(prop) || prop.computed) return FAIL;
      const key = prop.key;
      let keyName: string | null = null;
      if (t.isIdentifier(key)) keyName = key.name;
      else if (t.isStringLiteral(key)) keyName = key.value;
      else if (t.isNumericLiteral(key)) keyName = String(key.value);
      if (keyName === null) return FAIL;
      // Allow shorthand only when the value reduces to a literal (rare).
      const val = prop.value;
      if (t.isPatternLike(val) || !t.isExpression(val)) return FAIL;
      const inner = evaluateLiteral(val, scope);
      if (!inner.ok) return FAIL;
      out[keyName] = inner.value;
    }
    return { ok: true, value: out };
  }

  if (t.isArrayExpression(node)) {
    const out: unknown[] = [];
    for (const el of node.elements) {
      if (el === null) {
        out.push(undefined);
        continue;
      }
      if (t.isSpreadElement(el)) return FAIL;
      const inner = evaluateLiteral(el, scope);
      if (!inner.ok) return FAIL;
      out.push(inner.value);
    }
    return { ok: true, value: out };
  }

  if (t.isIdentifier(node) && scope !== undefined) {
    if (node.name === 'undefined') return { ok: true, value: undefined };
    const binding = scope.getBinding(node.name);
    if (binding === null || binding === undefined) return FAIL;
    if (binding.kind !== 'const' || !binding.constant) return FAIL;
    if (bindingIsMutated(binding)) return FAIL;
    const target = binding.path.node;
    if (t.isVariableDeclarator(target) && target.init !== null && target.init !== undefined) {
      // Resolve the initialiser in the binding's *own* scope so an identifier
      // inside it isn't captured by a shadow at the reference site.
      return evaluateLiteral(target.init, binding.scope ?? scope);
    }
    return FAIL;
  }

  return FAIL;
}
