# Brettflix Image Prompts — Google Flow / Imagen 4

> **Usage:** Copy each prompt into [Google Flow](https://labs.google/fx/tools/flow) (Imagen 4).
> Generate at **16:9 aspect ratio**. Export at sizes defined in `MEDIA_HANDOFF_SPEC.md`.
>
> **Style constraints applied to ALL prompts:**
> - Dark cinematic background (#141414 charcoal/black)
> - Subject/focal-point on the RIGHT side (left 40% is dark for text overlay)
> - Bottom 30% should be dark/gradient-friendly (fades to page background)
> - NO text, titles, or words baked into images (CSS handles overlays)
> - High contrast, saturated accent colors pop on dark backgrounds
> - Cinematic shallow depth of field, volumetric lighting

---

## Output Checklist Per Project

| Asset | Sizes | File Naming | Delivery Path |
|-------|-------|-------------|---------------|
| Card Thumbnail | 665×374, 480×270, 342×192 | `{slug}-thumb-{w}x{h}.webp` | `assets/images/thumbs/` |
| Detail Hero | 1920×1080, 1280×720, 768×432 | `{slug}-hero-{w}x{h}.webp` | `assets/images/hero/` |

After generating, convert to WebP (quality 75-80) + JPEG fallback (quality 80-85).

---

## 1. excalidraw-mcp — Excalidraw MCP ⭐ Featured

### Card Thumbnail
```
A cinematic 16:9 composition on a dark charcoal background. On the right side, a glowing translucent blue holographic hand-drawn whiteboard floats in space, showing wireframe boxes and arrows in a sketchy Excalidraw style with visible pencil strokes. Thin luminous connection lines radiate from a small glowing AI neural network node on the far right toward the diagram. The left side fades to pure dark. Moody volumetric lighting, shallow depth of field, subtle purple and cyan accent glows. Hyper-detailed, cinematic color grading, 4K quality.
```

### Detail Hero
```
Wide cinematic 16:9 shot of a futuristic workspace. On the right half, a large translucent floating Excalidraw-style whiteboard displays hand-drawn architecture diagrams — boxes, arrows, flowcharts in a rough sketch style with white and cyan strokes on a dark glass surface. Below the whiteboard, a subtle reflection on a dark polished desk. On the far right, a small glowing orb representing an AI agent emits thin golden streams of data connecting to the diagram elements. The left 40% is dark and empty for text overlay. Volumetric fog, cinematic rim lighting from the right, dark moody atmosphere. Photo-realistic, 8K detail.
```

**Alt text (thumbnail):** `Excalidraw MCP — AI-powered hand-drawn diagram creation tool with glowing holographic whiteboard`
**Alt text (hero):** `Excalidraw MCP workspace showing AI agent creating hand-drawn architecture diagrams on a floating digital canvas`

---

## 2. mcp-app-media — MCP App Media

### Card Thumbnail
```
A cinematic 16:9 dark scene. On the right, a glowing vinyl record spins on a futuristic translucent turntable, casting warm orange and magenta light. Floating above it, a holographic audio waveform pulses with green and pink gradients. Musical note particles drift upward. The left side fades to pure black. Neon accent lighting, shallow depth of field, cyberpunk aesthetic. Highly detailed, cinematic.
```

### Detail Hero
```
Wide cinematic 16:9 composition. Right side: a futuristic DJ booth with glowing turntables and a floating holographic UI showing playlist controls, audio waveforms, and album artwork tiles. Sound waves ripple outward in concentric circles of warm amber and cool cyan light. Floating musical notes made of light particles scatter upward. Left 40% fades to deep black. Dark studio environment, volumetric purple and orange rim lighting, reflective dark floor. Hyper-realistic, 4K.
```

**Alt text (thumbnail):** `MCP App Media — AI-powered music DJ controller with glowing turntable and audio waveforms`
**Alt text (hero):** `MCP App Media DJ booth with holographic playlist controls, audio waveforms, and floating musical notes`

---

## 3. model-modes — Model Modes

### Card Thumbnail
```
Cinematic 16:9 dark composition. On the right, four floating translucent code editor panels arranged in a slight arc, each tinted a different color: deep green, warm amber, electric blue, and rich purple. Each panel shows faint code syntax highlighting. Between them, thin glowing connection lines form a palette shape. Dark background fading to black on the left. Soft neon glow, shallow depth of field, minimalist and elegant. High quality, photorealistic render.
```

### Detail Hero
```
Wide 16:9 cinematic shot of a developer's dark workspace. On the right, a large ultrawide monitor displays a code editor with a dramatic color theme — deep emerald green code on dark background, with a floating HUD overlay showing active AI tool indicators as small glowing icons. Three smaller translucent panels float nearby, each showing the same code but in different color themes of amber, blue, and purple. Dark desk surface with subtle keyboard glow. Left 40% dark for text. Moody tech lighting, realistic.
```

**Alt text (thumbnail):** `Model Modes — VS Code extension showing four AI model theme skins in green, amber, blue, and purple`
**Alt text (hero):** `Model Modes developer workspace with multiple AI model color themes displayed across floating code panels`

---

## 4. content-engine — Content Engine

### Card Thumbnail
```
Cinematic 16:9 dark scene. On the right, a miniature futuristic factory assembly line made of light — code symbols enter from the top, pass through glowing processing stages, and emerge as floating video frame thumbnails and social media post cards at the bottom. Mechanical gears and conveyor belts made of thin luminous lines. Orange and teal industrial accent lighting. Left fades to dark. Shallow depth of field, cinematic, detailed miniature tilt-shift aesthetic.
```

### Detail Hero
```
Wide cinematic 16:9 view of an automated media factory. Right side: a vertical pipeline visualization where code commit icons flow down through illuminated processing nodes — script generation, video rendering, and publishing stages, each represented by a glowing module. At the bottom, finished video thumbnails and social cards fan out like a deck of cards. Conveyor belts of light connect the stages. Teal and orange accent lighting, dark industrial atmosphere. Left 40% dark. Volumetric fog, 4K.
```

**Alt text (thumbnail):** `Content Engine — automated pipeline turning code into video content with glowing factory assembly line`
**Alt text (hero):** `Content Engine media factory showing automated pipeline from code commits through video rendering to social publishing`

---

## 5. agent-sentinel — Agent Sentinel

### Card Thumbnail
```
Cinematic 16:9 dark composition. On the right, a glowing shield emblem floats in space, composed of hexagonal grid segments in electric blue. Behind it, multiple thin red laser-like scan lines sweep across a field of floating data packets. A subtle radar sweep effect with green and amber indicators. Dark background fading left. Military-grade tech aesthetic, clean geometric shapes, volumetric blue lighting. Serious, commanding atmosphere. High detail, cinematic.
```

### Detail Hero
```
Wide 16:9 cinematic command center scene. Right side: a floating holographic security dashboard displaying multiple AI agent status panels — each showing heartbeat graphs, alert indicators in green, amber, and red, and data flow visualizations. A large translucent shield icon anchors the composition. Thin scan lines sweep across the scene. Below, a timeline visualization shows logged events. Dark control room atmosphere with blue and red accent lighting. Left 40% dark. Dramatic, high-tech, photorealistic.
```

**Alt text (thumbnail):** `Agent Sentinel — AI governance shield with security scanning and monitoring indicators`
**Alt text (hero):** `Agent Sentinel command center with holographic security dashboard monitoring AI agent fleet`

---

## 6. agentic-philosophers — Agentic Philosophers

### Card Thumbnail
```
Cinematic 16:9 dark scene. On the right, four distinct glowing orbs arranged in a diamond pattern — each a different color of gold, silver, ruby, and sapphire representing Researcher, Critic, Synthesizer, and Devil's Advocate. Between them, thin luminous debate threads weave and intersect, forming a complex conversation web. Each orb has a subtle unique icon silhouette inside. Dark atmospheric background fading left. Warm scholarly lighting, mystical yet technological. Detailed, cinematic.
```

### Detail Hero
```
Wide 16:9 cinematic amphitheater scene reimagined digitally. Right side: four floating AI agent avatars — abstract glowing humanoid silhouettes in distinct colors of gold, silver, red, and blue — face each other across a circular digital arena. Thought streams of luminous text flow between them in real-time, crossing and weaving. A round counter at center shows a debate stage indicator. Dark stone-textured background with modern holographic overlays. Left 40% dark. Dramatic philosophical lighting, 4K.
```

**Alt text (thumbnail):** `Agentic Philosophers — four AI debate agents as glowing orbs connected by conversation threads`
**Alt text (hero):** `Agentic Philosophers digital amphitheater with four AI agents engaged in structured multi-round debate`

---

## 7. agent-lens — Agent Lens

### Card Thumbnail
```
Cinematic 16:9 dark composition. On the right, a floating circular lens or magnifying glass made of thin luminous rings, peering into a stream of data particles flowing through it. Inside the lens, miniature dashboard charts of line graphs and bar charts are visible. The data stream glows in teal and green. Metrics numbers float faintly in the background. Left fades to dark. Clean data-visualization aesthetic, cyan and green accent lighting. Sharp, modern, cinematic.
```

### Detail Hero
```
Wide 16:9 cinematic data visualization scene. Right side: a large holographic dashboard floating in dark space — showing real-time line charts, token counters, cost meters, and latency gauges with teal, green, and amber indicators. Below, a stream of individual agent tool-call events flow like a waterfall of glowing data points. A circular lens icon anchors the top-right corner. Dark background with subtle grid lines. Left 40% dark. Clean, modern, data-forward aesthetic, 4K.
```

**Alt text (thumbnail):** `Agent Lens — observability dashboard with floating data lens analyzing AI agent metrics`
**Alt text (hero):** `Agent Lens holographic dashboard showing real-time AI agent metrics, token counters, and latency gauges`

---

## 8. model-router — Model Router

### Card Thumbnail
```
Cinematic 16:9 dark scene. On the right, a glowing central routing hub — a geometric node with pulsing connections branching outward to four distinct endpoints, each represented by a different-colored terminal in green, amber, blue, and purple. Data packets travel along the branches, choosing different paths. Circuit-board trace aesthetic with a dark background. Left fades to dark. Sharp geometric lines, electric blue and warm amber accent lighting. Technical, clean, cinematic.
```

### Detail Hero
```
Wide 16:9 cinematic network visualization. Right side: an elaborate neural routing diagram with a central hub dispatching glowing data packets along branching pathways to four distinct AI model nodes — each styled differently as a green terminal, amber brain, blue gem, and purple animal silhouette. Pathways show faint cost and quality indicators along them. A strategy selector dial glows at the center. Dark background with circuit-trace patterns. Left 40% dark. Neon-on-dark aesthetic, 4K.
```

**Alt text (thumbnail):** `Model Router — neural switchboard routing AI tasks across multiple model endpoints`
**Alt text (hero):** `Model Router network visualization with central hub dispatching tasks to four AI model endpoints by cost and quality`

---

## 9. pm-agent — PM Agent

### Card Thumbnail
```
Cinematic 16:9 dark composition. On the right, scattered floating sticky notes and issue cards in disarray — some tilted, overlapping — flow into a glowing funnel that organizes them into neat rows of user story cards emerging at the bottom. The input cards are warm orange and yellow, the organized output cards glow clean white with green checkmarks. Left fades to dark. Minimal, organized aesthetic with warm-to-cool color transition. Shallow depth of field, cinematic.
```

### Detail Hero
```
Wide 16:9 cinematic workspace scene. Right side: a virtual kanban board floating in dark space, with columns for different workflow stages. Above it, a swirl of unorganized issue cards spiral downward, being caught and sorted by an AI agent hand made of light. Below the board, neatly formatted user story cards stack up. Progress bars and priority indicators glow in green, amber, and red. Left 40% dark. Clean product-management aesthetic, 4K.
```

**Alt text (thumbnail):** `PM Agent — AI product manager organizing chaotic issues into structured user stories`
**Alt text (hero):** `PM Agent workspace with virtual kanban board and AI sorting issues into prioritized user stories`

---

## 10. ideas-agent — Ideas Agent

### Card Thumbnail
```
Cinematic 16:9 dark scene. On the right, a constellation of floating markdown document icons — small glowing note cards — connected by thin luminous threads forming a knowledge graph. At the center, a bright lightbulb icon pulses warmly, where several threads converge to reveal a hidden connection. Warm gold and cool cyan tones. Left fades to dark. Ethereal, discovery-oriented atmosphere. Shallow depth of field, particle effects, cinematic.
```

### Detail Hero
```
Wide 16:9 cinematic mind-map visualization. Right side: dozens of floating markdown note cards arranged in clusters, connected by luminous threads of varying brightness — the brightest connections represent newly discovered links. A central conversational AI interface as a glowing chat bubble floats at the nexus. Some notes have visible keywords. Warm amber inner glow transitioning to cool blue at edges. Left 40% dark. Beautiful, dreamy, knowledge-visualization aesthetic, 4K.
```

**Alt text (thumbnail):** `Ideas Agent — knowledge graph connecting notes with glowing threads around a central lightbulb`
**Alt text (hero):** `Ideas Agent mind-map visualization with interconnected note cards and AI-discovered knowledge connections`

---

## 11. agent-academy — Agent Academy

### Card Thumbnail
```
Cinematic 16:9 dark composition. On the right, a floating hexagonal grid of agent cards — each tile containing a unique glowing icon representing a different agent capability such as code, music, search, and writing. Some tiles glow brighter than others indicating popularity. A search bar floats above with a subtle glow. Library and marketplace aesthetic. Left fades to dark. Clean, organized, community-feel with warm amber and cool blue lighting. Cinematic, detailed.
```

### Detail Hero
```
Wide 16:9 cinematic digital marketplace scene. Right side: a grand hall of floating agent registry cards arranged in a curved display — each card shows an agent icon, title, and capability tags. A featured agent card is enlarged and glowing brighter. A search interface floats at the top. At the bottom, a composition diagram shows agents being wired together. Graduation cap icon subtly incorporated. Left 40% dark. Grand, aspirational, platform aesthetic with warm and cool accent lighting, 4K.
```

**Alt text (thumbnail):** `Agent Academy — agent marketplace with hexagonal grid of discoverable AI agent cards`
**Alt text (hero):** `Agent Academy digital marketplace with curved display of AI agent registry cards and composition tools`

---

## Google Flow Workflow

### Per Project
1. Open [Google Flow](https://labs.google/fx/tools/flow)
2. Create project: `Brettflix - {Project Name}`
3. **Scene 1 — Thumbnail:** Paste "Card Thumbnail" prompt → Generate → Select best → Download
4. **Scene 2 — Detail Hero:** Paste "Detail Hero" prompt → Generate → Select best → Download
5. Export at 16:9, highest resolution available
6. Resize to required dimensions (see `MEDIA_HANDOFF_SPEC.md`)
7. Convert: `cwebp -q 75 input.png -o output.webp` + keep JPEG at q80

### Batch Processing (After Download)
```bash
# Resize + convert all hero images
for img in *-hero-raw.*; do
  slug=$(echo $img | sed 's/-hero-raw.*//')
  convert "$img" -resize 1920x1080 -quality 85 "${slug}-hero-1920x1080.jpg"
  convert "$img" -resize 1280x720 -quality 85 "${slug}-hero-1280x720.jpg"
  convert "$img" -resize 768x432 -quality 85 "${slug}-hero-768x432.jpg"
  cwebp -q 80 "${slug}-hero-1920x1080.jpg" -o "${slug}-hero-1920x1080.webp"
  cwebp -q 80 "${slug}-hero-1280x720.jpg" -o "${slug}-hero-1280x720.webp"
  cwebp -q 80 "${slug}-hero-768x432.jpg" -o "${slug}-hero-768x432.webp"
done

# Resize + convert all thumbnails
for img in *-thumb-raw.*; do
  slug=$(echo $img | sed 's/-thumb-raw.*//')
  convert "$img" -resize 665x374 -quality 80 "${slug}-thumb-665x374.jpg"
  convert "$img" -resize 480x270 -quality 80 "${slug}-thumb-480x270.jpg"
  convert "$img" -resize 342x192 -quality 80 "${slug}-thumb-342x192.jpg"
  cwebp -q 75 "${slug}-thumb-665x374.jpg" -o "${slug}-thumb-665x374.webp"
  cwebp -q 75 "${slug}-thumb-480x270.jpg" -o "${slug}-thumb-480x270.webp"
  cwebp -q 75 "${slug}-thumb-342x192.jpg" -o "${slug}-thumb-342x192.webp"
done
```

### projects.yml Update Template
```yaml
- id: "{slug}"
  image: "/assets/images/thumbs/{slug}-thumb-665x374.webp"
  heroImage: "/assets/images/hero/{slug}-hero-1920x1080.webp"
```
