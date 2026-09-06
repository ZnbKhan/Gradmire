import Image from "next/image";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  studentName: string;
  university: string;
  course: string;
  quote: string;
  imageUrl: string;
  rating?: number;
}

export function TestimonialCard({
  studentName,
  university,
  course,
  quote,
  imageUrl,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <div className="card-premium group relative">
      {/* Quote Mark */}
      <div className="mb-4 text-5xl text-coral/20">&ldquo;</div>

      {/* Quote */}
      <p className="mb-6 min-h-[80px] text-base text-ink-soft leading-relaxed">
        {quote}
      </p>

      {/* Rating */}
      <div className="mb-5 flex gap-1">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} size={16} className="fill-coral text-coral" />
        ))}
      </div>

      {/* Student Info */}
      <div className="flex items-center gap-4 rounded-lg bg-coral-dim/50 p-4">
        {/* Avatar */}
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full">
          <Image
            src={imageUrl}
            alt={studentName}
            fill
            sizes="56px"
            className="object-cover"
            priority={false}
          />
        </div>

        {/* Name & Details */}
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-ink">{studentName}</h4>
          <p className="text-xs text-ink-soft">{university}</p>
          <p className="text-xs font-medium text-coral">{course}</p>
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute right-0 top-0 h-px w-1/3 bg-gradient-to-l from-coral to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
}
