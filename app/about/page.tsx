import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "About",
  description:
    "The person behind FrostLabs — Max Frost, systems engineer and studio operator.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="page page-narrow">
        <section className="page-intro">
          <div className="page-eyebrow">About</div>
          <h2 className="page-title">The person behind FrostLabs.</h2>
        </section>

        <section className="content">
          <p>
            Hey, I&rsquo;m Max Frost &ndash; a 24&#8209;year&#8209;old systems
            engineer by trade who can&rsquo;t stop thinking about new ideas,
            tools, and processes that make life more fun and a little easier.
          </p>

          <h2>What FrostLabs is</h2>

          <p>
            FrostLabs is the place where I keep track of what I&rsquo;m working
            on &ndash; a living index of projects, companies, and
            half&#8209;finished ideas. It&rsquo;s a studio, a logbook, and an
            invite for the right people to plug in.
          </p>

          <p>
            Some things here are active ventures, some are experiments in
            progress, and some are just threads I&rsquo;m pulling on. The common
            theme is exploring better systems for how we work, create, and
            play.
          </p>

          <div className="highlight-card">
            <div className="highlight-label">If this resonates</div>
            <div>
              I&rsquo;m always open to collaborating, jamming on ideas, or
              comparing notes on building and systems. If something here sparks
              a thought, reach out via the contact page &ndash; I&rsquo;d love
              to hear from you.
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
