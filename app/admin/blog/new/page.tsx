"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  { ssr: false }
);

// Each detected heading carries its level so we can label it in the UI
type DetectedHeading = { text: string; level: 1 | 2 };

export default function AddBlogPage() {
  const [title, setTitle] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [generatedJson, setGeneratedJson] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Section images state — keyed by heading text (same as BlogDetailClient sentinel)
  const [detectedHeadings, setDetectedHeadings] = useState<DetectedHeading[]>([]);
  const [sectionImages, setSectionImages] = useState<Record<string, string>>({});
  const [h2DetectMsg, setH2DetectMsg] = useState("");

  const editorRef = useRef<any>(null);

  // Parse H1 and H2 headings from TinyMCE content, preserving document order
  const handleDetectH2s = () => {
    if (!editorRef.current) {
      setH2DetectMsg("Editor not ready yet.");
      return;
    }
    const html = editorRef.current.getContent();
    if (!html.trim()) {
      setH2DetectMsg("Editor is empty. Write some content first.");
      return;
    }

    // Match h1 and h2 tags in document order
    const matches = [
      ...html.matchAll(/<h([12])[^>]*>(.*?)<\/h[12]>/gi),
    ];

    const headings: DetectedHeading[] = matches.map((m) => ({
      level: parseInt(m[1], 10) as 1 | 2,
      text: m[2].replace(/<[^>]+>/g, "").replace(/&[a-z]+;/gi, " ").trim(),
    }));

    if (headings.length === 0) {
      setH2DetectMsg("No H1 or H2 headings found in content.");
      return;
    }

    // Preserve any image values already set for unchanged heading texts
    const updated: Record<string, string> = {};
    headings.forEach(({ text }) => {
      updated[text] = sectionImages[text] || "";
    });

    setDetectedHeadings(headings);
    setSectionImages(updated);
    setH2DetectMsg(
      `Found ${headings.length} heading${headings.length > 1 ? "s" : ""} (H1/H2).`
    );
  };

  const handleSectionImageChange = (headingText: string, value: string) => {
    setSectionImages((prev) => ({ ...prev, [headingText]: value }));
  };

  const handleGenerate = async () => {
    if (editorRef.current) {
      setIsSaving(true);
      setSaveMessage("");
      try {
        const htmlContent = editorRef.current.getContent();
        const finalTitle = title || "New Blog Post";

        // Only include section images that have a value
        const filteredSectionImages = Object.fromEntries(
          Object.entries(sectionImages).filter(([, v]) => v.trim())
        );

        const newPost = {
          id: Math.floor(Math.random() * 10000),
          slug:
            slug ||
            finalTitle
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)+/g, ""),
          title: finalTitle,
          metaTitle: metaTitle.trim(),
          metaDescription: metaDescription.trim(),
          image: image || "/Blog/Blog11.webp",
          ...(Object.keys(filteredSectionImages).length > 0 && {
            sectionImages: filteredSectionImages,
          }),
          htmlContent: htmlContent,
          content: [],
        };

        const res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPost),
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
        <h1 className="text-4xl font-bold text-forest">Add New Blog Post</h1>

        {/* ── Basic fields ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-medium text-forest">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 rounded-lg border border-forest bg-white outline-none focus:border-forest transition-colors text-gray-900"
              placeholder="e.g., Manual vs AI Call Automation"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-medium text-forest">Slug (URL Path)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="p-3 rounded-lg border border-forest bg-white outline-none focus:border-forest transition-colors text-gray-900"
              placeholder="e.g., manual-vs-ai-call-automation (auto-generated if empty)"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-medium text-forest">Meta Title (SEO)</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="p-3 rounded-lg border border-forest bg-white outline-none focus:border-forest transition-colors text-gray-900"
              placeholder="e.g., Manual vs AI Call Automation: Which Is Better for Business"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-medium text-forest">Meta Description (SEO)</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="p-3 rounded-lg border border-forest bg-white outline-none focus:border-forest transition-colors text-gray-900 resize-y"
              placeholder="e.g., Compare manual calling vs AI call automation for cost, efficiency, and ROI..."
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

        {/* ── TinyMCE editor ── */}
        <div className="flex flex-col gap-2 mt-4">
          <label className="font-medium text-forest">Content</label>
          <div className="border border-forest rounded-lg overflow-hidden">
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              init={{
                height: 500,
                placeholder: "Start writing your blog post here...",
                menubar: false,
                plugins: [
                  "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                  "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                  "insertdatetime", "media", "table", "code", "help", "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
                  "alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
              }}
            />
          </div>
        </div>

        {/* ── Section Images ── */}
        <div className="flex flex-col gap-4 mt-2 p-6 rounded-xl border border-forest bg-white/60">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-forest">
                Section Images{" "}
                <span className="text-sm font-normal text-gray-500">
                  (one per H1 / H2 heading)
                </span>
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Write your content above, then click the button to detect H1 and H2
                headings and assign an image to each.
              </p>
            </div>
            <button
              type="button"
              onClick={handleDetectH2s}
              className="shrink-0 px-5 py-2.5 bg-forest hover:bg-canyon text-white text-sm font-medium rounded-lg transition-colors"
            >
              Detect H1 / H2 sections from content
            </button>
          </div>

          {h2DetectMsg && (
            <p
              className={`text-sm font-medium ${
                detectedHeadings.length > 0 ? "text-green-700" : "text-amber-600"
              }`}
            >
              {h2DetectMsg}
            </p>
          )}

          {detectedHeadings.length === 0 && !h2DetectMsg && (
            <p className="text-sm text-gray-400 italic">
              No sections detected yet. Write content with H1 or H2 headings and click
              the button above.
            </p>
          )}

          {detectedHeadings.length > 0 && (
            <div className="flex flex-col gap-4">
              {detectedHeadings.map(({ text, level }, idx) => (
                <div key={`${level}-${text}`} className="flex flex-col gap-1.5">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    {/* Badge: green for H1, forest/teal for H2 */}
                    <span
                      className={`inline-flex items-center justify-center w-8 h-6 rounded-full text-white text-xs font-bold shrink-0 ${
                        level === 1 ? "bg-emerald-600" : "bg-forest"
                      }`}
                    >
                      H{level}
                    </span>
                    <span className="font-mono text-forest truncate">{text}</span>
                  </label>
                  <input
                    type="text"
                    value={sectionImages[text] || ""}
                    onChange={(e) => handleSectionImageChange(text, e.target.value)}
                    className="p-2.5 rounded-lg border border-gray-300 bg-white outline-none focus:border-forest transition-colors text-gray-900 text-sm"
                    placeholder={`/Blog/section-${idx + 1}.webp`}
                  />
                  {sectionImages[text]?.trim() && (
                    <p className="text-xs text-gray-400 ml-10">
                      ✓ Image set:{" "}
                      <code className="bg-gray-100 px-1 rounded">
                        {sectionImages[text]}
                      </code>
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Save button ── */}
        <div className="flex justify-end mt-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isSaving}
            className="px-8 py-3 bg-forest hover:bg-canyon text-white rounded-lg font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving…" : "Save & generate JSON"}
          </button>
        </div>

        {saveMessage && (
          <p
            className={`text-sm font-medium ${
              saveMessage.startsWith("Success") ? "text-green-700" : "text-red-700"
            }`}
          >
            {saveMessage}
          </p>
        )}

        {/* ── Generated JSON preview ── */}
        {generatedJson && (
          <div className="mt-8 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-forest">Generated JSON</h2>
            <p className="text-forest">
              Copy this JSON object and add it to the <code>BLOG_POSTS</code> array in{" "}
              <code>lib/constants/blogs.ts</code>.
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