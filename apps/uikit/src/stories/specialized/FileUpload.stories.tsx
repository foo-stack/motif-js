import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Button, Text, VStack } from 'usemotif';
import { FileUpload } from '@usemotif/headless';
import { Note } from '../../harness/demo.js';

// FileUpload wraps a hidden <input type="file"> plus a drag-drop region. Its
// child is a render prop: ({ isDragging, openPicker }) => node. `onFiles`
// fires with a File[] for both drop and picker. `accept`, `multiple`, and
// `disabled` map onto the input.
function dropZone(isDragging: boolean): CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    width: 320,
    padding: 28,
    borderRadius: 12,
    border: `2px dashed ${
      isDragging
        ? 'var(--colors-action-primary-bg, #3b82f6)'
        : 'var(--colors-border-default, #d1d5db)'
    }`,
    background: isDragging
      ? 'var(--colors-surface-muted, #eff6ff)'
      : 'var(--colors-surface-base, #ffffff)',
    color: 'var(--colors-text-muted, #6b7280)',
    textAlign: 'center',
    transition: 'border-color 120ms ease, background 120ms ease',
  };
}

/**
 * FileUpload - wraps a hidden `<input type="file">` plus a drag-drop region.
 * Its child is a render prop `({ isDragging, openPicker }) => node`:
 * `isDragging` reflects an active drag, `openPicker()` opens the native file
 * dialog. `onFiles(File[])` fires for both drop and picker selection.
 * `accept`, `multiple`, and `disabled` map onto the input.
 */
const meta = {
  title: 'Specialized/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  argTypes: {
    children: { control: false },
    onFiles: { control: false },
    style: { control: false },
    accept: { control: 'text' },
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  // FileUpload requires a render-prop `children`; every story supplies its own
  // via `render`, so this meta-level arg is a placeholder to satisfy the type.
  args: {
    children: () => null,
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Single-file drop zone with a live filename readout. */
export const Playground: Story = {
  render: () => {
    function Demo() {
      const [names, setNames] = useState<string[]>([]);
      return (
        <VStack gap="$2">
          <FileUpload onFiles={(files) => setNames(files.map((f) => f.name))}>
            {({ isDragging, openPicker }) => (
              <div style={dropZone(isDragging)}>
                <Text fontWeight="$semibold" color="$colors.text.default" m={0}>
                  {isDragging ? 'Drop to upload' : 'Drag a file here'}
                </Text>
                <Button variant="outline" size="sm" onPress={openPicker}>
                  Browse...
                </Button>
              </div>
            )}
          </FileUpload>
          <Note>{names.length > 0 ? names.join(', ') : 'No file selected'}</Note>
        </VStack>
      );
    }
    return <Demo />;
  },
};

/** Multiple files + an `accept` filter. */
export const MultipleImages: Story = {
  render: () => {
    function Demo() {
      const [names, setNames] = useState<string[]>([]);
      return (
        <VStack gap="$2">
          <FileUpload
            accept="image/*"
            multiple
            onFiles={(files) => setNames(files.map((f) => f.name))}
          >
            {({ isDragging, openPicker }) => (
              <div style={dropZone(isDragging)}>
                <Text fontWeight="$semibold" color="$colors.text.default" m={0}>
                  {isDragging ? 'Drop images' : 'Drop images or browse'}
                </Text>
                <Button variant="outline" size="sm" onPress={openPicker}>
                  Choose images
                </Button>
              </div>
            )}
          </FileUpload>
          <Note>
            {names.length > 0
              ? `${names.length} file(s): ${names.join(', ')}`
              : 'No images selected'}
          </Note>
        </VStack>
      );
    }
    return <Demo />;
  },
};

/** Disabled - picker and drop are inert. */
export const Disabled: Story = {
  render: () => (
    <FileUpload disabled onFiles={() => {}}>
      {({ openPicker }) => (
        <div style={{ ...dropZone(false), opacity: 0.5 }}>
          <Text fontWeight="$semibold" color="$colors.text.default" m={0}>
            Uploads disabled
          </Text>
          <Button variant="outline" size="sm" disabled onPress={openPicker}>
            Browse...
          </Button>
        </div>
      )}
    </FileUpload>
  ),
};
