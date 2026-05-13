"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Variant = "default" | "large";

interface SiteHeaderProps {
  /** "large" renders the home-page hero-sized wordmark. */
  variant?: Variant;
}

const NAV_LINKS: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/ventures", label: "Ventures" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader({ variant = "default" }: SiteHeaderProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <header className="site-header">
      <div>
        <h1 className={`site-title${variant === "large" ? " lg" : ""}`}>
          Frost<span>Labs</span>
        </h1>
      </div>
      <nav className="nav">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? "active" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
