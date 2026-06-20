"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "~/features/motion/use-prefers-reduced-motion";

type Props = {
  children: ReactNode;
  enabled?: boolean | null;
};

/**
 * Wraps media in a scroll-driven parallax effect.
 * Disabled when `prefers-reduced-motion: reduce` is set.
 */
export function ParallaxWrapper({ children, enabled }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const shouldParallax = Boolean(enabled) && !reducedMotion;

  useEffect(() => {
    if (!shouldParallax) return;

    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    let rafId: number;

    function update() {
      const rect = container!.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const progress = 1 - rect.bottom / (viewportH + rect.height);
      const offset = progress * 40;
      inner!.style.transform = `translateY(${-offset}px)`;
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [shouldParallax]);

  if (!shouldParallax) return <>{children}</>;

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      <div
        ref={innerRef}
        style={{ height: "120%", marginTop: "-10%", willChange: "transform" }}
        className="w-full"
      >
        {children}
      </div>
    </div>
  );
}
