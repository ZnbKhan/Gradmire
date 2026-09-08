"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { animate, onScroll } from "animejs";

/**
 * Counts a stat's leading figure up from zero when it scrolls into view.
 *
 * The stats are written as prose — "1 year", "4 of 10", "Direct" — so only a
 * leading run of digits is animated and everything after it is left alone. A
 * value with no leading figure renders as plain text and starts no animation.
 *
 * The server renders the *final* value, so the figure is correct for crawlers
 * and for a visitor without JavaScript; the reset to zero happens in a layout
 * effect, before paint, so the number never visibly snaps backwards.
 */

const LEADING_FIGURE = /^(\d+)(.*)$/;

const DURATION = 1100;
const EASE = "out(4)";
// "<container edge> <target edge>" — see reveal.tsx.
const ENTER = "end-=72 start";

// Client components still render on the server, where `useLayoutEffect` warns.
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function CountUp({ value }: { value: string }) {
  const figureRef = useRef<HTMLSpanElement>(null);

  useBeforePaint(() => {
    const el = figureRef.current;
    if (!el) return;

    const match = LEADING_FIGURE.exec(value);
    if (!match) return;
    const [, figure] = match;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.textContent = "0";

    const counter = { n: 0 };
    const animation = animate(counter, {
      n: Number(figure),
      duration: DURATION,
      ease: EASE,
      onUpdate: () => {
        el.textContent = String(Math.round(counter.n));
      },
      // Rounding during the tween can leave the last frame a digit short.
      onComplete: () => {
        el.textContent = figure;
      },
      autoplay: onScroll({ target: el, enter: ENTER, repeat: false }),
    });

    return () => {
      animation.revert();
      el.textContent = figure;
    };
  }, [value]);

  const match = LEADING_FIGURE.exec(value);
  if (!match) return <>{value}</>;

  return (
    <>
      <span ref={figureRef}>{match[1]}</span>
      {match[2]}
    </>
  );
}
