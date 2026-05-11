"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [generatedJson, setGeneratedJson] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const editorRef = useRef<any>(null);

  const handleGenerate = async () => {
    if (editorRef.current) {
      setIsSaving(true);
      setSaveMessage("");
      try {
        const htmlContent = editorRef.current.getContent();
        
        const finalTitle = title || "New Blog Post";
        const newPost = {
          id: Math.floor(Math.random() * 10000), // Random ID for now
          slug: slug || finalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
          title: finalTitle,
          image: image || "/Blog/Blog11.webp",
          htmlContent: htmlContent,
          content: [] // Empty array for backwards compatibility with the type if needed
        };

        const res = await fetch('/api/admin/blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost)
        });

        if (res.ok) {
          setSaveMessage("Success! Blog post saved.");
          setGeneratedJson(JSON.stringify(newPost, null, 2));
        } else {
          setSaveMessage("Failed to save post.");
        }
      } catch (err) {
        setSaveMessage("Error saving post.");
        console.error(err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 lg:px-20 bg-[rgba(245,240,232,0.98)]">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-forest">
          Add New Blog Post
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-forest">Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 rounded-lg border border-forest bg-white outline-none focus:border-forest transition-colors text-gray-900"
              placeholder="e.g., Modern Websites"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-forest">Slug (URL Path)</label>
            <input 
              type="text" 
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="p-3 rounded-lg border border-forest bg-white outline-none focus:border-forest transition-colors text-gray-900"
              placeholder="e.g., modern-websites (auto-generated if empty)"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-medium text-forest">Cover Image URL</label>
            <input 
              type="text" 
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="p-3 rounded-lg border border-forest bg-white outline-none focus:border-forest transition-colors text-gray-900"
              placeholder="e.g., /Blog/Blog11.webp"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label className="font-medium text-forest">Content</label>
          <div className="border border-forest rounded-lg overflow-hidden">
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue="<p>Start writing your blog post here...</p>"
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
              }}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button 
            onClick={handleGenerate}
            className="px-8 py-3 bg-forest hover:bg-canyon text-white rounded-lg font-medium transition-colors"
          >
            Generate JSON Output
          </button>
        </div>

        {generatedJson && (
          <div className="mt-8 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-forest">
              Generated JSON
            </h2>
            <p className="text-forest">
              Copy this JSON object and add it to the <code>BLOG_POSTS</code> array in <code>lib/constants/blogs.ts</code>.
            </p>
            <div className="relative">
              <pre className="p-6 rounded-lg overflow-x-auto border border-gray-300 bg-gray-900 text-green-400 text-sm font-mono">
                <code>{generatedJson}</code>
              </pre>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedJson)}
                className="absolute top-4 right-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-sm"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
