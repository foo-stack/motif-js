interface Quote {
  body: string;
  name: string;
  role: string;
  initials: string;
}

const quotes: readonly Quote[] = [
  {
    body: 'We replaced three styling libraries with motif-js and shipped our React Native app from the same codebase the next quarter. The hardest part was deleting code.',
    name: 'Beta tester quote',
    role: 'Placeholder until v1.2',
    initials: '··',
  },
  {
    body: 'The token system finally made our design system feel like a system instead of a Slack channel. Our designers can read the source.',
    name: 'Beta tester quote',
    role: 'Placeholder until v1.2',
    initials: '··',
  },
  {
    body: "Motif's variants are how I wish I had been writing styles for the last ten years. Compiles to nothing. Type-checks everything.",
    name: 'Beta tester quote',
    role: 'Placeholder until v1.2',
    initials: '··',
  },
];

export function Testimonials() {
  return (
    <section className="section">
      <div className="h2">
        <div className="section__head section__head--center">
          <div>
            <span className="section__eye">In their words (forthcoming)</span>
            <h2 className="section__title">
              Beta testers <em>are still landing</em>.
            </h2>
            <p className="section__sub" style={{ margin: '12px auto 0' }}>
              The quotes below are illustrative — written by the team to mark out the outcomes we're
              designing toward. Real beta-tester quotes replace them at v1.2.
            </p>
          </div>
        </div>
        <div className="quotes">
          {quotes.map((q) => (
            <figure className="quote" key={q.body.slice(0, 24)}>
              <blockquote className="quote__body">"{q.body}"</blockquote>
              <figcaption className="quote__by">
                <span className="quote__avatar">{q.initials}</span>
                <div>
                  <div className="quote__name">{q.name}</div>
                  <div className="quote__role">{q.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
