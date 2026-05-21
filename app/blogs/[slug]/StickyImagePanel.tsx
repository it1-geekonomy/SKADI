"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BlogPost } from "@/lib/constants/blogs";

interface StickyImagePanelProps {
  post: BlogPost;
  activeImage: string;
}

export function StickyImagePanel({ post, activeImage }: StickyImagePanelProps) {
  const [currentImage, setCurrentImage] = useState<string>(() => activeImage || post.image || "");
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const next = activeImage || post.image || "";
    if (!next || next === currentImage) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    setPrevImage(currentImage);
    setCurrentImage(next);
    setFading(true);

    timerRef.current = setTimeout(() => {
      setPrevImage(null);
      setFading(false);
    }, 280);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeImage]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayImage = currentImage || post.image || "";

  return (
    <>
      {/* Mobile/tablet: fixed 320x320 */}
      <div className="lg:hidden relative w-[320px] h-[320px] mx-auto overflow-hidden rounded-lg">
        <Image
          src={displayImage}
          alt={post.title}
          fill
          className="object-contain object-center"
          priority
          sizes="320px"
        />
        {prevImage && (
          <Image
            src={prevImage}
            alt={post.title}
            fill
            className={`object-contain object-center transition-opacity duration-[280ms] ease-in-out ${
              fading ? "opacity-0" : "opacity-100"
            }`}
            sizes="320px"
          />
        )}
      </div>

      {/* Desktop: full panel, no bg, no border */}
      <div className="hidden lg:flex relative w-full flex-1 min-h-[280px] overflow-hidden rounded-lg">
        <Image
          src={displayImage}
          alt={post.title}
          fill
          className="object-contain object-center"
          priority
          sizes="50vw"
        />
        {prevImage && (
          <Image
            src={prevImage}
            alt={post.title}
            fill
            className={`object-contain object-center transition-opacity duration-[280ms] ease-in-out ${
              fading ? "opacity-0" : "opacity-100"
            }`}
            sizes="50vw"
          />
        )}
      </div>
    </>
  );
}