# Brettflix Frontend Design Skill

> Reusable skill for a frontend design agent working on the Brettflix portfolio site.

## Overview

Brettflix is a Netflix-inspired GitHub Pages portfolio showcasing AI/agent projects. It uses Jekyll with custom CSS/JS — no build tools. The design language follows Netflix's dark cinematic UI patterns.

## Architecture

### Component Hierarchy

```
Page (default.html layout)
├── Navbar (.navbar) — fixed, transparent → opaque on scroll
├── Hero Billboard (.hero-billboard) — featured project, full viewport
├── Carousel Sections (.carousel-section) × N
│   ├── Title (.carousel-title)
│   └── Carousel Wrapper (.carousel-wrapper)
│       ├── Arrow Left (.carousel-arrow--left)
│       ├── Track (.carousel-track) — horizontal scroll
│       │   └── Title Card (.title-card) × N
│       │       ├── Card BG (.title-card-bg) — gradient + icon
│       │       ├── Card Info (.title-card-info) — title on hover
│       │       └── Popup Card (.popup-card) — Netflix hover popup
│       │           ├── Thumbnail (.popup-thumbnail)
│       │           ├── Controls (.popup-controls) — action buttons
│       │           ├── Meta (.popup-meta) — status + category
│       │           └── Descriptors (.popup-descriptors)
│       └── Arrow Right (.carousel-arrow--right)
├── Detail Modal (#detailModal) — single shared overlay
│   ├── Modal Container (.modal-container)
│   │   ├── Close Button (.modal-close)
│   │   ├── Hero (.modal-hero) — gradient, icon, brand, title, CTA buttons
│   │   └── Body (.modal-body) — two-column
│   │       ├── Main (.modal-main) — description, media section
│   │       └── Sidebar (.modal-sidebar) — tech stack, links, descriptors
└── Footer (.nf-footer)
```

### Key Files

| File | Purpose |
|------|---------|
| `_config.yml` | Jekyll config, site title "Brettflix" |
| `_data/projects.yml` | All project data (11 projects) |
| `index.html` | Home page with Liquid templating |
| `assets/css/style.css` | All styles (dark theme, components, responsive) |
| `assets/js/netflix.js` | Navbar, carousel, hover popup, modal logic |
| `project.html` + `assets/js/project-detail.js` | Individual project detail pages |
| `_layouts/default.html` | HTML wrapper, loads CSS/JS |
| `_includes/header.html` | Navbar component |
| `_includes/footer.html` | Footer component |

## CSS Custom Properties

```css
--bg-color: #141414;       /* Page background */
--bg-secondary: #1a1a1a;   /* Cards, sections */
--bg-card: #181818;         /* Popup/modal background */
--text-primary: #e5e5e5;   /* Main text */
--text-secondary: #999;    /* Muted text */
--text-tertiary: #666;     /* Very muted */
--accent-color: #e50914;   /* Netflix red */
--accent-hover: #f40612;   /* Red hover state */
--white: #fff;
--gradient-1 through --gradient-8  /* Card background gradients */
--border-radius: 6px;
--border-radius-sm: 4px;
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--nav-height: 68px;
```

## Data Schema (`_data/projects.yml`)

```yaml
- id: my-project              # URL-safe identifier
  title: "My Project"         # Display name
  category: epic               # epic | feature | mini
  heroIcon: "fas fa-robot"     # FontAwesome 5 class
  featured: false              # true = hero billboard
  carouselCategories:          # Which carousel rows to appear in
    - "AI Agents"
    - "MCP Tools"
  description: "Short desc"   # One-liner
  fullDescription: |           # HTML content for modal/detail page
    <p>Full description...</p>
  tags:                        # Tech stack tags
    - TypeScript
    - MCP
  descriptors:                 # Mood/style words (3 recommended)
    - Innovative
    - Powerful
    - TypeScript
  media:                       # Future video/media content
    - type: trailer            # trailer | tutorial | short
      title: "Demo Video"
      url: "https://..."
  image: ""                    # Optional hero image URL
  githubUrl: "https://..."     # GitHub repository URL
  videoUrl: ""                 # Optional video URL
  published: true              # false = hidden
  status: building             # released | building
```

## Patterns

### Adding a New Project

1. Add entry to `_data/projects.yml` with all required fields
2. Assign `carouselCategories` for row placement
3. Set `published: true` to show, `featured: true` for hero billboard
4. The Liquid templates automatically render cards + popups

### Adding Media to a Project

1. In `projects.yml`, add items to the `media` array:
   ```yaml
   media:
     - type: trailer
       title: "Launch Trailer"
       url: "https://youtube.com/embed/..."
   ```
2. The modal JS automatically renders media cards in the Media section

### Adding a New Carousel Row

1. In `index.html`, duplicate a carousel section block
2. Use Liquid to filter projects (e.g., `{% assign row = published | where: "category", "epic" %}`)
3. The popup card markup inside each `{% for %}` loop is identical

### Hover Popup Behavior

- **Show delay**: 300ms after mouseenter on `.title-card`
- **Hide delay**: 200ms after mouseleave (cancelled if user enters popup)
- Parent card gets `.popup-active` class (suppresses default scale transform)
- Popup gets `.popup-visible` class (display + opacity + scale animation)

### Modal Behavior

- Triggered by clicking `[data-modal-id]` buttons (expand chevron or hero CTA)
- Populated from embedded `<script id="project-data" type="application/json">`
- Body scroll locked via `body.modal-locked`
- Closes via: X button, Escape key, backdrop click

## CSS Class Naming Conventions

- **BEM-like**: `.block`, `.block-element`, `.block--modifier`
- **Component prefixes**: `popup-`, `modal-`, `title-card-`, `hero-`, `carousel-`, `nf-`
- **State classes**: `.popup-visible`, `.modal-open`, `.popup-active`, `.nav-scrolled`, `.modal-locked`
- **Gradient classes**: `.card-grad-1` through `.card-grad-8` (cycling via Liquid modulo)
- **Status modifiers**: `--shipped`, `--building`, `--primary`, `--secondary`

## Media Asset Pipeline

See `docs/MEDIA_HANDOFF_SPEC.md` for the complete media asset specification. Video and image agents should follow this spec when producing assets for the site.

## Content Pipeline Integration

Images are generated by the **content-engine** (`BrettReifs/content-engine`, private repo):

### Asset Requirements
| Asset | Sizes | Format | Naming | Directory |
|-------|-------|--------|--------|-----------|
| Card Thumbnail | 665×374, 480×270, 342×192 | WebP + JPEG | `{slug}-thumb-{w}x{h}.webp` | `assets/images/thumbs/` |
| Detail Hero | 1920×1080, 1280×720, 768×432 | WebP + JPEG | `{slug}-hero-{w}x{h}.webp` | `assets/images/hero/` |

### Brand Rules for Generated Images
- Dark cinematic background (#141414)
- Subject on RIGHT side (left 40% reserved for CSS text overlay)
- Bottom 30% dark (gradient fade zone)
- NO text baked into images
- 16:9 aspect ratio

### Workflow
1. Content-engine reads prompts from `data/prompts.json` (22 entries)
2. Calls Gemini Imagen 4 API (`imagen-4.0-generate-001`)
3. Optimizes with Sharp (resize, WebP/JPEG, quality gates)
4. Deploys to this repo via GitHub PAT
5. Updates `_data/projects.yml` `image` and `heroImage` fields

After images are deployed, update `index.html` responsive image `<picture>` elements if new sizes are added.

## Testing

Run `assets/js/brettflix.test.js` in browser DevTools console. It validates:
- All title cards have popup structure (thumbnail, brand, buttons, descriptors)
- Modal HTML structure is complete (hero, body, sidebar, media)
- Project JSON data is valid and has required fields
- Modal opens/closes via button, Escape, and backdrop click
- Branding says "BRETTFLIX" across nav, popups, and modal
