import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type BlogListItem = {
  id: number;
  slug: string;
  title: string;
  image: string;
};

const POSTS_DIR = path.join(process.cwd(), "lib/constants/posts");

export async function GET() {
  try {
    if (!fs.existsSync(POSTS_DIR)) {
      return NextResponse.json({ blogs: [] as BlogListItem[] });
    }

    const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".json"));
    const blogs: BlogListItem[] = [];

    for (const file of files) {
      const filePath = path.join(POSTS_DIR, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const post = JSON.parse(raw) as Partial<BlogListItem>;

      if (
        typeof post.slug === "string" &&
        typeof post.title === "string" &&
        post.slug &&
        post.title
      ) {
        blogs.push({
          id: typeof post.id === "number" ? post.id : blogs.length,
          slug: post.slug,
          title: post.title,
          image: typeof post.image === "string" ? post.image : "/Blog/Blog11.webp",
        });
      }
    }

    blogs.sort((a, b) => a.id - b.id);

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("Error listing blogs:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
