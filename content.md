# deadmanifesto — Editorial Map & Asset Ledger

The site is the source of truth for its own text. This file is the map: what exists, what is public, what is held back, what is missing, and what happens next. It does not duplicate live copy.

Last updated: 7 November 2026 — launch-prep 0.1.5

## How to use this file

- Change copy in the HTML page that renders it.
- Use this file to decide what to change and to track images and held-back work.
- Every structural change updates this map, `/disclaimer/changelog/` and `/disclaimer/robots/`.

## Public surface

Target nav (ten items, shop retired):

Home · Listen · Ginger Deadman · deadmanifesto · Games · Career · Contact · Disclaimer · Changelog · Robots

## Page inventory

States: **LIVE** (public, no visible WIP markers) · **NEEDS COPY** (public, placeholder or wireframe copy) · **HIDDEN** (noindex, unlinked, coming-soon) · **GONE**.

| Page | Path | State | Next action |
|---|---|---|---|
| Splash | `index.html` | LIVE | Splash image (8:3) when assets arrive |
| Listen | `music/index.html` | LIVE | Author-supplied release metadata and remaining streaming links |
| Ginger Deadman | `ginger-deadman/index.html` | LIVE | Press photo |
| About | `ginger-deadman/about/index.html` | LIVE | — |
| EPK Bio | `ginger-deadman/about/epk-bio/index.html` | LIVE | Press photo, credit and quote |
| deadmanifesto hub | `deadmanifesto/index.html` | LIVE | Keep three live links; WIP banner removed in 0.1.4 |
| Manifesto | `deadmanifesto/manifesto/index.html` | LIVE | Draft scaffolding removed in 0.1.0 |
| Games | `deadmanifesto/games/index.html` | LIVE | Steam + Game Credits live; other platform profiles when URLs exist |
| Career | `deadmanifesto/career/index.html` | LIVE | Game Credits + full history live; exact roles author-supplied |
| Contact | `contact/index.html` | LIVE | Email when the domain and mailbox exist |
| Disclaimer | `disclaimer/index.html` | LIVE | — |
| Changelog | `disclaimer/changelog/index.html` | LIVE | Update every shipped change |
| Robots | `disclaimer/robots/index.html` | LIVE | Update every structural change |
| 404 | `404.html` | LIVE | Branded not-found page; absolute links point at the current GitHub Pages base |
| Services | `deadmanifesto/services/index.html` | HIDDEN | Restore when service copy exists |
| ADHD Guide | `deadmanifesto/adhd-guide/index.html` | HIDDEN | Editorial backlog |
| Recipes | `deadmanifesto/recipes/index.html` | HIDDEN | Editorial backlog |
| Music Reviews | `deadmanifesto/music-reviews/index.html` | HIDDEN | Editorial backlog |
| Home Studio 101 | `deadmanifesto/home-studio-101/index.html` | HIDDEN | Editorial backlog |
| Freeware & Tech | `deadmanifesto/home-studio-101/freeware-tech/index.html` | HIDDEN | Editorial backlog |
| Games Blog | `deadmanifesto/games-blog/index.html` | HIDDEN | Editorial backlog |
| AI | `deadmanifesto/ai/index.html` | HIDDEN | Editorial backlog |
| Gallery hub | `ginger-deadman/about/gallery/index.html` | HIDDEN | Restore with image layer |
| Gallery: Outfits | `ginger-deadman/about/gallery/outfits/index.html` | HIDDEN | Image layer |
| Gallery: Gigs | `ginger-deadman/about/gallery/gigs/index.html` | HIDDEN | Image layer |
| Gallery: Food | `ginger-deadman/about/gallery/food/index.html` | HIDDEN | Image layer |
| Gallery: Wildlife | `ginger-deadman/about/gallery/wildlife/index.html` | HIDDEN | Image layer |
| Gallery: Urban | `ginger-deadman/about/gallery/urban/index.html` | HIDDEN | Image layer |
| Gallery: Nature | `ginger-deadman/about/gallery/nature/index.html` | HIDDEN | Image layer |
| Track pages (×6) | `music/albums/*/track-01.html` | HIDDEN | Restore when lyrics exist |
| Shop | `shop/index.html` | GONE | Future merch gets a new name and a new page |

As of 0.1.5, the public pages carry no TODO or placeholder blocks. Game credits are visible on Games and Career; exact roles and dates remain author-input fields below. The remaining gaps are image slots or author-input fields.

## Author input

These fields stay off the public pages until they are supplied. If a field is blank, do not publish it.

### Music metadata

The Listen page shows verified titles, artists and groups only. Release metadata and additional streaming links wait here.

| Release | Type | Year | Tracks | Credits | Streaming URL |
|---|---|---|---|---|---|
| Orange | Album | | | | |
| Obstinancy | Album | | | | |
| Obliquity | Album | | | | |
| Obsolescence | Tape | | | | |
| Obliviability | Album | | | | |
| Unreal | Tape | | | | |
| Flips | Flips series | | | | |
| Flips 2 | Flips series | | | | |
| Flips 3 | Flips series | | | | |
| Metro House | Collaboration | | | | |
| Cultus Ex Cultura | Collaboration | | | | |
| Unapology | Collaboration | | | | |

### Press copy

- Working bio: live on About and EPK Bio; approve or replace with the author's own version.
- Press quote: not published.
- Press photo: clean slot live on Ginger Deadman and EPK Bio.
- Press photo credit: not published.

### Game credit details

| Title | Role | Employer | Dates |
|---|---|---|---|
| Helldivers 2 | | | |
| LEGO Horizon Adventures | | | |
| Ravenbound | | | |
| Call of the Wild: The Angler | | | |

Official full titles are used in public copy. "HD2" and "theAngler" are shorthands, not part of the titles. Reference pages:

- Helldivers 2 — <https://www.playstation.com/en-us/games/helldivers-2/>
- LEGO Horizon Adventures — <https://www.lego.com/en-us/aboutus/news/2024/june/lego-horizon-adventures>
- Ravenbound — <https://avalanchestudios.com/games/ravenbound>
- Call of the Wild: The Angler — <https://cotwtheangler.com/news/call-of-the-wild-the-angler-tm-is-now-available-on-pc/>

## Held back

Unfinished sections are unlinked, marked `noindex`, and show a coming-soon panel. Files are kept so nothing is lost. The public surface never links to them.

## Asset ledger

Slots inferred from the current markup. Dimensions are targets, not requirements.

| Slot | Page | Ratio / size | Filename | Alt text | Priority |
|---|---|---|---|---|---|
| Favicon | all pages | 32×32 + 180×180 | `assets/images/favicon.svg` (created 0.1.3) / `apple-touch-icon.png` (pending) | — | 1 |
| Social share card | all pages | 1200×630 | `assets/images/og-deadmanifesto.jpg` | deadmanifesto — Ginger Deadman | 1 |
| Splash banner | `index.html` | 8:3, 1600×600 | `assets/images/splash-banner.jpg` | deadmanifesto press image | 1 |
| Artist portrait | `ginger-deadman/index.html`, `epk-bio/` | 3:4, 1200×1600 | `assets/images/ginger-deadman-portrait.jpg` | Ginger Deadman | 1 |
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
| Gallery: Outfits | gallery page | mixed | `assets/images/gallery/outfits-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Gigs | gallery page | mixed | `assets/images/gallery/gigs-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Food | gallery page | mixed | `assets/images/gallery/food-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Wildlife | gallery page | mixed | `assets/images/gallery/wildlife-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Urban | gallery page | mixed | `assets/images/gallery/urban-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Nature | gallery page | mixed | `assets/images/gallery/nature-01.jpg` … | descriptive alt per image | 3 |

All release covers are clean 1:1 slots. The previous Obliviability and Flips imgbb covers did not load reliably and were removed in 0.1.4. The old `wip.jpg` banners and Ginger Deadman test images were also removed from the public pages.

## Copy decisions

- **Voice:** first person for editorial pages; third person for press/EPK copy. Direct, dry wit. No corporate register.
- **Contact email:** "Coming soon" until the domain and mailbox exist.
- **Contact socials:** keep the main Instagram (`ofwolfe`), YouTube, TikTok and RateYourMusic. The extra Instagram accounts (`ginger.deadman`, `imsgagzam`, `pribability`) were removed in 0.1.5.
- **Shop:** retired. The local public build was audited in 0.1.5 and contains no shop links; the live GitHub Pages build still carries the old Shop nav until launch-prep is deployed. Any future merch gets a different name and a different page. Historical changelog entries stay.
- **Gallery:** dark until images exist. No empty frames on the public site.
- **Lyrics:** track pages dark until lyrics are supplied. Album cards remain.
- **Music metadata:** the public Listen page shows verified titles, artists and groups only. Release metadata lives under Author input until supplied.
- **Games:** Steam and the four verified game credits are public; other platform profiles stay hidden until URLs exist.
- **Game titles:** use the official full titles in public copy: Helldivers 2, LEGO Horizon Adventures, Ravenbound and Call of the Wild: The Angler. "HD2" and "theAngler" are shorthands, not part of the titles.
- **Press:** the working bio is built only from existing site facts; author review is pending.
- **Images:** slots are labelled by ratio, not by missing-content warnings.
- **Manifesto:** the trimmed version is canonical. Draft marker and author-only questions are not published.
- **Robots page:** describes the public structure, not the held-back one.

## Backlog

- Register a domain and configure DNS (custom domain deferred).
- Gather and optimise images; populate the ledger.
- Resolve author-input fields: release metadata, press bio approval, quote, photo credit and exact game credit roles.
- Add remaining streaming links and platform profiles when URLs exist.
- Restore gallery when the image layer ships.
- Restore track pages when lyrics exist.
- Merch under a new name.
- Editorial slots: services, ADHD guide, recipes, reviews, home studio, games blog, AI.
- Apple touch icon and OG share image.
- Update the 404 page's absolute links if the site moves to a custom domain.
- Final QA, accessibility and performance pass in 0.1.6.
