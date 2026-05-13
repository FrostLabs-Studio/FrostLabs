export type VentureStatus =
  | "Active"
  | "In Development"
  | "Idea"
  | "On Hold"
  | "Completed";

export interface Venture {
  id: string;
  name: string;
  status: VentureStatus;
  category?: string;
  summary?: string;
  dateStarted?: string; // ISO date string
  tags?: string[];
  website?: string;
}

export interface Post {
  id: string;
  title: string;
  category?: string;
  publishedDate?: string; // ISO date string
  readTime?: number;
  summary?: string;
  tags?: string[];
  /**
   * Optional pre-rendered HTML for the post body. In the new stack the
   * recommended path is to author posts as MDX files instead — leaving the
   * field here so existing data shapes can still be dropped in.
   */
  html?: string;
}

export const STATUS_CLASS: Record<VentureStatus, string> = {
  Active: "status-active",
  "In Development": "status-in-development",
  Idea: "status-idea",
  "On Hold": "status-on-hold",
  Completed: "status-completed",
};

export function formatDate(value?: string): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
