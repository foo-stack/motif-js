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
 * `a.sort()` — can't tell mutating from pure, so assume mutating). Plain
 * reads (`<Box style={o} />`) are untouched.
 */
function bindingIsMutated(binding: BindingLike): boolean {
  const refs = binding.referencePaths;
  if (refs === undefined) return false;
  for (const ref of refs) {
    const member = ref.parentPath;
    if (member === null) continue;
    const m = member.node;
    if (!t.isMemberExpression(m) || m.object !== ref.node) continue;
    const outer = member.parentPath?.node;
    if (outer === undefined || outer === null) continue;
    if (t.isAssignmentExpression(outer) && outer.left === m) return true;
    if (t.isUpdateExpression(outer) && outer.argument === m) return true;
    if (t.isUnaryExpression(outer) && outer.operator === 'delete' && outer.argument === m)
      return true;
    if (t.isCallExpression(outer) && outer.callee === m) return true;
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
      return evaluateLiteral(target.init, scope);
    }
    return FAIL;
  }

  return FAIL;
}
