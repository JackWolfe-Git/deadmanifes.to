(function () {
    function showNotice(text) {
        var n = document.getElementById('mode-notice');
        if (!n) {
            n = document.createElement('div');
            n.id = 'mode-notice';
            document.body.appendChild(n);
        }
        n.textContent = text;
        n.classList.add('visible');
        clearTimeout(n._t);
        n._t = setTimeout(function () { n.classList.remove('visible'); }, 1000);
    }

    function apply(mode, silent) {
        document.body.setAttribute('data-mode', mode);
        var buttons = document.querySelectorAll('.bar-right button');
        buttons.forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-mode') === mode);
        });
        try { localStorage.setItem('dm-mode', mode); } catch (e) {}
        if (!silent) { showNotice(mode.charAt(0).toUpperCase() + mode.slice(1)); }
    }

    var saved = 'dark';
    try { saved = localStorage.getItem('dm-mode') || 'dark'; } catch (e) {}

    apply(saved, true);

    var buttons = document.querySelectorAll('.bar-right button');
    buttons.forEach(function (b) {
        b.addEventListener('click', function () { apply(b.getAttribute('data-mode')); });
    });
})();
