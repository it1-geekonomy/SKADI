"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BLOG_POSTS, BlogContentItem, BlogPost } from "@/lib/constants/blogs";
import Typography from "@/lib/Typography";

function renderHtmlBody(post: BlogPost) {
  if (!post.htmlContent?.trim()) return null;
  return (
    <div
      className="blog-html-content blog-detail-prose blog-detail-prose-premium w-full max-w-none text-neutral-700 dark:text-neutral-200"
      dangerouslySetInnerHTML={{ __html: post.htmlContent }}
    />
  );
}

function renderStructuredBody(post: BlogPost) {
  return post.content.map((item, index) => renderContentItem(item, index));
}

function renderContentItem(item: BlogContentItem, index: number) {
  switch (item.type) {
    case "heading":
      return (
        <Typography
          key={index}
          variant="h2"
          className={`mb-3 border-b border-black/10 pb-2 text-left tracking-tight font-semibold text-forest dark:text-forest dark:border-white/15 ${index === 0 ? "mt-0" : "mt-10"}`}
        >
          {item.text}
        </Typography>
      );
    case "subheading":
      return (
        <Typography
          key={index}
          variant="h3"
          className={`text-left tracking-tight font-semibold text-forest dark:text-forest ${index === 0 ? "mt-0" : "mt-8"} mb-2`}
        >
          {item.text}
        </Typography>
      );
    case "paragraph":
      return (
        <Typography
          key={index}
          variant="body-lg"
          className="text-left text-neutral-700 dark:text-neutral-200 first:mt-0"
        >
          {item.text}
        </Typography>
      );
    case "list":
      return (
        <ul key={index} className={`list-disc space-y-2 pl-5 text-left text-neutral-700 dark:text-neutral-200 ${index === 0 ? "mt-0" : "mt-4"}`}>
          {item.items?.map((li, i) => (
            <li key={i} className="leading-[1.65] pl-1">
              <Typography variant="body-lg">{li}</Typography>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div key={index} className={`overflow-x-auto ${index === 0 ? "mt-0" : "my-6"}`}>
          <table className="w-full border-collapse border text-left border-black/10 dark:border-white/15">
            <thead>
              <tr className="bg-black/3 dark:bg-white/5">
                {item.headers?.map((header, i) => (
                  <th key={i} className="border border-black/10 dark:border-white/15 px-3 py-2 text-left text-sm font-semibold sm:px-4 sm:py-3 text-forest dark:text-forest">
                    <Typography variant="body-sm">{header}</Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {item.rows?.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="border border-black/10 dark:border-white/15 px-3 py-2 sm:px-4 sm:py-3 text-mid dark:text-neutral-300">
                      <Typography variant="body-lg" className="leading-[1.65]">{cell}</Typography>
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

export default function BlogDetailPage() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = typeof slugParam === "string" ? slugParam : slugParam?.[0];

  const post = slug ? BLOG_POSTS.find((p) => p.slug === slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Typography variant="display-xl" className="font-semibold tracking-tight text-forest dark:text-forest">
          Post not found
        </Typography>
      </div>
    );
  }

  const borderColor = "border-neutral-200 dark:border-neutral-800";
  const imageSrc = post.image || "/Blog/Blog11.webp";

  const isVerticalLayout = post.slug === "sustainable-ceramic-tiles";

  const body = post.htmlContent?.trim()
    ? renderHtmlBody(post)
    : renderStructuredBody(post);

  /* Viewport row height under fixed header: pt-24 (6rem) + a little air */
  const splitRowLg = "lg:h-[calc(100vh-6.25rem)]";

  return (
    <main
      className={`w-full bg-inherit ${
        isVerticalLayout
          ? "min-h-screen overflow-y-auto pt-20 pb-12 sm:pt-24 sm:pb-16 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20"
          : `min-h-screen pt-10 pb-10 sm:pt-24 sm:pb-14 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 ${splitRowLg} lg:overflow-hidden`
      }`}
    >
      {isVerticalLayout ? (
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 sm:gap-12">
          <div
            className={`relative w-full aspect-21/9 overflow-hidden border-2 ${borderColor} shadow-lg sm:shadow-xl`}
          >
            <Image src={imageSrc} alt={post.title} fill className="object-cover" priority sizes="100vw" />
          </div>

          <div className="flex flex-col gap-6 sm:gap-8 max-w-[900px] mx-auto w-full">
            <Typography variant="display-xl" className="font-semibold leading-tight text-center sm:text-left tracking-tight text-forest dark:text-forest">
              {post.title}
            </Typography>

            <div className="flex flex-col gap-5 sm:gap-6">{body}</div>
          </div>
        </div>
      ) : (
        <div
          className={`mx-auto w-full max-w-[1400px] flex flex-col lg:flex-row lg:items-stretch gap-8 lg:gap-10 xl:gap-14 ${splitRowLg}`}
        >
          {/* Mobile / tablet: hero image first */}
          <div className="order-1 lg:order-2 w-full lg:flex-1 lg:min-w-0 flex flex-col">
            <div
              className={`relative w-full aspect-4/3 sm:aspect-16/10 lg:aspect-auto lg:flex-1 lg:min-h-[280px] min-h-[200px] overflow-hidden border-2 ${borderColor} shadow-lg lg:shadow-xl`}
            >
              <Image
                src={imageSrc}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Text column: top aligns with image; scrolls inside row on desktop */}
          <div
            className={`order-2 lg:order-1 w-full lg:flex-1 lg:min-w-0 min-h-0 flex flex-col lg:overflow-y-auto lg:pr-2 xl:pr-4 scrollbar-hide pb-2 lg:pb-0`}
          >
            <Typography variant="display-xl" className="font-semibold leading-[1.15] tracking-tight mb-5 sm:mb-6 text-left max-w-xl text-forest dark:text-forest">
              {post.title}
            </Typography>

            <div className="flex flex-col gap-5 sm:gap-6 text-left">{body}</div>
          </div>
        </div>
      )}
    </main>
  );
}
