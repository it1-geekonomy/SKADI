import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const filePath = path.join(process.cwd(), 'lib/constants/posts', `${slug}.json`);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const post = JSON.parse(fileContents);
    
    return NextResponse.json(post);
  } catch (error) {
    console.error("Error reading blog post:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
