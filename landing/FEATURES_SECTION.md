# Features Section - A Day Inside Spardha

## Overview

A premium scroll-driven features section that tells the story of a student's complete day using Spardha. The section uses scroll progress to animate through 4 phases (Morning, Afternoon, Evening, Night) in a cinematic, timeline-based format.

## Key Features

### 🎬 Scroll-Driven Animation
- **Full-screen sticky section** - Locks the viewport and uses scroll as animation timeline
- **5x viewport height** (500vh) - Gives users control over animation speed
- **Progressive storytelling** - Each scroll increment advances the story

### 🎨 Design System Consistency
- Uses existing color palette: `#f3f6f8`, `#070a05`, `#393f5b`
- Glassmorphism cards with `bg-white/60 backdrop-blur-xl`
- Subtle shadows and glows (no harsh effects)
- Font-light typography matching Hero and About sections

### ♿ Accessibility
- Respects `prefers-reduced-motion`
- Falls back to static stacked sections
- GPU-friendly animations (transform + opacity only)

## Story Timeline

### 1. 🌅 Morning (7:00 AM) - "Daily Test"
- **Visual**: Interactive test interface
- **Animation**: Timer countdown, option selection, correct answer reveal
- **Message**: Start your day with competition

### 2. 🧠 Afternoon (2:00 PM) - "Smart Practice (DPP)"
- **Visual**: Practice dashboard with weak topics
- **Animation**: Topics highlight, questions populate
- **Message**: Practice what you're weak at

### 3. 📊 Evening (6:00 PM) - "Advanced Analytics"
- **Visual**: Analytics dashboard with graphs
- **Animation**: Graph draws left-to-right, accuracy improves
- **Message**: Know exactly where you stand

### 4. 🏁 Night (10:00 PM) - "Rank & Progress"
- **Visual**: Leaderboard with user highlight
- **Animation**: Rank improves, progress bar fills
- **Message**: See your rank improve daily

### 5. 🎯 Final CTA
- **Text**: "Small daily improvements. Massive rank shifts."
- **Button**: "Start Competing"

## File Structure

```
src/components/
├── sections/
│   └── Features.tsx          # Main section with scroll logic
└── ui/
    ├── StoryFrame.tsx         # Glassmorphism container
    ├── StepMorning.tsx        # Phase 1
    ├── StepAfternoon.tsx      # Phase 2
    ├── StepEvening.tsx        # Phase 3
    └── StepNight.tsx          # Phase 4
```

## Usage

Already integrated in `src/app/page.tsx`:

```tsx
import Features from "@/components/sections/Features";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Features />  {/* Scroll-driven features section */}
      <Testimonials />
      <Footer />
    </main>
  );
}
```

## Scroll Behavior

1. **User scrolls into section** → Screen snaps to full-screen view
2. **Scrolling down** → Progress bar advances through timeline
3. **Each phase** → Fades in/out based on scroll position
4. **Final frame** → CTA appears
5. **Scrolling past** → Returns to normal page scroll

## Customization

### Adjust Scroll Speed
Change the section height in `Features.tsx`:

```tsx
<section style={{ height: "500vh" }}>  // Slower = more vh
```

### Modify Transitions
Adjust phase boundaries in `Features.tsx`:

```tsx
const morningProgress = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
const afternoonProgress = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
// etc.
```

### Change Animations
Each step component (`StepMorning.tsx`, etc.) has independent animation logic in `useEffect` hooks.

## Performance

- ✅ GPU-accelerated animations (transform/opacity only)
- ✅ No layout thrashing
- ✅ Minimal re-renders
- ✅ Smooth 60fps on modern devices

## Mobile Responsive

- Cards resize appropriately
- Text scales down
- Animations remain smooth
- Touch scroll works perfectly

## Browser Support

- Chrome/Edge: Full support
- Safari: Full support
- Firefox: Full support
- Mobile browsers: Full support

## Tips

1. **Scroll slowly** on first view to appreciate each phase
2. **Scroll back up** to see reverse animations
3. **Works best** on desktop for full immersive experience
4. **Mobile version** maintains all functionality

---

Built with Next.js 16, Framer Motion 12, and Tailwind CSS 4.
