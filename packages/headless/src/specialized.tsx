'use client';

import {
  forwardRef,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';

/**
 * Specialized — ColorPicker, FileUpload, TreeView.
 *
 * v0 ships pragmatic implementations:
 * - ColorPicker wraps the native `<input type="color">` for the
 *   common case + exposes hooks for callers building their own
 *   HSV pickers later.
 * - FileUpload wraps `<input type="file">` with a drag-drop region.
 * - TreeView is a real implementation: nested items, ARIA tree
 *   pattern (role="tree", role="treeitem", aria-expanded /
 *   aria-selected), arrow-key navigation.
 */

// ─────────── ColorPicker ──────────────────────────────────────────

export interface ColorPickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Current colour as `#rrggbb`. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
}
export const ColorPicker = forwardRef(function ColorPicker(
  { value, defaultValue, onValueChange, onChange, ...rest }: ColorPickerProps,
  ref: Ref<HTMLInputElement>,
): ReactElement {
  return (
    <input
      ref={ref}
      type="color"
      value={value}
      defaultValue={defaultValue}
      onChange={(e) => {
        onChange?.(e);
        onValueChange?.(e.target.value);
      }}
      {...rest}
    />
  );
});

// ─────────── FileUpload ───────────────────────────────────────────

export interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onFiles?: (files: File[]) => void;
  /** Render fn for the drop zone. Receives `{ isDragging,
   * openPicker }`. */
  children: (info: { isDragging: boolean; openPicker: () => void }) => ReactNode;
  style?: CSSProperties;
}
export function FileUpload({
  accept,
  multiple = false,
  disabled = false,
  onFiles,
  children,
  style,
}: FileUploadProps): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const id = useId();

  const handleFiles = useCallback(
    (list: FileList | null): void => {
      if (list === null || list.length === 0) return;
      onFiles?.(Array.from(list));
    },
    [onFiles],
  );

  function onDragEnter(e: DragEvent<HTMLDivElement>): void {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(true);
  }
  function onDragOver(e: DragEvent<HTMLDivElement>): void {
    if (disabled) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }
  function onDragLeave(): void {
    setIsDragging(false);
  }
  function onDrop(e: DragEvent<HTMLDivElement>): void {
    if (disabled) return;
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }
  function openPicker(): void {
    if (!disabled) inputRef.current?.click();
  }

  return (
    <div
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      style={style}
    >
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        style={{ position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }}
        onChange={(e: ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
      />
      {children({ isDragging, openPicker })}
    </div>
  );
}

// ─────────── TreeView ─────────────────────────────────────────────

export interface TreeNode<T = unknown> {
  readonly id: string;
  readonly label: ReactNode;
  readonly data?: T;
  readonly children?: ReadonlyArray<TreeNode<T>>;
  readonly disabled?: boolean;
}

export interface TreeViewProps<T = unknown> {
  data: ReadonlyArray<TreeNode<T>>;
  /** Currently-selected node id. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (next: string) => void;
  /** Initially-expanded ids. */
  defaultExpanded?: ReadonlyArray<string>;
  /** Render fn for each node. */
  renderNode: (info: {
    node: TreeNode<T>;
    depth: number;
    isExpanded: boolean;
    isSelected: boolean;
    isFocused: boolean;
    toggle: () => void;
    select: () => void;
  }) => ReactElement;
  style?: CSSProperties;
  'aria-label'?: string;
}

interface FlatNode<T> {
  readonly node: TreeNode<T>;
  readonly depth: number;
  readonly parentExpanded: boolean;
}

function flatten<T>(
  nodes: ReadonlyArray<TreeNode<T>>,
  expanded: Set<string>,
  depth = 0,
  parentExpanded = true,
): FlatNode<T>[] {
  const out: FlatNode<T>[] = [];
  for (const n of nodes) {
    out.push({ node: n, depth, parentExpanded });
    if (n.children !== undefined && expanded.has(n.id)) {
      out.push(...flatten(n.children, expanded, depth + 1, parentExpanded));
    }
  }
  return out;
}

export function TreeView<T>({
  data,
  value: controlled,
  defaultValue,
  onValueChange,
  defaultExpanded = [],
  renderNode,
  style,
  ...aria
}: TreeViewProps<T>): ReactElement {
  const [uncontrolled, setUncontrolled] = useState<string | undefined>(defaultValue);
  const isControlled = controlled !== undefined;
  const selected = isControlled ? controlled : uncontrolled;
  const setSelected = useCallback(
    (next: string) => {
      if (!isControlled) setUncontrolled(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultExpanded));
  const toggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const [focusedId, setFocusedId] = useState<string | undefined>(selected);

  const flat = useMemo(() => flatten(data, expanded), [data, expanded]);
  const focusedIndex = flat.findIndex((f) => f.node.id === focusedId);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>): void {
    if (focusedIndex === -1) return;
    const current = flat[focusedIndex]!;
    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        const next = flat[focusedIndex + 1];
        if (next !== undefined) setFocusedId(next.node.id);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const prev = flat[focusedIndex - 1];
        if (prev !== undefined) setFocusedId(prev.node.id);
        break;
      }
      case 'ArrowRight':
        e.preventDefault();
        if (current.node.children !== undefined && !expanded.has(current.node.id)) {
          toggle(current.node.id);
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (current.node.children !== undefined && expanded.has(current.node.id)) {
          toggle(current.node.id);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        setSelected(current.node.id);
        break;
    }
  }

  return (
    <div role="tree" tabIndex={0} onKeyDown={onKeyDown} style={style} {...aria}>
      {flat.map(({ node, depth }) => {
        const isExpanded = expanded.has(node.id);
        const isSelected = selected === node.id;
        const isFocused = focusedId === node.id;
        return (
          <div
            key={node.id}
            role="treeitem"
            aria-level={depth + 1}
            aria-expanded={node.children !== undefined ? isExpanded : undefined}
            aria-selected={isSelected}
            aria-disabled={node.disabled || undefined}
          >
            {renderNode({
              node,
              depth,
              isExpanded,
              isSelected,
              isFocused,
              toggle: () => toggle(node.id),
              select: () => setSelected(node.id),
            })}
          </div>
        );
      })}
    </div>
  );
}
