export function StatsStrip() {
  return (
    <section className="stats">
      <div className="stat">
        <div className="stat__value">
          <em>12</em> KB
        </div>
        <div className="stat__label">Gzipped on web</div>
      </div>
      <div className="stat">
        <div className="stat__value">
          <em>3</em>
        </div>
        <div className="stat__label">Platforms supported</div>
      </div>
      <div className="stat">
        <div className="stat__value">
          <em>0</em> ms
        </div>
        <div className="stat__label">Style-resolution overhead</div>
      </div>
      <div className="stat">
        <div className="stat__value">
          <em>1.1</em>
        </div>
        <div className="stat__label">Stable since</div>
      </div>
    </section>
  );
}
