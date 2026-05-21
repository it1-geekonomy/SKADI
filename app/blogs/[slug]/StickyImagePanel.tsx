"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { BlogPost } from "@/lib/constants/blogs";

interface StickyImagePanelProps {
  post: BlogPost;
  activeImage: string;
}

export function StickyImagePanel({ post, activeImage }: StickyImagePanelProps) {
  const borderColor = "border-neutral-200 dark:border-neutral-800";
  const [currentImage, setCurrentImage] = useState(activeImage);
  const [prevImage, setPrevImage] = useState<string | null>(null);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (activeImage === currentImage) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    setPrevImage(currentImage);
    setCurrentImage(activeImage);
    setFading(true);

    timerRef.current = setTimeout(() => {
      setPrevImage(null);
      setFading(false);
    }, 280);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeImage]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className={`relative w-[80%] sm:w-[70%] lg:w-full mx-auto lg:mx-0 h-[220px] sm:h-[300px] lg:h-auto lg:aspect-auto lg:flex-1 lg:min-h-[280px] overflow-hidden border-2 ${borderColor} bg-black/5 dark:bg-black/40 shadow-lg lg:shadow-xl rounded-lg`}
    >
      <Image
        src={currentImage}
        alt={post.title}
        fill
        className="object-contain object-fill"
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
      />

      {/* Old image: sits on top and fades out */}
      {prevImage && (
        <Image
          src={prevImage}
          alt={post.title}
          fill
          className={`object-contain transition-opacity duration-[280ms] ease-in-out ${
            fading ? "opacity-0" : "opacity-100"
          }`}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      )}
    </div>
  );
}