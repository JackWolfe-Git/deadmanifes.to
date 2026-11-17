/* deadmanifesto - per-host audio player preferences
   Default is off. No player or third-party host loads until the visitor opts in. */
(function () {
    'use strict';

    var STORAGE_KEY = 'dm-player-hosts';
    var HOSTS = ['catbox', 'soundcloud'];
    var current = read();

    function normalize(value) {
        if (!Array.isArray(value)) {
            return [];
        }
        return HOSTS.filter(function (host) {
            return value.indexOf(host) !== -1;
        });
    }

    function read() {
        try {
            var raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return [];
            }
            return normalize(JSON.parse(raw));
        } catch (error) {
            return [];
        }
    }

    function write(list) {
        current = HOSTS.filter(function (host) {
            return list.indexOf(host) !== -1;
        });
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
        } catch (error) {
            /* Preferences still apply for this page if storage is blocked. */
        }
        applyAttributes();
        updateSettingsUI();
        document.dispatchEvent(new CustomEvent('site:playerprefschange', {
            detail: { hosts: all() }
        }));
    }

    function has(host) {
        return current.indexOf(host) !== -1;
    }

    function all() {
        return current.slice();
    }

    function set(host, enabled) {
        if (HOSTS.indexOf(host) === -1) {
            return has(host);
        }
        var list = current.slice();
        var index = list.indexOf(host);
        if (enabled && index === -1) {
            list.push(host);
        } else if (!enabled && index !== -1) {
            list.splice(index, 1);
        }
        write(list);
        return has(host);
    }

    function setAll(list) {
        write(normalize(list));
    }

    function applyAttributes() {
        var root = document.documentElement;
        root.setAttribute('data-player-catbox', has('catbox') ? 'true' : 'false');
        root.setAttribute('data-player-soundcloud', has('soundcloud') ? 'true' : 'false');
    }

    function statusText() {
        var catbox = has('catbox');
        var soundcloud = has('soundcloud');
        var suffix = ' Preferences are saved in this browser.';
        if (catbox && soundcloud) {
            return 'Catbox and SoundCloud are on.' + suffix;
        }
        if (catbox) {
            return 'Catbox is on. SoundCloud is off.' + suffix;
        }
        if (soundcloud) {
            return 'SoundCloud is on. Catbox is off.' + suffix;
        }
        return 'Both hosts are off. No audio player will load.';
    }

    function updateSettingsUI() {
        document.querySelectorAll('[data-player-host]').forEach(function (input) {
            var host = input.getAttribute('data-player-host');
            if (HOSTS.indexOf(host) !== -1) {
                input.checked = has(host);
            }
        });

        var status = document.querySelector('[data-player-settings-status]');
        if (status) {
            status.textContent = statusText();
        }

        var reset = document.querySelector('[data-player-settings-reset]');
        if (reset) {
            reset.disabled = !(has('catbox') || has('soundcloud'));
        }
    }

    function initSettings() {
        document.querySelectorAll('[data-player-host]').forEach(function (input) {
            input.addEventListener('change', function () {
                var host = input.getAttribute('data-player-host');
                if (HOSTS.indexOf(host) !== -1) {
                    set(host, input.checked);
                }
            });
        });

        var reset = document.querySelector('[data-player-settings-reset]');
        if (reset) {
            reset.addEventListener('click', function () {
                setAll([]);
            });
        }

        updateSettingsUI();
    }

    function init() {
        applyAttributes();
        initSettings();
    }

    window.SitePlayerPrefs = {
        has: has,
        set: set,
        setAll: setAll,
        all: all,
        storageKey: STORAGE_KEY,
        refresh: function () {
            current = read();
            applyAttributes();
            updateSettingsUI();
        }
    };

    applyAttributes();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('storage', function (event) {
        if (event.key !== STORAGE_KEY) {
            return;
        }
        current = read();
        applyAttributes();
        updateSettingsUI();
    });
})();
