import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

interface CityCardProps {
  name: string;
  description: string;
  universities: number;
  imageUrl: string;
  href?: string;
}

export function CityCard({
  name,
  description,
  universities,
  imageUrl,
  href = "#",
}: CityCardProps) {
  const content = (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-2xl">
      {/* Full-bleed image container with overlay */}
      <div className="relative h-72 w-full overflow-hidden bg-paper-dim">
        <Image
          src={imageUrl}
          alt={`${name} cityscape`}
          fill
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority={false}
          quality={90}
        />

        {/* Multi-layer gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-50" />

        {/* Location icon badge */}
        <div className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition-all duration-300 group-hover:bg-coral/20 group-hover:scale-110">
          <MapPin size={20} className="text-white transition-colors duration-300 group-hover:text-coral" />
        </div>

        {/* Content positioned over image with smooth slide effect */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 transition-all duration-300 group-hover:pb-7">
          {/* City name */}
          <h3 className="text-2xl font-semibold text-white transition-colors duration-300 group-hover:text-gold mb-2">
            {name}
          </h3>

          {/* Description */}
          <p className="text-sm text-white/90 line-clamp-2 transition-colors duration-300 group-hover:text-white mb-4">
            {description}
          </p>

          {/* Universities badge */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 transition-all duration-300 group-hover:bg-coral/30">
              <span className="text-xs font-semibold text-white transition-colors duration-300 group-hover:text-white">
                {universities} Universities
              </span>
            </div>

            {/* Arrow indicator - hidden by default, shows on hover */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-all duration-300 group-hover:bg-coral/40 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
              <ArrowRight size={16} className="text-white transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Subtle border highlight on hover */}
      <div className="absolute inset-0 rounded-2xl border border-white/0 transition-colors duration-300 group-hover:border-white/10 pointer-events-none" />
    </div>
  );

  if (href && href !== "#") {
    return <Link href={href} className="transition-all duration-300 block">{content}</Link>;
  }

  return content;
}
