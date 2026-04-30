'use client';

import {
  Sandpack,
  type SandpackPredefinedTemplate,
  type SandpackTheme,
} from '@codesandbox/sandpack-react';

/**
 * The actual sandpack instance. Split out so the `<Sandbox>`
 * wrapper can lazy-load it via `React.lazy` — the sandpack-react
 * chunk is large (the in-browser bundler ships with it) and there is
 * no reason to pull it into the initial route bundle.
 */

export interface SandboxImplProps {
  code: string;
  motifVersion: string;
  height: number;
}

const TEMPLATE: SandpackPredefinedTemplate = 'react-ts';

const ROOT_TSX = `import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@motif-js/react';
import { MotifReset } from '@motif-js/reset';
import { lightTheme, darkTheme } from '@motif-js/tokens';
import App from './App';

const node = document.getElementById('root');
if (node !== null) {
  createRoot(node).render(
    <>
      <MotifReset />
      <ThemeProvider themes={[lightTheme, darkTheme]} active="light">
        <App />
      </ThemeProvider>
    </>,
  );
}
`;

const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Motif demo</title>
    <style>body { margin: 0; padding: 24px; font-family: system-ui; }</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
`;

/**
 * Brand-flavored sandpack theme. The default themes look like generic
 * editors; this one borrows the docs-site's warm-paper palette so the
 * demos sit in the page rather than feeling pasted in.
 */
const PAPER_THEME: SandpackTheme = {
  colors: {
    surface1: '#FBF7F2',
    surface2: '#F5EFE6',
    surface3: '#EDE5D7',
    clickable: '#57534E',
    base: '#1C1917',
    disabled: '#A8A29E',
    hover: '#1C1917',
    accent: '#C2410C',
    error: '#B91C1C',
    errorSurface: '#FEE2E2',
  },
  syntax: {
    plain: '#1C1917',
    comment: { color: '#A8A29E', fontStyle: 'italic' },
    keyword: '#C2410C',
    tag: '#9A3412',
    punctuation: '#57534E',
    definition: '#7C2D12',
    property: '#65733C',
    static: '#B45309',
    string: '#65733C',
  },
  font: {
    body: 'Inter, ui-sans-serif, system-ui, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
    size: '13px',
    lineHeight: '1.55',
  },
};

export default function SandboxImpl({ code, motifVersion, height }: SandboxImplProps) {
  return (
    <Sandpack
      template={TEMPLATE}
      theme={PAPER_THEME}
      files={{
        '/App.tsx': { code, active: true },
        '/index.tsx': { code: ROOT_TSX, hidden: true },
        '/public/index.html': { code: INDEX_HTML, hidden: true },
      }}
      customSetup={{
        dependencies: {
          react: '^19.0.0',
          'react-dom': '^19.0.0',
          '@motif-js/react': motifVersion,
          '@motif-js/reset': motifVersion,
          '@motif-js/tokens': motifVersion,
        },
      }}
      options={{
        editorHeight: height,
        showLineNumbers: false,
        showInlineErrors: true,
        wrapContent: true,
      }}
    />
  );
}
