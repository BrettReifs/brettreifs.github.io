# Brettflix Media Asset Handoff Specification

> This spec defines the exact image and video assets required by the Brettflix frontend.
> Media agents (image generators, video editors) should produce assets matching these specs.
> Frontend agents consume these assets via the `_data/projects.yml` schema.

## Quick Reference

| Asset Type | Dimensions | Ratio | Format | Max Size | Naming |
|-----------|-----------|-------|--------|----------|--------|
| Hero Billboard | 1920×1080, 1280×720, 768×432 | 16:9 | WebP + JPEG | 250KB @1920w | `{slug}-hero-{w}x{h}.{ext}` |
| Card Thumbnail | 665×374, 480×270, 342×192 | 16:9 | WebP + JPEG | 80KB @665w | `{slug}-thumb-{w}x{h}.{ext}` |
| Card Poster | 480×720, 342×513 | 2:3 | WebP + JPEG | 100KB @480w | `{slug}-poster-{w}x{h}.{ext}` |
| Logo/Title Treatment | 600×338 max | variable | PNG (transparent) or SVG | 50KB | `{slug}-logo.{ext}` |
| Hero Video | 1280×720 | 16:9 | MP4 (H.264) | 5MB | `{slug}-hero.mp4` |
| Preview Video | 1280×720 | 16:9 | MP4 (H.264) | 2MB | `{slug}-preview.mp4` |

## Image Assets

### Hero Billboard Image
- **Purpose:** Full-width background behind featured project text
- **Required sizes:** 1920×1080 (desktop), 1280×720 (tablet), 768×432 (mobile)
- **Format:** WebP primary, JPEG fallback
- **Compression:** WebP quality 80, JPEG quality 85
- **Content guidelines:**
  - Subject/focal point should be on the RIGHT side (left side has text overlay)
  - Avoid bright/white areas on the left 40% of the image (text legibility)
  - Bottom 30% will have a gradient fade to #141414 — avoid important content there
- **File naming:** `{project-slug}-hero-1920x1080.webp`, `{project-slug}-hero-1920x1080.jpg`
- **Delivery path:** `assets/images/hero/`

### Card Thumbnail (Landscape)
- **Purpose:** Title card in carousel rows
- **Required sizes:** 665×374 (xl), 480×270 (md), 342×192 (sm)
- **Format:** WebP primary, JPEG fallback
- **Compression:** WebP quality 75, JPEG quality 80
- **Content guidelines:**
  - Image should be visually distinct at 342px width (the smallest render size)
  - Avoid text in the image — title overlays are rendered by CSS
  - High contrast and saturated colors work best on dark backgrounds
  - If using screenshots, crop to the most visually interesting portion
- **File naming:** `{project-slug}-thumb-665x374.webp`
- **Delivery path:** `assets/images/thumbs/`

### Card Poster (Portrait)
- **Purpose:** Alternative portrait-oriented card (future mobile layout)
- **Required sizes:** 480×720 (standard), 342×513 (compact)
- **Format:** WebP primary, JPEG fallback
- **Compression:** WebP quality 75, JPEG quality 80
- **Content guidelines:**
  - Vertical composition — logo/icon at top, visual below
  - Works well for projects with strong brand iconography
- **File naming:** `{project-slug}-poster-480x720.webp`
- **Delivery path:** `assets/images/posters/`

### Logo / Title Treatment
- **Purpose:** Project logo overlay on hero billboard and modal hero
- **Max size:** 600×338px
- **Format:** PNG with transparency, or SVG for vector logos
- **Content guidelines:**
  - Must be legible on dark backgrounds (#141414 to #333)
  - White or light-colored preferred
  - No background fill — transparency required
- **File naming:** `{project-slug}-logo.png` or `{project-slug}-logo.svg`
- **Delivery path:** `assets/images/logos/`

## Video Assets

### Hero Background Video
- **Purpose:** Full-screen looping background behind the featured project
- **Resolution:** 1280×720 (720p)
- **Aspect ratio:** 16:9
- **Duration:** 15–30 seconds
- **Codec:** H.264 (AVC) — broadest browser compatibility
- **Container:** MP4
- **Bitrate:** 300–800 kbps variable bitrate (2-pass encoding)
- **Audio:** None (muted playback) or AAC 64kbps if audio is needed
- **Max file size:** 5MB
- **Content guidelines:**
  - Loopable — end frame should transition smoothly to start frame
  - Avoid rapid motion that compresses poorly
  - Subject should be on the RIGHT side (left has text overlay)
  - Avoid flashing/strobing (accessibility: WCAG 2.3.1)
- **File naming:** `{project-slug}-hero.mp4`
- **Delivery path:** `assets/video/`

### Card Preview Video
- **Purpose:** Short preview that plays on card hover (future feature)
- **Resolution:** 1280×720 (720p) or 854×480 (480p)
- **Aspect ratio:** 16:9
- **Duration:** 10–20 seconds
- **Codec:** H.264
- **Container:** MP4
- **Bitrate:** 200–500 kbps variable
- **Audio:** Muted (plays on hover without audio)
- **Max file size:** 2MB
- **Content guidelines:**
  - Show the most visually compelling aspect of the project
  - Start with an attention-grabbing frame (no fade-from-black)
  - Must make sense without audio
- **File naming:** `{project-slug}-preview.mp4`
- **Delivery path:** `assets/video/previews/`

## Data Schema Integration

When media assets are ready, update `_data/projects.yml` for the target project:

```yaml
- id: my-project
  # ... existing fields ...
  image: /assets/images/thumbs/my-project-thumb-665x374.webp
  heroImage: /assets/images/hero/my-project-hero-1920x1080.webp
  heroVideo: /assets/video/my-project-hero.mp4
  logo: /assets/images/logos/my-project-logo.png
  media:
    - type: trailer
      title: "Project Demo"
      url: /assets/video/my-project-preview.mp4
      thumbnail: /assets/images/thumbs/my-project-thumb-480x270.webp
    - type: tutorial
      title: "Getting Started"
      url: https://youtube.com/watch?v=...
      thumbnail: /assets/images/thumbs/my-project-tutorial-480x270.webp
```

## Responsive Image HTML Pattern

The frontend renders images using `<picture>` with srcset:

```html
<picture>
  <source
    type="image/webp"
    srcset="
      /assets/images/thumbs/{slug}-thumb-342x192.webp 342w,
      /assets/images/thumbs/{slug}-thumb-480x270.webp 480w,
      /assets/images/thumbs/{slug}-thumb-665x374.webp 665w
    "
    sizes="(max-width: 500px) 45vw, (max-width: 800px) 30vw, (max-width: 1100px) 22vw, 15vw"
  />
  <img
    src="/assets/images/thumbs/{slug}-thumb-480x270.jpg"
    alt="{project title}"
    loading="lazy"
    width="480" height="270"
  />
</picture>
```

## Directory Structure

```
assets/
├── images/
│   ├── hero/           # Hero billboard images (1920, 1280, 768 widths)
│   ├── thumbs/         # Card thumbnails (665, 480, 342 widths)
│   ├── posters/        # Portrait posters (480, 342 widths)
│   └── logos/          # Project logos (PNG/SVG)
├── video/
│   ├── hero-reel.mp4   # Main hero video
│   └── previews/       # Per-project preview videos
└── css/
    └── style.css
```

## Quality Checklist for Media Agents

Before handing off assets, verify:
- [ ] All required sizes generated for each image type
- [ ] WebP AND JPEG versions exist for each image
- [ ] File sizes are within specified limits
- [ ] Naming convention matches `{slug}-{type}-{w}x{h}.{ext}`
- [ ] Images are visually distinct at smallest render size (342px)
- [ ] Videos are under max file size and bitrate
- [ ] Videos loop smoothly (hero) or start with compelling frame (preview)
- [ ] No text baked into images (CSS handles text overlays)
- [ ] All assets placed in correct directory paths
- [ ] Corresponding `_data/projects.yml` entry updated with paths
