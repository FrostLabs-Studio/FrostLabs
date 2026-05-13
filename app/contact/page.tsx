import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach out about a collaboration, idea, or anything else worth talking about.",
};

const EMAIL = "max@frostlabs.studio";

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="page page-narrow">
        <section className="page-intro">
          <div className="page-eyebrow">Contact</div>
          <h2 className="page-title">Interested in working together?</h2>
          <p className="page-sub">
            If a venture, idea, or piece of writing here resonates with you,
            I&rsquo;d love to hear from you.
          </p>
        </section>

        <section className="contact-content">
          <div className="contact-copy">
            <p>
              Whether you&rsquo;re exploring a potential collaboration, want to
              jam on an idea, or just want to say hi, the easiest way to reach
              me is by email.
            </p>
            <p>
              <strong>Send a note to {EMAIL}</strong> with a bit of context on
              who you are and what you&rsquo;d like to talk about.
            </p>
          </div>

          <aside className="contact-card">
            <div className="label">Email</div>
            <div className="contact-item">
              <div className="contact-item-title">Direct line</div>
              <a className="contact-link" href={`mailto:${EMAIL}`}>
                <strong>{EMAIL}</strong>
              </a>
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
