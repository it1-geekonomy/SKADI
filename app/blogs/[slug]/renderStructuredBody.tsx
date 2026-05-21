import React from "react";
import { BlogContentItem, BlogPost } from "@/lib/constants/blogs";
import Typography from "@/lib/Typography";

export function renderContentItem(item: BlogContentItem, index: number) {
  switch (item.type) {
    case "heading":
      return (
        <Typography
          key={index}
          variant="h2"
          className={`mb-3 border-b border-black/10 pb-2 text-left tracking-tight font-semibold text-forest dark:text-forest dark:border-white/15 ${
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
          className={`text-left tracking-tight font-semibold text-forest dark:text-forest ${
            index === 0 ? "mt-0" : "mt-8"
          } mb-2`}
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
        <ul
          key={index}
          className={`list-disc space-y-2 pl-5 text-left text-neutral-700 dark:text-neutral-200 ${
            index === 0 ? "mt-0" : "mt-4"
          }`}
        >
          {item.items?.map((li, i) => (
            <li key={i} className="leading-[1.65] pl-1">
              <Typography variant="body-lg">{li}</Typography>
            </li>
          ))}
        </ul>
      );
    case "table":
      return (
        <div
          key={index}
          className={`overflow-x-auto ${index === 0 ? "mt-0" : "my-6"}`}
        >
          <table className="w-full border-collapse border text-left border-black/10 dark:border-white/15">
            <thead>
              <tr className="bg-black/3 dark:bg-white/5">
                {item.headers?.map((header, i) => (
                  <th
                    key={i}
                    className="border border-black/10 dark:border-white/15 px-3 py-2 text-left text-sm font-semibold sm:px-4 sm:py-3 text-forest dark:text-forest"
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
                      <Typography variant="body-lg" className="leading-[1.65]">
                        {cell}
                      </Typography>
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
export function renderStructuredBody(post: BlogPost) {
  return post.content.map((item, index) => renderContentItem(item, index));
}