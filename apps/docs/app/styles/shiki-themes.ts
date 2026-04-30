/**
 * Custom Shiki themes that mirror the design's `.tk-*` palette.
 *
 *   Light (paper):
 *     keyword     #9A3412   (terracotta-700)
 *     string      #65733C   (moss)
 *     comment     #A8A29E   (stone-300, fg-faint)
 *     number      #6B5BA0   (lavender)
 *     type        #B45309   (ochre-500)
 *     function    #1C5775   (slate-blue)
 *     punctuation #57534E   (stone-500, fg-muted)
 *     var         #1C1917   (ink-400, fg-strong)
 *
 *   Dark (ink) — same hue families lifted for contrast on warm-ink bg.
 */

import type { ThemeRegistration } from 'shiki';

const PAPER_FG = '#1C1917';
const PAPER_BG = '#F5EFE6';
const INK_FG = '#FBF7F2';
const INK_BG = '#1A1714';

export const motifPaperTheme: ThemeRegistration = {
  name: 'motif-paper',
  type: 'light',
  colors: {
    'editor.background': PAPER_BG,
    'editor.foreground': PAPER_FG,
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#A8A29E', fontStyle: 'italic' } },

    { scope: ['string', 'string.quoted', 'string.template', 'meta.embedded.expression'], settings: { foreground: '#65733C' } },
    { scope: ['constant.character.escape'], settings: { foreground: '#65733C' } },

    { scope: ['constant.numeric', 'constant.language.boolean', 'constant.language.null'], settings: { foreground: '#6B5BA0' } },
    { scope: ['constant', 'support.constant'], settings: { foreground: '#6B5BA0' } },

    {
      scope: [
        'keyword',
        'keyword.control',
        'keyword.operator.new',
        'keyword.operator.expression',
        'storage',
        'storage.type',
        'storage.modifier',
      ],
      settings: { foreground: '#9A3412' },
    },

    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'entity.other.inherited-class',
        'support.type',
        'support.class',
        'meta.type.declaration entity.name.type',
      ],
      settings: { foreground: '#B45309' },
    },

    {
      scope: [
        'entity.name.function',
        'entity.name.method',
        'meta.function-call entity.name.function',
        'support.function',
        'meta.method-call entity.name.function',
      ],
      settings: { foreground: '#1C5775' },
    },

    {
      scope: [
        'variable',
        'variable.parameter',
        'variable.other',
        'meta.var.expr',
        'meta.definition.variable',
      ],
      settings: { foreground: PAPER_FG },
    },

    {
      scope: [
        'punctuation',
        'meta.brace',
        'keyword.operator',
        'punctuation.separator',
        'punctuation.terminator',
        'punctuation.definition',
      ],
      settings: { foreground: '#57534E' },
    },

    {
      scope: ['entity.name.tag', 'entity.name.tag.html'],
      settings: { foreground: '#9A3412' },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: '#B45309' },
    },

    // Shell/bash
    { scope: ['constant.language', 'meta.command-substitution', 'punctuation.section'], settings: { foreground: '#57534E' } },
  ],
};

export const motifInkTheme: ThemeRegistration = {
  name: 'motif-ink',
  type: 'dark',
  colors: {
    'editor.background': INK_BG,
    'editor.foreground': INK_FG,
  },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#A8A29E', fontStyle: 'italic' } },

    { scope: ['string', 'string.quoted', 'string.template', 'meta.embedded.expression'], settings: { foreground: '#B5C883' } },
    { scope: ['constant.character.escape'], settings: { foreground: '#B5C883' } },

    { scope: ['constant.numeric', 'constant.language.boolean', 'constant.language.null'], settings: { foreground: '#B5A3F0' } },
    { scope: ['constant', 'support.constant'], settings: { foreground: '#B5A3F0' } },

    {
      scope: [
        'keyword',
        'keyword.control',
        'keyword.operator.new',
        'keyword.operator.expression',
        'storage',
        'storage.type',
        'storage.modifier',
      ],
      settings: { foreground: '#F4A672' },
    },

    {
      scope: [
        'entity.name.type',
        'entity.name.class',
        'entity.other.inherited-class',
        'support.type',
        'support.class',
        'meta.type.declaration entity.name.type',
      ],
      settings: { foreground: '#E0A95E' },
    },

    {
      scope: [
        'entity.name.function',
        'entity.name.method',
        'meta.function-call entity.name.function',
        'support.function',
        'meta.method-call entity.name.function',
      ],
      settings: { foreground: '#8FCBE8' },
    },

    {
      scope: [
        'variable',
        'variable.parameter',
        'variable.other',
        'meta.var.expr',
        'meta.definition.variable',
      ],
      settings: { foreground: INK_FG },
    },

    {
      scope: [
        'punctuation',
        'meta.brace',
        'keyword.operator',
        'punctuation.separator',
        'punctuation.terminator',
        'punctuation.definition',
      ],
      settings: { foreground: '#C7BFB1' },
    },

    {
      scope: ['entity.name.tag', 'entity.name.tag.html'],
      settings: { foreground: '#F4A672' },
    },
    {
      scope: ['entity.other.attribute-name'],
      settings: { foreground: '#E0A95E' },
    },

    { scope: ['constant.language', 'meta.command-substitution', 'punctuation.section'], settings: { foreground: '#C7BFB1' } },
  ],
};
