(function () {
    var cb = document.getElementById('theme-toggle');
    var label = document.querySelector('.theme-toggle-label');
    if (!cb || !label) return;

    function applyLabel() {
        label.textContent = cb.checked ? 'TOO BRIGHT!' : 'TOO DARK!';
    }

    try {
        var saved = localStorage.getItem('dm-theme');
        if (saved === 'light') { cb.checked = true; }
    } catch (e) {}

    applyLabel();

    cb.addEventListener('change', function () {
        try { localStorage.setItem('dm-theme', cb.checked ? 'light' : 'dark'); } catch (e) {}
        applyLabel();
    });

    var orange = document.getElementById('orange-toggle');
    if (orange) {
        try {
            if (localStorage.getItem('dm-orange') === 'on') { orange.checked = true; }
        } catch (e) {}
        orange.addEventListener('change', function () {
            try { localStorage.setItem('dm-orange', orange.checked ? 'on' : 'off'); } catch (e) {}
        });
    }
})();