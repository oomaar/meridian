export default function Loading() {
  return (
    <>
      <div className="m-page__header">
        <div className="m-page__title">
          <span className="m-skel m-skel--text m-skel--w-24" />
          <span className="m-skel m-skel--title m-skel--w-48" />
          <span className="m-skel m-skel--text m-skel--w-64" />
        </div>
      </div>

      <div className="m-page__body">
        <div className="m-stack">
          <div className="m-grid m-grid-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="m-skel-card m-skel-stat">
                <span className="m-skel m-skel--text m-skel--w-48" />
                <span className="m-skel m-skel--title m-skel--w-32" />
              </div>
            ))}
          </div>

          <div className="m-grid m-grid-2-1 m-grid--top">
            <div className="m-skel-card">
              <div className="m-skel-card__head">
                <span className="m-skel m-skel--text m-skel--w-48" />
              </div>
              <div className="m-skel-rows">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="m-skel-row">
                    <span className="m-skel m-skel--circle m-skel-avatar" />
                    <span className="m-skel m-skel--text m-skel--w-64" />
                    <span className="m-skel m-skel--text m-skel--w-24 m-skel-push" />
                  </div>
                ))}
              </div>
            </div>

            <div className="m-stack">
              <div className="m-skel-card">
                <div className="m-skel-card__head">
                  <span className="m-skel m-skel--text m-skel--w-48" />
                </div>
                <div className="m-skel-rows">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="m-skel-row">
                      <span className="m-skel m-skel--text m-skel--w-80" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="m-skel-card">
                <div className="m-skel-card__head">
                  <span className="m-skel m-skel--text m-skel--w-32" />
                </div>
                <div className="m-skel-rows">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="m-skel-row">
                      <span className="m-skel m-skel--text m-skel--w-64" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
