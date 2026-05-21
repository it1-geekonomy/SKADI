import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/constants/blogs";
import BlogDetailClient from "./BlogDetailClient";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {};
  }

  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription,
    alternates: {
      canonical: `/blogs/${slug}`,
    },
  };
}

export default function BlogDetailPage() {
  return <BlogDetailClient />;
}