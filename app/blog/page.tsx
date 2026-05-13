import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import { posts } from "../lib/data";
import { formatDate } from "../lib/types";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Deep dives on projects, build notes from the studio, and other thoughts worth sharing.",
};

export default function BlogPage() {
  return (
    <>
      <SiteHeader />
      <main className="page page-narrow">
        <section className="page-intro">
          <div className="page-eyebrow">Writing</div>
          <h2 className="page-title">
            A personal blog from inside FrostLabs.
          </h2>
          <p className="page-sub">
            Deep dives on projects, build notes from the studio, and anything
            else I find interesting enough to share.
          </p>
        </section>

        <section>
          {posts.length === 0 ? (
            <div className="empty-state">No published posts yet.</div>
          ) : (
            <div className="posts-list">
              {posts.map((p) => (
                <article key={p.id} className="post-card">
                  <div className="post-meta">
                    {p.category ? (
                      <span className="post-category">{p.category}</span>
                    ) : null}
                    {p.publishedDate ? (
                      <span>{formatDate(p.publishedDate)}</span>
                    ) : null}
                    {p.readTime ? <span>{p.readTime} min read</span> : null}
                  </div>
                  <h3 className="post-title">{p.title}</h3>
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
