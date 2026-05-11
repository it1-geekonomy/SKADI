import Blogs from "@/components/Blogs";

/** Listing loads from GET /api/blogs (same JSON files as each `/api/blogs/[slug]` post). */
export default function BlogsPage() {
  return <Blogs />;
}
