/**
 * @motif-js/compiler-core
 *
 * Renderer-agnostic compile-time analysis and extraction. Wraps
 * `@motif-js/core`'s resolver so compiled output is byte-identical to
 * the runtime output. Plugin shims (Babel, SWC, Metro) consume this.
 */

export const PACKAGE_NAME = '@motif-js/compiler-core';

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

export type {
  CallSiteAnalysis,
  Classification,
  NativeExtractionResult,
  PrimitiveBinding,
  PropAnalysis,
  WebExtractionResult,
} from './types.js';
