/* deadmanifesto - click-to-load SoundCloud player
   No SoundCloud request is made until the visitor presses the button. */
(function () {
    'use strict';

    var WIDGET_BASE = 'https://w.soundcloud.com/player/?url=';
    var prefs = window.SitePlayerPrefs;

    function soundcloudEnabled() {
        return !!(prefs && typeof prefs.has === 'function' && prefs.has('soundcloud'));
    }

    function buildWidget(url, title) {
        var iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '166';
        iframe.scrolling = 'no';
        iframe.frameBorder = 'no';
        iframe.allow = 'autoplay; encrypted-media';
        iframe.title = 'SoundCloud player for ' + title;
        iframe.src = WIDGET_BASE + encodeURIComponent(url) +
            '&auto_play=true&hide_related=true&show_comments=false&show_user=true' +
            '&show_reposts=false&show_teaser=false&visual=false&color=%23ffa500';
        return iframe;
    }

    function loadPlayer(button) {
        var wrap = button.closest('[data-soundcloud-player]');
        if (!wrap || !soundcloudEnabled()) {
            return;
        }

        var slot = wrap.querySelector('.soundcloud-player-slot');
        var url = button.getAttribute('data-soundcloud-embed');
        if (!slot || !url || slot.getAttribute('data-loaded') === 'true') {
            return;
        }

        var title = button.getAttribute('data-soundcloud-title') || 'this track';

        // Avoid two streams playing at once when a Catbox player is already running.
        if (window.SiteAudio && typeof window.SiteAudio.pause === 'function') {
            window.SiteAudio.pause();
        }

        slot.appendChild(buildWidget(url, title));
        slot.hidden = false;
        slot.setAttribute('data-loaded', 'true');
        button.hidden = true;
        button.setAttribute('aria-expanded', 'true');

        var note = wrap.querySelector('.soundcloud-player-note');
        if (note) {
            note.hidden = true;
        }
    }

    document.addEventListener('click', function (event) {
        var button = event.target.closest('[data-soundcloud-embed]');
        if (!button) {
            return;
        }
        event.preventDefault();
        loadPlayer(button);
    });
})();
