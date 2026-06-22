'use strict';

// ──────────────────────────────────────────────────────────
// Theme Toggle — Sliding Sun/Moon Switch
// Isolated module: handles dark mode persistence + toggle UI
// ──────────────────────────────────────────────────────────

(function () {
    const htmlEl = document.documentElement;

    // ── 1. Restore persisted theme IMMEDIATELY (before paint) ──
    if (localStorage.getItem('darkMode') === 'true') {
        htmlEl.classList.add('dark');
    }

    // ── 2. Initialize toggle UI after DOM ready ──
    function init() {
        const toggles = document.querySelectorAll('.theme-toggle');
        if (!toggles.length) return;

        const isDark = htmlEl.classList.contains('dark');

        // Set initial state for all toggles on the page
        toggles.forEach(function (toggle) {
            if (isDark) toggle.classList.add('dark-active');
        });

        // Attach click handler
        toggles.forEach(function (toggle) {
            toggle.addEventListener('click', function () {
                htmlEl.classList.toggle('dark');
                const nowDark = htmlEl.classList.contains('dark');
                localStorage.setItem('darkMode', nowDark);

                // Sync ALL toggles on the page (in case there are multiple)
                document.querySelectorAll('.theme-toggle').forEach(function (t) {
                    t.classList.toggle('dark-active', nowDark);
                });
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
