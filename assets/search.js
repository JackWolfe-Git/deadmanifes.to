(function () {
    'use strict';

    var form = document.getElementById('search-page-form');
    var input = document.getElementById('search-page-input');
    var status = document.getElementById('search-status');
    var results = document.getElementById('search-results');
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();

    if (!form || !input || !status || !results) { return; }

    input.value = query;

    if (!query) {
        status.textContent = 'Enter a word or phrase to search the public pages.';
        results.hidden = true;
        return;
    }

    status.textContent = 'Searching…';
    results.hidden = true;

    fetch('../search-index.json', { cache: 'no-store' })
        .then(function (response) {
            if (!response.ok) { throw new Error('Search index unavailable'); }
            return response.json();
        })
        .then(function (index) {
            var terms = query.toLowerCase().split(/\s+/).filter(Boolean);
            var matches = [];

            index.forEach(function (entry) {
                var title = (entry.title || '').toLowerCase();
                var description = (entry.description || '').toLowerCase();
                var headings = (entry.headings || []).join(' ').toLowerCase();
                var text = (entry.text || '').toLowerCase();
                var haystack = [title, description, headings, text].join(' ');
                var matched = terms.every(function (term) { return haystack.indexOf(term) !== -1; });
                if (!matched) { return; }

                var score = 0;
                terms.forEach(function (term) {
                    if (title.indexOf(term) !== -1) { score += 5; }
                    if (headings.indexOf(term) !== -1) { score += 3; }
                    if (description.indexOf(term) !== -1) { score += 2; }
                    if (text.indexOf(term) !== -1) { score += 1; }
                });
                matches.push({ entry: entry, score: score });
            });

            matches.sort(function (a, b) {
                if (b.score !== a.score) { return b.score - a.score; }
                return a.entry.title.localeCompare(b.entry.title);
            });

            results.textContent = '';
            if (!matches.length) {
                status.textContent = 'No public pages match “' + query + '”.';
                results.hidden = true;
                return;
            }

            status.textContent = matches.length + (matches.length === 1 ? ' result for “' : ' results for “') + query + '”.';

            matches.forEach(function (match) {
                var entry = match.entry;
                var item = document.createElement('li');
                item.className = 'search-result';

                var link = document.createElement('a');
                link.className = 'search-result-title';
                link.href = entry.url;
                link.textContent = entry.title;

                var description = document.createElement('p');
                description.className = 'search-result-description';
                description.textContent = entry.description || '';

                item.appendChild(link);
                item.appendChild(description);
                results.appendChild(item);
            });

            results.hidden = false;
        })
        .catch(function () {
            status.textContent = 'Search is unavailable right now. You can still browse from the menu.';
            results.hidden = true;
        });
})();
