import { NextResponse } from "next/server";
import { BLOG_POSTS } from "@/lib/constants/blogs";

export async function GET() {
  const blogs = BLOG_POSTS.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    metaTitle: post.metaTitle,
    image: post.image || "/Blog/Blog11.webp",
  }));

  return NextResponse.json({ blogs });
}
