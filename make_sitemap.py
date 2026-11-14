#!/usr/bin/env python3
"""Build the human-readable sitemap pages from the public URL list and HTML tree."""

from __future__ import annotations

from html import escape, unescape
from pathlib import Path
import posixpath
import re

ROOT = Path(__file__).resolve().parent
SITE = "https://jackwolfe-git.github.io/deadmanifes.to"

TAPES = ["oxox", "mainframe", "denial", "unreal", "obliviability", "obsolescence"]
FLIPS = ["club-foot", "flips", "flips-2"]


def clean_text(fragment: str) -> str:
    text = unescape(re.sub(r"<[^>]+>", "", fragment))
    return " ".join(text.split())


def page_data(path: Path, rel: str) -> dict:
    source = path.read_text(encoding="utf-8", errors="replace")
    noindex = 'name="robots" content="noindex' in source
    label = ""
    match = re.search(r"<h1[^>]*>(.*?)</h1>", source, re.S | re.I)
    if match:
        label = clean_text(match.group(1))
    if not label:
        title = re.search(r"<title>(.*?)</title>", source, re.S | re.I)
        if title:
            label = clean_text(title.group(1))
            for separator in (" — ", " - "):
                if separator in label:
                    label = label.split(separator, 1)[0]
                    break
    if not label:
        label = rel

    if rel == "index.html":
        url = "/"
    elif rel.endswith("/index.html"):
        url = "/" + rel[: -len("index.html")]
    else:
        url = "/" + rel

    return {
        "rel": rel,
        "path": path,
        "url": url,
        "label": label,
        "noindex": noindex,
    }


def relative_url(url: str, prefix: str) -> str:
    if url == "/":
        return prefix
    return prefix + url.lstrip("/")


def is_track(rel: str) -> bool:
    parts = rel.split("/")
    return len(parts) == 5 and parts[:2] == ["music", "albums"] and parts[4] == "index.html"


def track_order(slug: str) -> list[str]:
    album = ROOT / "music" / "albums" / slug / "index.html"
    if not album.exists():
        return []
    source = album.read_text(encoding="utf-8", errors="replace")
    block = re.search(r'<ol class="tracklist">(.*?)</ol>', source, re.S | re.I)
    if not block:
        return []
    links = re.findall(r'<li><a href="([^"]+)"', block.group(1))
    ordered = []
    for link in links:
        rel = posixpath.normpath(
            posixpath.join(f"music/albums/{slug}", link, "index.html")
        )
        ordered.append(rel)
    return ordered


def status_tag(data: dict) -> str:
    if not data["noindex"]:
        return '<span class="sitemap-tag public">public</span>'
    return '<span class="sitemap-tag noindex">noindex</span>'


def link_item(data: dict, prefix: str, label: str | None = None) -> str:
    text = escape(label or data["label"])
    href = relative_url(data["url"], prefix)
    return f'<li><a href="{href}">{text}</a> {status_tag(data)}</li>'


def release_details(slug: str, pages: dict[str, dict], prefix: str) -> str:
    release_rel = f"music/albums/{slug}/index.html"
    release = pages.get(release_rel)
    if not release:
        return ""
    tracks = []
    for rel in track_order(slug):
        if rel in pages:
            tracks.append(rel)
    if not tracks:
        tracks = sorted(
            rel
            for rel in pages
            if is_track(rel) and rel.split("/")[2] == slug
        )
    count = len(tracks)
    summary_tag = status_tag(release)
    if count == 0:
        count_label = "no tracks"
    elif count == 1:
        count_label = "1 track"
    else:
        count_label = f"{count} tracks"
    rows = [
        link_item(release, prefix, "Release page"),
    ]
    rows.extend(link_item(pages[rel], prefix) for rel in tracks)
    return (
        '<li class="sitemap-release-item">'
        '<details class="sitemap-release" open>'
        f'<summary><span class="sitemap-folder">{escape(slug)}/</span> '
        f'<span class="sitemap-count">{count_label}</span> {summary_tag}</summary>'
        f'<ul>{"".join(rows)}</ul>'
        "</details>"
        "</li>"
    )


def group_folder(name: str, rows: list[str], kind: str = "") -> str:
    class_name = f" {kind}" if kind else ""
    return (
        f'<li class="sitemap-group{class_name}"><span class="sitemap-folder">{escape(name)}/</span>'
        f'<ul>{"".join(rows)}</ul></li>'
    )


def build_sitemap_page(pages: dict[str, dict]) -> str:
    root_rows = [
        link_item(pages["index.html"], "../", "Home"),
        link_item(pages["404.html"], "../", "404"),
    ]

    music_rows = [link_item(pages["music/index.html"], "../", "Listen")]
    tapes_rows = [release_details(slug, pages, "../") for slug in TAPES]
    flips_rows = [release_details(slug, pages, "../") for slug in FLIPS]
    music_rows.append(group_folder("tapes", tapes_rows))
    music_rows.append(group_folder("flips", flips_rows))

    ginger_rows = [
        link_item(pages["ginger-deadman/index.html"], "../", "Ginger Deadman"),
        link_item(pages["ginger-deadman/about/index.html"], "../", "About Ginger Deadman"),
        link_item(pages["ginger-deadman/about/bio/index.html"], "../", "Bio"),
    ]

    manifesto_rows = [
        link_item(pages["deadmanifesto/index.html"], "../", "deadmanifesto"),
        link_item(pages["deadmanifesto/manifesto/index.html"], "../", "Manifesto"),
        link_item(pages["deadmanifesto/career/index.html"], "../", "Career"),
    ]

    about_rows = [
        link_item(pages["about/index.html"], "../", "About"),
        link_item(pages["about/tools/index.html"], "../", "Tools"),
        link_item(pages["about/privacy/index.html"], "../", "Privacy"),
    ]

    tree = (
        '<ul class="sitemap-tree">'
        f'<li><span class="sitemap-folder">/</span><ul>{"".join(root_rows)}</ul></li>'
        f'{group_folder("music", music_rows)}'
        f'{group_folder("ginger-deadman", ginger_rows)}'
        f'{group_folder("deadmanifesto", manifesto_rows)}'
        f'{group_folder("contact", [link_item(pages["contact/index.html"], "../", "Contact")])}'
        f'{group_folder("about", about_rows)}'
        f'{group_folder("search", [link_item(pages["search/index.html"], "../", "Search")])}'
        f'{group_folder("sitemap", [link_item(pages["sitemap/index.html"], "../", "Sitemap")])}'
        "</ul>"
    )
    all_count = tree.count("<a href=")
    noindex_count = tree.count('</a> <span class="sitemap-tag noindex"')

    return page_shell(
        title="Sitemap",
        description="A generated terminal tree of the current live deadmanifesto routes, with held-back project templates and legacy routes omitted.",
        canonical=f"{SITE}/sitemap/",
        prefix="../",
        up="../about/index.html",
        bar_title="Sitemap",
        body=f"""
<main class="sitemap-page">
    <p><a href="../about/index.html">&larr; Back to About</a></p>
    <h1>Sitemap</h1>
    <p class="sitemap-intro">A generated terminal tree of the {all_count} current live routes. Held-back project templates and legacy routes are omitted. This page is <code>noindex</code>; crawlers should use <a href="../sitemap.xml">sitemap.xml</a>.</p>
    <p class="sitemap-legend"><span class="sitemap-tag public">public</span> indexable <span class="sitemap-tag noindex">noindex</span> linked but hidden from search</p>
    <div class="sitemap-term" role="region" aria-label="Current route tree">
        <div class="sitemap-term-bar"><span><span class="sitemap-dots" aria-hidden="true">&#9679; &#9679; &#9679;</span> deadmanifesto:/sitemap$</span><span>tree --current</span><span>{all_count} routes &middot; {noindex_count} noindex <span class="sitemap-cursor" aria-hidden="true">_</span></span></div>
        {tree}
    </div>
    <div class="sitemap-actions">
        <a class="bar-btn" href="../about/index.html">About</a>
    </div>
    <p class="muted sitemap-note">Generated from the HTML tree by <code>make_sitemap.py</code>. Regenerate after adding, removing or moving pages.</p>
</main>
""",
    )


def page_shell(
    *,
    title: str,
    description: str,
    canonical: str,
    prefix: str,
    up: str,
    bar_title: str,
    body: str,
) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, follow">
<meta name="description" content="{escape(description)}">
<link rel="canonical" href="{canonical}">
<meta property="og:site_name" content="deadmanifesto">
<meta property="og:type" content="website">
<meta property="og:title" content="{escape(title)} - deadmanifesto">
<meta property="og:description" content="{escape(description)}">
<meta property="og:url" content="{canonical}">
<meta property="og:locale" content="en_US">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="{escape(title)} - deadmanifesto">
<meta name="twitter:description" content="{escape(description)}">
<link rel="icon" type="image/svg+xml" href="{prefix}assets/images/favicon.svg">
<meta name="theme-color" content="#000000">
<title>{escape(title)} - deadmanifesto</title>
<link rel="stylesheet" href="{prefix}style.css?v=15">
<link rel="stylesheet" href="{prefix}assets/sitemap.css?v=2">
<link rel="alternate" type="application/rss+xml" title="deadmanifesto changelog" href="{SITE}/feed.xml">
</head>
<body id="top">
<header class="site-bar">
  <details class="bar-menu"><summary class="bar-btn">Menu</summary><ul>
            <li><a href="{prefix}index.html">Home</a></li>
            <li><a href="{prefix}music/index.html">Listen</a></li>
            <li><a href="{prefix}ginger-deadman/index.html">Ginger Deadman</a></li>
            <li><a href="{prefix}deadmanifesto/index.html">deadmanifesto</a></li>
            <li><a href="{prefix}deadmanifesto/career/index.html">Career</a></li>
            <li><a href="{prefix}contact/index.html">Contact</a></li>
            <li><a href="{prefix}about/index.html">About</a></li>
        </ul></details>
  <a class="bar-btn" href="{prefix}index.html">Home</a>
  <a class="bar-btn" href="{up}">Up</a>
  <a class="bar-btn" href="#top">Top</a>
  <span class="bar-title">{escape(bar_title)}</span>
<div class="bar-right"><button data-mode="dark" type="button" aria-label="Dark mode"></button><button data-mode="light" type="button" aria-label="Light mode"></button><button data-mode="orange" type="button" aria-label="Orange mode"></button></div>
</header>
{body}
<footer>
    <p>All Rights Reserved. &copy; deadmanifesto. MMXXVI</p>
    <p class="footer-links"><a href="{prefix}contact/">Contact</a> <span aria-hidden="true">&middot;</span> <a href="{prefix}about/#disclaimer">Disclaimer</a> <span aria-hidden="true">&middot;</span> <a href="{prefix}about/privacy/">Privacy</a></p>
    <p class="footer-privacy">No cookies or tracking.</p>
</footer>
<script src="{prefix}assets/theme.js?v=4" defer></script>
<script src="{prefix}assets/site-ui.js" defer></script>
</body>
</html>
"""


def main() -> None:
    pages = {}
    for path in sorted(ROOT.rglob("*.html")):
        rel = path.relative_to(ROOT).as_posix()
        pages[rel] = page_data(path, rel)

    # The generated page may not exist on the first run.
    pages.setdefault(
        "sitemap/index.html",
        {
            "rel": "sitemap/index.html",
            "path": ROOT / "sitemap/index.html",
            "url": "/sitemap/",
            "label": "Sitemap",
            "noindex": True,
        },
    )

    sitemap_html = build_sitemap_page(pages)

    sitemap_path = ROOT / "sitemap" / "index.html"
    sitemap_path.parent.mkdir(parents=True, exist_ok=True)
    sitemap_path.write_text(sitemap_html, encoding="utf-8")
    print(f"Wrote {sitemap_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
