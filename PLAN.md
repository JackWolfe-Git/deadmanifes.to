# Launch-prep plan

Branch: `launch-prep`\
Started: 7 November 2026\
Updated: 8 November 2026

## Decisions

- Manifesto: keep the trimmed draft; remove the draft marker and author-only question blocks. Version `1.1 · 8 November 2026` and the exact AI model list are public.
- WIP: unlink, `noindex`, coming-soon panel; files kept. Hidden pages stay hidden.
- Shop: delete entirely; future merch gets a new name and a new page. Historical changelog entries stay. The 0.1.5 public build is live with no shop links.
- Contact email: "Coming soon" until the domain and mailbox exist. No `mailto:`.
- Contact socials: main Instagram (`ofwolfe`), YouTube, TikTok, RateYourMusic and LinkedIn are live. RSS is linked. Second YouTube and SoundCloud are visible placeholders until URLs exist. The contact page is an icon-and-link list with email coming soon at the end; the extra Instagram accounts are removed.
- Domain: stay on `jackwolfe-git.github.io/deadmanifes.to` for now.
- Music metadata: keep the fields in `content.md` under Author input; the author fills them.
- Track pages: the 2021 Flips (Remix Collection) tracklist is public with 27 named `noindex` track pages; titles stay verbatim, while track 10's URL drops the explicit word. Java and Rigatoni Nosebleed have lyrics; the other 25 Flips lyrics and all track lengths remain TBC. Obliviability has 14 tracks with 7 lyric pages, and Obsolescence has 10 tracks with 4 lyric pages. The remaining lyric mappings live in the vault workbench, not on the public site.
- Album pages: six public release templates (Obsolescence, Obliviability, Unreal and the Flips series) are linked from Listen, but `noindex` and excluded from search, RSS and the sitemap until credits and remaining metadata exist. Obliviability and Obsolescence now have track counts and partial lyrics; year, type, credits and streaming remain TBC. Orange, Obstinancy, Obliquity and the three collaboration templates are held back under Future plans.
- Images: build slots and the ledger now; gather assets later. The full image layer is `0.2.0`.
- Public copy: verified facts only; unmet fields live under Author input in `content.md`.
- Game credits: the four verified titles are public on Games and Career; exact roles and dates stay author-supplied.
- Game title styling: use official full titles — Helldivers 2, LEGO Horizon Adventures, Ravenbound, Call of the Wild: theAngler. "HD2" is a shorthand; "theAngler" is the official styling of that title.
- Games platform cards: Xbox link and PlayStation username are on Games only; PSN is text only, no link.
- Identity: publish the confirmed name, pronouns, location, birth date, dynamic Europe/London age and `TBC` pronunciation/Greek transliteration. Do not invent the missing fields.
- Press: the confirmed factual bio is live and ends `More soon.` Press quote, photo, photo credit and press contact are `TBC` placeholders.
- Privacy: no analytics, cookies, ads, tracking pixels, third-party embeds, Google Fonts, SimpleIcons CDN or remote images. Browser storage is limited to `dm-mode`. GitHub Pages hosting logs are disclosed. No consent banner is needed because there are no non-essential cookies or trackers.
- Search: local static index only; no external service and no query logging by us. The query appears in the URL and may appear in hosting logs. Hidden pages, drafts, 404 and unfilled album pages are excluded.
- RSS: static changelog feed; no tracking pixels or unique identifiers. Linked from Contact and the public page heads.
- Fonts and icons: self-host Fragment Mono and the local SVGs; no third-party runtime requests.
- Versioning: `0.1.x` launch-prep, `0.2.0` image layer, `1.0.0` public launch.
- Changelog: one entry per shipped change; historical entries retained.
- `content.md`: editorial map and asset ledger, not a copy source.

## Work queue

- [x] 0.1.0 Stabilise, keep manifesto, adopt versioned editorial map
- [x] 0.1.1 Retire the shop everywhere
- [x] 0.1.2 Hide the WIP surface and clean links
- [x] 0.1.3 Splash rewrite and global polish (meta, OG, favicon, 404, sitemap)
- [x] 0.1.4 Content finish (music, games, career, Ginger Deadman, press copy)
- [x] 0.1.5 Restore game credits, standardise game titles, fix menu button and clean contact socials
- [x] 0.1.5 Deploy to `main` and verify GitHub Pages
- [ ] 0.1.6 Content, privacy, search, RSS, Flips track pages, initial Obliviability/Obsolescence lyric pages and album-template batch; hold back Orange, Obstinancy, Obliquity and the collaborations
- [ ] 0.1.7 QA, deploy, verify GitHub Pages
- [ ] Merge `launch-prep` into `main` for 0.1.6

## Open questions

- Domain name and registrar (deferred).
- Contact email address (needs domain).
- Press quote, press photo, photo credit and press contact.
- IPA and Greek transliteration.
- Games credit details and exact career roles.
- Career CV details.
- Remaining track counts, release years, credits and streaming links.
- Second YouTube and SoundCloud URLs.
- Remaining platform profile URLs.

## Future plans

Held back from Listen and the public catalog. Their `noindex` templates remain in the repo, unlinked and excluded from search, RSS and the sitemap until they are restored.

- Orange — album.
- Obstinancy — album.
- Obliquity — album.
- Metro House — collaboration.
- Cultus Ex Cultura — collaboration.
- Unapology — collaboration.

## Rules of engagement

- One shipped change per changelog entry.
- Changelog entry and site change ship in the same commit.
- Structural change → update robots and this plan.
- Public page change → update `search-index.json` when the page is indexable.
- No new dependencies without approval.
- Two-strike rule on failures; one-question rule on ambiguity.
- Evidence before "done": diff, status code, or screenshot.
