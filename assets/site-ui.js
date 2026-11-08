(function () {
    'use strict';

    var script = document.currentScript || document.querySelector('script[src$="site-ui.js"]');
    var base = '/';
    if (script && script.src) {
        try {
            base = new URL('../', script.src).pathname;
        } catch (e) {
            base = '/';
        }
    }

    function make(tag, className, text) {
        var node = document.createElement(tag);
        if (className) { node.className = className; }
        if (text) { node.textContent = text; }
        return node;
    }

    function injectSearch() {
        var bar = document.querySelector('.site-bar');
        if (!bar || bar.querySelector('.bar-search')) { return; }

        var wrap = make('div', 'bar-search');
        var toggle = make('button', 'bar-search-toggle');
        toggle.type = 'button';
        toggle.setAttribute('aria-label', 'Search');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m16 16 4.5 4.5"></path></svg>';

        var form = make('form', 'bar-search-form');
        form.setAttribute('role', 'search');
        form.setAttribute('method', 'get');
        form.setAttribute('action', base + 'search/');
        form.innerHTML = '<label class="visually-hidden" for="site-search-input">Search deadmanifesto</label>' +
            '<input id="site-search-input" name="q" type="search" placeholder="Search" autocomplete="off">' +
            '<button type="submit" aria-label="Submit search"><svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"></circle><path d="m16 16 4.5 4.5"></path></svg></button>';

        wrap.appendChild(toggle);
        wrap.appendChild(form);
        var right = bar.querySelector('.bar-right');
        if (right) {
            bar.insertBefore(wrap, right);
        } else {
            bar.appendChild(wrap);
        }

        var input = form.querySelector('input');

        function open() {
            bar.classList.add('search-open');
            toggle.setAttribute('aria-expanded', 'true');
            window.requestAnimationFrame(function () { input.focus(); });
        }

        function close() {
            bar.classList.remove('search-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }

        toggle.addEventListener('click', function () {
            if (bar.classList.contains('search-open')) {
                close();
            } else {
                open();
            }
        });

        form.addEventListener('submit', function (event) {
            if (!input.value.trim()) {
                event.preventDefault();
                input.focus();
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && bar.classList.contains('search-open')) {
                close();
            }
        });
    }

    function updateAge() {
        var target = document.querySelector('[data-age]');
        if (!target) { return; }

        var birthday = { year: 1998, month: 2, day: 5 };
        var parts;
        try {
            var formatter = new Intl.DateTimeFormat('en-GB', {
                timeZone: 'Europe/London',
                year: 'numeric',
                month: 'numeric',
                day: 'numeric'
            });
            var map = {};
            formatter.formatToParts(new Date()).forEach(function (part) {
                if (part.type !== 'literal') { map[part.type] = parseInt(part.value, 10); }
            });
            parts = { year: map.year, month: map.month, day: map.day };
        } catch (e) {
            var now = new Date();
            parts = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
        }

        var years = parts.year - birthday.year;
        var months = parts.month - birthday.month;
        var days = parts.day - birthday.day;

        if (days < 0) {
            months -= 1;
            days += new Date(Date.UTC(parts.year, parts.month - 1, 0)).getUTCDate();
        }
        if (months < 0) {
            years -= 1;
            months += 12;
        }

        target.textContent = years + ' years, ' + months + ' months, ' + days + ' days';
    }

    function wirePrintButtons() {
        document.querySelectorAll('[data-print]').forEach(function (button) {
            button.addEventListener('click', function () { window.print(); });
        });
    }

    function init() {
        injectSearch();
        updateAge();
        wirePrintButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
