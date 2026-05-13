"use client";

import { useMemo, useState } from "react";
import SiteHeader from "./components/SiteHeader";
import { posts, ventures } from "./lib/data";
import { STATUS_CLASS, type VentureStatus } from "./lib/types";

type Filter = "All" | VentureStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Active", label: "Active" },
  { value: "In Development", label: "In Dev" },
  { value: "Idea", label: "Ideas" },
  { value: "On Hold", label: "On Hold" },
  { value: "Completed", label: "Completed" },
];

export default function HomePage() {
  const [filter, setFilter] = useState<Filter>("All");

  const visibleVentures = useMemo(
    () =>
      filter === "All"
        ? ventures
        : ventures.filter((v) => v.status === filter),
    [filter],
  );

  const stats = useMemo(
    () => ({
      total: ventures.length,
      active: ventures.filter((v) => v.status === "Active").length,
      posts: posts.length,
      pipeline: ventures.filter((v) => v.status === "In Development").length,
    }),
    [],
  );

  return (
    <>
      <SiteHeader variant="large" />

      <div className="stats-bar">
        <div className="stat">
          <div className="stat-num">{stats.total || "—"}</div>
          <div className="stat-label">Ventures</div>
        </div>
        <div className="stat">
          <div className="stat-num">{stats.active || "—"}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat">
          <div className="stat-num">{stats.posts || "—"}</div>
          <div className="stat-label">Posts</div>
        </div>
        <div className="stat">
          <div className="stat-num">{stats.pipeline || "—"}</div>
          <div className="stat-label">In Pipeline</div>
        </div>
      </div>

      <main className="page page-wide">
        <section>
          <div className="section-header">
            <h2 className="section-title">Ventures</h2>
            <div className="filter-bar">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  className={`filter-btn${filter === f.value ? " active" : ""}`}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {visibleVentures.length === 0 ? (
            <div className="empty-state">
              No ventures yet. Add some in <code>app/lib/data.ts</code>.
            </div>
          ) : (
            <div className="ventures-grid">
              {visibleVentures.map((v) => (
                <article key={v.id} className="venture-card">
                  <div className="card-top">
                    <div className="card-tags">
                      <span className={`tag ${STATUS_CLASS[v.status]}`}>
                        {v.status}
                      </span>
                      {v.category ? <span className="tag">{v.category}</span> : null}
                    </div>
                    <span className="arrow-icon">↗</span>
                  </div>
                  <h3 className="card-name">{v.name}</h3>
                  {v.summary ? (
                    <p className="card-summary">{v.summary}</p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="section-header">
            <h2 className="section-title">Writing</h2>
          </div>

          {posts.length === 0 ? (
            <div className="empty-state">
              No published posts yet. Add some in{" "}
              <code>app/lib/data.ts</code>.
            </div>
          ) : (
            <div className="posts-grid">
              {posts.map((p) => (
                <article key={p.id} className="post-card">
                  <div className="post-meta">
                    {p.category ? (
                      <span className="post-category">{p.category}</span>
                    ) : null}
                    {p.publishedDate ? (
                      <span className="post-date">
                        {new Date(p.publishedDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    ) : null}
                    {p.readTime ? (
                      <span className="post-read-time">{p.readTime} min read</span>
                    ) : null}
                  </div>
                  <div className="card-top">
                    <h3 className="post-title">{p.title}</h3>
                    <span className="arrow-icon">↗</span>
                  </div>
                  {p.summary ? (
                    <p className="post-summary">{p.summary}</p>
                  ) : null}
                  {p.tags && p.tags.length > 0 ? (
                    <div className="post-tags">
                      {p.tags.map((t) => (
                        <span key={t} className="tag">
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
