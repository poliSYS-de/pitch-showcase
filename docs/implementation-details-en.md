# Agentiq Capital VC Pitch Presentation - Technical Implementation Documentation

## Project Overview

This document provides a comprehensive technical overview of the Agentiq Capital VC Pitch Presentation website, a scroll-based animated presentation built to impress venture capital investors. The presentation showcases the company's vision, products, and investment opportunity through advanced web technologies and sophisticated visual effects.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Architecture](#project-architecture)
3. [Design Philosophy](#design-philosophy)
4. [Component Structure](#component-structure)
5. [Animation System](#animation-system)
6. [Visualization Components](#visualization-components)
7. [Styling System](#styling-system)
8. [Smooth Scroll Implementation](#smooth-scroll-implementation)
9. [Performance Optimizations](#performance-optimizations)
10. [File Structure](#file-structure)

---

## Technology Stack

### Core Framework
- **Next.js 16** (App Router) - React framework with server-side rendering capabilities
- **TypeScript** - Type-safe JavaScript for better developer experience and code reliability
- **React 19** - Latest React version with improved performance

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework for rapid UI development
- **CSS Custom Properties** - Theme variables for consistent color management
- **PostCSS** - CSS processing and optimization

### Animation Libraries
- **GSAP (GreenSock Animation Platform) v3.14** - Industry-standard animation library for complex, high-performance animations
- **@gsap/react v2.1** - React integration for GSAP
- **Framer Motion v12.28** - React-native animation library for declarative animations and gestures

### Smooth Scrolling
- **Lenis v1.3** - Smooth scroll library for buttery-smooth scrolling experience

### Package Manager
- **pnpm** - Fast, disk space efficient package manager

---

## Project Architecture

### Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Main presentation page
├── components/
│   ├── navigation/
│   │   └── SlideNav.tsx         # Navigation system
│   ├── providers/
│   │   └── SmoothScrollProvider.tsx  # Lenis scroll context
│   ├── slides/                  # Individual slide components
│   │   ├── HeroSlide.tsx
│   │   ├── CompanySlide.tsx
│   │   ├── VisionSlide.tsx
│   │   ├── ProductSlide.tsx
│   │   ├── FeaturesSlide.tsx
│   │   ├── LFMSlide.tsx
│   │   ├── GoToMarketSlide.tsx
│   │   ├── FinanceSlide.tsx
│   │   ├── AskSlide.tsx
│   │   └── ClosingSlide.tsx
│   ├── ui/                      # Reusable UI components
│   │   ├── SlideWrapper.tsx
│   │   ├── AnimatedText.tsx
│   │   └── DataNumber.tsx
│   └── visualizations/          # Data visualization components
│       ├── RadialChart.tsx
│       ├── DataSphere.tsx
│       └── ParticleField.tsx
```

### Component Hierarchy

```
App (layout.tsx)
└── SmoothScrollProvider
    └── Page (page.tsx)
        ├── SlideNav
        ├── HeroSlide
        │   └── ParticleField
        ├── CompanySlide
        │   └── DataNumber (multiple)
        ├── VisionSlide
        ├── ProductSlide
        │   ├── RadialChart
        │   └── DataSphere
        ├── FeaturesSlide
        ├── LFMSlide
        ├── GoToMarketSlide
        ├── FinanceSlide
        │   └── DataNumber (multiple)
        ├── AskSlide
        │   └── DataNumber (multiple)
        └── ClosingSlide
```

---

## Design Philosophy

### Brand Identity: "Bloomberg Terminal meets Contemporary Minimalism"

Following the `ai-regulate.md` guidelines, the design avoids common AI-generated patterns and embraces a unique visual identity:

#### Color Strategy
```css
/* Primary Colors */
--color-obsidian: #0a0a0f;      /* Deep black background */
--color-charcoal: #1a1a24;      /* Secondary background */
--color-graphite: #2a2a3a;      /* Tertiary/borders */

/* Accent Colors */
--color-accent-cyan: #00d4ff;    /* Primary accent */
--color-accent-burnt: #ff6b35;   /* Secondary accent */
--color-accent-violet: #8b5cf6;  /* Tertiary accent */
--color-accent-gold: #fbbf24;    /* Highlight accent */

/* Text Colors */
--color-text-primary: #ffffff;
--color-text-secondary: #a0a0b0;
--color-text-muted: #606070;
```

#### Typography
- **Geist Sans** - Primary font for headings and body text
- **Geist Mono** - Monospace font for data, numbers, and technical details
- **Tabular figures** for financial numbers alignment

#### Layout Principles
1. **Asymmetric layouts** - Breaking the grid intentionally
2. **Tetris-like compositions** - Non-uniform content blocks
3. **Generous white space** - Expensive, intentional spacing
4. **Data as visual art** - Numbers and charts as design elements

---

## Component Structure

### SlideWrapper Component

The base component for all slides, providing consistent structure and animations:

```typescript
interface SlideWrapperProps {
  children: React.ReactNode;
  id: string;
  background?: "dark" | "darker" | "accent";
  className?: string;
}
```

**Features:**
- Intersection Observer for viewport detection
- Framer Motion entrance animations
- Consistent padding and layout
- Background color variants

### AnimatedText Component

Handles text reveal animations with word-by-word or character-by-character effects:

```typescript
interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  type?: "words" | "chars";
}
```

**Animation Technique:**
- Splits text into individual elements
- Uses Framer Motion's `staggerChildren` for sequential reveals
- Configurable delay and stagger timing

### DataNumber Component

Animated number counter with spring physics:

```typescript
interface DataNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}
```

**Features:**
- Framer Motion's `useSpring` for smooth counting
- Configurable decimal places
- Prefix/suffix support (e.g., "$", "M", "%")
- Triggers on viewport entry

---

## Animation System

### GSAP Integration

GSAP is used for complex, timeline-based animations:

```typescript
// Example: Staggered element reveal
gsap.fromTo(
  elements,
  { opacity: 0, y: 50 },
  {
    opacity: 1,
    y: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power3.out",
  }
);
```

**Key GSAP Features Used:**
- `gsap.fromTo()` - Explicit start/end states
- `stagger` - Sequential element animations
- `ScrollTrigger` potential (prepared for future use)
- Custom easing functions

### Framer Motion Integration

Framer Motion handles React-native animations:

```typescript
// Example: Slide entrance animation
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={isInView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
>
```

**Key Framer Motion Features:**
- `useInView` hook for viewport detection
- `motion` components for declarative animations
- `AnimatePresence` for exit animations
- Custom cubic-bezier easing

### Animation Timing Strategy

```
Slide Entry Timeline:
0ms    - Slide becomes visible
100ms  - Section label fades in
300ms  - Main heading animates
500ms  - Body text reveals
700ms  - Data/visualizations animate
1000ms - Secondary elements appear
```

---

## Visualization Components

### RadialChart Component

A 5-layer concentric circle visualization representing the methodology layers:

```typescript
interface RadialChartProps {
  layers: {
    name: string;
    value: number;
    color: string;
  }[];
  size?: number;
  className?: string;
}
```

**Technical Implementation:**
- SVG-based rendering
- Calculated circumference for each layer
- `strokeDasharray` and `strokeDashoffset` for progress animation
- GSAP-powered reveal animation
- Drop shadow filters for glow effect

**Layers Represented:**
1. Market (outermost)
2. Fundamentals
3. Technicals
4. Quantitative
5. Dynamic (innermost)

### DataSphere Component

A 3D rotating sphere with data points:

```typescript
interface DataSphereProps {
  size?: number;
  className?: string;
  pointCount?: number;
}
```

**Technical Implementation:**
- Fibonacci sphere point distribution algorithm
- 3D to 2D projection mathematics
- Continuous rotation animation via GSAP
- Client-side only rendering to avoid hydration issues

**Point Generation Algorithm:**
```typescript
for (let i = 0; i < pointCount; i++) {
  const phi = Math.acos(-1 + (2 * i) / pointCount);
  const theta = Math.sqrt(pointCount * Math.PI) * phi;
  
  const x = radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(phi);
}
```

### ParticleField Component

Canvas-based particle network animation:

```typescript
interface ParticleFieldProps {
  count?: number;
  className?: string;
  color?: string;
}
```

**Technical Implementation:**
- HTML5 Canvas for performance
- Particle physics simulation (velocity, position)
- Connection lines between nearby particles
- Edge wrapping for continuous effect
- RequestAnimationFrame for smooth 60fps animation

**Particle Properties:**
```typescript
interface Particle {
  x: number;      // Position (0-100%)
  y: number;
  vx: number;     // Velocity
  vy: number;
  size: number;   // Radius
  opacity: number;
}
```

---

## Styling System

### CSS Custom Properties

All colors and theme values are defined as CSS variables in `globals.css`:

```css
:root {
  /* Colors */
  --color-obsidian: #0a0a0f;
  --color-charcoal: #1a1a24;
  /* ... */
  
  /* Typography */
  --font-sans: "Geist Sans", system-ui, sans-serif;
  --font-mono: "Geist Mono", monospace;
  
  /* Spacing */
  --slide-padding: clamp(2rem, 5vw, 6rem);
}
```

### Tailwind CSS 4 Configuration

Using the new CSS-first configuration approach:

```css
@import "tailwindcss";

@theme {
  --color-obsidian: #0a0a0f;
  --color-charcoal: #1a1a24;
  /* ... */
}
```

### Responsive Design

All slides are fully responsive using:
- CSS `clamp()` for fluid typography
- Tailwind responsive prefixes (`md:`, `lg:`)
- CSS Grid with auto-fit/auto-fill
- Flexbox for flexible layouts

```css
/* Example: Responsive heading */
.slide-heading {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

---

## Smooth Scroll Implementation

### Lenis Configuration

```typescript
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical",
  smoothWheel: true,
});
```

### SmoothScrollProvider

A React context provider that initializes and manages Lenis:

```typescript
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenisRef.current = lenis;

    return () => lenis.destroy();
  }, []);

  return <>{children}</>;
}
```

---

## Performance Optimizations

### Hydration Mismatch Prevention

Components using `Math.random()` or dynamic calculations are rendered client-side only:

```typescript
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

// Only render dynamic content after mount
{isMounted && <DynamicContent />}
```

### Animation Performance

1. **GPU Acceleration** - Using `transform` and `opacity` for animations
2. **Will-change** - Applied to animated elements
3. **RequestAnimationFrame** - For canvas animations
4. **Intersection Observer** - Animations only trigger when visible

### Code Splitting

Each slide component is a separate file, enabling:
- Lazy loading potential
- Better tree shaking
- Easier maintenance

---

## File Structure

### Complete File Listing

```
dev-pitch-site/
├── docs/
│   ├── ai-regulate.md           # Design guidelines
│   ├── dev-rule.md              # Development rules
│   ├── guide.md                 # Project requirements
│   └── implementation-details-en.md  # This file
├── public/
│   └── [static assets]
├── src/
│   ├── app/
│   │   ├── globals.css          # ~200 lines
│   │   ├── layout.tsx           # ~30 lines
│   │   └── page.tsx             # ~50 lines
│   └── components/
│       ├── navigation/
│       │   └── SlideNav.tsx     # ~150 lines
│       ├── providers/
│       │   └── SmoothScrollProvider.tsx  # ~40 lines
│       ├── slides/
│       │   ├── HeroSlide.tsx    # ~120 lines
│       │   ├── CompanySlide.tsx # ~180 lines
│       │   ├── VisionSlide.tsx  # ~150 lines
│       │   ├── ProductSlide.tsx # ~200 lines
│       │   ├── FeaturesSlide.tsx # ~220 lines
│       │   ├── LFMSlide.tsx     # ~180 lines
│       │   ├── GoToMarketSlide.tsx # ~200 lines
│       │   ├── FinanceSlide.tsx # ~250 lines
│       │   ├── AskSlide.tsx     # ~220 lines
│       │   └── ClosingSlide.tsx # ~100 lines
│       ├── ui/
│       │   ├── SlideWrapper.tsx # ~60 lines
│       │   ├── AnimatedText.tsx # ~80 lines
│       │   └── DataNumber.tsx   # ~50 lines
│       └── visualizations/
│           ├── RadialChart.tsx  # ~160 lines
│           ├── DataSphere.tsx   # ~170 lines
│           └── ParticleField.tsx # ~140 lines
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## Slide Content Summary

| Slide | Purpose | Key Elements |
|-------|---------|--------------|
| Hero | Introduction | Company name, tagline, particle animation |
| Company | Overview | Stats (Founded, Focus, Vision), tech stack |
| Vision | ASI Mission | Gauge/Operator/Measure Theory, mission statement |
| Product | Visualization Engine | RadialChart demo, DataSphere demo |
| Features | MVP 1.0/1.1 | Feature list, Vibe Trading concept |
| LFM | Large Financial Model | 5x density increase, bar chart |
| Go-To-Market | Strategy | Reddit, SEO, timeline |
| Finance | Valuation | TAM/SAM/SOM, revenue projections |
| Ask | Investment Request | $2M seed, use of funds, milestones |
| Closing | Thank You | Contact info, call to action |

---

## Running the Project

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Environment

- Node.js 18+
- pnpm 8+

---

## Future Enhancements

1. **Keyboard Navigation** - Arrow keys for slide navigation
2. **Presenter Mode** - Notes and timer for presentations
3. **Mobile Touch Gestures** - Swipe navigation
4. **Loading Animation** - Preloader with progress
5. **PDF Export** - Generate static PDF version
6. **Analytics** - Track slide engagement

---

## Conclusion

This VC pitch presentation represents a sophisticated implementation of modern web technologies, combining Next.js 16, GSAP, Framer Motion, and custom visualizations to create an impressive, memorable experience for potential investors. The modular architecture ensures maintainability, while the attention to design details following the "Bloomberg Terminal meets contemporary minimalism" philosophy creates a unique brand identity that stands out from typical startup presentations.
