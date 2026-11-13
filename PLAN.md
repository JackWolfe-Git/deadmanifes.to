# deadmanifesto ? running triage

Updated: 13 November 2026
Preview: `http://127.0.0.1:8765/`
Working tree: P0/P1 complete; full-route sitemap implemented and committed locally; `main` is 16 commits ahead of `origin/main`; live site is still at `fef2013`; push is on hold.
Last link check: 3,665 links, 0 missing. 149 HTML pages: 13 indexable, 136 `noindex`.

## P0 ? ship integrity

- [x] Finish the player patch: removed `inputmode="decimal"`, verified the mobile seek-first layout, exact popup strings, both seek formats and the no-popup controls; bumped `audio-player.css?v=8` and `audio-player.js?v=13`.
- [x] Add changelog and feed entries for 0.2.14?0.2.20: player polish, oxox, mainframe, Denial, Unreal 2017, Club Foot and the public cleanup.
- [x] Update `content.md` to the current catalog. Stale Unreal 2018 / `x Tracks` / Club Foot pending / Flips 2 pending notes are gone.
- [x] Fix Unreal meta copy: description, OG and Twitter now say five track pages.
- [x] Commit locally. Push and GitHub Pages verification remain intentionally on hold.

## P1 ? public cleanup

- [x] Remove the orphaned `unreal/hollywood` and `unreal/snowstorm` directories.
- [x] Remove the five orphaned `track-01.html` templates.
- [x] Resolve Flips 2: keep the empty 2023 placeholder, type it Flips (Remix Collection), and set tracks to Coming soon.
- [x] Resolve public TBC fields: Obliviability is Album, Flips 2 has type/tracks, Tools is filled, pronunciation/Greek are removed, and the Bio portrait caption is gone. The only public `TBC` text left is the historical 0.1.12 changelog line.
- [x] Replace the About planning notes placeholder with current phase and next-pass copy.
- [x] Update the stale Flips meta description.
- [x] Change the home Start Here Listen copy to ?tapes, flips?.
- [x] Decide the streaming-placeholder policy: remove every ?URL coming soon? card; keep a streaming section only when a real link exists.
- [x] Keep the 44 pending-lyrics track pages link-only and `noindex`; no new public lyric stubs.
- [x] Optimise the covers: `club-foot.jpg` is 1000?1000 / 125 KB and `obsolescence.jpg` is 1000?1000 / 337 KB.
- [x] Link the Java track page to both Flips and Obsolescence.

## P2 ? content and assets

- [ ] Lyrics backlog: Flips 25, Obliviability 7, Obsolescence 8, Unreal 3, plus the 41 pending new pages.
- [ ] Add the splash image, artist portrait, EPK press photo/credit, OG share card and Apple touch icon.
- [ ] Confirm Denial?s release credits and streaming URL.
- [ ] Add the contact email/domain and the second YouTube and SoundCloud URLs.
- [ ] Add gallery images and keep Tools current as the toolchain changes.
- [x] Add the full-route sitemap: a generated terminal-style `/sitemap/` tree of the current HTML routes, with release groups open by default and held-back project templates omitted. `make_sitemap.py` rebuilds it from the HTML tree, and About's useful links point to it. `sitemap.xml` remains the crawler index.
- [ ] Wire audio for the new tapes. Blocked on Catbox; decide between SoundCloud embeds and waiting for files.

## P3 ? later

- [ ] Decide whether strict chronological ordering across Tapes/Flips matters, or whether separate sections are the intended order.
- [ ] Decide the remaining tapes: Sketchbook, 2018, 2019?2020, 2021, 2022 and Unreal (flips 1hr mix).
- [ ] Restore or rename the held-back Orange, Obstinancy, Obliquity, Metro House, Cultus Ex Cultura and Unapology templates when confirmed.

## Done this pass

- Preview booted; Home, Listen, Club Foot, Java player and Bio render; link check clean.
- oxox, mainframe, Denial, Unreal 2017 and Club Foot pages are live locally; 99 track pages across nine releases.
- Club Foot has 27 tracks, dated 2019-2021, typed Flips (Remix Collection).
- Flips 2 is back to an empty placeholder.
- Player seek parsed `0:00`, `0s` and `1:23`; invalid input error works.
- Player popups verified: `Skipped!`, `Rewind!`, `One track back.`, `Shut up!`, `Unmuted...`; no popup for play, tracklist, duration toggle or forward 10s.
- Removed placeholder streaming cards across 99 pages; no streaming ?URL coming soon? cards remain.
- Removed orphan Unreal duplicates and five legacy `track-01.html` templates.
- Compressed the two oversized covers and cross-linked Java to both albums.
- Changelog and RSS now cover 0.2.14?0.2.21 at 13 November 2026.
- Added `/sitemap/` as a generated full-route terminal tree. It is `noindex`, expands release groups by default, omits held-back templates and is linked from About.


---

# 0.2 image-layer plan (historical)

Branch: `main`\
Live: `0.1.43` at `fef2013`\
Started: 10 November 2026\
Updated: 10 November 2026

## Position

- `0.1.43` is live on GitHub Pages; the working tree is clean.
- 100 HTML pages: 14 indexable, 86 `noindex` album, track, gallery and editorial pages.
- 2,183 local links and asset references checked; 0 missing.
- 0 images missing `alt` text.
- 10 placeholder image slots remain.
- 91 `TBC` fields across 30 pages; most sit on `noindex` pages.
- `0.2.x` is the image layer. `1.0.0` is the public launch.

## Triage

### P1 — public visual gaps

- Home hero splash, 8:3.
- Artist portrait, 3:4, used on Ginger Deadman and the EPK.
- EPK press photo and photo credit.
- Open Graph share card, 1200×630.
- Apple touch icon, 180×180.
- Optimise the oversized covers before adding more art:
  - `club-foot.png` — 2000×2000, 3.3 MB.
  - `obsolescence.png` — 1000×1000, 1.2 MB.

### P2 — gallery

- Outfits, gigs, food, wildlife, urban and nature stay dark and `noindex` until images exist.
- Do not publish empty frames.

### P3 — held-back release art

- Orange, Obstinancy, Obliquity, Metro House, Cultus Ex Cultura and Unapology covers.
- These can wait until the releases are restored and their metadata is confirmed.

### Housekeeping

- Remove the five orphaned `track-01.html` templates; nothing links to them.
- Add `width`/`height` and `loading` attributes to the remaining inline SVG icons.
- Repair the mojibake in the `content.md` asset ledger.
- Keep the hidden editorial `TODO` pages out of the image-layer release.

## Work queue

- [ ] `0.2.0` Lock the image pipeline: local formats, naming, sizes, compression and ledger fields.
- [ ] `0.2.1` Optimise the existing album and game covers; add the missing icon dimensions.
- [ ] `0.2.2` Generate the Apple touch icon and Open Graph share card from approved brand assets.
- [ ] `0.2.3` Add the public artist portrait and EPK press photo when supplied.
- [ ] `0.2.4` Add the homepage splash image when supplied.
- [ ] `0.2.5` Restore the gallery categories when their images and credits arrive.
- [ ] `0.2.6` Add held-back release covers when the releases return.
- [ ] `0.2.7` Image QA: crops, responsive sizes, dark/light contrast, lazy loading, file sizes, alt text and local links.
- [ ] `1.0.0` Public launch after the image layer and author-input fields are complete.

## Blockers

### Assets needed

- Artist portrait / EPK press photo.
- Press photo credit.
- Homepage splash image.
- Gallery images and descriptive alt text.
- Hidden-release covers, if they should land before launch.
- Confirmation that one portrait can serve the artist page and EPK.

### Metadata needed

- Club Foot type, tracklist and track count.
- Flips 2 type and track count.
- Obliviability type.
- Unreal track count, currently published as the literal `x Tracks`.
- Press quote and press contact.
- Pronunciation and Greek transliteration.
- Contact email and domain.
- Exact game-credit roles and career CV details.
- Remaining streaming links, second YouTube and SoundCloud URLs, and platform profiles.

## Decisions

- Images are self-hosted; no third-party runtime image requests.
- Do not invent images, credits or crops. Placeholders remain until assets are supplied.
- Preserve the existing visual language: 1:1 release art, 3:4 portrait, 8:3 splash, 1200×630 share card.
- Use one changelog entry per shipped feature.
- Public page changes update `search-index.json`; structural changes update robots and this plan.
- Keep gallery pages dark and `noindex` until they contain real images.
- The custom domain and mailbox stay deferred.

## Not in 0.2

- Editorial copy for services, ADHD guide, recipes, reviews, home studio, games blog and AI.
- Merch.
- Remaining lyrics.
- Domain migration.
- A redesign of the player or catalogue.

## Acceptance

- No public placeholder image slots remain.
- No public `TBC` field remains for a visual asset or image credit.
- Every image has descriptive alt text, dimensions and an appropriate loading strategy.
- No page ships an image over the agreed size budget.
- Gallery pages are either complete and indexed or still dark and excluded.
- `0.2.x` changelog entries match the shipped image work.
- Live GitHub Pages build verified after the final 0.2 push.
