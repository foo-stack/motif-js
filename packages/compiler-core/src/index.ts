/**
 * @usemotif/compiler-core
 *
 * Renderer-agnostic compile-time analysis and extraction. Wraps
 * `@usemotif/core`'s resolver so compiled output is byte-identical to
 * the runtime output. Plugin shims (Babel, SWC, Metro) consume this.
 */

export const PACKAGE_NAME = '@usemotif/compiler-core';

export { evaluateLiteral } from './literal.js';
export type { LiteralFail, LiteralOk, LiteralResult, ScopeLike } from './literal.js';

export { classifyJsxAttributes } from './analyze.js';
export { extractWeb } from './extract-web.js';
export { extractNative } from './extract-native.js';
export {
  DEFAULT_MOTIF_SOURCES,
  PRIMITIVE_NAMES,
  bindingForJsxName,
  findMotifBindings,
} from './imports.js';

export { PRIMITIVE_INFO, getPrimitiveInfo } from './primitives.js';
export type { PrimitiveInfo } from './primitives.js';

export { analyzeStripSafety } from './safety-analysis.js';
export type { BailReason, StripSafetyResult } from './safety-analysis.js';

export { findThemeChainCombos } from './theme-chains.js';

export { evaluateStyledConfig, resolveStyledMergedProps } from './styled.js';
export type {
  ResolvedCompoundVariant,
  ResolvedStyledConfig,
  ResolvedVariantEntry,
} from './styled.js';

export type {
  CallSiteAnalysis,
  Classification,
  MotionPropAnalysis,
  NativeExtractionResult,
  PrimitiveBinding,
  PropAnalysis,
  PseudoStateAnalysis,
  ExtractWebOptions,
  WebExtractionResult,
} from './types.js';
