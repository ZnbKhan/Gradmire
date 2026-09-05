"use client";

import { useEffect, useRef } from "react";
import { animate, onScroll, set, stagger } from "animejs";

/**
 * Scroll-triggered entrance animation for a section, or for a grid's tiles in
 * sequence.
 *
 * Deliberately scroll-only, and deliberately not used on the hero. The hero
 * holds the largest contentful paint, and Chrome does not treat an element
 * painted at opacity 0 as an LCP candidate: animating it in — whether from
 * JavaScript or a keyframe — hands LCP to some smaller element that happens
 * to be visible, and delays the headline a visitor actually came to read.
 *
 * The hidden starting state is declared in globals.css (`.js [data-reveal]`)
 * rather than applied here. An effect cannot run before the first paint, so
 * hiding these in JavaScript would flash the finished layout and then blank
 * it. Gating that rule behind the `.js` class — added by the inline script in
 * the root layout — means a visitor without JavaScript gets an unhidden page
 * instead of an empty one.
 *
 * Children are passed through untouched, so wrapping a server-rendered
 * section in this does not pull that section into the client bundle.
 */

/** px of upward travel. Small: this is punctuation, not a transition. */
const DISTANCE = 18;
const DURATION = 620;
/** Leaves immediately, settles gently — the same intent as the Tailwind default. */
const EASE = "out(3)";
/**
 * Threshold reads "<container edge> <target edge>": the element's top meeting
 * the viewport's bottom, pulled 72px up so a section commits to appearing
 * rather than creeping in a pixel at a time.
 */
const ENTER = "end-=72 start";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Move the direct children in sequence instead of the wrapper as one block. */
  group?: boolean;
  /** ms between children. Ignored unless `group`. */
  step?: number;
  /** ms before the first element moves. */
  delay?: number;
  as?: "div" | "ol" | "ul";
};

export function Reveal({
  children,
  className,
  group = false,
  step = 70,
  delay = 0,
  as = "div",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = group ? Array.from(root.children) : root;

    // The CSS hides these unconditionally, so reduced motion is not "skip the
    // animation" — it is "put them back", or the section never appears.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      set(targets, { opacity: 1 });
      return;
    }

    const observer = onScroll({ target: root, enter: ENTER, repeat: false });

    const animation = animate(targets, {
      opacity: [0, 1],
      y: [DISTANCE, 0],
      duration: DURATION,
      ease: EASE,
      delay: group ? stagger(step, { start: delay }) : delay,
      autoplay: observer,
    });

    return () => {
      animation.revert();
      observer.revert();
    };
  }, [group, step, delay]);

  // Aliased to a `div`-typed tag so one component can emit either element
  // without a polymorphic ref type; `ol`/`ul` take the same props used here.
  const Tag = as as "div";

  return (
    <Tag
      ref={rootRef}
      className={className}
      {...(group ? { "data-reveal-group": "" } : { "data-reveal": "" })}
    >
      {children}
    </Tag>
  );
}
