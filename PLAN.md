# Launch-prep plan

Branch: `launch-prep`  
Started: 7 November 2026

## Decisions

- Manifesto: keep the trimmed draft; remove the draft marker and author-only question blocks.
- WIP: unlink, `noindex`, coming-soon panel; files kept.
- Shop: delete entirely; future merch gets a new name and a new page.
- Contact email: "Coming soon" until the domain exists.
- Domain: stay on `jackwolfe-git.github.io/deadmanifes.to` for now.
- Music metadata: keep the fields; the author fills them.
- Images: build slots and the ledger now; gather assets later.
- Versioning: `0.1.x` launch-prep, `0.2.0` image layer, `1.0.0` public launch.
- Changelog: one entry per shipped change; historical entries retained.
- `content.md`: editorial map and asset ledger, not a copy source.

## Work queue

- [x] 0.1.0 Stabilise, keep manifesto, adopt versioned editorial map
- [x] 0.1.1 Retire the shop everywhere
- [x] 0.1.2 Hide the WIP surface and clean links
- [x] 0.1.3 Splash rewrite and global polish (meta, OG, favicon, 404, sitemap)
- [ ] 0.1.4 Content finish (contact, music metadata, career, games, Ginger Deadman)
- [ ] 0.1.5 Image slots and ledger verification
- [ ] 0.1.6 QA, deploy, verify GitHub Pages
- [ ] Merge `launch-prep` into `main`

## Open questions

- Domain name and registrar (deferred).
- Contact email address (needs domain).
- Bio copy for Ginger Deadman, About and EPK Bio.
- Games credit details.
- Career CV details.
- Track counts and release years for the discography.

## Rules of engagement

- One shipped change per changelog entry.
- Changelog entry and site change ship in the same commit.
- Structural change → update robots and this plan.
- No new dependencies without approval.
- Two-strike rule on failures; one-question rule on ambiguity.
- Evidence before "done": diff, status code, or screenshot.
