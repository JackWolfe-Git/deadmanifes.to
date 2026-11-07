# deadmanifesto — Editorial Map & Asset Ledger

The site is the source of truth for its own text. This file is the map: what exists, what is public, what is held back, what is missing, and what happens next. It does not duplicate live copy.

Last updated: 7 November 2026 — launch-prep 0.1.2

## How to use this file

- Change copy in the HTML page that renders it.
- Use this file to decide what to change and to track images and held-back work.
- Every structural change updates this map, `/disclaimer/changelog/` and `/disclaimer/robots/`.

## Public surface

Target nav (nine items, shop retired):

Home · Listen · Ginger Deadman · deadmanifesto · Games · Career · Contact · Disclaimer · Changelog · Robots

## Page inventory

States: **LIVE** (public, no visible WIP markers) · **NEEDS COPY** (public, placeholder or wireframe copy) · **HIDDEN** (noindex, unlinked, coming-soon) · **GONE**.

| Page | Path | State | Next action |
|---|---|---|---|
| Splash | `index.html` | NEEDS COPY | Replace wireframe headings and media banner with launch copy |
| Listen | `music/index.html` | NEEDS COPY | Fill album metadata, real embeds, remove track links |
| Ginger Deadman | `ginger-deadman/index.html` | NEEDS COPY | Bio copy, portrait slot |
| About | `ginger-deadman/about/index.html` | NEEDS COPY | Bio copy |
| EPK Bio | `ginger-deadman/about/epk-bio/index.html` | NEEDS COPY | Press bio copy |
| deadmanifesto hub | `deadmanifesto/index.html` | LIVE | Keep three live links; retire WIP list |
| Manifesto | `deadmanifesto/manifesto/index.html` | LIVE | Draft scaffolding removed in 0.1.0 |
| Games | `deadmanifesto/games/index.html` | NEEDS COPY | Credits details, remove platform TODOs |
| Career | `deadmanifesto/career/index.html` | NEEDS COPY | CV copy |
| Contact | `contact/index.html` | NEEDS COPY | Email "coming soon"; remove social-note TODOs |
| Disclaimer | `disclaimer/index.html` | LIVE | — |
| Changelog | `disclaimer/changelog/index.html` | LIVE | Update every shipped change |
| Robots | `disclaimer/robots/index.html` | LIVE | Update every structural change |
| Services | `deadmanifesto/services/index.html` | HIDDEN (0.1.2) | Restore when service copy exists |
| ADHD Guide | `deadmanifesto/adhd-guide/index.html` | HIDDEN (0.1.2) | Editorial backlog |
| Recipes | `deadmanifesto/recipes/index.html` | HIDDEN (0.1.2) | Editorial backlog |
| Music Reviews | `deadmanifesto/music-reviews/index.html` | HIDDEN (0.1.2) | Editorial backlog |
| Home Studio 101 | `deadmanifesto/home-studio-101/index.html` | HIDDEN (0.1.2) | Editorial backlog |
| Freeware & Tech | `deadmanifesto/home-studio-101/freeware-tech/index.html` | HIDDEN (0.1.2) | Editorial backlog |
| Games Blog | `deadmanifesto/games-blog/index.html` | HIDDEN (0.1.2) | Editorial backlog |
| AI | `deadmanifesto/ai/index.html` | HIDDEN (0.1.2) | Editorial backlog |
| Gallery hub | `ginger-deadman/about/gallery/index.html` | HIDDEN (0.1.2) | Restore with image layer |
| Gallery: Outfits | `ginger-deadman/about/gallery/outfits/index.html` | HIDDEN (0.1.2) | Image layer |
| Gallery: Gigs | `ginger-deadman/about/gallery/gigs/index.html` | HIDDEN (0.1.2) | Image layer |
| Gallery: Food | `ginger-deadman/about/gallery/food/index.html` | HIDDEN (0.1.2) | Image layer |
| Gallery: Wildlife | `ginger-deadman/about/gallery/wildlife/index.html` | HIDDEN (0.1.2) | Image layer |
| Gallery: Urban | `ginger-deadman/about/gallery/urban/index.html` | HIDDEN (0.1.2) | Image layer |
| Gallery: Nature | `ginger-deadman/about/gallery/nature/index.html` | HIDDEN (0.1.2) | Image layer |
| Track pages (×6) | `music/albums/*/track-01.html` | HIDDEN (0.1.2) | Restore when lyrics exist |
| Shop | `shop/index.html` | GONE (0.1.1) | Future merch gets a new name and a new page |

## Held back

Unfinished sections are unlinked, marked `noindex`, and show a coming-soon panel. Files are kept so nothing is lost. The public surface never links to them.

## Asset ledger

Slots inferred from the current markup. Dimensions are targets, not requirements.

| Slot | Page | Ratio / size | Filename | Alt text | Priority |
|---|---|---|---|---|---|
| Favicon | all pages | 32×32 + 180×180 | `assets/images/favicon.svg` / `apple-touch-icon.png` | — | 1 |
| Social share card | all pages | 1200×630 | `assets/images/og-deadmanifesto.jpg` | deadmanifesto — Ginger Deadman | 1 |
| Splash banner | `index.html` | 8:3, 1600×600 | `assets/images/splash-banner.jpg` | deadmanifesto press image | 1 |
| Artist portrait | `ginger-deadman/index.html`, `about/`, `epk-bio/` | 3:4, 1200×1600 | `assets/images/ginger-deadman-portrait.jpg` | Ginger Deadman | 1 |
| Album: Orange | `music/index.html` | 1:1, 1000×1000 | `assets/images/album-orange.jpg` | Orange album cover | 1 |
| Album: Obstinancy | `music/index.html` | 1:1 | `assets/images/album-obstinancy.jpg` | Obstinancy album cover | 1 |
| Album: Obliquity | `music/index.html` | 1:1 | `assets/images/album-obliguity.jpg` | Obliquity album cover | 1 |
| Album: Obsolescence | `music/index.html` | 1:1 | `assets/images/album-obsolescence.jpg` | The Obsolescence Tapes cover | 1 |
| Album: Obliviability | `music/index.html` | 1:1 | `assets/images/album-obliviability.jpg` | Obliviability album cover | 1 |
| Album: Unreal | `music/index.html` | 1:1 | `assets/images/album-unreal.jpg` | The Unreal Tapes cover | 1 |
| Album: Flips | `music/index.html` | 1:1 | `assets/images/album-flips.jpg` | Flips album cover | 1 |
| Album: Flips 2 | `music/index.html` | 1:1 | `assets/images/album-flips-2.jpg` | Flips 2 album cover | 1 |
| Album: Flips 3 | `music/index.html` | 1:1 | `assets/images/album-flips-3.jpg` | Flips 3 album cover | 1 |
| Collab: Metro House | `music/index.html` | 1:1 | `assets/images/collab-metro-house.jpg` | Metro House cover | 2 |
| Collab: Cultus Ex Cultura | `music/index.html` | 1:1 | `assets/images/collab-cultus-ex-cultura.jpg` | Cultus Ex Cultura cover | 2 |
| Collab: Unapology | `music/index.html` | 1:1 | `assets/images/collab-unapology.jpg` | Unapology cover | 2 |
| Content banner | music, ginger-deadman, deadmanifesto, games | 3:1 | `assets/images/content-banner.jpg` | deadmanifesto banner | 2 |
| Gallery: Outfits | gallery page | mixed | `assets/images/gallery/outfits-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Gigs | gallery page | mixed | `assets/images/gallery/gigs-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Food | gallery page | mixed | `assets/images/gallery/food-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Wildlife | gallery page | mixed | `assets/images/gallery/wildlife-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Urban | gallery page | mixed | `assets/images/gallery/urban-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Nature | gallery page | mixed | `assets/images/gallery/nature-01.jpg` … | descriptive alt per image | 3 |

Current remote images: `wip.jpg` and the Obliviability / Flips covers are hosted on imgbb. Treat them as temporary until local assets exist.

## Copy decisions

- **Voice:** first person, direct, dry wit. No corporate register.
- **Contact email:** "Coming soon" until the domain and mailbox exist.
- **Shop:** retired. Any future merch gets a different name and a different page. Historical changelog entries stay.
- **Gallery:** dark until images exist. No empty frames on the public site.
- **Lyrics:** track pages dark until lyrics are supplied. Album cards remain.
- **Music metadata:** fields stay; values are the author's to fill.
- **Manifesto:** the trimmed version is canonical. Draft marker and author-only questions are not published.
- **Robots page:** describes the public structure, not the held-back one.

## Backlog

- Register a domain and configure DNS (custom domain deferred).
- Gather and optimise images; populate the ledger.
- Restore gallery when the image layer ships.
- Restore track pages when lyrics exist.
- Merch under a new name.
- Editorial slots: services, ADHD guide, recipes, reviews, home studio, games blog, AI.
- OG/meta pass, favicon, 404, sitemap.
- Accessibility and performance pass.
