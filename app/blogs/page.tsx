import Blogs from "@/components/Blogs";
import { BLOG_POSTS } from "@/lib/constants/blogs";

const blogs = BLOG_POSTS.map((post) => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  metaTitle: post.metaTitle,
  image: post.image,
}));

export default function BlogsPage() {
  return <Blogs blogs={blogs} />;
}