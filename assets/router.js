/* deadmanifesto — lightweight same-origin page router
   Swaps <main> only so the persistent audio player keeps playing.
   No cookies, no tracking, no storage. */
(function () {
    'use strict';

    if (window.SiteRouter) {
        return;
    }

    var currentMain = document.querySelector('main');
    if (!currentMain) {
        return;
    }

    var navigationToken = 0;

    function absoluteUrl(value, baseUrl) {
        if (!value) {
            return '';
        }
        var trimmed = String(value).trim();
        if (!trimmed || trimmed.charAt(0) === '#' ||
            /^(?:data:|blob:|mailto:|tel:|javascript:)/i.test(trimmed)) {
            return '';
        }
        try {
            return new URL(trimmed, baseUrl).href;
        } catch (error) {
            return '';
        }
    }

    function absoluteSrcset(value, baseUrl) {
        if (!value) {
            return '';
        }
        return String(value).split(',').map(function (candidate) {
            var parts = candidate.trim().split(/\s+/);
            if (!parts.length || !parts[0] || /^(?:data:|blob:)/i.test(parts[0])) {
                return candidate.trim();
            }
            var resolved = absoluteUrl(parts[0], baseUrl);
            if (!resolved) {
                return candidate.trim();
            }
            parts[0] = resolved;
            return parts.join(' ');
        }).join(', ');
    }

    function absolutizeDocument(documentNode, baseUrl) {
        var attributes = [
            ['a[href]', 'href'],
            ['area[href]', 'href'],
            ['link[href]', 'href'],
            ['script[src]', 'src'],
            ['img[src]', 'src'],
            ['source[src]', 'src'],
            ['audio[src]', 'src'],
            ['video[src]', 'src'],
            ['video[poster]', 'poster'],
            ['iframe[src]', 'src'],
            ['form[action]', 'action'],
            ['object[data]', 'data']
        ];

        attributes.forEach(function (pair) {
            documentNode.querySelectorAll(pair[0]).forEach(function (element) {
                var resolved = absoluteUrl(element.getAttribute(pair[1]), baseUrl);
                if (resolved) {
                    element.setAttribute(pair[1], resolved);
                }
            });
        });

        documentNode.querySelectorAll('img[srcset], source[srcset]').forEach(function (element) {
            var resolved = absoluteSrcset(element.getAttribute('srcset'), baseUrl);
            if (resolved) {
                element.setAttribute('srcset', resolved);
            }
        });
    }

    // Freeze URLs before the History API changes the document depth. This keeps
    // header navigation, scripts and artwork stable across PJAX transitions.
    absolutizeDocument(document, window.location.href);

    function pagePath(value) {
        var url;
        try {
            url = new URL(value || window.location.href, window.location.href);
        } catch (error) {
            return '';
        }
        var path = url.pathname || '/';
        path = path.replace(/\/index\.html$/i, '/');
        if (path.charAt(path.length - 1) !== '/' && !/\.[a-z0-9]+$/i.test(path)) {
            path += '/';
        }
        return path;
    }

    function copyHead(nextDocument) {
        var title = nextDocument.querySelector('title');
        if (title) {
            document.title = title.textContent;
        }

        var selectors = [
            ['meta[name="description"]', 'content'],
            ['link[rel="canonical"]', 'href'],
            ['meta[property="og:title"]', 'content'],
            ['meta[property="og:description"]', 'content'],
            ['meta[property="og:url"]', 'content'],
            ['meta[name="twitter:title"]', 'content'],
            ['meta[name="twitter:description"]', 'content']
        ];

        selectors.forEach(function (pair) {
            var next = nextDocument.querySelector(pair[0]);
            if (!next) {
                return;
            }
            var current = document.head.querySelector(pair[0]);
            if (current) {
                current.setAttribute(pair[1], next.getAttribute(pair[1]) || '');
            } else {
                document.head.appendChild(next.cloneNode(true));
            }
        });
    }

    function copyBar(nextDocument, targetUrl) {
        var nextTitle = nextDocument.querySelector('.site-bar .bar-title');
        var currentTitle = document.querySelector('.site-bar .bar-title');
        if (nextTitle && currentTitle) {
            currentTitle.textContent = nextTitle.textContent;
        }

        var nextLinks = nextDocument.querySelectorAll('.site-bar a[href]');
        var currentLinks = document.querySelectorAll('.site-bar a[href]');
        if (nextLinks.length && nextLinks.length === currentLinks.length) {
            nextLinks.forEach(function (nextLink, index) {
                var currentLink = currentLinks[index];
                var href = nextLink.getAttribute('href');
                if (href) {
                    currentLink.setAttribute('href', href);
                }
                if (nextLink.hasAttribute('aria-current')) {
                    currentLink.setAttribute('aria-current', nextLink.getAttribute('aria-current'));
                } else {
                    currentLink.removeAttribute('aria-current');
                }
                if (nextLink.hasAttribute('title')) {
                    currentLink.setAttribute('title', nextLink.getAttribute('title'));
                } else {
                    currentLink.removeAttribute('title');
                }
            });
            return;
        }

        var targetPaths = {};
        nextDocument.querySelectorAll('.site-bar a[aria-current="page"]').forEach(function (link) {
            targetPaths[pagePath(new URL(link.getAttribute('href'), targetUrl).href)] = true;
        });
        document.querySelectorAll('.site-bar a[aria-current="page"]').forEach(function (link) {
            link.removeAttribute('aria-current');
        });
        if (Object.keys(targetPaths).length) {
            document.querySelectorAll('.site-bar a[href]').forEach(function (link) {
                if (targetPaths[pagePath(link.href)]) {
                    link.setAttribute('aria-current', 'page');
                }
            });
        }
    }

    function scriptKey(value) {
        try {
            var url = new URL(value, window.location.href);
            return url.origin + url.pathname + url.search;
        } catch (error) {
            return '';
        }
    }

    function loadMissingScripts(nextDocument, targetUrl) {
        var existing = {};
        document.querySelectorAll('script[src]').forEach(function (node) {
            var key = scriptKey(node.getAttribute('src'));
            if (key) {
                existing[key] = true;
            }
        });

        nextDocument.querySelectorAll('script[src]').forEach(function (node) {
            if (node.type && node.type !== 'text/javascript' && node.type !== 'module') {
                return;
            }
            var source;
            try {
                source = new URL(node.getAttribute('src'), targetUrl).href;
            } catch (error) {
                return;
            }
            var key = scriptKey(source);
            if (!key || existing[key]) {
                return;
            }
            var pathname = new URL(source).pathname;
            if (/\/audio-player\.js$/i.test(pathname) && window.SiteAudio && window.SiteAudio.hasPlayer) {
                return;
            }
            if (/\/router\.js$/i.test(pathname) && window.SiteRouter) {
                return;
            }
            var loader = document.createElement('script');
            loader.src = source;
            if (node.async) {
                loader.async = true;
            }
            if (node.defer) {
                loader.defer = true;
            }
            if (node.type) {
                loader.type = node.type;
            }
            loader.setAttribute('data-pjax-loaded', '');
            document.body.appendChild(loader);
            existing[key] = true;
        });
    }

    function closeMenu() {
        var menu = document.querySelector('.bar-menu[open]');
        if (menu) {
            menu.removeAttribute('open');
        }
    }

    function scrollToTarget(targetUrl) {
        if (targetUrl.hash) {
            var id = targetUrl.hash.slice(1);
            var element = id ? document.getElementById(id) : null;
            if (element) {
                element.scrollIntoView();
                return;
            }
        }
        window.scrollTo(0, 0);
    }

    function applyPage(nextDocument, targetUrl, options) {
        absolutizeDocument(nextDocument, targetUrl.href);

        var nextMain = nextDocument.querySelector('main');
        if (!nextMain) {
            return false;
        }

        currentMain.replaceWith(nextMain);
        currentMain = nextMain;

        document.body.className = nextDocument.body.className || '';
        if (document.querySelector('[data-audio-player]:not([data-idle="true"])')) {
            document.body.classList.add('has-audio-player');
        }

        copyHead(nextDocument);
        copyBar(nextDocument, targetUrl.href);

        if (options.history !== 'replace') {
            window.history.pushState({ pjax: true }, '', targetUrl.href);
        } else {
            window.history.replaceState({ pjax: true }, '', targetUrl.href);
        }

        if (window.SiteAudio && typeof window.SiteAudio.syncFromDocument === 'function') {
            window.SiteAudio.syncFromDocument(nextDocument, targetUrl.href, {
                play: options.play,
                fromAutoplay: Boolean(options.fromAutoplay)
            });
        }

        if (window.SiteUI && typeof window.SiteUI.refresh === 'function') {
            window.SiteUI.refresh();
        }

        loadMissingScripts(nextDocument, targetUrl.href);
        closeMenu();
        scrollToTarget(targetUrl);

        document.dispatchEvent(new CustomEvent('site:pagechange', {
            detail: { url: targetUrl.href }
        }));
        return true;
    }

    function navigate(url, options) {
        options = options || {};
        var targetUrl;
        try {
            targetUrl = new URL(url, window.location.href);
        } catch (error) {
            window.location.href = url;
            return;
        }

        if (targetUrl.origin !== window.location.origin ||
            (targetUrl.protocol !== 'http:' && targetUrl.protocol !== 'https:')) {
            window.location.href = targetUrl.href;
            return;
        }

        if (!options.history &&
            pagePath(targetUrl.href) === pagePath(window.location.href) &&
            targetUrl.search === window.location.search &&
            !targetUrl.hash) {
            window.scrollTo(0, 0);
            return;
        }

        var token = ++navigationToken;

        fetch(targetUrl.href, {
            credentials: 'same-origin',
            headers: { 'Accept': 'text/html' }
        }).then(function (response) {
            if (!response.ok) {
                throw new Error('Page unavailable');
            }
            var type = response.headers.get('content-type') || '';
            if (type && type.indexOf('text/html') === -1) {
                throw new Error('Not an HTML page');
            }
            return response.text();
        }).then(function (html) {
            if (token !== navigationToken) {
                return;
            }
            var nextDocument = new DOMParser().parseFromString(html, 'text/html');
            applyPage(nextDocument, targetUrl, options);
        }).catch(function () {
            if (token === navigationToken) {
                window.location.assign(targetUrl.href);
            }
        });
    }

    window.SiteRouter = {
        navigate: navigate,
        refresh: function () {
            currentMain = document.querySelector('main');
        }
    };

    window.addEventListener('popstate', function () {
        var playing = window.SiteAudio && typeof window.SiteAudio.isPlaying === 'function'
            ? window.SiteAudio.isPlaying()
            : false;
        navigate(window.location.href, {
            history: 'replace',
            play: playing,
            source: 'history'
        });
    });

    document.addEventListener('click', function (event) {
        if (event.defaultPrevented || event.button !== 0 ||
            event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
            return;
        }

        var link = event.target.closest('a[href]');
        if (!link || link.hasAttribute('download') || link.closest('[data-no-pjax]')) {
            return;
        }
        if (link.target && link.target !== '_self') {
            return;
        }

        var href = link.getAttribute('href');
        if (!href || href.charAt(0) === '#' || /^(?:mailto:|tel:|javascript:)/i.test(href)) {
            return;
        }

        var targetUrl;
        try {
            targetUrl = new URL(link.href, window.location.href);
        } catch (error) {
            return;
        }
        if (targetUrl.origin !== window.location.origin) {
            return;
        }
        if (targetUrl.protocol !== 'http:' && targetUrl.protocol !== 'https:') {
            return;
        }
        if (/\.(?:wav|mp3|m4a|aac|ogg|flac|zip|pdf|jpe?g|png|gif|svg|webp)$/i.test(targetUrl.pathname)) {
            return;
        }
        if (targetUrl.pathname === window.location.pathname &&
            targetUrl.search === window.location.search && targetUrl.hash) {
            return;
        }

        var isTrackLink = Boolean(link.closest('.tracklist') ||
            link.closest('.track-nav') ||
            link.hasAttribute('data-audio-play'));
        var playing = window.SiteAudio && typeof window.SiteAudio.isPlaying === 'function'
            ? window.SiteAudio.isPlaying()
            : false;

        event.preventDefault();
        navigate(targetUrl.href, {
            play: isTrackLink || playing,
            source: isTrackLink ? 'track-link' : 'link'
        });
    });
})();
