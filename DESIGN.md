# Design Brief

## Direction

Aurora Glass — a light, airy premium AI-SaaS system where soft lavender leads, mint and pale blue support, and glassmorphism surfaces float over ambient gradient light.

## Tone

Refined futuristic SaaS: calm, spacious and expensive-feeling, deliberately light rather than dark to keep a free public tool approachable and trustworthy.

## Differentiation

Frosted glass cards over softly drifting aurora orbs, with a lavender-to-mint gradient reserved for one signature word and the primary CTA — restraint that makes the accent feel earned.

## Color Palette

| Token      | OKLCH        | Role                                        |
| ---------- | ------------ | ------------------------------------------- |
| background | 0.985 0.006 285 | Off-white with faint lavender tint       |
| foreground | 0.22 0.03 275   | Deep slate-violet body & heading text    |
| card       | 1.0 0.003 285   | Pure white elevated surfaces             |
| primary    | 0.58 0.19 285   | Lavender — CTAs, active states, links    |
| accent     | 0.72 0.14 168   | Mint green — success, highlights, badges |
| secondary  | 0.955 0.02 265  | Pale blue — soft fills, icon tiles       |
| muted      | 0.96 0.012 285  | Light gray sections & subdued text       |

## Typography

- Display: Space Grotesk — hero, section headings, nav wordmark, stat figures
- Body: DM Sans — paragraphs, labels, inputs, buttons, FAQ
- Mono: JetBrains Mono — QR payload previews, URLs, technical values
- Scale: hero `text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight`, h2 `text-3xl md:text-4xl font-bold tracking-tight`, label `text-xs font-semibold tracking-widest uppercase text-muted-foreground`, body `text-base md:text-lg`

## Elevation & Depth

Three-tier soft shadow system (`shadow-subtle` → `shadow-elevated` → `shadow-float`) tinted violet rather than black, plus `.glass` frosted surfaces so depth reads as light, never as darkness.

## Structural Zones

| Zone    | Background              | Border      | Notes                                             |
| ------- | ----------------------- | ----------- | ------------------------------------------------- |
| Header  | `.glass` translucent    | `border-b`  | Sticky, blurs content beneath, logo + pill CTA    |
| Hero    | `bg-background` + aurora orbs | —     | Ambient blurred gradient orbs behind hero content |
| Content | `bg-background` / `bg-muted/40` alternating | — | Every other section shifts to muted tint |
| Footer  | `bg-muted/50`           | `border-t`  | Multi-column links, muted text, small print       |

## Spacing & Rhythm

Sections use `py-16 md:py-24` with `container` gutters; content groups stack on `space-y-4`/`space-y-6`; micro-spacing on cards is `p-6` with `gap-4` grids.

## Component Patterns

- Buttons: full-radius pills; primary = lavender gradient + white text + `shadow-glow`; secondary = white glass + border; hover lifts 1px and deepens shadow
- Cards: `rounded-2xl` white surfaces, `border-border`, `shadow-subtle`, hover to `shadow-elevated` with `-translate-y-0.5`
- Badges: pill, `bg-secondary` or mint-tinted `bg-accent/15` with `text-accent-foreground`, uppercase tracking-wide micro-labels

## Motion

- Entrance: `animate-fade-up` on hero and section content, 0.5s ease-out, staggered by index
- Hover: `transition-smooth` (0.3s cubic-bezier) on lift, shadow and color shifts
- Decorative: slow `animate-aurora` drift on background orbs and `animate-float-slow` on the QR preview card only

## Constraints

- Light mode is primary; dark mode exists but is never the default surface
- No neon, no full-page gradients, no bouncy or looping animations beyond ambient orbs
- Accent gradient limited to one hero word and the primary CTA; never on body text
- Semantic tokens only in components — no raw hex, rgb, or arbitrary color classes
- Core generator, customization and downloads stay free and fully client-side

## Signature Detail

The "aurora field" — three slowly drifting blurred lavender/blue/mint orbs behind the hero glass card — gives QRNova an unmistakable light-and-air identity without a single dark pixel.
