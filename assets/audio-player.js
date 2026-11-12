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

    function makeTimeButton(element, attributeName) {
        if (element.tagName === 'BUTTON') {
            return element;
        }
        var button = document.createElement('button');
        button.type = 'button';
        button.className = (element.className ? element.className + ' ' : '') + 'audio-player-time-button';
        button.setAttribute(attributeName, '');
        button.textContent = element.textContent;
        element.replaceWith(button);
        return button;
    }

    currentEl = makeTimeButton(currentEl, 'data-audio-current');
    durationEl = makeTimeButton(durationEl, 'data-audio-duration');

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
    var durationWords = false;
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

    function parseTimeValue(value) {
        if (typeof value === 'number') {
            return isFinite(value) && value > 0 ? value : 0;
        }
        var text = String(value || '').trim();
        if (!text) {
            return 0;
        }
        if (/^\d+(?:\.\d+)?s?$/i.test(text)) {
            return Math.max(0, parseFloat(text));
        }
        var parts = text.split(':');
        if (parts.length < 2 || parts.length > 3) {
            return 0;
        }
        var total = 0;
        var index;
        for (index = 0; index < parts.length; index += 1) {
            var part = Number(parts[index]);
            if (!isFinite(part) || part < 0) {
                return 0;
            }
            total = (total * 60) + part;
        }
        return total;
    }

    function parseSeekInput(value) {
        var text = String(value || '').trim().toLowerCase();
        if (!text) {
            return null;
        }
        if (/^\d+(?:\.\d+)?s?$/.test(text)) {
            var seconds = parseFloat(text.replace(/s$/, ''));
            return isFinite(seconds) && seconds >= 0 ? seconds : null;
        }
        if (!/^\d{1,3}(?::\d{1,2}){1,2}$/.test(text)) {
            return null;
        }
        var parts = text.split(':').map(Number);
        var total = 0;
        var index;
        for (index = 0; index < parts.length; index += 1) {
            if (!isFinite(parts[index]) || parts[index] < 0) {
                return null;
            }
            if (index > 0 && parts[index] > 59) {
                return null;
            }
            total = (total * 60) + parts[index];
        }
        return total;
    }

    function formatDurationWords(value) {
        if (!isFinite(value) || value < 0) {
            return '0s';
        }
        return Math.floor(value) + 's';
    }

    function formatTimeDisplay(value) {
        if (!isFinite(value) || value < 0) {
            value = 0;
        }
        return durationWords ? formatDurationWords(value) : formatTime(value);
    }

    function formatDurationDisplay(value) {
        if (!isFinite(value) || value <= 0) {
            return durationWords ? '0s' : '0:00';
        }
        return formatTimeDisplay(value);
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

    var previousButton = document.createElement('button');
    previousButton.type = 'button';
    previousButton.className = 'audio-player-control audio-player-previous';
    previousButton.setAttribute('data-audio-previous', '');
    previousButton.setAttribute('aria-label', 'Previous track');
    previousButton.title = 'Previous track';
    previousButton.innerHTML = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M6 5v14"></path>' +
        '<path d="M18 6l-8 6 8 6z"></path>' +
        '</svg>';

    var nextButton = document.createElement('button');
    nextButton.type = 'button';
    nextButton.className = 'audio-player-control audio-player-next';
    nextButton.setAttribute('data-audio-next', '');
    nextButton.setAttribute('aria-label', 'Next track');
    nextButton.title = 'Next track';
    nextButton.innerHTML = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M18 5v14"></path>' +
        '<path d="M6 6l8 6-8 6z"></path>' +
        '</svg>';

    var backButton = document.createElement('button');
    backButton.type = 'button';
    backButton.className = 'audio-player-control audio-player-skip';
    backButton.setAttribute('data-audio-back', '');
    backButton.setAttribute('aria-label', 'Back 10 seconds');
    backButton.title = 'Back 10 seconds';
    backButton.innerHTML = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M4.5 11a7.5 7.5 0 1 1 2.2 5.3"></path>' +
        '<path d="M4.5 5.5v5.5H10"></path>' +
        '</svg>';

    var forwardButton = document.createElement('button');
    forwardButton.type = 'button';
    forwardButton.className = 'audio-player-control audio-player-skip';
    forwardButton.setAttribute('data-audio-forward', '');
    forwardButton.setAttribute('aria-label', 'Forward 10 seconds');
    forwardButton.title = 'Forward 10 seconds';
    forwardButton.innerHTML = '<svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M19.5 11a7.5 7.5 0 1 0-2.2 5.3"></path>' +
        '<path d="M19.5 5.5v5.5H14"></path>' +
        '</svg>';

    toggle.insertAdjacentElement('beforebegin', previousButton);
    toggle.insertAdjacentElement('beforebegin', backButton);
    toggle.insertAdjacentElement('afterend', forwardButton);
    forwardButton.insertAdjacentElement('afterend', nextButton);
    nextButton.insertAdjacentElement('afterend', autoplayToggle);

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

    var volumeIcon = player.querySelector('.audio-player-volume-icon');
    var muteButton = document.createElement('button');
    muteButton.type = 'button';
    muteButton.className = 'audio-player-mute';
    muteButton.setAttribute('data-audio-mute', '');
    muteButton.setAttribute('aria-label', 'Mute');
    muteButton.setAttribute('aria-pressed', 'false');
    muteButton.title = 'Mute';
    muteButton.innerHTML = '<span class="audio-player-mute-icon" aria-hidden="true">' +
        (volumeIcon ? volumeIcon.innerHTML : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h3l4-3v12l-4-3H4z"></path><path d="M15 8.5a5 5 0 0 1 0 7"></path><path d="M17.5 6a8.5 8.5 0 0 1 0 12"></path></svg>') +
        '</span>';
    if (volumeIcon) {
        volumeIcon.replaceWith(muteButton);
    } else {
        volumeWrap.insertBefore(muteButton, volumeWrap.firstChild);
    }

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

    var feedback = document.createElement('div');
    feedback.className = 'audio-player-feedback';
    feedback.setAttribute('aria-hidden', 'true');
    player.appendChild(feedback);
    var feedbackTimer = 0;

    var seekPopup = document.createElement('form');
    seekPopup.className = 'audio-player-seek-popup';
    seekPopup.hidden = true;
    seekPopup.setAttribute('role', 'dialog');
    seekPopup.setAttribute('aria-label', 'Seek to a specific time');
    seekPopup.innerHTML = '<label class="audio-player-seek-label" for="audio-player-seek-input">Seek to time</label>' +
        '<div class="audio-player-seek-row">' +
        '<input class="audio-player-seek-input" id="audio-player-seek-input" data-audio-seek-input type="text" autocomplete="off" spellcheck="false" placeholder="1:23 or 83" aria-describedby="audio-player-seek-error">' +
        '<button class="audio-player-seek-submit" type="submit">Go</button>' +
        '<button class="audio-player-seek-cancel" type="button" data-audio-seek-cancel aria-label="Cancel seek">Cancel</button>' +
        '</div>' +
        '<p class="audio-player-seek-error" id="audio-player-seek-error" data-audio-seek-error hidden></p>';
    player.appendChild(seekPopup);
    var seekInput = seekPopup.querySelector('[data-audio-seek-input]');
    var seekError = seekPopup.querySelector('[data-audio-seek-error]');
    var seekCancel = seekPopup.querySelector('[data-audio-seek-cancel]');
    var seekPopupOpen = false;

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

    function showFeedback(message) {
        announce(message);
        feedback.textContent = message;
        feedback.classList.add('is-visible');
        window.clearTimeout(feedbackTimer);
        feedbackTimer = window.setTimeout(function () {
            feedback.classList.remove('is-visible');
        }, 1500);
    }

    function openSeekPopup() {
        var duration = currentDuration();
        if (!duration) {
            announce('Audio not ready yet.');
            return;
        }
        if (popupOpen) {
            closePopup(false);
        }
        seekPopupOpen = true;
        seekPopup.hidden = false;
        seekError.hidden = true;
        seekError.textContent = '';
        seekInput.removeAttribute('aria-invalid');
        feedback.classList.remove('is-visible');
        var current = isFinite(audio.currentTime) && audio.currentTime > 0 ? audio.currentTime : 0;
        seekInput.value = formatTimeDisplay(current);
        window.requestAnimationFrame(function () {
            seekInput.focus();
            seekInput.select();
        });
    }

    function closeSeekPopup(restoreFocus) {
        if (!seekPopupOpen) {
            return;
        }
        seekPopupOpen = false;
        seekPopup.hidden = true;
        if (restoreFocus) {
            currentEl.focus();
        }
    }

    function submitSeek() {
        var duration = currentDuration();
        if (!duration) {
            announce('Audio not ready yet.');
            closeSeekPopup(false);
            return;
        }
        var target = parseSeekInput(seekInput.value);
        if (target === null || target > duration) {
            seekError.textContent = target === null ? 'Enter a time like 1:23 or 83.' : 'Enter a time within the track length.';
            seekError.hidden = false;
            seekInput.setAttribute('aria-invalid', 'true');
            seekInput.focus();
            seekInput.select();
            return;
        }
        audio.currentTime = target;
        updateTime();
        closeSeekPopup(true);
    }

    function setMuteButtonState() {
        muteButton.setAttribute('aria-pressed', audio.muted ? 'true' : 'false');
        muteButton.title = audio.muted ? 'Unmute' : 'Mute';
        muteButton.setAttribute('aria-label', audio.muted ? 'Unmute' : 'Mute');
    }

    function durationText() {
        return formatDurationDisplay(currentDuration());
    }

    function updateTimeButtonLabels() {
        var current = isFinite(audio.currentTime) && audio.currentTime > 0 ? audio.currentTime : 0;
        currentEl.title = 'Seek to a specific time';
        currentEl.setAttribute('aria-label', 'Current time ' + formatTimeDisplay(current) + '. Seek to a specific time.');
        durationEl.title = durationWords ? 'Show duration as 0:00' : 'Show duration in seconds';
        durationEl.setAttribute('aria-label', 'Duration ' + durationText() + '. ' + durationEl.title + '.');
    }

    function currentDuration() {
        if (isFinite(audio.duration) && audio.duration > 0) {
            return audio.duration;
        }
        return parseTimeValue(state.duration);
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

    function currentPreviousLink() {
        return document.querySelector('.track-nav a[aria-label^="Previous track"]');
    }

    function getPrevious() {
        if (state.playlist && state.currentIndex >= 0) {
            var previous = state.playlist.tracks[state.currentIndex - 1];
            if (previous) {
                return { track: previous, url: trackPage(previous) };
            }
            return null;
        }
        var link = currentPreviousLink();
        if (link) {
            return { track: null, url: new URL(link.href, window.location.href).href };
        }
        return null;
    }

    function syncTrackButtons() {
        previousButton.disabled = !getPrevious();
        nextButton.disabled = !getNext();
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
        syncTrackButtons();
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

    function albumPageHref() {
        if (!state.albumSlug) {
            return '';
        }
        try {
            return new URL('music/albums/' + state.albumSlug + '/', siteRoot).href;
        } catch (error) {
            return '';
        }
    }

    function renderPopupAlbum() {
        if (!popupAlbum) {
            return;
        }
        var label = state.album || 'Current track';
        var href = albumPageHref();
        popupAlbum.textContent = '';
        if (!href) {
            popupAlbum.textContent = label;
            return;
        }
        var link = document.createElement('a');
        link.href = href;
        link.textContent = label;
        link.className = 'audio-player-popup-album-link';
        link.setAttribute('aria-label', 'Open the ' + label + ' album page');
        link.addEventListener('click', function () {
            closePopup(false);
        });
        popupAlbum.appendChild(link);
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
        toggle.title = audio.paused ? 'Play' : 'Pause';
        seek.setAttribute('aria-label', 'Seek ' + state.title);
        durationEl.textContent = durationText();
        updateTimeButtonLabels();
        renderPopupAlbum();
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
        var position = isFinite(audio.currentTime) && audio.currentTime > 0 ? audio.currentTime : 0;
        popupPosition.textContent = formatTimeDisplay(position) + ' / ' + durationText();
    }

    function updateTime() {
        var duration = currentDuration();
        var current = isFinite(audio.currentTime) && audio.currentTime > 0 ? audio.currentTime : 0;
        currentEl.textContent = formatTimeDisplay(current);
        durationEl.textContent = durationText();
        updateTimeButtonLabels();

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
        durationEl.textContent = durationText();
        backButton.disabled = !duration;
        forwardButton.disabled = !duration;
        if (duration) {
            seek.disabled = false;
            player.dataset.ready = 'true';
            player.dataset.loading = 'false';
            hint.textContent = '';
        }
    }

    function setVolume(value) {
        var next = Math.max(0, Math.min(1, Number(value) || 0));
        audio.volume = next;
        if (next > 0 && audio.muted) {
            audio.muted = false;
        }
        setMuteButtonState();
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
            currentEl.textContent = formatTimeDisplay(0);
            durationEl.textContent = durationText();
            hint.textContent = 'loading';
            seek.disabled = true;
            backButton.disabled = true;
            forwardButton.disabled = true;
            seek.value = '0';
            seek.setAttribute('aria-valuetext', '0:00 of ' + durationText());
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
        renderPopupAlbum();
        popupContext.textContent = state.track ? 'Track ' + state.track + (state.total ? ' of ' + state.total : '') : 'Now playing';
        updatePositionLine();

        var next = getNext();
        popupUpNext.textContent = '';
        if (next && next.track) {
            popupUpNext.appendChild(document.createTextNode('Up next: '));
            var nextLink = document.createElement('a');
            nextLink.href = trackPage(next.track);
            nextLink.textContent = next.track.title || 'Next track';
            nextLink.className = 'audio-player-popup-upnext-link';
            nextLink.setAttribute('data-audio-play', '');
            nextLink.setAttribute('aria-label', 'Play and open ' + (next.track.title || 'next track'));
            nextLink.addEventListener('click', function () {
                closePopup(false);
            });
            popupUpNext.appendChild(nextLink);
            if (autoplay) {
                popupUpNext.appendChild(document.createTextNode(' · Autoplay on'));
            }
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
            link.className = 'audio-player-popup-track';
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

            if (index === state.currentIndex) {
                var openLink = document.createElement('a');
                openLink.className = 'audio-player-popup-open';
                openLink.href = trackPage(track);
                openLink.textContent = 'Page';
                openLink.setAttribute('data-audio-open-page', '');
                openLink.setAttribute('aria-label', 'Open the ' + (track.title || 'current track') + ' page');
                openLink.addEventListener('click', function () {
                    closePopup(false);
                });
                item.appendChild(openLink);
            }

            popupList.appendChild(item);
        });
    }

    function openPopup() {
        if (popupOpen) {
            return;
        }
        closeSeekPopup(false);
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
                window.SiteRouter.navigate(page, { play: true, track: true, fromAutoplay: true });
            } else {
                window.location.assign(page);
            }
        } else if (next.url) {
            if (window.SiteRouter && typeof window.SiteRouter.navigate === 'function') {
                window.SiteRouter.navigate(next.url, { play: true, track: true, fromAutoplay: true });
            } else {
                var target = new URL(next.url, window.location.href);
                target.searchParams.set('autoplay', '1');
                window.location.assign(target.href);
            }
        }
        return true;
    }

    function goToPrevious() {
        var previous = getPrevious();
        if (!previous) {
            return false;
        }
        if (previous.track) {
            var page = trackPage(previous.track);
            updatePlayerForTrack(trackFromPlaylist(previous.track, page), { play: true });
            if (window.SiteRouter && typeof window.SiteRouter.navigate === 'function') {
                window.SiteRouter.navigate(page, { play: true, track: true });
            } else {
                window.location.assign(page);
            }
        } else if (previous.url) {
            if (window.SiteRouter && typeof window.SiteRouter.navigate === 'function') {
                window.SiteRouter.navigate(previous.url, { play: true, track: true });
            } else {
                window.location.assign(previous.url);
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
        updatePlayerForTrack(trackFromPlaylist(track, trackPage(track)), { play: true });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Escape') {
            return;
        }
        if (seekPopupOpen) {
            closeSeekPopup(true);
            return;
        }
        if (popupOpen) {
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

    document.addEventListener('click', function (event) {
        if (!seekPopupOpen) {
            return;
        }
        if (seekPopup.contains(event.target) || currentEl.contains(event.target)) {
            return;
        }
        closeSeekPopup(false);
    });

    document.addEventListener('site:pagechange', function () {
        closePopup(false);
        closeSeekPopup(false);
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

    previousButton.addEventListener('click', function () {
        if (goToPrevious()) {
            showFeedback('One track back.');
        }
    });

    nextButton.addEventListener('click', function () {
        if (advanceToNext()) {
            showFeedback('Skipped!');
        }
    });

    backButton.addEventListener('click', function () {
        var duration = currentDuration();
        if (!duration) {
            announce('Audio not ready yet.');
            return;
        }
        audio.currentTime = Math.max(0, audio.currentTime - 10);
        updateTime();
        showFeedback('Rewind!');
    });

    forwardButton.addEventListener('click', function () {
        var duration = currentDuration();
        if (!duration) {
            announce('Audio not ready yet.');
            return;
        }
        audio.currentTime = Math.min(duration, audio.currentTime + 10);
        updateTime();
    });

    muteButton.addEventListener('click', function () {
        audio.muted = !audio.muted;
        setMuteButtonState();
        if (audio.muted) {
            showFeedback('Shut up!');
        } else {
            showFeedback('Unmuted...');
        }
    });

    currentEl.addEventListener('click', function () {
        if (seekPopupOpen) {
            closeSeekPopup(true);
        } else {
            openSeekPopup();
        }
    });

    seekPopup.addEventListener('submit', function (event) {
        event.preventDefault();
        submitSeek();
    });

    seekCancel.addEventListener('click', function () {
        closeSeekPopup(true);
    });

    seekInput.addEventListener('input', function () {
        seekError.hidden = true;
        seekError.textContent = '';
        seekInput.removeAttribute('aria-invalid');
    });

    durationEl.addEventListener('click', function () {
        durationWords = !durationWords;
        updateTime();
        announce(durationWords ? 'Time shown in seconds.' : 'Time shown as minutes and seconds.');
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
        currentEl.textContent = formatTimeDisplay(target);
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
        toggle.title = 'Pause';
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
        toggle.title = 'Play';
        if (!audio.ended) {
            announce('Paused ' + state.title + '.');
        }
    });

    audio.addEventListener('ended', function () {
        player.dataset.state = 'paused';
        player.dataset.loading = 'false';
        toggle.setAttribute('aria-label', 'Play ' + state.title);
        toggle.title = 'Play';
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
        backButton.disabled = true;
        forwardButton.disabled = true;
        hint.textContent = 'audio unavailable';
        toggle.title = 'Audio unavailable';
        toggle.setAttribute('aria-label', 'Play ' + state.title);
        durationEl.textContent = formatDurationDisplay(0);
        seek.setAttribute('aria-valuetext', 'Audio unavailable');
        announce('Audio unavailable.');
    });

    player.dataset.state = 'paused';
    player.dataset.ready = state.src ? 'false' : 'false';
    seek.disabled = true;
    backButton.disabled = true;
    forwardButton.disabled = true;
    seek.setAttribute('aria-valuetext', '0:00 of ' + durationText());
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
