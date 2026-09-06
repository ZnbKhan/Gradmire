# Gradmire Premium Visual Components Guide

## Overview

This document describes the new premium visual components added to Gradmire for enhanced UI/UX with high-impact imagery and refined interactions.

---

## Components Added

### 1. **UniversityCard** (`src/components/ui/university-card.tsx`)

Display universities with key information and campus imagery.

**Features:**
- High-quality campus image (responsive with hover zoom effect)
- University name and city
- Key metrics displayed in a stat grid:
  - Ranking (#1, #2, etc.)
  - Tuition fees
  - Employability score with trending indicator
- Premium card styling with shadow depth
- Hover state with animated underline indicator
- Optional link wrapping

**Props:**
```tsx
interface UniversityCardProps {
  name: string;              // University name
  city: string;              // City location
  ranking: number;           // University ranking
  tuitionFees: string;       // Fee range (e.g., "£25-30k")
  employability: number;     // Employability %; 0-100
  imageUrl: string;          // Campus image URL
  href?: string;             // Optional link destination
}
```

**Usage:**
```tsx
<UniversityCard
  name="University of Oxford"
  city="Oxford"
  ranking={1}
  tuitionFees="£25-30k"
  employability={96}
  imageUrl="https://images.unsplash.com/..."
  href="/destinations/uk/universities/oxford"
/>
```

---

### 2. **CityCard** (`src/components/ui/city-card.tsx`)

Showcase UK cities with floating info cards and glass morphism effects.

**Features:**
- Full-height cityscape imagery with gradient overlay
- Floating card with city name, description, and university count
- Map pin icon badge on the image
- Glass morphism effect (backdrop blur)
- Hover scale and shadow animations
- Optional link wrapping

**Props:**
```tsx
interface CityCardProps {
  name: string;              // City name
  description: string;       // City description
  universities: number;      // Number of universities
  imageUrl: string;          // City skyline image URL
  href?: string;             // Optional link destination
}
```

**Usage:**
```tsx
<CityCard
  name="London"
  description="Vibrant capital with endless opportunities..."
  universities={22}
  imageUrl="https://images.unsplash.com/..."
  href="/destinations/uk/cities/london"
/>
```

---

### 3. **TestimonialCard** (`src/components/ui/testimonial-card.tsx`)

Student success stories with portraits and star ratings.

**Features:**
- Large opening quote mark
- Student quote/testimonial text
- 5-star rating display
- Student info section with avatar
- Compact info display (name, university, course)
- Subtle decorative line on hover
- Premium background styling

**Props:**
```tsx
interface TestimonialCardProps {
  studentName: string;       // Student name
  university: string;        // University attended
  course: string;            // Course/program
  quote: string;             // Testimonial text
  imageUrl: string;          // Student portrait URL
  rating?: number;           // Star rating (default 5)
}
```

**Usage:**
```tsx
<TestimonialCard
  studentName="Sarah Chen"
  university="University of Cambridge"
  course="Computer Science"
  quote="Gradmire helped me find the perfect course match..."
  imageUrl="https://images.unsplash.com/..."
  rating={5}
/>
```

---

### 4. **PathTimeline** (`src/components/ui/path-timeline.tsx`)

Interactive 7-step journey visualization showing the student journey from interest to graduation.

**Features:**
- **Desktop:** Horizontal timeline with connecting line
- **Mobile:** Vertical timeline with left-aligned steps
- 7 steps: Interest → Course → University → City → Application → Visa → UK 🎓
- Emoji icons for each step
- Intersection observer for scroll-triggered animations
- Responsive design with smooth transitions
- Hover state for scale effect on nodes

**Steps:**
1. **Interest** 🎯 - Tell us your interests and career goals
2. **Course** 📚 - Discover perfect course matches
3. **University** 🏛️ - Find top-ranked universities
4. **City** 🌍 - Choose your ideal location
5. **Application** ✍️ - Get application support
6. **Visa** 🛂 - Navigate visa process
7. **UK 🎓** 🎓 - Start your journey

**Usage:**
```tsx
<PathTimeline />
```

---

### 5. **HeroWithImage** (`src/components/ui/hero-with-image.tsx`)

Enhanced hero section template with background imagery and floating stat cards.

**Features:**
- Full-screen background image with dual gradient overlay
- Left-aligned headline and description content
- Right-aligned floating stat cards with gradient badges
- Eyebrow label above headline
- CTA button support
- Glass morphism effect on stat cards
- Responsive grid layout (stacks on mobile)
- Staggered animation on stat cards

**Props:**
```tsx
interface HeroWithImageProps {
  backgroundImage: string;   // Hero background image URL
  eyebrow: string;          // Eyebrow label
  headline: string;         // Main headline
  subheading: ReactNode;    // Subheading (optional)
  description: string;      // Description text
  cta?: ReactNode;          // CTA buttons
  stats: Array<{            // Floating stat cards
    number: string;
    label: string;
  }>;
}
```

**Usage:**
```tsx
<HeroWithImage
  backgroundImage="https://images.unsplash.com/..."
  eyebrow="Study abroad, reordered"
  headline="Find your course. Then find the UK around it."
  description="Most platforms start with pick a country..."
  stats={[
    { number: "120+", label: "Universities" },
    { number: "Find ideal", label: "course" },
    { number: "Calculate", label: "ROI" },
    { number: "Track", label: "deadlines" }
  ]}
  cta={<button>Find my course</button>}
/>
```

---

## Color Palette

All components use the Gradmire premium palette defined in `globals.css`:

```css
/* Brand Colors */
--ink: 206 72% 13%;          /* Navy #11446A */
--coral: 206 64% 52%;        /* Sky Blue #298DC6 */
--cream: 37 100% 90%;        /* Warm Cream */

/* Supporting Palette */
--ink-2: 206 70% 22%;        /* Navy shade 2 */
--ink-3: 206 65% 32%;        /* Navy shade 3 */
--coral-text: 206 70% 42%;   /* Sky Blue text */
--coral-dim: 206 50% 90%;    /* Sky Blue dimmed */
--cream-dark: 37 80% 76%;    /* Cream dark */
```

---

## CSS Classes Used

All components leverage the premium Tailwind CSS utility classes:

- **`.card-premium`** - Base card styling with shadow depth and hover lift
- **`.glass`** - Glass morphism effect with backdrop blur
- **`.eyebrow`** - Section label with dot indicator
- **`.gutter`** - Responsive horizontal padding

---

## Homepage Integration

New sections added to `src/app/page.tsx`:

1. **Top Universities** - 4 featured university cards with stats
2. **UK Cities** - 4 major UK cities with floating info cards
3. **Student Success Stories** - 3 student testimonials
4. **Find Your Path Timeline** - 7-step interactive journey visualization

All sections use the `<Reveal>` component for scroll-triggered animations.

---

## Image Sources

Components use Unsplash URLs for demonstration:

- University campuses: `images.unsplash.com/photo-*` (campus collections)
- City skylines: `images.unsplash.com/photo-*` (city collections)
- Student portraits: `images.unsplash.com/photo-*` (portrait collections)

For production, replace with hosted images from your CDN or asset management system.

---

## Responsive Design

All components are fully responsive:

- **Mobile (< 768px):** Single-column layout, stacked cards
- **Tablet (768px - 1024px):** 2-column grids
- **Desktop (> 1024px):** 3-4 column grids, enhanced animations

---

## Accessibility

All components include:

- Semantic HTML (e.g., `<Link>` for navigation)
- Alternative text on images (`alt` attributes)
- Proper heading hierarchy
- Keyboard-navigable interactive elements
- Support for `prefers-reduced-motion` media query

---

## Performance Considerations

- Images use Next.js `<Image>` component with responsive sizing
- Lazy loading enabled where appropriate (`priority={false}`)
- CSS transitions use GPU-accelerated properties (transform, opacity)
- No animation loops; all animations triggered by user interaction or scroll

---

## Customization

To customize the components:

1. **Colors:** Modify CSS variables in `globals.css`
2. **Images:** Replace `imageUrl` props with your own URLs
3. **Text Content:** Update mock data arrays at the top of `page.tsx`
4. **Animations:** Adjust transition durations and timing functions
5. **Spacing:** Modify Tailwind gap/padding utilities in component JSX

---

## Next Steps

- Test components locally with `npm run dev`
- Replace mock data with real university/city information
- Integrate with Supabase to fetch dynamic data
- Add image optimization for production CDN
- Run E2E tests with `npm run test:e2e`

---

## Commit

**Commit Hash:** `76c0c11`
**Message:** "Add premium visual components to Gradmire homepage"
**Date:** 2026-09-06
