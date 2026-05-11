import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const post = await request.json();
    
    if (!post.slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const dir = path.join(process.cwd(), 'lib/constants/posts');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, `${post.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(post, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: 'Post saved successfully' });
  } catch (error) {
    console.error("Error saving blog post:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
