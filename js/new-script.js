'use strict';

    // ──────────────────────────────────────────────────────────
    // 1. LOADING SCREEN — index2
    //    ID: loadingScreen, progressBarFill, loadingPercentage
    // ──────────────────────────────────────────────────────────
    let progressValue = 0;
    const progressBarFill   = document.getElementById('progressBarFill');
    const loadingPercentage = document.getElementById('loadingPercentage');
    const loadingScreen     = document.getElementById('loadingScreen');

    const loadingInterval = setInterval(function () {
        progressValue += Math.random() * 12;
        if (progressValue >= 100) {
            progressValue = 100;
            clearInterval(loadingInterval);
            setTimeout(function () {
                loadingScreen.classList.add('fade-out');
                setTimeout(function () {
                    loadingScreen.style.display = 'none';
                    setTimeout(showPopup, 800);
                }, 500);
            }, 300);
        }
        progressBarFill.style.width = progressValue + '%';
        loadingPercentage.textContent = Math.floor(progressValue) + '%';
    }, 90);

    // ──────────────────────────────────────────────────────────
    // 2. POPUP MODAL — index2
    //    ID: popupOverlay, popupClose, popupCta
    // ──────────────────────────────────────────────────────────
    const popupOverlay = document.getElementById('popupOverlay');
    const popupClose   = document.getElementById('popupClose');
    const popupCta     = document.getElementById('popupCta');

    function showPopup() {
        popupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function hidePopup() {
        popupOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    popupClose.addEventListener('click', hidePopup);
    popupCta.addEventListener('click', hidePopup);

    popupOverlay.addEventListener('click', function (e) {
        if (e.target === popupOverlay) hidePopup();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && popupOverlay.classList.contains('active')) hidePopup();
    });

    // ──────────────────────────────────────────────────────────
    // 3. DARK MODE TOGGLE — index2
    //    Material Symbols + localStorage
    //    ID: darkModeToggle, themeIcon
    // ──────────────────────────────────────────────────────────
    const darkModeToggle = document.getElementById('darkModeToggle');
    const themeIcon      = document.getElementById('themeIcon');
    const htmlEl         = document.documentElement;

    if (localStorage.getItem('darkMode') === 'true') {
        htmlEl.classList.add('dark');
        themeIcon.textContent = 'light_mode';
    }

    darkModeToggle.addEventListener('click', function () {
        htmlEl.classList.toggle('dark');
        const isDark = htmlEl.classList.contains('dark');
        localStorage.setItem('darkMode', isDark);
        themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
    });

    // ──────────────────────────────────────────────────────────
    // 4. MOBILE MENU — index2 (dropdown, bukan fullscreen overlay)
    //    ID: mobileMenu, mobileMenuDropdown
    // ──────────────────────────────────────────────────────────
    const mobileMenuBtn      = document.getElementById('mobileMenu');
    const mobileMenuDropdown = document.getElementById('mobileMenuDropdown');

    mobileMenuBtn.addEventListener('click', function () {
        mobileMenuDropdown.classList.toggle('hidden');
    });

    mobileMenuDropdown.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            mobileMenuDropdown.classList.add('hidden');
        });
    });

    document.addEventListener('click', function (e) {
        if (!mobileMenuBtn.contains(e.target) && !mobileMenuDropdown.contains(e.target)) {
            mobileMenuDropdown.classList.add('hidden');
        }
    });

    // ──────────────────────────────────────────────────────────
    // 5. TESTIMONIAL CAROUSEL — index2
    //    Carousel + dots + auto-slide + pause on hover
    //    ID: carouselTrack, prevBtn, nextBtn, indicators
    // ──────────────────────────────────────────────────────────
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn       = document.getElementById('prevBtn');
    const nextBtn       = document.getElementById('nextBtn');
    const indicators    = document.querySelectorAll('.indicator');
    let currentSlide    = 0;
    const totalSlides   = 3;
    let autoSlideInterval;

    function updateCarousel() {
        carouselTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        indicators.forEach(function (dot, idx) {
            dot.classList.toggle('active', idx === currentSlide);
        });
    }

    function nextSlide() { currentSlide = (currentSlide + 1) % totalSlides; updateCarousel(); }
    function prevSlide() { currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; updateCarousel(); }
    function startAutoSlide() { autoSlideInterval = setInterval(nextSlide, 2800); }
    function resetAutoSlide() { clearInterval(autoSlideInterval); startAutoSlide(); }

    nextBtn.addEventListener('click', function () { nextSlide(); resetAutoSlide(); });
    prevBtn.addEventListener('click', function () { prevSlide(); resetAutoSlide(); });

    indicators.forEach(function (dot, idx) {
        dot.addEventListener('click', function () {
            currentSlide = idx; updateCarousel(); resetAutoSlide();
        });
    });

    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', function () { clearInterval(autoSlideInterval); });
    carouselContainer.addEventListener('mouseleave', startAutoSlide);
    startAutoSlide();

    // ──────────────────────────────────────────────────────────
    // 6. LANGUAGE SKILLS ANIMATION — index2
    //    IntersectionObserver: .language-item → .animate
    // ──────────────────────────────────────────────────────────
    const langObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !entry.target.classList.contains('animate')) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.language-item').forEach(function (item) {
        langObserver.observe(item);
    });

    // ──────────────────────────────────────────────────────────
    // 7. SCROLL REVEAL — index2
    //    IntersectionObserver: .scroll-animate → .active
    //    (Header hide on scroll DIHAPUS sesuai instruksi)
    // ──────────────────────────────────────────────────────────
    const scrollObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.scroll-animate').forEach(function (el) {
        scrollObserver.observe(el);
    });

    // ──────────────────────────────────────────────────────────
    // Particles — parallax mouse effect
    // ──────────────────────────────────────────────────────────
    const container = document.getElementById("particles");
    const homeSection = document.getElementById("home");

    for (let i = 0; i < 60; i++) {
        const dot = document.createElement("div");
        dot.className = "particle";

        const size = Math.random() * 6 + 4;
        dot.style.width  = size + "px";
        dot.style.height = size + "px";
        dot.style.left   = Math.random() * 100 + "%";
        dot.style.top    = Math.random() * 100 + "%";
        dot.dataset.speed = Math.random() * 3 + 1;

        container.appendChild(dot);
    }

    homeSection.addEventListener("mousemove", function (e) {
        const particles = container.querySelectorAll(".particle");
        particles.forEach(function (p) {
            const speed = p.dataset.speed;
            const x = (window.innerWidth  / 2 - e.clientX) * speed * 0.02;
            const y = (window.innerHeight / 2 - e.clientY) * speed * 0.02;
            p.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // ──────────────────────────────────────────────────────────
    // 8. SMOOTH SCROLL — index2
    //    Custom easing (easeInOutCubic) + offset 90px navbar fixed
    //    Menggantikan default browser anchor jump dengan animasi halus
    // ──────────────────────────────────────────────────────────

    /**
     * easeInOutCubic — kurva animasi S yang natural & sangat smooth
     */
    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /**
     * smoothScrollTo — scroll ke posisi Y dengan animasi frame-by-frame
     * @param {number} targetY   posisi akhir (px dari atas dokumen)
     * @param {number} duration  durasi animasi dalam milidetik
     */
    function smoothScrollTo(targetY, duration) {
        const startY    = window.scrollY;
        const distance  = targetY - startY;
        let   startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed  = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease     = easeInOutCubic(progress);

            window.scrollTo(0, startY + distance * ease);

            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    // Intercept semua anchor internal (href="#section-id")
    const NAVBAR_OFFSET = 90; // tinggi navbar fixed

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const targetY = target.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
            smoothScrollTo(targetY, 900); // 900ms — smooth tapi tidak lambat

            // Tutup mobile dropdown jika terbuka
            mobileMenuDropdown.classList.add('hidden');

            // Tutup popup jika masih aktif (tombol "Lihat Portfolio")
            if (popupOverlay.classList.contains('active')) hidePopup();
        });
    });

    // ──────────────────────────────────────────────────────────
    // 9. ACTIVE NAV HIGHLIGHT — index2
    //    IntersectionObserver melacak section yang sedang terlihat
    //    → menandai link navbar yg sesuai dengan class .nav-active
    // ──────────────────────────────────────────────────────────
    const navSections = document.querySelectorAll('main section[id]');
    const navLinks    = document.querySelectorAll(
        'header nav ul a[href^="#"], #mobileMenuDropdown a[href^="#"]'
    );

    function setActiveLink(sectionId) {
        navLinks.forEach(function (link) {
            const matches = link.getAttribute('href') === '#' + sectionId;
            link.classList.toggle('nav-active', matches);
        });
    }

    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                setActiveLink(entry.target.id);
            }
        });
    }, {
        threshold: 0.35,
        rootMargin: '-80px 0px -30% 0px'
    });

    navSections.forEach(function (section) {
        sectionObserver.observe(section);
    });

    // ──────────────────────────────────────────────────────────
    // 10. SCROLL PROGRESS BAR — index2
    //     Bar tipis gradient di atas viewport (z-index: 9999)
    //     menunjukkan progress scroll halaman
    // ──────────────────────────────────────────────────────────
    const scrollProgressBar = document.getElementById('scroll-progress');

    if (scrollProgressBar) {
        window.addEventListener('scroll', function () {
            const scrollTop  = window.scrollY;
            const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
            const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgressBar.style.width = pct + '%';
        }, { passive: true });
    }
