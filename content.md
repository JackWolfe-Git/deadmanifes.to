# deadmanifesto — Editorial Map & Asset Ledger

The site is the source of truth for its own text. This file is the map: what exists, what is public, what is held back, what is missing, and what happens next. It does not duplicate live copy.

Last updated: 10 November 2026 — changelog 0.2.12

## How to use this file

- Change copy in the HTML page that renders it.
- Use this file to decide what to change and to track images and held-back work.
- Every structural change updates this map and the changelog and site-structure sections on `/about/`.

## Public surface

Target nav (seven items, shop retired):

Home · Listen · Ginger Deadman · deadmanifesto · Career · Contact · About

Search is a header icon and `/search/` results page, not an eighth menu item. About contains Disclaimer, Changelog and Robots. The global footer links Contact, Disclaimer and Privacy, followed by the no-cookies line.

## Page inventory

States: **LIVE** (public, no visible WIP markers) · **NEEDS COPY** (public, placeholder or wireframe copy) · **HIDDEN** (noindex, unlinked, coming-soon) · **GONE**.

| Page | Path | State | Next action |
|---|---|---|---|
| Splash | `index.html` | LIVE | Short bio live above the lede; splash image (8:3) when assets arrive |
| Listen | `music/index.html` | LIVE | Album templates live; release metadata, tracklists and streaming links author-supplied |
| Ginger Deadman | `ginger-deadman/index.html` | LIVE | Artist portrait |
| About | `ginger-deadman/about/index.html` | LIVE | Identity live; IPA and Greek transliteration when supplied |
| Bio | `ginger-deadman/about/bio/index.html` | LIVE | Artist portrait TBC; old EPK URL redirects here |
| deadmanifesto hub | `deadmanifesto/index.html` | LIVE | "180 songs" line removed in 0.1.11 |
| Manifesto | `deadmanifesto/manifesto/index.html` | LIVE | Version line and AI credits live |
| Career | `deadmanifesto/career/index.html` | LIVE | Game covers + credits + full history live; exact roles author-supplied |
| Contact | `contact/index.html` | LIVE | Steam/Xbox/PSN/EA cards live; email, second YouTube and SoundCloud URLs when supplied |
| About | `about/index.html` | LIVE | Disclaimer, changelog, planning placeholder and site-structure notes combined |
| Privacy | `about/privacy/index.html` | LIVE | Update when storage or hosting changes |
| Tools | `about/tools/index.html` | LIVE | LLM, AI-assisted and traditional tool sections live; entries TBC |
| Search | `search/index.html` | LIVE | Local index; update `search-index.json` with public pages |
| Album templates (×6 public) | `music/albums/*/index.html` | NEEDS COPY | Public, linked from Listen, `noindex` until credits and remaining metadata exist; six further release and collaboration templates are held back |
| Flips track pages (×27) | `music/albums/flips/*/index.html` | PARTIAL | Public, linked from Flips, `noindex`; Java and Rigatoni Nosebleed have lyrics, remaining lyrics pending |
| 404 | `404.html` | LIVE | WIP image and new copy in 0.1.24; absolute links point at the current GitHub Pages base |
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
| Track pages (×6) | `music/albums/*/track-01.html` | HIDDEN | Legacy placeholders; Flips, Obliviability and Obsolescence use named track pages |
| Obliviability track pages (×7) | `music/albums/obliviability/*/index.html` | PARTIAL | `noindex`; lyrics live for 7 tracks, 7 album tracks await lyrics |
| Obsolescence track pages (×4) | `music/albums/obsolescence/*/index.html` | PARTIAL | `noindex`; lyrics live for 4 tracks, 6 album tracks await lyrics |
| Shop | `shop/index.html` | GONE | Future merch gets a new name and a new page |

As of 0.1.43, the public pages carry no unchecked TODO blocks. Six album pages are public templates with some `TBC` fields and a `noindex` instruction until credits and remaining metadata arrive; six further release and collaboration templates are held back and unlinked. The Flips (Remix Collection) tracklist is live with 27 linked, `noindex` track pages; Java and Rigatoni Nosebleed have lyrics. Obliviability has a 14-track list with 7 lyric pages, and Obsolescence has a 12-track list with 4 lyric pages. Game credits and covers are visible on Career; exact roles and dates remain author-input fields below. The remaining gaps are album metadata, the remaining lyrics and author-input fields.

## Author input

These fields stay off the public pages until they are supplied. If a field is blank, do not publish it.

### Music metadata

The Listen page shows verified titles, artists and groups only. The six public album templates are linked from Listen and remain `noindex` until their remaining metadata arrives. Club Foot is set to 2019 with cover art and a pending tracklist. Flips is filled to 2021 (2022 Remaster), Flips (Remix Collection) and 27 tracks. The Flips tracklist is public with 27 linked track pages; Java and Rigatoni Nosebleed have lyrics, while track lengths and the remaining lyrics are pending. Obliviability is set to 14 tracks with 7 lyric pages; Obsolescence is set to 10 tracks with 4 lyric pages. Release years, types, credits and streaming links still wait here. The six held-back release templates are listed under Future plans and stay off Listen.

| Release | Type | Year | Tracks | Credits | Streaming URL |
|---|---|---|---|---|---|
| Obsolescence | Experimental | 2022 | 12 | | |
| Obliviability | Album | | 14 | | |
| Unreal | Experimental | 2018 | x | | |
| Flips | Flips (Remix Collection) | 2021 | 27 | | |
| Flips 2 | Flips series | | | | |
| Club Foot | Flips series | 2019 | | | |

Flips track page titles are verbatim. Track 10's URL omits the explicit word; all other slugs are lowercase title slugs. Obliviability and Obsolescence use the same title/slug pattern; the Spontenaity page follows the album-note spelling, while the lyric file is named Spontinaety.

### Identity

- Name: Jack Aodh Ginger Kilbride Wolfe.
- Pronouns: they/them/theirs.
- Based: Liverpool, UK.
- Born: 5 February 1998.
- Age: calculated dynamically in `Europe/London` on About.
- Pronunciation and Greek transliteration: `TBC` until supplied.
- Do not invent a pronunciation, Greek spelling, role, credit, date or metadata.

### Press copy

- Bio: the confirmed factual paragraph is live on About and EPK Bio, ending `More soon.`
- Press quote: `TBC` placeholder live on EPK Bio.
- Press photo: clean slot live on EPK Bio; `TBC` caption.
- Press photo credit: `TBC` on EPK Bio.
- Press contact: `TBC` on EPK Bio.

### Game credit details

| Title | Role | Employer | Dates |
|---|---|---|---|
| Helldivers 2 | | | |
| LEGO Horizon Adventures | | | |
| Ravenbound | | | |
| Call of the Wild: theAngler | | | |

Official full titles are used in public copy. "HD2" is a shorthand; "theAngler" is the official styling of that title. Reference pages:

- Helldivers 2 — <https://www.playstation.com/en-us/games/helldivers-2/>
- LEGO Horizon Adventures — <https://www.lego.com/en-us/aboutus/news/2024/june/lego-horizon-adventures>
- Ravenbound — <https://avalanchestudios.com/games/ravenbound>
- Call of the Wild: theAngler — <https://cotwtheangler.com/news/call-of-the-wild-the-angler-tm-is-now-available-on-pc/>

## Held back

Unfinished sections are unlinked, marked `noindex`, and show a coming-soon panel. Files are kept so nothing is lost. The public surface never links to them.

## Future plans

Held back from Listen and the public catalog. Their `noindex` templates remain in the repo, unlinked and excluded from search, RSS and the sitemap until they are restored.

| Release | Type | Template |
|---|---|---|
| Orange | Album | `music/albums/orange/index.html` |
| Obstinancy | Album | `music/albums/obstinancy/index.html` |
| Obliquity | Album | `music/albums/obliquity/index.html` |
| Metro House | Collaboration | `music/albums/metro-house/index.html` |
| Cultus Ex Cultura | Collaboration | `music/albums/cultus-ex-cultura/index.html` |
| Unapology | Collaboration | `music/albums/unapology/index.html` |

## Asset ledger

Slots inferred from the current markup. Dimensions are targets, not requirements.

| Slot | Page | Ratio / size | Filename | Alt text | Priority |
|---|---|---|---|---|---|
| Favicon | all pages | 32×32 + 180×180 | `assets/images/favicon.svg` (created 0.1.4) / `apple-touch-icon.png` (pending) | — | 1 |
| Social share card | all pages | 1200×630 | `assets/images/og-deadmanifesto.jpg` | deadmanifesto — Ginger Deadman | 1 |
| Splash banner | `index.html` | 8:3, 1600×600 | `assets/images/splash-banner.jpg` | deadmanifesto press image | 1 |
| Artist portrait | `ginger-deadman/index.html`, `epk-bio/` | 3:4, 1200×1600 | `assets/images/ginger-deadman-portrait.jpg` | Ginger Deadman | 1 |
| Album: Orange | `music/albums/orange/index.html` | 1:1, 1000×1000 | `assets/images/album-orange.jpg` | Orange album cover | 3 |
| Album: Obstinancy | `music/albums/obstinancy/index.html` | 1:1 | `assets/images/album-obstinancy.jpg` | Obstinancy album cover | 3 |
| Album: Obliquity | `music/albums/obliquity/index.html` | 1:1 | `assets/images/album-obliguity.jpg` | Obliquity album cover | 3 |
| Album: Obsolescence | `music/index.html` | 1:1 | `assets/images/album-obsolescence.jpg` | The Obsolescence Tapes cover | 1 |
| Album: Obliviability | `music/index.html` | 1:1 | `assets/images/album-obliviability.jpg` | Obliviability album cover | 1 |
| Album: Unreal | `music/index.html` | 1:1 | `assets/images/album-unreal.jpg` | Unreal cover | 1 |
| Album: Flips | `music/index.html` | 1:1 | `assets/images/album-flips.jpg` | Flips album cover | 1 |
| Album: Flips 2 | `music/index.html` | 1:1 | `assets/images/album-flips-2.jpg` | Flips 2 album cover | 1 |
| Album: Club Foot | `music/index.html` | 1:1 | `assets/images/album-covers/club-foot.png` | Club Foot album cover | 1 |
| Collab: Metro House | `music/albums/metro-house/index.html` | 1:1 | `assets/images/collab-metro-house.jpg` | Metro House cover | 3 |
| Collab: Cultus Ex Cultura | `music/albums/cultus-ex-cultura/index.html` | 1:1 | `assets/images/collab-cultus-ex-cultura.jpg` | Cultus Ex Cultura cover | 3 |
| Collab: Unapology | `music/albums/unapology/index.html` | 1:1 | `assets/images/collab-unapology.jpg` | Unapology cover | 3 |
| Game cover: Helldivers 2 | `deadmanifesto/career/index.html` | 2:3 | `assets/images/game-covers/helldivers-2.jpg` (used 0.1.19) | Helldivers 2 cover art | 1 |
| Game cover: LEGO Horizon Adventures | `deadmanifesto/career/index.html` | 2:3 | `assets/images/game-covers/lego-horizon-adventures.jpg` (used 0.1.19) | LEGO Horizon Adventures cover art | 1 |
| Game cover: Ravenbound | `deadmanifesto/career/index.html` | 2:3 | `assets/images/game-covers/ravenbound.jpg` (used 0.1.19) | Ravenbound cover art | 1 |
| Game cover: Call of the Wild: theAngler | `deadmanifesto/career/index.html` | 2:3 | `assets/images/game-covers/call-of-the-wild-the-angler.jpg` (used 0.1.19) | Call of the Wild: theAngler cover art | 1 |
| 404 WIP image | `404.html` | 481×467 | `assets/images/wip.jpg` (used 0.1.24) | Sorry bro. The edit is still being edited. Keep scrolling. | 1 |
| Gallery: Outfits | gallery page | mixed | `assets/images/gallery/outfits-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Gigs | gallery page | mixed | `assets/images/gallery/gigs-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Food | gallery page | mixed | `assets/images/gallery/food-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Wildlife | gallery page | mixed | `assets/images/gallery/wildlife-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Urban | gallery page | mixed | `assets/images/gallery/urban-01.jpg` … | descriptive alt per image | 3 |
| Gallery: Nature | gallery page | mixed | `assets/images/gallery/nature-01.jpg` … | descriptive alt per image | 3 |

All release covers are clean 1:1 slots. The previous Obliviability and Flips imgbb covers were removed in 0.1.25 and replaced with local placeholder slots. The four game covers, the 404 WIP image, Fragment Mono and the local icons are now shipped. The streaming placeholders use local dark/light SVGs for YouTube Music, Spotify, YouTube, Tidal, SoundCloud, Apple Music and Amazon. The old `wip.jpg` banners and Ginger Deadman test images were removed from the public pages in 0.1.7.

## Copy decisions

- **Voice:** first person for editorial pages; third person for biography copy. Direct, dry wit. No corporate register.
- **Contact email:** "Coming soon" until the domain and mailbox exist.
- **Contact socials:** keep the main Instagram (`ofwolfe`), YouTube, TikTok and RateYourMusic. LinkedIn is live. Steam, Xbox, PlayStation and EA sit in the same icon-and-link list, with no separate platform heading. RSS is linked. The second YouTube channel and SoundCloud are visible placeholders until URLs exist. The contact page is an icon-and-link list with email coming soon last. The extra Instagram accounts (`ginger.deadman`, `imsgagzam`, `pribability`) were removed in 0.1.10.
- **Shop:** retired. The live GitHub Pages build carries the previous public build, which has no shop links. Any future merch gets a different name and a different page. Historical changelog entries stay.
- **Gallery:** dark until images exist. No empty frames on the public site.
- **Lyrics:** track pages are live for confirmed lyric files. Java and Rigatoni Nosebleed (Flips), seven Obliviability tracks and four Obsolescence tracks are published; the remaining lyrics stay in the vault workbench.
- **Music metadata:** the public Listen page shows verified titles, artists and groups only. Flips is filled to 2021 (2022 Remaster) / Flips (Remix Collection) / 27 tracks. Obliviability is set to 14 tracks (2020) and Obsolescence to 12 tracks (2022, Experimental). Release pages are `noindex` and excluded from search, RSS and the sitemap until filled.
- **Career:** the four verified game covers/credits, four [redacted] cover placeholders and the full professional history are public. **Contact:** the Steam profile link and Xbox, PlayStation and EA username cards are public. The Steam widget is removed. Exact roles and dates stay author-supplied.
- **Game titles:** use the official full titles in public copy: Helldivers 2, LEGO Horizon Adventures, Ravenbound and Call of the Wild: theAngler. "HD2" is a shorthand; "theAngler" is the official styling of that title.
- **Press:** the confirmed factual bio is live and closes with the QA Tester line. Press quote, photo, credit and contact are explicit `TBC` placeholders; no invented quotes or credits.
- **Images:** slots are labelled by ratio, not by missing-content warnings. Game covers are used on Career.
- **Manifesto:** the trimmed version is canonical. Version `1.0 · 8 November 2026` and the exact AI model list are live. Draft marker and author-only questions are not published.
- **Privacy:** no analytics, cookies, ads, tracking pixels, third-party embeds, Google Fonts, SimpleIcons CDN or remote images. Browser storage is limited to `dm-mode`. GitHub Pages hosting logs are disclosed. There is no cookie consent banner because there are no non-essential cookies or trackers.
- **Search:** local static index only; no external search service and no query logging by us. The query appears in the URL and may appear in hosting logs. Hidden pages, drafts, 404 and unfilled album pages are excluded.
- **RSS:** static changelog feed; no tracking pixels or unique identifiers. Linked from Contact and the public page heads.
- **Robots page:** describes the public structure and the held-back surfaces, not the held-back copy itself.

## Backlog

- Deploy 0.1.43 after final QA and explicit approval; future releases are logged one feature per version.
- Register a domain and configure DNS (custom domain deferred).
- Gather and optimise images; populate the ledger. The full image layer is 0.2.0.
- Resolve author-input fields: release metadata and the remaining tracklists, press quote, photo, photo credit, press contact, IPA/Greek, exact game credit roles and career CV details.
- Add remaining streaming links, second YouTube and SoundCloud URLs, and platform profiles when supplied.
- Restore gallery when the image layer ships.
- Add the remaining track pages as lyrics arrive.
- Merch under a new name.
- Editorial slots: services, ADHD guide, recipes, reviews, home studio, games blog, AI.
- Apple touch icon and OG share image.
- Update the 404 page's absolute links if the site moves to a custom domain.
- Final QA, accessibility and performance pass in 0.1.44.
