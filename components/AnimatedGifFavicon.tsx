"use client";

import { useEffect } from "react";
import { parseGIF, decompressFrames } from "gifuct-js";

export default function AnimatedGifFavicon({ gifUrl }: { gifUrl: string }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let isActive = true;
    let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let frames: any[] = [];
    let currentFrame = 0;
    let timeoutId: NodeJS.Timeout;
    
    // Create an offscreen canvas to draw patches
    const patchCanvas = document.createElement("canvas");
    const patchCtx = patchCanvas.getContext("2d");

    async function loadGif() {
      try {
        const res = await fetch(gifUrl);
        const buffer = await res.arrayBuffer();
        const gif = parseGIF(buffer);
        frames = decompressFrames(gif, true);
        
        if (!frames.length || !isActive) return;
        
        canvas.width = frames[0].dims.width;
        canvas.height = frames[0].dims.height;
        patchCanvas.width = canvas.width;
        patchCanvas.height = canvas.height;
        
        playGif();
      } catch (e) {
        console.error("Failed to load GIF for favicon", e);
      }
    }

    function playGif() {
      if (!isActive || !frames.length) return;
      
      const frame = frames[currentFrame];
      const dims = frame.dims;
      
      // Create ImageData for the patch
      const patchData = new ImageData(
        new Uint8ClampedArray(frame.patch),
        dims.width,
        dims.height
      );
      
      // Apply disposal method before drawing current frame
      // 2 = restore to background color (clear)
      // 3 = restore to previous
      if (frame.disposalType === 2) {
         ctx!.clearRect(dims.left, dims.top, dims.width, dims.height);
      }
      
      // Draw the patch to our patch canvas
      patchCanvas.width = dims.width;
      patchCanvas.height = dims.height;
      patchCtx!.putImageData(patchData, 0, 0);
      
      // Draw the patch canvas onto the main canvas with alpha compositing
      ctx!.drawImage(patchCanvas, dims.left, dims.top);
      
      // Update favicon
      link.type = "image/png";
      link.href = canvas.toDataURL("image/png");
      
      currentFrame = (currentFrame + 1) % frames.length;
      
      // Schedule next frame
      const delay = Math.max(frame.delay || 100, 30);
      timeoutId = setTimeout(playGif, delay);
    }

    loadGif();

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [gifUrl]);

  return null;
}
