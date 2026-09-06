import Image from "next/image";
import { ReactNode } from "react";

interface StatCard {
  number: string;
  label: string;
}

interface HeroWithImageProps {
  backgroundImage: string;
  eyebrow: string;
  headline: string;
  subheading: ReactNode;
  description: string;
  cta?: ReactNode;
  stats: StatCard[];
}

export function HeroWithImage({
  backgroundImage,
  eyebrow,
  headline,
  subheading,
  description,
  cta,
  stats,
}: HeroWithImageProps) {
  return (
    <section className="relative min-h-[600px] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Hero background"
          fill
          className="object-cover"
          priority
          quality={85}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink/30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-[600px] flex-col justify-center gutter">
        <div className="mx-auto w-full max-w-5xl">
          {/* Eyebrow */}
          <div className="mb-4 inline-block">
            <span className="eyebrow">{eyebrow}</span>
          </div>

          {/* Main Content */}
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            {/* Left: Headline & Description */}
            <div className="flex flex-col justify-center">
              <h1 className="mb-6 text-[clamp(34px,5vw,56px)] font-semibold leading-[1.1] text-white">
                {headline}
              </h1>

              {subheading && (
                <p className="mb-4 text-lg text-white/90">{subheading}</p>
              )}

              <p className="mb-8 max-w-[46ch] text-[17px] text-white/80 leading-relaxed">
                {description}
              </p>

              {cta && <div className="flex flex-wrap gap-3">{cta}</div>}
            </div>

            {/* Right: Floating Stat Cards */}
            <div className="flex flex-col justify-center gap-4">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="card-premium glass backdrop-blur-md"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-coral to-coral/70">
                      <span className="text-2xl font-bold text-white">
                        {stat.number.split("+")[0]}
                      </span>
                      {stat.number.includes("+") && (
                        <span className="text-2xl font-bold text-white">+</span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-ink">{stat.number}</p>
                      <p className="text-sm text-ink-soft">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
