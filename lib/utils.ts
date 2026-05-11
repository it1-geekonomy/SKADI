import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Ease that feels like natural user scrolling */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

let activeScrollRafId: number | null = null;
let activeScrollDelayId: ReturnType<typeof setTimeout> | null = null;

const SCROLL_DELAY_MS = 300;
const SCROLL_DURATION_MS = 6000;

/** Smooth, slow scroll to an element by id. Delay first, then fixed target to avoid jumps. */
export function smoothScrollToId(targetId: string, durationMs = SCROLL_DURATION_MS) {
  if (activeScrollDelayId !== null) {
    clearTimeout(activeScrollDelayId);
    activeScrollDelayId = null;
  }
  if (activeScrollRafId !== null) {
    cancelAnimationFrame(activeScrollRafId);
    activeScrollRafId = null;
  }

  activeScrollDelayId = setTimeout(() => {
    activeScrollDelayId = null;
    const el = document.getElementById(targetId);
    if (!el || !document.body.contains(el)) return;

    const startY = window.scrollY;
    const targetY = el.getBoundingClientRect().top + window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    function step(currentTime: number) {
      try {
        if (!document.body.contains(el)) {
          activeScrollRafId = null;
          return;
        }
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const eased = easeInOutCubic(progress);
        const desiredY = startY + distance * eased;
        window.scrollTo({ top: Math.round(desiredY), left: 0, behavior: "auto" });
        if (progress < 1) {
          activeScrollRafId = requestAnimationFrame(step);
        } else {
          activeScrollRafId = null;
        }
      } catch {
        activeScrollRafId = null;
      }
    }
    activeScrollRafId = requestAnimationFrame(step);
  }, SCROLL_DELAY_MS);
}

const SCROLL_TO_TOP_DURATION_MS = 800;

/** Smooth scroll to top of the page (y = 0). */
export function smoothScrollToTop(durationMs = SCROLL_TO_TOP_DURATION_MS) {
  if (activeScrollDelayId !== null) {
    clearTimeout(activeScrollDelayId);
    activeScrollDelayId = null;
  }
  if (activeScrollRafId !== null) {
    cancelAnimationFrame(activeScrollRafId);
    activeScrollRafId = null;
  }

  const startY = window.scrollY;
  if (startY <= 0) return;

  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    const eased = easeInOutCubic(progress);
    const desiredY = startY * (1 - eased);
    window.scrollTo({ top: Math.round(desiredY), left: 0, behavior: "auto" });
    if (progress < 1) {
      activeScrollRafId = requestAnimationFrame(step);
    } else {
      activeScrollRafId = null;
    }
  }
  activeScrollRafId = requestAnimationFrame(step);
}
