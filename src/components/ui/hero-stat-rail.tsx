"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { GraduationCap, Plane, Trophy, type LucideIcon } from "lucide-react";

export interface HeroStat {
  icon: "graduation" | "plane" | "trophy";
  value: string;
  label: string;
}

const ICONS: Record<HeroStat["icon"], LucideIcon> = {
  graduation: GraduationCap,
  plane: Plane,
  trophy: Trophy,
};

/**
 * The three floating stat chips over the hero photo.
 *
 * A client component so it can read `prefers-reduced-motion` and drive a
 * spring — the server-rendered hero text beside it stays completely static
 * (see the note in `page.tsx`: the headline is the page's LCP candidate and
 * must never start at opacity 0).
 *
 * Springs, not a CSS transition: nothing here is gesture-driven, but a
 * damping-1.0 (critically damped) spring is this app's one entrance-motion
 * vocabulary already (see `Reveal`'s scroll-triggered fade), so this reuses
 * it rather than inventing a second easing curve for the same kind of
 * moment. Reduced motion drops the y-offset and staggers into a plain
 * cross-fade, per the same principle `Reveal` already follows.
 */
export function HeroStatRail({ stats }: { stats: HeroStat[] }) {
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.12, delayChildren: 0.15 },
    },
  };

  const item: Variants = reduceMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.25 } } }
    : {
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", damping: 1, stiffness: 170, mass: 0.7 },
        },
      };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-3"
    >
      {stats.map((stat) => {
        const Icon = ICONS[stat.icon];
        return (
          <motion.div
            key={stat.label}
            variants={item}
            className="glass flex items-center gap-3.5 rounded-2xl px-4 py-3.5 shadow-card"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-coral/15 text-coral-text">
              <Icon size={19} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-[17px] font-semibold leading-tight text-ink">
                {stat.value}
              </span>
              <span className="block text-[12.5px] leading-tight text-ink-soft">
                {stat.label}
              </span>
            </span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
