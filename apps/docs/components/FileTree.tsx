import type { ReactNode } from 'react';

export interface FileTreeProps {
  children: ReactNode;
}

export function FileTree({ children }: FileTreeProps) {
  return (
    <div className="filetree" aria-label="File tree">
      <ul>{children}</ul>
    </div>
  );
}

export interface FileTreeDirProps {
  name: string;
  children: ReactNode;
  note?: string;
}

export function FileTreeDir({ name, children, note }: FileTreeDirProps) {
  return (
    <li>
      <span className="filetree__dir">{name}</span>
      {note ? <span className="filetree__note">{note}</span> : null}
      <ul>{children}</ul>
    </li>
  );
}

export interface FileTreeFileProps {
  name: string;
  note?: string;
}

export function FileTreeFile({ name, note }: FileTreeFileProps) {
  return (
    <li>
      <span className="filetree__file">{name}</span>
      {note ? <span className="filetree__note">{note}</span> : null}
    </li>
  );
}
