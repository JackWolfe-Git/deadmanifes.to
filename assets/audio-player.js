/* deadmanifesto — persistent floating audio player
   Vanilla JS, no dependencies, no cookies, no tracking, no storage. */
(function () {
    'use strict';

    var script = document.currentScript || document.querySelector('script[src*="audio-player.js"]');
    var scriptUrl = script && script.src
        ? script.src
        : new URL('assets/audio-player.js', window.location.href).href;
    var siteRoot = '/';
    try {
        siteRoot = new URL('../', scriptUrl).href;
    } catch (error) {
        siteRoot = new URL('/', window.location.href).href;
    }

    var player = document.querySelector('[data-audio-player]');
    if (!player) {
        window.SiteAudio = {
            hasPlayer: false,
            isPlaying: function () { return false; },
            syncFromDocument: function () { return false; }
        };
        return;
    }
    if (player.getAttribute('data-audio-enhanced') === 'true') {
        return;
    }
    player.setAttribute('data-audio-enhanced', 'true');

    var audio = player.querySelector('.audio-player-media');
    var toggle = player.querySelector('[data-audio-toggle]');
    var currentEl = player.querySelector('[data-audio-current]');
    var durationEl = player.querySelector('[data-audio-duration]');
    var hint = player.querySelector('[data-audio-hint]');
    var seekWrap = player.querySelector('.audio-player-seek-wrap');
    var seek = player.querySelector('[data-audio-seek]');
    var volumeWrap = player.querySelector('.audio-player-volume-slider');
    var volume = player.querySelector('[data-audio-volume]');
    var status = player.querySelector('[data-audio-status]');
    var inner = player.querySelector('.audio-player-inner');

    if (!audio || !toggle || !currentEl || !durationEl || !hint || !seekWrap || !seek || !volumeWrap || !volume || !status || !inner) {
        return;
    }

    var albumNames = {
        'club-foot': 'Club Foot',
        flips: 'Flips',
        obliviability: 'Obliviability',
        obsolescence: 'Obsolescence'
    };
    var playlistCache = {};
    var playlistRequests = {};
    var scrubbing = false;
    var autoplay = false;
    var attemptedInitialAutoplay = false;
    var initialAutoplay = new URLSearchParams(window.location.search).get('autoplay') === '1';
    var popupOpen = false;
    var state = readTrackFromElement(player, window.location.href);

    function pad2(value) {
        return value < 10 ? '0' + value : String(value);
    }

    function formatTime(value) {
        if (!isFinite(value) || value < 0) {
            return '--:--';
        }
        var total = Math.floor(value);
        var hours = Math.floor(total / 3600);
        var minutes = Math.floor((total % 3600) / 60);
        var seconds = total % 60;
        if (hours > 0) {
            return hours + ':' + pad2(minutes) + ':' + pad2(seconds);
        }
        return minutes + ':' + pad2(seconds);
    }

    function normalizeSrc(value) {
        if (!value) {
            return '';
        }
        try {
            return new URL(value, window.location.href).href;
        } catch (error) {
            return value;
        }
    }

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

    function albumSlugFromPage(value) {
        var path = pagePath(value);
        var match = path.match(/\/music\/albums\/([^/]+)\//i);
        return match ? match[1].toLowerCase() : '';
    }

    function albumTitleFromSlug(slug) {
        if (!slug) {
            return '';
        }
        if (albumNames[slug]) {
            return albumNames[slug];
        }
        return slug.replace(/-/g, ' ').replace(/\b[a-z]/g, function (letter) {
            return letter.toUpperCase();
        });
    }

    function readTrackFromElement(element, url) {
        var slug = (element.getAttribute('data-album-slug') || albumSlugFromPage(url)).toLowerCase();
        var title = (element.getAttribute('data-title') || '').trim();
        var album = (element.getAttribute('data-album') || '').trim();
        var track = parseInt(element.getAttribute('data-track'), 10);
        var total = parseInt(element.getAttribute('data-track-total'), 10);
        return {
            title: title || 'audio',
            src: normalizeSrc((element.getAttribute('data-src') || '').trim()),
            album: album || albumTitleFromSlug(slug),
            albumSlug: slug,
            track: isFinite(track) && track > 0 ? track : 0,
            total: isFinite(total) && total > 0 ? total : 0,
            duration: (element.getAttribute('data-duration') || '').trim(),
            page: pagePath(url)
        };
    }

    function trackPage(track) {
        if (!track) {
            return window.location.href;
        }
        if (track.page) {
            var value = String(track.page).replace(/^\/+/, '');
            try {
                return new URL(value, siteRoot).href;
            } catch (error) {
                return window.location.href;
            }
        }
        return window.location.href;
    }

    function trackFromPlaylist(track, page) {
        return {
            title: track.title || 'audio',
            src: normalizeSrc(track.src || ''),
            album: track.album || state.album,
            albumSlug: (track.albumSlug || state.albumSlug || '').toLowerCase(),
            track: parseInt(track.track, 10) || 0,
            total: parseInt(track.total, 10) || state.total || 0,
            duration: track.duration || '',
            page: pagePath(page || trackPage(track))
        };
    }

    var autoplayToggle = document.createElement('button');
    autoplayToggle.type = 'button';
    autoplayToggle.className = 'audio-player-autoplay';
    autoplayToggle.setAttribute('data-audio-autoplay', '');
    autoplayToggle.setAttribute('aria-label', 'Autoplay next track');
    autoplayToggle.setAttribute('aria-pressed', 'false');
    autoplayToggle.innerHTML = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M4.5 12a7.5 7.5 0 0 1 12.6-5.5"></path>' +
        '<path d="M20 4.5v4h-4"></path>' +
        '<path d="M19.5 12a7.5 7.5 0 0 1-12.6 5.5"></path>' +
        '<path d="M4 19.5v-4h4"></path>' +
        '<path d="m10.2 8.3 5.4 3.7-5.4 3.7z"></path>' +
        '</svg>';
    toggle.insertAdjacentElement('afterend', autoplayToggle);

    var tracklistToggle = document.createElement('button');
    tracklistToggle.type = 'button';
    tracklistToggle.className = 'audio-player-tracklist-toggle';
    tracklistToggle.setAttribute('data-audio-tracklist-toggle', '');
    tracklistToggle.setAttribute('aria-label', 'Album tracklist');
    tracklistToggle.setAttribute('aria-expanded', 'false');
    tracklistToggle.setAttribute('aria-controls', 'audio-player-tracklist-popup');
    tracklistToggle.innerHTML = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M4 6h11"></path>' +
        '<path d="M4 12h11"></path>' +
        '<path d="M4 18h7"></path>' +
        '<path d="m16 9 5 3-5 3z"></path>' +
        '</svg>';
    inner.appendChild(tracklistToggle);

    var popup = document.createElement('div');
    popup.className = 'audio-player-popup';
    popup.id = 'audio-player-tracklist-popup';
    popup.hidden = true;
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', 'Album tracklist');
    popup.innerHTML = '<div class="audio-player-popup-head">' +
        '<div class="audio-player-popup-heading">' +
        '<p class="audio-player-popup-kicker">Album tracklist</p>' +
        '<p class="audio-player-popup-album" data-audio-popup-album></p>' +
        '</div>' +
        '<button class="audio-player-popup-close" type="button" data-audio-popup-close aria-label="Close album tracklist">' +
        '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12"></path><path d="M18 6 6 18"></path></svg>' +
        '</button>' +
        '</div>' +
        '<p class="audio-player-popup-context" data-audio-popup-context></p>' +
        '<p class="audio-player-popup-position" data-audio-popup-position></p>' +
        '<p class="audio-player-popup-upnext" data-audio-popup-upnext></p>' +
        '<ol class="audio-player-popup-list" data-audio-popup-list></ol>' +
        '<p class="audio-player-popup-empty" data-audio-popup-empty hidden></p>';
    player.appendChild(popup);

    var popupBackdrop = document.createElement('div');
    popupBackdrop.className = 'audio-player-popup-backdrop';
    popupBackdrop.hidden = true;
    document.body.appendChild(popupBackdrop);

    var popupAlbum = popup.querySelector('[data-audio-popup-album]');
    var popupContext = popup.querySelector('[data-audio-popup-context]');
    var popupPosition = popup.querySelector('[data-audio-popup-position]');
    var popupUpNext = popup.querySelector('[data-audio-popup-upnext]');
    var popupList = popup.querySelector('[data-audio-popup-list]');
    var popupEmpty = popup.querySelector('[data-audio-popup-empty]');
    var popupClose = popup.querySelector('[data-audio-popup-close]');

    function announce(message) {
        status.textContent = '';
        window.setTimeout(function () {
            status.textContent = message;
        }, 30);
    }

    function currentDuration() {
        return (isFinite(audio.duration) && audio.duration > 0) ? audio.duration : 0;
    }

    function currentNextLink() {
        return document.querySelector('.track-nav a[aria-label^="Next track"]');
    }

    function getNext() {
        if (state.playlist && state.currentIndex >= 0) {
            var next = state.playlist.tracks[state.currentIndex + 1];
            if (next) {
                return { track: next, url: trackPage(next) };
            }
            return null;
        }
        var link = currentNextLink();
        if (link) {
            return { track: null, url: new URL(link.href, window.location.href).href };
        }
        return null;
    }

    function setAutoplay(enabled, silent) {
        autoplay = Boolean(enabled);
        autoplayToggle.setAttribute('aria-pressed', autoplay ? 'true' : 'false');
        player.dataset.autoplay = autoplay ? 'true' : 'false';
        if (!silent) {
            announce(autoplay ? 'Autoplay on. The next track will play when this track ends.' : 'Autoplay off.');
        }
        renderPopup();
    }

    function syncAutoplayAvailability() {
        var next = getNext();
        var available = Boolean(next);
        autoplayToggle.disabled = !available;
        if (available) {
            autoplayToggle.title = autoplay ? 'Autoplay on' : 'Autoplay next track';
            autoplayToggle.setAttribute('aria-label', autoplay ? 'Autoplay on, press to turn off' : 'Autoplay next track');
        } else {
            autoplayToggle.title = 'No next track';
            autoplayToggle.setAttribute('aria-label', 'Autoplay unavailable, no next track');
            if (autoplay) {
                setAutoplay(false, true);
            }
        }
    }

    function updateLabels() {
        player.setAttribute('data-title', state.title);
        player.setAttribute('data-album', state.album || '');
        player.setAttribute('data-album-slug', state.albumSlug || '');
        player.setAttribute('data-track', state.track ? String(state.track) : '');
        player.setAttribute('data-track-total', state.total ? String(state.total) : '');
        player.setAttribute('data-duration', state.duration || '');
        player.setAttribute('aria-label', state.title + ' audio player');
        toggle.setAttribute('aria-label', (audio.paused ? 'Play ' : 'Pause ') + state.title);
        seek.setAttribute('aria-label', 'Seek ' + state.title);
        durationEl.textContent = currentDuration() ? formatTime(currentDuration()) : (state.duration || '--:--');
        if (popupAlbum) {
            popupAlbum.textContent = state.album || 'Current track';
        }
    }

    function setSeekVisual(ratio) {
        var safe = Math.max(0, Math.min(1, ratio || 0));
        seekWrap.style.setProperty('--ap-progress', (safe * 100).toFixed(2) + '%');
    }

    function updateBuffered() {
        var length = audio.buffered ? audio.buffered.length : 0;
        var duration = currentDuration();
        var ratio = 0;
        if (!duration || !length) {
            seekWrap.style.setProperty('--ap-buffered', '0%');
            return;
        }
        try {
            ratio = Math.min(1, audio.buffered.end(length - 1) / duration);
        } catch (error) {
            ratio = 0;
        }
        seekWrap.style.setProperty('--ap-buffered', (Math.max(0, ratio) * 100).toFixed(2) + '%');
    }

    function updatePositionLine() {
        if (!popupPosition) {
            return;
        }
        var duration = currentDuration();
        var position = isFinite(audio.currentTime) && audio.currentTime > 0 ? audio.currentTime : 0;
        popupPosition.textContent = formatTime(position) + ' / ' + (duration ? formatTime(duration) : (state.duration || '--:--'));
    }

    function updateTime() {
        var duration = currentDuration();
        var current = isFinite(audio.currentTime) && audio.currentTime > 0 ? audio.currentTime : 0;
        currentEl.textContent = formatTime(current);
        durationEl.textContent = duration ? formatTime(duration) : (state.duration || '--:--');

        if (!scrubbing && duration) {
            var ratio = Math.min(1, current / duration);
            seek.value = String(Math.round(ratio * 1000));
            setSeekVisual(ratio);
            seek.setAttribute('aria-valuetext', formatTime(current) + ' of ' + formatTime(duration));
        }
        updatePositionLine();
    }

    function syncDuration() {
        var duration = currentDuration();
        if (duration) {
            durationEl.textContent = formatTime(duration);
            seek.disabled = false;
            player.dataset.ready = 'true';
            player.dataset.loading = 'false';
            hint.textContent = '';
            if (toggle.hasAttribute('title')) {
                toggle.removeAttribute('title');
            }
        } else {
            durationEl.textContent = state.duration || '--:--';
        }
    }

    function setVolume(value) {
        var next = Math.max(0, Math.min(1, Number(value) || 0));
        audio.volume = next;
        volume.value = String(next);
        volumeWrap.style.setProperty('--ap-volume', (next * 100).toFixed(0) + '%');
        volume.setAttribute('aria-valuetext', Math.round(next * 100) + ' percent');
    }

    function playAudio() {
        var promise = audio.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {
                announce('Playback was blocked. Press play to continue.');
            });
        }
    }

    function updatePlayerForTrack(track, options) {
        options = options || {};
        var source = normalizeSrc(track.src || '');
        if (!source) {
            return false;
        }
        player.removeAttribute('data-idle');
        document.body.classList.add('has-audio-player');
        var sameSource = source === state.src;
        var sameAlbum = (track.albumSlug || '') === state.albumSlug;

        state.title = track.title || state.title || 'audio';
        state.src = source;
        state.album = track.album || state.album;
        state.albumSlug = (track.albumSlug || state.albumSlug || '').toLowerCase();
        state.track = parseInt(track.track, 10) || 0;
        state.total = parseInt(track.total, 10) || state.total || 0;
        state.duration = track.duration || state.duration || '';
        state.page = track.page || pagePath(window.location.href);

        if (!sameSource) {
            audio.pause();
            audio.src = source;
            audio.load();
            player.dataset.ready = 'false';
            player.dataset.error = 'false';
            player.dataset.loading = 'true';
            currentEl.textContent = '0:00';
            durationEl.textContent = state.duration || '--:--';
            hint.textContent = 'loading';
            seek.disabled = true;
            seek.value = '0';
            seek.setAttribute('aria-valuetext', '0:00 of ' + (state.duration || '--:--'));
            setSeekVisual(0);
            seekWrap.style.setProperty('--ap-buffered', '0%');
        }

        if (!sameAlbum) {
            state.playlist = null;
            state.currentIndex = -1;
        }

        updateLabels();
        ensurePlaylist();
        syncAutoplayAvailability();
        renderPopup();
        updatePositionLine();

        if (options.play === true) {
            playAudio();
        } else if (options.play === undefined && !audio.paused) {
            playAudio();
        }
        return true;
    }

    function syncIndex() {
        var tracks = state.playlist && state.playlist.tracks ? state.playlist.tracks : [];
        var found = -1;
        var index;
        if (state.track) {
            for (index = 0; index < tracks.length; index += 1) {
                if (parseInt(tracks[index].track, 10) === state.track) {
                    found = index;
                    break;
                }
            }
        }
        if (found < 0) {
            for (index = 0; index < tracks.length; index += 1) {
                if (pagePath(trackPage(tracks[index])) === state.page) {
                    found = index;
                    break;
                }
            }
        }
        state.currentIndex = found;
    }

    function applyPlaylist(slug, data) {
        if (state.albumSlug !== slug) {
            return;
        }
        state.playlist = data && Array.isArray(data.tracks) ? data : { tracks: [] };
        state.playlistError = false;
        state.playlistLoading = false;
        syncIndex();
        syncAutoplayAvailability();
        renderPopup();
    }

    function ensurePlaylist() {
        var slug = state.albumSlug;
        if (!slug) {
            state.playlist = null;
            state.playlistError = true;
            renderPopup();
            return;
        }
        if (playlistCache[slug]) {
            applyPlaylist(slug, playlistCache[slug]);
            return;
        }
        if (playlistRequests[slug]) {
            state.playlistLoading = true;
            return;
        }

        state.playlistLoading = true;
        state.playlistError = false;
        renderPopup();
        var url = new URL('playlists/' + encodeURIComponent(slug) + '.json', scriptUrl).href;
        playlistRequests[slug] = fetch(url, { credentials: 'same-origin' })
            .then(function (response) {
                if (!response.ok) {
                    throw new Error('Tracklist unavailable');
                }
                return response.json();
            })
            .then(function (data) {
                playlistCache[slug] = data;
                return data;
            });

        playlistRequests[slug].then(function (data) {
            applyPlaylist(slug, data);
        }).catch(function () {
            if (state.albumSlug === slug) {
                state.playlistLoading = false;
                state.playlistError = true;
                state.playlist = null;
                state.currentIndex = -1;
                syncAutoplayAvailability();
                renderPopup();
            }
        });
    }

    function renderPopup() {
        if (!popup) {
            return;
        }
        popupAlbum.textContent = state.album || 'Current track';
        popupContext.textContent = state.track ? 'Track ' + state.track + (state.total ? ' of ' + state.total : '') : 'Now playing';
        updatePositionLine();

        var next = getNext();
        var upNext = next && next.track ? next.track.title : (next ? 'Next track' : '');
        if (upNext) {
            popupUpNext.textContent = 'Up next: ' + upNext + (autoplay ? ' · Autoplay on' : '');
        } else {
            popupUpNext.textContent = state.playlist ? 'End of album' : 'Up next: —';
        }

        while (popupList.firstChild) {
            popupList.removeChild(popupList.firstChild);
        }

        if (state.playlistLoading) {
            popupEmpty.hidden = false;
            popupEmpty.textContent = 'Loading tracklist…';
            return;
        }
        if (!state.playlist) {
            popupEmpty.hidden = false;
            popupEmpty.textContent = state.playlistError ? 'Tracklist unavailable.' : 'Play a track to see its album.';
            return;
        }

        var tracks = state.playlist.tracks;
        if (!tracks.length) {
            popupEmpty.hidden = false;
            popupEmpty.textContent = 'No tracks listed.';
            return;
        }
        popupEmpty.hidden = true;

        tracks.forEach(function (track, index) {
            var item = document.createElement('li');
            var link = document.createElement('a');
            var number = document.createElement('span');
            var label = document.createElement('span');
            var length = document.createElement('span');

            link.href = trackPage(track);
            link.setAttribute('data-audio-track', String(index));
            link.setAttribute('data-audio-play', '');
            number.className = 'audio-player-popup-number';
            label.className = 'audio-player-popup-title';
            length.className = 'audio-player-popup-length';
            number.textContent = pad2(parseInt(track.track, 10) || (index + 1));
            label.textContent = track.title || 'Untitled';
            length.textContent = track.duration || '';

            if (index === state.currentIndex) {
                item.className = 'is-current';
                link.setAttribute('aria-current', 'true');
                label.textContent = track.title || 'Untitled';
            }

            link.appendChild(number);
            link.appendChild(label);
            link.appendChild(length);
            item.appendChild(link);
            popupList.appendChild(item);
        });
    }

    function openPopup() {
        if (popupOpen) {
            return;
        }
        popupOpen = true;
        popup.hidden = false;
        popupBackdrop.hidden = false;
        tracklistToggle.setAttribute('aria-expanded', 'true');
        ensurePlaylist();
        renderPopup();
        window.requestAnimationFrame(function () {
            popupClose.focus();
        });
    }

    function closePopup(restoreFocus) {
        if (!popupOpen) {
            return;
        }
        popupOpen = false;
        popup.hidden = true;
        popupBackdrop.hidden = true;
        tracklistToggle.setAttribute('aria-expanded', 'false');
        if (restoreFocus) {
            tracklistToggle.focus();
        }
    }

    function tryInitialAutoplay() {
        if (!initialAutoplay || attemptedInitialAutoplay || !state.src) {
            return;
        }
        if (audio.readyState < 1) {
            return;
        }
        attemptedInitialAutoplay = true;
        playAudio();
    }

    function advanceToNext() {
        var next = getNext();
        if (!next) {
            return false;
        }
        if (next.track) {
            var page = trackPage(next.track);
            updatePlayerForTrack(trackFromPlaylist(next.track, page), { play: true });
            if (window.SiteRouter && typeof window.SiteRouter.navigate === 'function') {
                window.SiteRouter.navigate(page, { play: true, fromAutoplay: true });
            } else {
                window.location.assign(page);
            }
        } else if (next.url) {
            if (window.SiteRouter && typeof window.SiteRouter.navigate === 'function') {
                window.SiteRouter.navigate(next.url, { play: true, fromAutoplay: true });
            } else {
                var target = new URL(next.url, window.location.href);
                target.searchParams.set('autoplay', '1');
                window.location.assign(target.href);
            }
        }
        return true;
    }

    function syncFromDocument(doc, url, options) {
        options = options || {};
        if (!options.track) {
            return false;
        }
        var nextPlayer = doc.querySelector('[data-audio-player]');
        if (!nextPlayer) {
            return false;
        }
        var track = readTrackFromElement(nextPlayer, url);
        track.page = pagePath(url);
        var play = options.play === undefined ? !audio.paused : Boolean(options.play);
        return updatePlayerForTrack(track, { play: play });
    }

    autoplayToggle.addEventListener('click', function () {
        if (autoplayToggle.disabled) {
            announce('No next track.');
            return;
        }
        setAutoplay(!autoplay);
    });

    tracklistToggle.addEventListener('click', function () {
        if (popupOpen) {
            closePopup(true);
        } else {
            openPopup();
        }
    });

    popupClose.addEventListener('click', function () {
        closePopup(true);
    });

    popupBackdrop.addEventListener('click', function () {
        closePopup(true);
    });

    popupList.addEventListener('click', function (event) {
        var link = event.target.closest('a[data-audio-track]');
        if (!link) {
            return;
        }
        event.preventDefault();
        var index = parseInt(link.getAttribute('data-audio-track'), 10);
        var track = state.playlist && state.playlist.tracks ? state.playlist.tracks[index] : null;
        if (!track) {
            return;
        }
        if (index === state.currentIndex) {
            closePopup(true);
            if (audio.paused) {
                playAudio();
            }
            return;
        }
        closePopup(false);
        var page = trackPage(track);
        if (window.SiteRouter && typeof window.SiteRouter.navigate === 'function') {
            window.SiteRouter.navigate(page, { play: true, source: 'tracklist' });
        } else {
            window.location.assign(page);
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && popupOpen) {
            closePopup(true);
        }
    });

    document.addEventListener('click', function (event) {
        if (!popupOpen) {
            return;
        }
        if (player.contains(event.target)) {
            return;
        }
        closePopup(false);
    });

    document.addEventListener('site:pagechange', function () {
        closePopup(false);
    });

    toggle.addEventListener('click', function () {
        if (!audio.getAttribute('src')) {
            announce('Audio source pending.');
            return;
        }
        if (audio.paused) {
            playAudio();
        } else {
            audio.pause();
        }
    });

    seek.addEventListener('input', function () {
        var duration = currentDuration();
        if (!duration) {
            return;
        }
        scrubbing = true;
        var ratio = Number(seek.value) / 1000;
        var target = ratio * duration;
        setSeekVisual(ratio);
        currentEl.textContent = formatTime(target);
        seek.setAttribute('aria-valuetext', formatTime(target) + ' of ' + formatTime(duration));
        try {
            audio.currentTime = target;
        } catch (error) {
            /* Ignore seek failures while metadata is settling. */
        }
    });

    seek.addEventListener('change', function () {
        scrubbing = false;
        updateTime();
    });

    volume.addEventListener('input', function () {
        setVolume(volume.value);
    });

    audio.addEventListener('loadedmetadata', function () {
        syncDuration();
        updateTime();
        updateBuffered();
        tryInitialAutoplay();
    });

    audio.addEventListener('durationchange', function () {
        syncDuration();
        updateTime();
    });

    audio.addEventListener('timeupdate', function () {
        updateTime();
        updateBuffered();
    });

    audio.addEventListener('progress', updateBuffered);
    audio.addEventListener('seeked', updateTime);

    audio.addEventListener('play', function () {
        player.dataset.state = 'playing';
        player.dataset.loading = 'false';
        toggle.setAttribute('aria-label', 'Pause ' + state.title);
        announce('Playing ' + state.title + '.');
    });

    audio.addEventListener('playing', function () {
        player.dataset.loading = 'false';
    });

    audio.addEventListener('waiting', function () {
        player.dataset.loading = 'true';
    });

    audio.addEventListener('canplay', function () {
        player.dataset.loading = 'false';
        tryInitialAutoplay();
    });

    audio.addEventListener('pause', function () {
        player.dataset.state = 'paused';
        player.dataset.loading = 'false';
        toggle.setAttribute('aria-label', 'Play ' + state.title);
        if (!audio.ended) {
            announce('Paused ' + state.title + '.');
        }
    });

    audio.addEventListener('ended', function () {
        player.dataset.state = 'paused';
        player.dataset.loading = 'false';
        toggle.setAttribute('aria-label', 'Play ' + state.title);
        updateTime();
        if (autoplay && advanceToNext()) {
            announce(state.title + ' ended. Playing the next track.');
            return;
        }
        announce(state.title + ' ended.');
    });

    audio.addEventListener('error', function () {
        player.dataset.state = 'paused';
        player.dataset.loading = 'false';
        player.dataset.ready = 'false';
        player.dataset.error = 'true';
        seek.disabled = true;
        hint.textContent = 'audio unavailable';
        toggle.title = 'Audio unavailable';
        toggle.setAttribute('aria-label', 'Play ' + state.title);
        durationEl.textContent = '--:--';
        seek.setAttribute('aria-valuetext', 'Audio unavailable');
        announce('Audio unavailable.');
    });

    player.dataset.state = 'paused';
    player.dataset.ready = state.src ? 'false' : 'false';
    seek.disabled = true;
    seek.setAttribute('aria-valuetext', '0:00 of ' + (state.duration || '--:--'));
    volume.setAttribute('aria-valuetext', '80 percent');
    setVolume(volume.value);
    updateLabels();

    if (state.src) {
        audio.src = state.src;
        audio.load();
    } else {
        hint.textContent = 'source pending';
        toggle.title = 'Audio source pending';
        seek.setAttribute('aria-valuetext', 'Audio source pending');
    }

    if (state.src) {
        ensurePlaylist();
    }
    if (initialAutoplay && getNext()) {
        setAutoplay(true, true);
    } else {
        initialAutoplay = false;
    }
    syncAutoplayAvailability();
    renderPopup();
    updatePositionLine();

    if (initialAutoplay && audio.readyState >= 1) {
        tryInitialAutoplay();
    }

    window.SiteAudio = {
        hasPlayer: true,
        isPlaying: function () {
            return !audio.paused && !audio.ended;
        },
        syncFromDocument: syncFromDocument,
        current: function () {
            return {
                title: state.title,
                album: state.album,
                track: state.track,
                total: state.total,
                page: state.page
            };
        },
        play: playAudio,
        pause: function () { audio.pause(); }
    };
})();
