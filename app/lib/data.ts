import type { Post, Venture } from "./types";

/**
 * Drop your ventures here. The home + ventures pages read from this array.
 * Status drives the colored tag — see VentureStatus in ./types.ts.
 */
export const ventures: Venture[] = [];

/**
 * Drop your posts here. Each post should have an id, title, and ideally a
 * summary + tags. The detail-overlay pattern from the legacy site has been
 * dropped in favor of regular page routes — see /blog.
 *
 * For long-form bodies, prefer authoring an MDX file under `content/posts/`
 * (you can wire that up later) instead of stuffing HTML strings into `html`.
 */
export const posts: Post[] = [];
