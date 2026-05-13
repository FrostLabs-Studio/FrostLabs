import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import { ventures } from "../lib/data";
import { STATUS_CLASS, formatDate } from "../lib/types";

export const metadata: Metadata = {
  title: "Ventures",
  description:
    "A living portfolio of products, experiments, and businesses across FrostLabs.",
};

export default function VenturesPage() {
  return (
    <>
      <SiteHeader />
      <main className="page">
        <section className="page-intro">
          <div className="page-eyebrow">Ventures</div>
          <h2 className="page-title">
            A studio of experiments and companies.
          </h2>
          <p className="page-sub">
            A living portfolio of products, experiments, and businesses across
            FrostLabs — from active companies to ideas in incubation.
          </p>
        </section>

        <section>
          {ventures.length === 0 ? (
            <div className="empty-state">
              No ventures yet. New experiments coming soon.
            </div>
          ) : (
            <div className="ventures-grid">
              {ventures.map((v) => (
                <article key={v.id} className="venture-card">
                  <div className="card-top-row">
                    <div>
                      <h3 className="card-name">{v.name}</h3>
                      <div className="card-tags">
                        <span className={`tag ${STATUS_CLASS[v.status]}`}>
                          {v.status}
                        </span>
                        {v.category ? (
                          <span className="tag">{v.category}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {v.summary ? (
                    <p className="card-summary">{v.summary}</p>
                  ) : null}

                  <div className="meta-row">
                    {v.dateStarted ? (
                      <div className="meta-group">
                        <div className="meta-label">Founded</div>
                        <div>{formatDate(v.dateStarted)}</div>
                      </div>
                    ) : null}
                    {v.tags && v.tags.length > 0 ? (
                      <div className="meta-group">
                        <div className="meta-label">Themes</div>
                        <div>{v.tags.join(", ")}</div>
                      </div>
                    ) : null}
                  </div>

                  <div className="card-footer">
                    {v.website ? (
                      <a
                        className="detail-link-btn"
                        href={v.website}
                        target="_blank"
                        rel="noopener"
                      >
                        Visit site ↗
                      </a>
                    ) : (
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--text-dim)",
                        }}
                      >
                        Internal / in development
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
