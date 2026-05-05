import { Sparkle } from './icons.js';

const tools = [
  'Vite',
  'Next.js',
  'Remix',
  'Astro',
  'Expo',
  'Metro',
  'React Native',
  'React Server Components',
  'Vitest',
  'Storybook',
  'TypeScript',
  'ESLint',
];

const all = [...tools, ...tools];

export function UsedBy() {
  return (
    <div className="marquee">
      <div className="marquee__label">Drops into the React ecosystem you already have</div>
      <div className="marquee__track">
        {all.map((name, i) => (
          // eslint-disable-next-line react/no-array-index-key -- duplicated for seamless scroll loop
          <span key={`${name}-${i}`} className="marquee__item">
            <Sparkle /> {name}
          </span>
        ))}
      </div>
    </div>
  );
}
