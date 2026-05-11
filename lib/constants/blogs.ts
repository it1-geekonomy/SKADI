// Blog Section Constants
import theEvolutionOfModernWebDesign from "./posts/the-evolution-of-modern-web-design.json";
import futureOfAi from "./posts/future-of-ai.json";

export type BlogContentItem = {
  type: "paragraph" | "heading" | "subheading" | "list" | "table";
  text?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  image: string;
  content: BlogContentItem[];
  htmlContent?: string;
};

const blogPostsRaw = [
  theEvolutionOfModernWebDesign,
  futureOfAi
] as const;

export const BLOG_POSTS = [...blogPostsRaw].sort((a, b) => a.id - b.id) as BlogPost[];