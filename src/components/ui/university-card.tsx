import Image from "next/image";
import Link from "next/link";
import { TrendingUp } from "lucide-react";

interface UniversityCardProps {
  name: string;
  city: string;
  ranking: number;
  tuitionFees: string;
  employability: number;
  imageUrl: string;
  href?: string;
}

export function UniversityCard({
  name,
  city,
  ranking,
  tuitionFees,
  employability,
  imageUrl,
  href = "#",
}: UniversityCardProps) {
  const content = (
    <div className="card-premium group relative overflow-hidden">
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden rounded-xl bg-paper-dim">
        <Image
          src={imageUrl}
          alt={`${name} campus`}
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />
        {/* Overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative pt-5">
        <h3 className="mb-1 text-lg font-semibold text-ink">{name}</h3>
        <p className="mb-4 text-sm text-ink-soft">{city}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 rounded-lg bg-coral-dim p-3">
          {/* Ranking */}
          <div className="flex flex-col items-center">
            <p className="text-xs uppercase tracking-wider text-coral-text">
              Rank
            </p>
            <p className="mt-1 text-lg font-bold text-ink">#{ranking}</p>
          </div>

          {/* Fees */}
          <div className="flex flex-col items-center border-l border-r border-coral/20">
            <p className="text-xs uppercase tracking-wider text-coral-text">
              Tuition
            </p>
            <p className="mt-1 text-sm font-semibold text-ink">{tuitionFees}</p>
          </div>

          {/* Employability */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1">
              <TrendingUp size={12} className="text-coral" />
              <p className="text-xs uppercase tracking-wider text-coral-text">
                Employ
              </p>
            </div>
            <p className="mt-1 text-lg font-bold text-ink">{employability}%</p>
          </div>
        </div>
      </div>

      {/* Hover State Indicator */}
      <div className="mt-4 h-1 w-0 rounded-full bg-coral transition-all duration-300 group-hover:w-full" />
    </div>
  );

  if (href && href !== "#") {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
