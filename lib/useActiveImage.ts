"use client";

import { useEffect, useRef, useState, RefObject } from "react";
import { BlogPost } from "@/lib/constants/blogs";

export function useActiveImage(
  post: BlogPost | undefined,
  scrollRef: RefObject<HTMLDivElement | null>
) {
  const coverImage = post?.image || "/Blog/Blog11.webp";
  const [activeImage, setActiveImage] = useState(coverImage);
  const lastAssignedImage = useRef(coverImage);
  const hasCrossedFirstSection = useRef(false);

  // Reset whenever the post (and thus cover image) changes
  useEffect(() => {
    setActiveImage(coverImage);
    lastAssignedImage.current = coverImage;
    hasCrossedFirstSection.current = false;
  }, [coverImage]);

  useEffect(() => {
    if (!post?.sectionImages) return;
    const container = scrollRef.current;
    if (!container) return;

    const hasSectionImages = Object.keys(post.sectionImages).length > 0;
    if (!hasSectionImages) return;

    const handleScroll = () => {
      const isMobile = window.innerWidth < 1024;

      const sentinels = Array.from(
        container.querySelectorAll<HTMLElement>("[data-h2-sentinel]")
      );
      if (sentinels.length === 0) return;

      const scrollTop = isMobile ? window.scrollY : container.scrollTop;
      const clientHeight = isMobile ? window.innerHeight : container.clientHeight;
      const triggerOffset = clientHeight * 0.3;

      const firstSentinel = sentinels[0];
      const firstSentinelPos = isMobile
        ? firstSentinel.getBoundingClientRect().top + window.scrollY
        : firstSentinel.offsetTop;

      if (firstSentinelPos > scrollTop + triggerOffset) {
        if (!hasCrossedFirstSection.current) {
          lastAssignedImage.current = coverImage;
          setActiveImage(coverImage);
        }
        return;
      }

      let chosenImage: string | null = null;

      for (const sentinel of sentinels) {
        const sentinelPos = isMobile
          ? sentinel.getBoundingClientRect().top + window.scrollY
          : sentinel.offsetTop;

        if (sentinelPos > scrollTop + triggerOffset) break;

        const key = sentinel.dataset.h2Sentinel!;
        if (post.sectionImages![key]) {
          chosenImage = post.sectionImages![key];
        }
      }

      if (chosenImage) {
        hasCrossedFirstSection.current = true;
        if (chosenImage !== lastAssignedImage.current) {
          lastAssignedImage.current = chosenImage;
          setActiveImage(chosenImage);
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [post, coverImage, scrollRef]);

  return { activeImage, coverImage };
}