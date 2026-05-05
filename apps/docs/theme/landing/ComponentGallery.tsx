export function ComponentGallery() {
  return (
    <section className="section">
      <div className="h2">
        <div className="section__head">
          <div>
            <span className="section__eye">Components</span>
            <h2 className="section__title">
              A starter library, <em>not</em> a UI kit.
            </h2>
          </div>
          <p className="section__sub">
            Headless and styled primitives ship with motif-js. Use them as-is, restyle them, or
            ignore them entirely — whatever suits your design.
          </p>
        </div>

        <div className="gallery">
          <a className="gal-card" href="/recipes/buttons">
            <div className="gal-card__preview">
              <div className="demo-btn-row">
                <button type="button" className="demo-btn-sm demo-btn-pri">
                  Save
                </button>
                <button type="button" className="demo-btn-sm demo-btn-sec">
                  Cancel
                </button>
                <button type="button" className="demo-btn-sm demo-btn-ghost">
                  Skip
                </button>
              </div>
            </div>
            <div className="gal-card__body">
              <span className="gal-card__title">Buttons</span>
              <span className="gal-card__count">3 variants · 4 intents</span>
            </div>
          </a>

          <a className="gal-card" href="/recipes/forms">
            <div className="gal-card__preview">
              <input
                className="demo-input"
                placeholder="Type a name…"
                defaultValue="Eleanor Ashbury"
              />
            </div>
            <div className="gal-card__body">
              <span className="gal-card__title">Inputs</span>
              <span className="gal-card__count">Field · Input · TextArea · NumberInput</span>
            </div>
          </a>

          <a className="gal-card" href="/recipes/layouts">
            <div className="gal-card__preview">
              <div className="demo-card">
                <div className="demo-card-eye">Project</div>
                <div className="demo-card-title">Q4 design review</div>
                <div className="demo-card-text">Three working sessions across two weeks.</div>
              </div>
            </div>
            <div className="gal-card__body">
              <span className="gal-card__title">Cards</span>
              <span className="gal-card__count">Surface · Stack · Heading</span>
            </div>
          </a>

          <a className="gal-card" href="/concepts/variants">
            <div className="gal-card__preview">
              <div style={{ display: 'flex', gap: 8 }}>
                <span className="demo-badge demo-badge--ok">Live</span>
                <span className="demo-badge demo-badge--warn">Preview</span>
                <span className="demo-badge demo-badge--info">v1.1.2</span>
              </div>
            </div>
            <div className="gal-card__body">
              <span className="gal-card__title">Badges</span>
              <span className="gal-card__count">4 intents</span>
            </div>
          </a>

          <a className="gal-card" href="/concepts/composition">
            <div className="gal-card__preview">
              <div className="demo-tab">
                <div className="demo-tab__t demo-tab__t--active">Overview</div>
                <div className="demo-tab__t">Activity</div>
                <div className="demo-tab__t">Settings</div>
              </div>
            </div>
            <div className="gal-card__body">
              <span className="gal-card__title">Tabs</span>
              <span className="gal-card__count">3 styles</span>
            </div>
          </a>

          <a className="gal-card" href="/recipes/forms">
            <div className="gal-card__preview">
              <div className="demo-toggle">
                <span
                  style={{
                    font: '500 12px/1 var(--font-sans)',
                    color: 'var(--fg-strong)',
                  }}
                >
                  Notifications
                </span>
                <span className="demo-switch" />
              </div>
            </div>
            <div className="gal-card__body">
              <span className="gal-card__title">Toggles</span>
              <span className="gal-card__count">Switch · checkbox</span>
            </div>
          </a>

          <a className="gal-card" href="/reference/styled">
            <div className="gal-card__preview">
              <div className="demo-avatar-stack">
                <span className="demo-av" style={{ background: '#C2410C', color: '#FBF7F2' }}>
                  EA
                </span>
                <span className="demo-av" style={{ background: '#7E6B43', color: '#FBF7F2' }}>
                  JR
                </span>
                <span className="demo-av" style={{ background: '#5B7553', color: '#FBF7F2' }}>
                  MK
                </span>
                <span
                  className="demo-av"
                  style={{ background: 'var(--bg-paper-3)', color: 'var(--fg-strong)' }}
                >
                  +4
                </span>
              </div>
            </div>
            <div className="gal-card__body">
              <span className="gal-card__title">Avatars</span>
              <span className="gal-card__count">Stack · group</span>
            </div>
          </a>

          <a className="gal-card" href="/recipes/animation">
            <div className="gal-card__preview">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 200 }}>
                <div
                  style={{
                    height: 8,
                    background: 'var(--bg-paper-3)',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '64%',
                      height: '100%',
                      background: 'var(--accent)',
                    }}
                  />
                </div>
                <div
                  style={{
                    font: '500 10.5px/1 var(--font-mono)',
                    color: 'var(--fg-faint)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  64% · 320 of 500
                </div>
              </div>
            </div>
            <div className="gal-card__body">
              <span className="gal-card__title">Progress</span>
              <span className="gal-card__count">Bar · ring</span>
            </div>
          </a>

          <a className="gal-card" href="/recipes/animation">
            <div className="gal-card__preview">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  background: 'var(--bg-paper-2)',
                  border: '1px solid var(--line-faint)',
                  borderRadius: 6,
                  width: 220,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    background: 'var(--moss-500)',
                    borderRadius: '50%',
                  }}
                />
                <span
                  style={{
                    font: '500 12.5px/1.3 var(--font-sans)',
                    color: 'var(--fg-strong)',
                  }}
                >
                  Deploy succeeded
                </span>
              </div>
            </div>
            <div className="gal-card__body">
              <span className="gal-card__title">Toasts</span>
              <span className="gal-card__count">4 variants</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
