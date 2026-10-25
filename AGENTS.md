# Project Guidance

## User Preferences

- Premium futuristic AI-SaaS visual style with soft lavender, pale blue, mint green, off-white and light-gray tones
- Minimal gradients, soft shadows, elegant borders, rounded cards, glassmorphism, clean spacing and smooth micro-interactions
- Avoid overly dark backgrounds, excessive neon, clutter and unnecessary animations
- Core QR generation, customization and downloads stay completely free with no account or subscription
- Generate QR codes in the browser to protect user-entered information
- No fake reviews, keyword stuffing or misleading claims in SEO content

## Accepted Requirements

- 13 QR category generators (URL, text, Wi-Fi, email, phone, SMS, WhatsApp, contact/vCard, location, social media, PDF link, event, app download), each with icon, inputs, placeholders, validation, errors and a Generate button
- Customization: foreground/background colors, preset palettes, gradients, dot and corner styles, center logo upload with error correction, size/resolution, white padding, live preview, reset to default, scannability warning
- Free PNG, JPG and high-resolution print PNG downloads as separate labeled buttons producing the real generated image
- Premium futuristic AI-SaaS homepage with nav bar, hero, URL input, preview area, category grid, How It Works, free features, SEO content, FAQ and footer
- Strong technical and on-page SEO: unique titles/meta, semantic HTML with one H1, clean URLs, sitemap, robots.txt, canonical URLs, Open Graph, breadcrumbs, structured data, internal links, accessible forms
- Browser-side QR generation with a reliable library and image export
- Responsive design, keyboard accessibility, loading states, helpful errors, no dead buttons or fake downloads
- Core generator free with architecture ready for future accounts, saved codes, analytics, dynamic codes and team features

## Verified Commands

- **typecheck**: `pnpm typecheck`
- **fix**: `pnpm fix`
- **build**: `pnpm build`

## Learnings

- The shared QR engine lives in src/frontend/src/lib/qr (encode.ts, render.ts, categories.ts, types.ts, index.ts) and exports QR_CATEGORIES, getCategory, the encode* helpers, DEFAULT_RENDER_OPTIONS, renderQrToCanvas, renderQrToDataUrl, downloadPng, downloadJpg and downloadPrintPng.
- The generator state hook is src/frontend/src/hooks/useGenerator.ts (useGenerator, buildPayload, EMPTY_DRAFT, GeneratorDraft); the generator page is src/frontend/src/pages/GeneratorPage.tsx with components in src/frontend/src/components/generator.
- isValidUrl in src/frontend/src/lib/qr/encode.ts requires a dotted hostname for http/https links and rejects malformed input; useGenerator's url case surfaces it as an inline error.
- EventInput.url is encoded as the iCalendar URL property in encode.ts; description is a separate optional field.
- Decorative animations are guarded by a prefers-reduced-motion media rule in src/frontend/src/index.css rather than per-element motion-safe classes.
- React 19 removed the global JSX namespace; type component maps as (props) => ReactElement from react.
- TanStack Router: any Link to a route with validateSearch must pass search={{type:'url'}} or typecheck fails TS2741.
- qrcode@1.5.4 with @types/qrcode resolves its browser entry lib/browser.js in Vite; canvas render plus toDataURL export work client-side, and QRCode.create(value,{errorCorrectionLevel}) exposes modules.size/data for custom dot and eye rendering.
