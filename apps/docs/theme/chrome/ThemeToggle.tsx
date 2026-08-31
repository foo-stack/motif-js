import { useCallback, useEffect, useState } from 'react';
import { Btn } from './Anchor.js';
import { Moon, Sun } from './icons.js';

const STORAGE_KEY = 'vorge-theme';

const ICON_WRAP_STYLE = { display: 'inline-flex' };

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const read = () =>
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  const toggle = useCallback(() => {
    const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage may throw in private mode - ignore.
    }
  }, []);

  return (
    <Btn
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      title="Toggle theme"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      w={32}
      h={32}
      bg="transparent"
      borderStyle="solid"
      borderWidth={1}
      borderColor="transparent"
      borderRadius="5px"
      color="$colors.fg.muted"
      cursor="pointer"
      transition="all 160ms var(--easings-base)"
      _hover={{ color: '$colors.fg.strong', bg: '$colors.surface.paper2' }}
    >
      <span suppressHydrationWarning style={ICON_WRAP_STYLE}>
        {theme === 'dark' ? <Sun /> : <Moon />}
      </span>
    </Btn>
  );
}
