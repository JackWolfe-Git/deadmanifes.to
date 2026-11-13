# deadmanifesto — Editorial Map & Asset Ledger

The site is the source of truth for its own text. This file is the map: what exists, what is public, what is held back, what is missing, and what happens next. It does not duplicate live copy.

Last updated: 13 November 2026 - changelog 0.2.22

## How to use this file

- Change copy in the HTML page that renders it.
- Use this file to decide what to change and to track images and held-back work.
- Every structural change updates this map and the changelog and site-structure sections on `/about/`.
- After adding, removing or moving HTML files, run `make_sitemap.py` to rebuild `/sitemap/`.

## Public surface

Target nav (seven items, shop retired):

Home → Listen → Ginger Deadman → deadmanifesto → Career → Contact → About

Search is a header icon and `/search/` results page, not an eighth menu item. About contains Disclaimer, Changelog and Robots. The global footer links Contact, Disclaimer and Privacy, followed by the no-cookies line.

There are 13 indexable pages: Home, Listen, Ginger Deadman, Ginger Deadman About, Bio, deadmanifesto hub, Manifesto, Career, Contact, About, Tools, Privacy and Search. Release and track pages are linked from Listen but remain `noindex` until their metadata is complete. The generated `/sitemap/` current-route tree is a `noindex` utility linked from About; held-back and legacy routes are omitted. `sitemap.xml` remains the crawler index.

## Page inventory

States: **LIVE** (public, no visible WIP markers) → **PARTIAL** (public, `noindex`, some copy or lyrics pending) → **UTILITY** (noindex support page, linked from About) → **HIDDEN** (noindex, unlinked, coming-soon) → **GONE**.

| Page | Path | State | Notes |
|---|---|---|---|
| Splash | `index.html` | LIVE | Short bio and lede; splash image (8:3) when supplied |
| Listen | `music/index.html` | LIVE | Tapes and Flips cards; Spotify follow link at the bottom |
| Ginger Deadman | `ginger-deadman/index.html` | LIVE | Artist profile; portrait pending |
| Ginger Deadman About | `ginger-deadman/about/index.html` | LIVE | Identity and routes into the site |
| Bio | `ginger-deadman/about/bio/index.html` | LIVE | Biography and identity; portrait pending |
| deadmanifesto hub | `deadmanifesto/index.html` | LIVE | Entry point to the manifesto and career |
| Manifesto | `deadmanifesto/manifesto/index.html` | LIVE | Core tenets, AI-use statement and model list |
| Career | `deadmanifesto/career/index.html` | LIVE | Game covers and credits, six redacted placeholders, professional history and LinkedIn |
| Contact | `contact/index.html` | LIVE | Social, platform and contact links |
| About | `about/index.html` | LIVE | Disclaimer, changelog, planning notes and site structure |
| Privacy | `about/privacy/index.html` | LIVE | Storage and hosting disclosure |
| Tools | `about/tools/index.html` | LIVE | Linked LLMs, workspaces, AI-assisted, hardware placeholder and traditional tools |
| Search | `search/index.html` | LIVE | Local static search index |
| Release: oxox | `music/albums/oxox/index.html` | PARTIAL | 2015 tape, oxox, 6 tracks, `noindex` |
| Release: mainframe | `music/albums/mainframe/index.html` | PARTIAL | 2016 tape, oxox, 4 tracks, `noindex` |
| Release: Denial | `music/albums/denial/index.html` | PARTIAL | 2016 EP, Ginger Deadman, 4 tracks, `noindex` |
| Release: Unreal | `music/albums/unreal/index.html` | PARTIAL | 2017 tape, Ginger Deadman, 5 tracks, `noindex` |
| Release: Obliviability | `music/albums/obliviability/index.html` | PARTIAL | 2020 album, 14 tracks, `noindex` |
| Release: Obsolescence | `music/albums/obsolescence/index.html` | PARTIAL | 2022 experimental album, 12 tracks, `noindex` |
| Release: Club Foot | `music/albums/club-foot/index.html` | PARTIAL | 2019-2021 Flips remix collection, 27 tracks, `noindex` |
| Release: Flips | `music/albums/flips/index.html` | PARTIAL | 2021 (2022 Remaster), 27 tracks, `noindex` |
| Release: Flips 2 | `music/albums/flips-2/index.html` | PARTIAL | 2023 placeholder; tracklist coming soon |
| 404 | `404.html` | LIVE | WIP image and copy |
| Sitemap | `sitemap/index.html` | UTILITY | Generated current-route tree; release groups open by default; held-back and legacy routes omitted; linked from About |

There are 149 HTML pages in total: 13 indexable and 136 `noindex`. The sitemap tree shows 123 current routes: 13 public and 110 `noindex`; 22 held-back and 4 legacy routes are omitted. The legacy `track-01.html` templates and the duplicate `unreal/hollywood` and `unreal/snowstorm` pages were removed in 0.2.20. The sitemap utility was added in 0.2.21.

## Track pages and lyrics

| Release | Track pages | Lyrics state |
|---|---:|---|
| oxox | 6 | All 6 pages say "Lyrics coming soon" |
| mainframe | 4 | All 4 pages say "Lyrics coming soon" |
| Denial | 4 | All 4 pages say "Lyrics coming soon" |
| Unreal | 5 | 3 pages say "Lyrics coming soon" |
| Obliviability | 14 | 7 lyric pages live; 7 pending |
| Obsolescence | 12 | 4 lyric pages live; 8 pending |
| Club Foot | 27 | All 27 pages say "Lyrics coming soon" |
| Flips | 27 | Java and Rigatoni Nosebleed live; 25 pending |
| Flips 2 | 0 | Tracklist and track pages coming soon |

The 44 pages with pending lyrics are link-only and `noindex`: oxox (6), mainframe (4), Denial (4), Unreal (3), Club Foot (27).

## Author input

These fields stay off the public pages until they are supplied. If a field is blank, do not publish it.

### Music metadata

| Release | Artist | Type | Year | Tracks | Runtime | Streaming |
|---|---|---|---|---|---:|---|
| oxox | oxox | Tape | 2015 | 6 | 14m 51s | SoundCloud links live |
| mainframe | oxox | Tape | 2016 | 4 | 7m 57s | SoundCloud links live |
| Denial | Ginger Deadman | EP | 2016 | 4 | 16m 7s | SoundCloud links live |
| Unreal | Ginger Deadman | Experimental | 2017 | 5 | 14m 55s | SoundCloud collection live |
| Obliviability | Ginger Deadman | Album | 2020 | 14 | 50m 46s | Catbox audio on track pages |
| Obsolescence | Ginger Deadman | Experimental | 2022 | 12 | 40m | Catbox audio on track pages |
| Club Foot | deadmanifesto | Flips (Remix Collection) | 2019-2021 | 27 | 1h 29m 31s | SoundCloud links live |
| Flips | deadmanifesto | Flips (Remix Collection) | 2021 (2022 Remaster) | 27 | 1h 1m 11s | Catbox audio on track pages |
| Flips 2 | deadmanifesto | Flips (Remix Collection) | 2023 | Coming soon | - | Coming soon |

Unreal excludes Damaged Goods. The unsorted Oxox tracks — Trap Queen, Damaged Goods, This Is What Giving Head and Tutorial — stay off the site. chedlox stays off the site; collaborations are deferred. Flips 2 remains an empty placeholder for now.

### Identity

- Name: Jack Aodh Ginger Kilbride Wolfe.
- Pronouns: they/them/theirs.
- From: North West England.
- Born: 5 February 1998.
- Age: calculated dynamically in `Europe/London` on the Ginger Deadman About page.
- Pronunciation and Greek transliteration are not published.
- Do not invent a pronunciation, Greek spelling, role, credit, date or metadata.

### Press copy

- Bio: the confirmed factual paragraph is live and closes with the QA Tester line.
- Press quote, photo, photo credit and press contact are not published.
- Professional inquiries must relate to the Ginger Deadman / deadmanifesto projects.

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

Unfinished sections are unlinked, marked `noindex`, and show a coming-soon panel. Files are kept so nothing is lost. The public surface and human sitemap never link to them.

Held-back editorial, service and gallery templates remain hidden. The remaining unreleased SoundCloud items are not published yet.

## Future plans

Held back from Listen and the public catalog. Their names and paths are redacted here. The six `noindex` templates remain in the repo, unlinked and excluded from search, RSS, `sitemap.xml` and the human sitemap until they are restored.

## Asset ledger

| Slot | Page | Ratio / size | Filename | Notes |
|---|---|---|---|---|
| Favicon | all pages | 32×32 + 180×180 | `assets/images/favicon.svg` | Apple touch icon pending |
| Social share card | all pages | 1200×630 | `assets/images/og-deadmanifesto.jpg` | Pending |
| Splash banner | `index.html` | 8:3, 1600×600 | `assets/images/splash-banner.jpg` | Pending |
| Artist portrait | Ginger Deadman, Bio | 3:4, 1200×1600 | `assets/images/ginger-deadman-portrait.jpg` | Pending |
| Album: oxox | Listen, album, tracks | 1:1, 500×500 | `assets/images/album-covers/oxox.jpg` | 55 KB |
| Album: mainframe | Listen, album, tracks | 1:1, 500×500 | `assets/images/album-covers/mainframe.jpg` | 62 KB |
| Album: Denial | Listen, album, tracks | 1:1, 500×500 | `assets/images/album-covers/denial.jpg` | 39 KB |
| Album: Unreal | Listen, album, tracks | 1:1, 640×640 | `assets/images/album-covers/unreal.jpg` | 177 KB |
| Album: Obliviability | Listen, album, tracks | 1:1, 512×512 | `assets/images/album-covers/obliviability.jpg` | 83 KB |
| Album: Obsolescence | Listen, album, tracks | 1:1, 1000×1000 | `assets/images/album-covers/obsolescence.jpg` | 337 KB, optimised 0.2.20 |
| Album: Club Foot | Listen, album, tracks | 1:1, 1000×1000 | `assets/images/album-covers/club-foot.jpg` | 125 KB, optimised 0.2.20 |
| Album: Flips | Listen, album, tracks | 1:1, 640×640 | `assets/images/album-covers/flips.jpg` | 269 KB |
| Album: Flips 2 | Listen, album | 1:1, 1920×1920 | `assets/images/album-covers/flips-2.jpg` | 73 KB |
| Gallery images | gallery pages | mixed | `assets/images/gallery/*` | Pending; keep hidden until supplied |

All release covers are clean 1:1 slots. The album and track covers are local. Fragment Mono and the streaming icons are self-hosted. There are no remote images on the public pages.

## Copy decisions

- **Voice:** first person for editorial pages; third person for biography copy. Direct, dry wit. No corporate register.
- **Contact email:** "Coming soon" until the domain and mailbox exist.
- **Contact socials:** keep the main Instagram (`ofwolfe`), YouTube, TikTok and RateYourMusic. LinkedIn is live. Steam, Xbox, PlayStation and EA sit in the same icon-and-link list. RSS is linked. The second YouTube and SoundCloud placeholders were removed in 0.2.22.
- **Shop:** retired. Historical changelog entries stay.
- **Gallery:** dark until images exist. No empty frames on the public site.
- **Lyrics:** track pages are live for confirmed lyric files. Java and Rigatoni Nosebleed (Flips), seven Obliviability tracks, four Obsolescence tracks and two Unreal tracks are published. The remaining lyrics stay in the vault workbench.
- **Streaming:** show only real links. The "URL coming soon" cards were removed in 0.2.20; a streaming section appears only when at least one real link exists. Flips and Obsolescence stream from Catbox; the newer tapes link to SoundCloud.
- **Music metadata:** oxox, mainframe, Denial, Unreal, Obliviability, Obsolescence, Club Foot, Flips and Flips 2 are the current catalog. Obliviability is typed Album. Flips 2 is typed Flips (Remix Collection) with tracks coming soon. Release and track pages are `noindex` and excluded from search, RSS and `sitemap.xml`.
- **Home:** the Listen card reads "tapes, flips and streaming links."
- **Ginger Deadman profile:** the lede is "Experimental stuff is cool."; the poem ends "Art can be free."
- **Listen:** the lede is "the deadmanifesto catalogue so far"; the Spotify follow button sits at the bottom, above the footer.
- **Tools:** every listed tool opens its official product page or Wikipedia in a new tab. Workspaces follows LLMs; Hardware is a placeholder until the list is supplied.
- **Career:** the four verified game covers/credits, six [redacted] cover placeholders and the full professional history are public. LinkedIn is the only professional link; the MobyGames link and the Steam/platform note were removed in 0.2.22. Listen, Bio and Contact buttons close the page. Exact roles and dates stay author-supplied.
- **Game titles:** use the official full titles in public copy: Helldivers 2, LEGO Horizon Adventures, Ravenbound and Call of the Wild: theAngler.
- **Images:** slots are labelled by ratio, not by missing-content warnings. Game covers are used on Career.
- **Manifesto:** the trimmed version is canonical. Version `1.0 — 8 November 2026` and the exact AI model list are live.
- **Privacy:** no analytics, cookies, ads, tracking pixels, third-party embeds, Google Fonts, SimpleIcons CDN or remote images. Browser storage is limited to `dm-mode`. GitHub Pages hosting logs are disclosed.
- **Search:** local static index only; no external search service and no query logging by us. Hidden pages, drafts, 404 and unfilled album pages are excluded.
- **RSS:** static changelog feed; no tracking pixels or unique identifiers.
- **Player:** skip back, scrub back, play, scrub forward, skip forward and autoplay. Typed seek accepts `0:00` and `0s`. Duration click toggles clock/total seconds. Popups are exactly `Skipped!`, `Rewind!`, `One track back.`, `Shut up!` and `Unmuted...`; play/pause, tracklist, volume, scrub, forward 10s and duration toggles do not show a popup.
- **Sitemap:** `/sitemap/` is a generated terminal-style tree of the 123 current live routes, with release groups open by default and held-back project templates and legacy routes omitted. It is `noindex` and linked from About. `sitemap.xml` remains the search-engine index.

## Backlog

- Wire audio for the new tapes when files or stable hosted URLs arrive. Catbox uploads currently fail from this environment.
- Finish the remaining lyrics.
- Add the splash image, artist portrait, EPK press photo/credit, OG share card and Apple touch icon.
- Confirm Denial's release credits and remaining streaming URLs.
- Add the contact email/domain.
- Add hardware to Tools and keep the tool links current.
- Decide the remaining tape candidates and the unreleased Unreal mix.
- Decide whether strict chronological ordering across Tapes/Flips matters, or whether separate sections are the intended order.
- Restore or rename the six held-back release and collaboration templates when confirmed.
- Final QA, accessibility and performance pass, then push and verify GitHub Pages.
