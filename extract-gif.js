const fs = require('fs');
const gifFrames = require('gif-frames');

async function extract() {
  try {
    const frameData = await gifFrames({ url: 'public/icons8-favicon-v2.gif', frames: 'all', outputType: 'canvas', cumulative: true });
    
    let base64Frames = [];
    for (let frame of frameData) {
      const canvas = frame.getImage();
      const base64 = canvas.toDataURL('image/png');
      base64Frames.push(base64);
    }
    
    const framesString = base64Frames.map(f => '"' + f + '"').join(',\n  ');
    
    const tsxCode = `"use client";

import { useEffect } from "react";

// Generated frames from icons8-favicon-v2.gif
const frames = [
  ` + framesString + `
];

export default function AnimatedFavicon() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    
    link.type = "image/png";

    let frameIndex = 0;
    const intervalId = setInterval(() => {
      frameIndex = (frameIndex + 1) % frames.length;
      link.href = frames[frameIndex];
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return null;
}
`;

    fs.writeFileSync('components/AnimatedFavicon.tsx', tsxCode);
    console.log("Successfully extracted frames and generated AnimatedFavicon.tsx");
  } catch(e) {
    console.error(e);
  }
}

extract();
