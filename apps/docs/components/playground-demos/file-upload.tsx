import type { ControlSpec, ControlState, PlaygroundDemo } from './index.js';

const controls: readonly ControlSpec[] = [
  { kind: 'toggle', id: 'dragging', label: 'dragging', defaultValue: false },
];

function code(state: ControlState): string {
  return `import { FileUpload } from 'usemotif/headless';

<FileUpload accept="image/*" multiple onFiles={upload}>
  {({ isDragging, openPicker }) => (
    // isDragging === ${Boolean(state.dragging)}
    <DropZone active={isDragging} onClick={openPicker} />
  )}
</FileUpload>`;
}

function preview(state: ControlState) {
  const dragging = Boolean(state.dragging);
  return (
    <div
      style={{
        width: 220,
        height: 110,
        borderRadius: 10,
        border: `2px dashed ${dragging ? 'var(--colors-accent-base)' : 'var(--colors-line-base)'}`,
        background: dragging ? 'var(--colors-surface-muted)' : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <span style={{ fontSize: 22 }}>⬆</span>
      <span
        style={{
          fontFamily: 'var(--font-families-sans)',
          fontSize: 13,
          color: 'var(--colors-fg-muted)',
        }}
      >
        {dragging ? 'Drop to upload' : 'Drag files or click to browse'}
      </span>
    </div>
  );
}

export const fileUploadDemo: PlaygroundDemo = {
  label: 'FileUpload',
  code,
  preview,
  controls,
};
