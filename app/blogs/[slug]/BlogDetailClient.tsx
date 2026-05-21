"use client";

import React, { useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BLOG_POSTS, BlogPost } from "@/lib/constants/blogs";
import Typography from "@/lib/Typography";
import { renderHtmlBody } from "./renderHtmlBody";
import { renderStructuredBody } from "./renderStructuredBody";
import { StickyImagePanel } from "./StickyImagePanel";
import { useActiveImage } from "@/lib/useActiveImage";

export default function BlogDetailClient() {
  const params = useParams();
  const slugParam = params?.slug;
  const slug = typeof slugParam === "string" ? slugParam : slugParam?.[0];
  const post = slug ? BLOG_POSTS.find((p) => p.slug === slug) : undefined;
  const scrollRef = useRef<HTMLDivElement>(null);
  const { activeImage, coverImage } = useActiveImage(post, scrollRef);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Typography
          variant="display-xl"
          className="font-semibold tracking-tight text-forest dark:text-forest"
        >
          Post not found
        </Typography>
      </div>
    );
  }

  const borderColor = "border-neutral-200 dark:border-neutral-800";
  const imageSrc = post.image || "/Blog/Blog11.webp";
  const isVerticalLayout = post.slug === "automation-ai";
  const hasHtmlContent = Boolean(post.htmlContent?.trim());
  const body = hasHtmlContent ? renderHtmlBody(post) : renderStructuredBody(post);
  const showPageTitle = !hasHtmlContent;
  // Reduced from 100vh to 92vh so equal space is left top and bottom on desktop
  const splitRowLg = "lg:h-[calc(92vh-6.25rem)]";

  return (
    <main
      className={`w-full bg-[rgb(245,240,232)] ${
        isVerticalLayout
          ? "min-h-screen overflow-y-auto pt-20 pb-12 sm:pt-24 sm:pb-16 px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20"
          : `min-h-screen pt-20 pb-4 sm:pb-4 px-4 sm:px-6 md:px-10 lg:flex lg:items-center lg:justify-center lg:pb-0 lg:min-h-screen`
      }`}
    >
      {isVerticalLayout ? (
        <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-8 sm:gap-12">
          <div
            className={`relative w-full aspect-21/9 overflow-hidden border-2 ${borderColor} shadow-lg sm:shadow-xl`}
          >
            <Image
              src={imageSrc}
              alt={post.title}
              fill
              className="object-contain object-fill"
              priority
              sizes="100vw"
            />
          </div>
          <div className="flex flex-col gap-6 sm:gap-8 max-w-[900px] mx-auto w-full">
            {showPageTitle && (
              <Typography
                variant="display-xl"
                className="font-semibold leading-tight text-center sm:text-left tracking-tight text-forest dark:text-forest"
              >
                {post.title}
              </Typography>
            )}
            <div className="flex flex-col gap-5 sm:gap-6">{body}</div>
          </div>
        </div>
      ) : (
        <div
          className={`mx-auto w-full max-w-[1400px] flex flex-col lg:flex-row lg:items-stretch gap-0 lg:gap-10 xl:gap-14 ${splitRowLg} lg:overflow-hidden`}
        >
          {/* RIGHT: sticky image panel */}
          <div className="sticky top-[5.3rem] lg:top-0 z-20 order-1 lg:order-2 w-full lg:flex-1 lg:min-w-0 flex flex-col bg-[rgb(245,240,232)] dark:bg-neutral-900 pt-8 lg:pt-0">
            <StickyImagePanel post={post} activeImage={activeImage} />
            <div className="h-6 w-full bg-[rgb(245,240,232)] dark:bg-neutral-900 flex-shrink-0 lg:hidden" />
          </div>

          {/* LEFT: scrollable content */}
          <div
            ref={scrollRef}
            className="order-2 lg:order-1 w-full lg:flex-1 lg:min-w-0 min-h-0 flex flex-col lg:overflow-y-auto lg:pr-2 xl:pr-4 scrollbar-hide pt-2 lg:pt-0 pb-2 lg:pb-0"
          >
            {showPageTitle && (
              <Typography
                variant="display-xl"
                className="font-semibold leading-[1.15] tracking-tight mb-5 sm:mb-6 text-left max-w-xl text-forest dark:text-forest mt-1 lg:mt-0"
              >
                {post.title}
              </Typography>
            )}
            <div className="flex flex-col gap-5 sm:gap-6 text-left">{body}</div>
          </div>
        </div>
      )}
    </main>
  );
}