import { Box } from '@usemotif/react';
import { useCallback, useId, useMemo, useState } from 'react';
import { Check, Copy } from './icons.js';
import {
  type ControlSpec,
  type ControlState,
  type ControlValue,
  type PlaygroundDemoName,
  playgroundDemos,
} from './playground-demos/index.js';

const ROOT_STYLE = { fontFeatureSettings: 'normal' } as const;
const PRE_STYLE = { whiteSpace: 'pre' as const, tabSize: 2 as const };

export interface PlaygroundProps {
  /**
   * Name of a registered demo in `playground-demos/`. Defaults to `'hero'`,
   * the cross-page introductory demo. Per-component pages pass their own
   * demo name (e.g. `demo="box"`).
   */
  demo?: PlaygroundDemoName;
  /**
   * Replaces the header label shown above the editor pane. Falls back to the
   * registered demo's `label`.
   */
  label?: string;
  /**
   * Cosmetic variant. `'strip'` is the slimmer hero-strip used at the top of
   * component pages; default `'card'` matches the existing playground card.
   */
  variant?: 'card' | 'strip';
}

export function Playground({ demo = 'hero', label, variant = 'card' }: PlaygroundProps = {}) {
  const registered = playgroundDemos[demo];
  const initialState = useMemo(() => seedState(registered.controls), [registered]);
  const [state, setState] = useState<ControlState>(initialState);
  const [copied, setCopied] = useState(false);

  const code = registered.code(state);
  const lines = code.split('\n');
  const headerLabel = label ?? registered.label;

  const onCopy = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => undefined);
    }
    setCopied(true);
    const id = window.setTimeout(() => setCopied(false), 1400);
    return () => window.clearTimeout(id);
  }, [code]);

  const setControl = useCallback((id: string, value: ControlValue) => {
    setState((prev) => ({ ...prev, [id]: value }));
  }, []);

  return (
    <Box
      mt={0}
      mb={variant === 'strip' ? 16 : 28}
      borderStyle="solid"
      borderWidth={1}
      borderColor="$colors.line.base"
      borderRadius={variant === 'strip' ? '8px' : '10px'}
      bg="$colors.surface.paper2"
      overflow="hidden"
      style={ROOT_STYLE}
    >
      <Header label={headerLabel} copied={copied} onCopy={onCopy} />
      <Box display="grid" style={{ gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)' }}>
        <Editor lines={lines} />
        <Preview
          node={registered.preview(state)}
          controls={registered.controls}
          state={state}
          setControl={setControl}
        />
      </Box>
    </Box>
  );
}

function seedState(controls: readonly ControlSpec[] | undefined): ControlState {
  if (!controls) return {};
  const seed: Record<string, ControlValue> = {};
  for (const c of controls) seed[c.id] = c.defaultValue;
  return seed;
}

function Header({ label, copied, onCopy }: { label: string; copied: boolean; onCopy: () => void }) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      px={14}
      py={10}
      borderBottomStyle="solid"
      borderBottomWidth={1}
      borderBottomColor="$colors.line.faint"
      bg="$colors.surface.paper3"
    >
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        gap={8}
        fontFamily="$fontFamilies.mono"
        fontWeight={500}
        fontSize="11px"
        lineHeight={1}
        textTransform="uppercase"
        letterSpacing="0.1em"
        color="$colors.fg.faint"
      >
        <Box
          as="span"
          aria-hidden="true"
          w={6}
          h={6}
          borderRadius="50%"
          bg="$colors.accent.base"
          style={{
            boxShadow: '0 0 0 3px color-mix(in oklab, var(--colors-accent-base) 22%, transparent)',
          }}
        />
        {label}
      </Box>
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy snippet"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 9px',
          borderRadius: 5,
          border: '1px solid var(--colors-line-faint)',
          background: 'var(--colors-surface-paper)',
          color: 'var(--colors-fg-muted)',
          cursor: 'pointer',
          fontFamily: 'var(--font-families-mono)',
          fontWeight: 500,
          fontSize: 11,
          lineHeight: 1,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          transition: 'all 120ms var(--easings-base)',
        }}
      >
        {copied ? <Check width={12} height={12} /> : <Copy width={12} height={12} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </Box>
  );
}

function Editor({ lines }: { lines: readonly string[] }) {
  return (
    <Box
      bg="$colors.surface.paper2"
      borderRightStyle="solid"
      borderRightWidth={1}
      borderRightColor="$colors.line.faint"
      overflowX="auto"
      maxW="100%"
    >
      <Box
        as="pre"
        m={0}
        py={14}
        px={0}
        fontFamily="$fontFamilies.mono"
        fontWeight={400}
        fontSize="13px"
        lineHeight={1.7}
        color="$colors.fg.strong"
        style={PRE_STYLE}
      >
        {lines.map((line, i) => (
          // eslint-disable-next-line react/no-array-index-key -- editor lines are positional
          <Box key={i} as="span" display="grid" style={{ gridTemplateColumns: 'auto 1fr' }}>
            <Box
              as="span"
              px={14}
              color="$colors.fg.faint"
              style={{ userSelect: 'none', opacity: 0.55, textAlign: 'right', minWidth: '2.25ch' }}
            >
              {i + 1}
            </Box>
            <Box as="span" pr={14}>
              {line.length === 0 ? ' ' : line}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function Preview({
  node,
  controls,
  state,
  setControl,
}: {
  node: React.ReactNode;
  controls: readonly ControlSpec[] | undefined;
  state: ControlState;
  setControl: (id: string, value: ControlValue) => void;
}) {
  const previewLabelId = useId();
  const hasControls = controls && controls.length > 0;
  return (
    <Box
      position="relative"
      bg="$colors.surface.paper"
      display="flex"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: 220, paddingBottom: hasControls ? 56 : 24 }}
    >
      <Box
        as="span"
        id={previewLabelId}
        position="absolute"
        top={12}
        left={14}
        fontFamily="$fontFamilies.mono"
        fontWeight={500}
        fontSize="11px"
        lineHeight={1}
        textTransform="uppercase"
        letterSpacing="0.1em"
        color="$colors.fg.faint"
      >
        Preview
      </Box>
      {node}
      {hasControls ? <Controls controls={controls} state={state} setControl={setControl} /> : null}
    </Box>
  );
}

function Controls({
  controls,
  state,
  setControl,
}: {
  controls: readonly ControlSpec[];
  state: ControlState;
  setControl: (id: string, value: ControlValue) => void;
}) {
  return (
    <Box
      position="absolute"
      left={14}
      bottom={14}
      right={14}
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      alignItems="center"
      gap={16}
      fontFamily="$fontFamilies.mono"
      fontWeight={500}
      fontSize="11px"
      lineHeight={1}
      textTransform="uppercase"
      letterSpacing="0.08em"
      color="$colors.fg.faint"
    >
      {controls.map((c) => (
        <Control key={c.id} spec={c} value={state[c.id]} onChange={(v) => setControl(c.id, v)} />
      ))}
    </Box>
  );
}

function Control({
  spec,
  value,
  onChange,
}: {
  spec: ControlSpec;
  value: ControlValue | undefined;
  onChange: (value: ControlValue) => void;
}) {
  if (spec.kind === 'color') {
    return (
      <ControlLabel label={spec.label}>
        <input
          type="color"
          value={String(value ?? spec.defaultValue)}
          onChange={(e) => onChange(e.target.value)}
          aria-label={spec.label}
          style={{
            width: 22,
            height: 22,
            border: '1px solid var(--colors-line-base)',
            borderRadius: 4,
            padding: 0,
            background: 'none',
            cursor: 'pointer',
          }}
        />
      </ControlLabel>
    );
  }
  if (spec.kind === 'range') {
    return (
      <ControlLabel label={spec.label}>
        <input
          type="range"
          min={spec.min}
          max={spec.max}
          step={spec.step ?? 1}
          value={Number(value ?? spec.defaultValue)}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={spec.label}
          style={{ width: 64 }}
        />
        <Box as="span" color="$colors.fg.muted" style={{ minWidth: '2ch' }}>
          {Number(value ?? spec.defaultValue)}
        </Box>
      </ControlLabel>
    );
  }
  if (spec.kind === 'toggle') {
    return (
      <ControlLabel label={spec.label}>
        <input
          type="checkbox"
          checked={Boolean(value ?? spec.defaultValue)}
          onChange={(e) => onChange(e.target.checked)}
          aria-label={spec.label}
        />
      </ControlLabel>
    );
  }
  return (
    <ControlLabel label={spec.label}>
      <select
        value={String(value ?? spec.defaultValue)}
        onChange={(e) => onChange(e.target.value)}
        aria-label={spec.label}
        style={{
          fontFamily: 'var(--font-families-mono)',
          fontSize: 11,
          padding: '2px 6px',
          borderRadius: 4,
          border: '1px solid var(--colors-line-base)',
          background: 'var(--colors-surface-paper)',
          color: 'var(--colors-fg-muted)',
        }}
      >
        {spec.options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </ControlLabel>
  );
}

function ControlLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box as="label" display="inline-flex" alignItems="center" gap={7}>
      {label}
      {children}
    </Box>
  );
}

export default Playground;
