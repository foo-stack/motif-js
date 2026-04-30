import {
  ArrowRight,
  Book,
  Box as BoxIcon,
  Code,
  Compass,
  Copy,
  Github,
  Globe,
  Layers,
  Palette,
  Smartphone,
  Sparkles,
  Zap,
} from '@motif-js/icons';
import { Link as RRLink } from 'react-router';

export default function Index() {
  return (
    <div className="layout layout--centered" data-pagefind-body>
      <div className="home">
        <Hero />
        <Cards />
        <BrandStory />
        <Features />
        <Quote />
        <FooterCta />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="home__hero">
      <span className="home__eyebrow">Motif · v1.1.2 · Documentation</span>
      <h1 className="home__title">
        Write your styles once. <em>Run them anywhere</em> React runs.
      </h1>
      <p className="home__lede">
        Motif is a cross-platform styling library for React. One source of truth for tokens,
        variants, and themes — rendered to atomic CSS on the web and to native style objects on iOS
        and Android.
      </p>
      <div className="home__cta">
        <RRLink to="/docs/introduction" className="btn btn--primary">
          Read the docs <ArrowRight />
        </RRLink>
        <button className="btn btn--copy-install" title="Copy install command" type="button">
          <span className="npm-prefix">$</span>
          <span>npm install @motif-js/react</span>
          <span className="copy-affordance">
            <Copy />
          </span>
        </button>
        <a
          href="https://github.com/foo-stack/motif-js"
          className="btn btn--ghost"
          target="_blank"
          rel="noreferrer"
        >
          <Github /> View on GitHub
        </a>
      </div>
    </section>
  );
}

function Cards() {
  return (
    <div className="home__cards">
      <RRLink to="/docs/introduction" className="home-card">
        <Compass className="home-card__icon" />
        <h3 className="home-card__title">Get started</h3>
        <p className="home-card__desc">
          Install Motif, write your first styled component, and see the same code render on web and
          native in under five minutes.
        </p>
        <span className="home-card__cta">
          Start the tour <ArrowRight className="home-card__arrow" />
        </span>
      </RRLink>
      <RRLink to="/docs/tokens" className="home-card">
        <Book className="home-card__icon" />
        <h3 className="home-card__title">Concepts</h3>
        <p className="home-card__desc">
          Tokens, variants, theming, and the rules that hold them together. Read this if you want a
          working mental model in fifteen minutes.
        </p>
        <span className="home-card__cta">
          Read the concepts <ArrowRight className="home-card__arrow" />
        </span>
      </RRLink>
      <RRLink to="/api/box" className="home-card">
        <Code className="home-card__icon" />
        <h3 className="home-card__title">API reference</h3>
        <p className="home-card__desc">
          Every primitive, every prop, every hook — with type signatures and live examples.
          Generated from the source, never out of date.
        </p>
        <span className="home-card__cta">
          Browse the API <ArrowRight className="home-card__arrow" />
        </span>
      </RRLink>
      <RRLink to="/examples" className="home-card">
        <Sparkles className="home-card__icon" />
        <h3 className="home-card__title">Examples</h3>
        <p className="home-card__desc">
          Real apps and components built with Motif — copy a recipe, fork a sandbox, or read the
          source. New examples each release.
        </p>
        <span className="home-card__cta">
          See examples <ArrowRight className="home-card__arrow" />
        </span>
      </RRLink>
    </div>
  );
}

function BrandStory() {
  return (
    <section className="home__section">
      <div className="home__story">
        <div>
          <span className="home__section-eye">A short note</span>
          <h2 className="home__section-title">
            On <em>style</em>, and why we wrote another library.
          </h2>
        </div>
        <div>
          <p>
            Most styling libraries pick a side: build for the web, then port; or build for native,
            and pretend the web is similar enough. We did not want to choose.
          </p>
          <p className="muted">
            Motif compiles a single style declaration to atomic CSS on the web and to platform style
            objects on iOS and Android. Tokens resolve once, at build time. Variants are statically
            analyzable. Themes swap without a re-render storm.
          </p>
          <p className="muted">
            It is a small library that does one thing well: it lets you describe how something
            looks, in a language that travels.
          </p>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="home__section">
      <span className="home__section-eye">Why Motif</span>
      <h2 className="home__section-title">
        A quiet set of <em>opinions</em>, well-tested.
      </h2>
      <div className="home__features">
        <Feature icon={<Globe />} title="Universal by design">
          One file. Web, iOS, Android, server. The same component, the same props, the same output.
        </Feature>
        <Feature icon={<Zap />} title="Compiled, not interpreted">
          Styles resolve at build time to atomic classes on the web and to platform style objects on
          native. No runtime cost on hot paths.
        </Feature>
        <Feature icon={<Palette />} title="Token-first">
          Define your scale once. Reference it everywhere. Refactor by editing one file and watch
          every component follow.
        </Feature>
        <Feature icon={<Layers />} title="Variants that compose">
          First-class size, intent, and state variants. They are values you map, merge, and override
          like any other data.
        </Feature>
        <Feature icon={<BoxIcon />} title="Tiny by default">
          A handful of kilobytes gzipped. No peer dependencies beyond React. Tree-shakes cleanly
          when you only reach for the parts you use.
        </Feature>
        <Feature icon={<Smartphone />} title="Native-aware">
          Knows about platform-specific tokens, safe areas, and the gaps between them. Falls back
          gracefully when a property does not exist.
        </Feature>
      </div>
    </section>
  );
}

function Feature({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="feature__icon">{icon}</div>
      <h4 className="feature__title">{title}</h4>
      <p className="feature__desc">{children}</p>
    </div>
  );
}

function Quote() {
  return (
    <div className="home__quote">
      <p>
        "The best styles are the ones you do not have to think about twice. Motif is the closest
        I've felt to that since I started writing CSS."
      </p>
      <cite>— a developer, somewhere</cite>
    </div>
  );
}

function FooterCta() {
  return (
    <div className="home__footer-cta">
      <div>
        <h3>Ready to start?</h3>
        <p>
          The introduction is a five-minute read. By the end you will have a styled component
          running on web and native — from the same source.
        </p>
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <RRLink to="/docs/introduction" className="btn btn--primary">
          Read the introduction <ArrowRight />
        </RRLink>
      </div>
    </div>
  );
}
