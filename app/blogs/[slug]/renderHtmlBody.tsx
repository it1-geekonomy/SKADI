import React from "react";
import { BlogPost } from "@/lib/constants/blogs";
import { stripHtml } from "@/lib/stripHtml";

export function renderHtmlBody(post: BlogPost) {
  if (!post.htmlContent?.trim()) return null;

  const hasSectionImages =
    post.sectionImages && Object.keys(post.sectionImages).length > 0;

  if (!hasSectionImages) {
    return (
      <div
        className="blog-html-content blog-detail-prose blog-detail-prose-premium w-full max-w-none text-neutral-700 dark:text-neutral-200"
        dangerouslySetInnerHTML={{ __html: post.htmlContent }}
      />
    );
  }
  const parts = post.htmlContent.split(/(<h[12][^>]*>[\s\S]*?<\/h[12]>)/gi);

  return (
    <div className="blog-html-content blog-detail-prose blog-detail-prose-premium w-full max-w-none text-neutral-700 dark:text-neutral-200">
      {parts.map((part, i) => {
        const h1Match = part.match(/^<h1[^>]*>([\s\S]*?)<\/h1>$/i);
        const h2Match = part.match(/^<h2[^>]*>([\s\S]*?)<\/h2>$/i);
        const headingMatch = h1Match || h2Match;

        if (headingMatch) {
          const headingText = stripHtml(headingMatch[1]);
          return (
            <React.Fragment key={i}>
              <div
                data-h2-sentinel={headingText}
                style={{ height: 0, overflow: "hidden" }}
                aria-hidden="true"
              />
              <div dangerouslySetInnerHTML={{ __html: part }} />
            </React.Fragment>
          );
        }
        return <div key={i} dangerouslySetInnerHTML={{ __html: part }} />;
      })}
    </div>
  );
}