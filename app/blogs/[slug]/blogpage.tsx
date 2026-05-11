"use client";

import Image from "next/image";
import Link from "next/link";
import { BlogPost, BlogContentItem } from "@/lib/constants/blogs";
import Typography from "@/lib/Typography";

export default function BlogDetailClient({ post }: { post: BlogPost }) {
  const isVerticalLayout = post.slug === "sustainable-ceramic-tiles";

  return (
    <main
      className={`bg-inherit ${
        isVerticalLayout
          ? "min-h-screen pt-24 pb-20 px-6 md:px-12 lg:px-20 flex flex-col overflow-y-auto scrollbar-hide"
          : // KEY: h-screen + overflow-hidden on main for BOTH mobile and desktop.
            // Nothing on the page body ever scrolls — only the content div scrolls internally.
            "h-dvh overflow-hidden pt-24 px-6 md:px-12 lg:px-20 flex flex-col lg:flex-row lg:gap-16"
      }`}
    >
      {isVerticalLayout ? (
        /* ── Vertical layout ── */
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-12">
          <div className="relative w-full aspect-[21/9] overflow-hidden border-2 border-neutral-200 dark:border-neutral-800 shadow-xl">
            <Image
              src={post.image || "/Blog/Blog11.webp"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col gap-8 max-w-[900px] mx-auto w-full">
            <Typography variant="display-xl" className="text-center font-normal leading-tight text-forest">
              {post.title}
            </Typography>
            <div className="space-y-6">
              {post.htmlContent?.trim() ? (
                <div
                  className="blog-html-content blog-detail-prose blog-detail-prose-premium w-full max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                />
              ) : (
                post.content.map((item, index) => renderContent(item, index))
              )}
            </div>
            <div className="w-full h-[1px] bg-neutral-300 dark:bg-neutral-800 my-8" />
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 uppercase tracking-widest text-sm hover:opacity-70 transition-opacity self-start"
            >
              <span style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}>&larr;</span> 
              <Typography variant="body-sm">Back to Blogs</Typography>
            </Link>
          </div>
        </div>
      ) : (
        /*
         * ── Split layout (mobile + desktop) ──
         *
         * <main> is h-screen overflow-hidden — the page body NEVER scrolls.
         * Inside, flex direction is:
         *   • column on mobile  → image row on top, content row below
         *   • row on desktop    → image column on left, content column on right
         *
         * The image is a plain flex child with a fixed size — it never scrolls
         * because nothing above it scrolls (main is overflow-hidden).
         *
         * The content div has overflow-y-auto + flex-1 + min-h-0.
         * min-h-0 is CRITICAL — flex children default to min-height:auto which
         * prevents shrinking, so overflow-y-auto never fires without it.
         */
        <>
          {/*
           * <main> is h-dvh + overflow-hidden + flex-col (mobile) / flex-row (desktop).
           * Image and content are DIRECT children — no wrapper in between.
           *
           * IMAGE: flex-shrink-0 with explicit height on mobile → never moves.
           * CONTENT: flex-1 + min-h-0 + overflow-y-auto → only this scrolls.
           */}

          {/* IMAGE */}
          <div className="flex-shrink-0 w-full h-[42vw] max-h-[35vh] min-h-[150px] lg:w-[45%] lg:h-auto lg:max-h-none lg:min-h-0 lg:self-stretch">
            <div className="relative w-full h-full overflow-hidden border-2 border-neutral-200 dark:border-neutral-800 shadow-2xl">
              <Image
                src={post.image || "/Blog/Blog11.webp"}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
          </div>

          {/* CONTENT — the one and only scrolling element */}
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide flex flex-col pt-6 pb-10 lg:pt-12 lg:pb-0 lg:pr-8 lg:gap-0">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 uppercase tracking-widest text-sm mb-8 lg:mb-12 hover:opacity-70 transition-opacity flex-shrink-0"
            >
              <span style={{ fontSize: "1.2rem", marginRight: "0.5rem" }}>&larr;</span> 
              <Typography variant="body-sm">Back to Blogs</Typography>
            </Link>

            <Typography variant="display-xl" className="font-normal leading-tight mb-8 lg:mb-12 text-forest flex-shrink-0">
              {post.title}
            </Typography>

            <div className="space-y-8 pb-16">
              {post.htmlContent?.trim() ? (
                <div
                  className="blog-html-content blog-detail-prose blog-detail-prose-premium w-full max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                />
              ) : (
                post.content.map((item, index) => renderContent(item, index))
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}

function renderContent(item: BlogContentItem, index: number) {
  switch (item.type) {
    case "paragraph":
      return (
        <Typography
          key={index}
          variant="body-lg"
          className="text-left text-mid dark:text-neutral-300 first:mt-0 break-words"
        >
          {item.text}
        </Typography>
      );
    case "heading":
      return (
        <Typography
          key={index}
          variant="h2"
          className={`mb-3 border-b border-black/10 pb-2 text-left tracking-tight text-forest dark:text-forest dark:border-white/15 break-words ${
            index === 0 ? "mt-0" : "mt-10"
          }`}
        >
          {item.text}
        </Typography>
      );
    case "subheading":
      return (
        <Typography
          key={index}
          variant="h3"
          className={`text-left tracking-tight text-forest dark:text-forest break-words ${
            index === 0 ? "mt-0" : "mt-8"
          } mb-2`}
        >
          {item.text}
        </Typography>
      );
    case "list":
      return (
        <ul
          key={index}
          className={`list-disc space-y-2 pl-5 text-left text-mid dark:text-neutral-300 ${
            index === 0 ? "mt-0" : "mt-6"
          }`}
        >
          {item.items?.map((listItem, i) => (
            <li key={i} className="leading-[1.65] pl-1 break-words">
              <Typography variant="body-lg">{listItem}</Typography>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div key={index} className={`w-full max-w-full ${index === 0 ? "mt-0" : "my-6"}`}>
          <table className="w-full table-fixed border-collapse border text-left border-black/10 dark:border-white/15">
            <thead>
              <tr className="bg-black/5 dark:bg-white/5">
                {item.headers?.map((header, i) => (
                  <th
                    key={i}
                    className="border border-black/10 dark:border-white/15 px-3 py-2 text-left text-sm font-semibold sm:px-4 sm:py-3 text-forest dark:text-forest break-words"
                  >
                    <Typography variant="body-sm">{header}</Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {item.rows?.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className="border border-black/10 dark:border-white/15 px-3 py-2 sm:px-4 sm:py-3 text-mid dark:text-neutral-300"
                    >
                      <Typography variant="body-lg" className="leading-[1.65] break-words">{cell}</Typography>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}