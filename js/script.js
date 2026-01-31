        // ============================================
        // LOADING SCREEN WITH SMOOTH PROGRESS BAR
        // ============================================
        
        let progressValue = 0;
        const progressBarFill = document.getElementById('progressBarFill');
        const loadingPercentage = document.getElementById('loadingPercentage');
        const loadingScreen = document.getElementById('loadingScreen');
        const body = document.body;
        
        const loadingInterval = setInterval(function() {
            progressValue += Math.random() * 10;
            
            if (progressValue >= 100) {
                progressValue = 100;
                clearInterval(loadingInterval);
                
                setTimeout(function() {
                    loadingScreen.classList.add('fade-out');
                    body.classList.remove('loading');
                    
                    setTimeout(function() {
                        loadingScreen.style.display = 'none';
                        
                        // Show pop-up only on home page
                        const currentHash = window.location.hash.substring(1);
                        if (!currentHash || currentHash === 'home' || currentHash === 'home-page') {
                            setTimeout(showPopup, 1000);
                        }
                    }, 1000);
                }, 300);
            }
            
            progressBarFill.style.width = progressValue + '%';
            loadingPercentage.textContent = Math.floor(progressValue) + '%';
        }, 100);
        
        // ============================================
        // POP-UP MODAL FUNCTIONALITY
        // ============================================
        
        const popupOverlay = document.getElementById('popupOverlay');
        const popupClose = document.getElementById('popupClose');
        const popupCta = document.getElementById('popupCta');
        
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
        
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === popupOverlay) {
                hidePopup();
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
                hidePopup();
            }
        });

        // ============================================
        // PAGE NAVIGATION SYSTEM - IMPROVED
        // ============================================
        
        function switchPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show requested page
            const targetPage = document.getElementById(pageId);
            if (targetPage) {
                targetPage.classList.add('active');
                
                // Update navigation active states
                updateNavActiveStates(pageId);
                
                // Update breadcrumb
                updateBreadcrumb(pageId);
                
                // Scroll to top smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Close mobile menu if open
                const navLinks = document.getElementById('navLinks');
                const mobileMenu = document.getElementById('mobileMenu');
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
            }
        }
        
        function updateBreadcrumb(pageId) {
            const breadcrumbContainer = document.getElementById('breadcrumbContainer');
            const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
            
            if (pageId === 'home-page') {
                breadcrumbContainer.style.display = 'none';
            } else {
                breadcrumbContainer.style.display = 'block';
                
                // Set breadcrumb text based on page
                if (pageId === 'wedding-page') {
                    breadcrumbCurrent.textContent = 'Wedding Project';
                } else if (pageId === 'graduation-page') {
                    breadcrumbCurrent.textContent = 'Graduation Project';
                } else if (pageId === 'graphic-design-page') {
                    breadcrumbCurrent.textContent = 'Graphic Design';
                }
            }
        }
        
        function updateNavActiveStates(pageId) {
            // Remove active from all nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active to appropriate nav link
            if (pageId === 'home-page') {
                const homeLink = document.querySelector('.nav-link[href="#home"]');
                if (homeLink) homeLink.classList.add('active');
            }
        }
        
        // Handle hash changes
        function handleHashChange() {
            let hash = window.location.hash.substring(1); // Remove #
            
            // Map hash to page sections
            if (hash === 'wedding' || hash === 'wedding-page') {
                switchPage('wedding-page');
            } else if (hash === 'graduation' || hash === 'graduation-page') {
                switchPage('graduation-page');
            } else if (hash === 'graphic-design' || hash === 'graphic-design-page') {
                switchPage('graphic-design-page');
            } else if (!hash || hash === 'home' || hash === 'home-page') {
                switchPage('home-page');
            } else if (hash === 'about' || hash === 'portfolio' || hash === 'contact') {
                // Home page sections - ensure we're on home page first
                switchPage('home-page');
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        const headerOffset = 80;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Update nav active state for section links
                        document.querySelectorAll('.nav-link').forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === '#' + hash) {
                                link.classList.add('active');
                            }
                        });
                    }
                }, 400);
            }
        }
        
        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);
        
        // Handle initial page load
        window.addEventListener('load', handleHashChange);
        
        // Handle all navigation clicks
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a[href^="#"]');
            if (!target) return;
            
            const href = target.getAttribute('href');
            if (!href || href === '#') return;
            
            // For external links, don't interfere
            if (target.getAttribute('target') === '_blank') return;
            
            const hash = href.substring(1);
            
            // Check if it's a page navigation or section navigation
            if (hash === 'wedding' || hash === 'wedding-page' || 
                hash === 'graduation' || hash === 'graduation-page' || 
                hash === 'graphic-design' || hash === 'graphic-design-page' ||
                hash === 'home' || hash === 'home-page') {
                e.preventDefault();
                window.location.hash = hash;
            } else if (hash === 'about' || hash === 'portfolio' || hash === 'contact') {
                // Section navigation within home page
                e.preventDefault();
                
                // Make sure we're on home page first
                const currentPage = document.querySelector('.page-section.active');
                if (!currentPage || currentPage.id !== 'home-page') {
                    switchPage('home-page');
                    setTimeout(() => {
                        const element = document.getElementById(hash);
                        if (element) {
                            const headerOffset = 80;
                            const elementPosition = element.getBoundingClientRect().top;
                            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                            
                            window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }, 400);
                } else {
                    const element = document.getElementById(hash);
                    if (element) {
                        const headerOffset = 80;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
                
                // Update URL hash without jumping
                history.pushState(null, null, '#' + hash);
                
                // Update nav active states
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === href) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // ============================================
        // DARK MODE TOGGLE LOGIC
        // ============================================
        
        const darkModeToggle = document.getElementById('darkModeToggle');

        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            body.classList.add('dark-mode');
        }

        darkModeToggle.addEventListener('click', function() {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            
            this.classList.add('ripple');
            setTimeout(() => {
                this.classList.remove('ripple');
            }, 600);
        });

        // Show/Hide Dark Mode Toggle on Scroll
        let lastScrollPosition = 0;
        let scrollTimeout;
        const scrollThreshold = 100;

        window.addEventListener('scroll', function() {
            const currentScrollPosition = window.pageYOffset;
            
            clearTimeout(scrollTimeout);
            
            if (currentScrollPosition < scrollThreshold) {
                darkModeToggle.classList.remove('hidden');
                darkModeToggle.classList.add('visible');
                lastScrollPosition = currentScrollPosition;
                return;
            }
            
            if (currentScrollPosition > lastScrollPosition && currentScrollPosition > scrollThreshold) {
                darkModeToggle.classList.add('hidden');
                darkModeToggle.classList.remove('visible');
            } 
            else if (currentScrollPosition < lastScrollPosition) {
                darkModeToggle.classList.remove('hidden');
                darkModeToggle.classList.add('visible');
            }
            
            lastScrollPosition = currentScrollPosition;
            
            if (currentScrollPosition > scrollThreshold) {
                scrollTimeout = setTimeout(() => {
                    if (window.pageYOffset > scrollThreshold) {
                        darkModeToggle.classList.add('hidden');
                        darkModeToggle.classList.remove('visible');
                    }
                }, 3000);
            }
        });

        // ============================================
        // MOBILE MENU TOGGLE
        // ============================================
        
        const mobileMenu = document.getElementById('mobileMenu');
        const navLinks = document.getElementById('navLinks');

        mobileMenu.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', function(event) {
            const isClickInsideNav = navLinks.contains(event.target);
            const isClickOnMenu = mobileMenu.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnMenu && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });

        // ============================================
        // CAROUSEL LOGIC (HOME PAGE)
        // ============================================
        
        const carouselTrack = document.getElementById('carouselTrack');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const indicators = document.querySelectorAll('.indicator');
        let currentSlide = 0;
        const totalSlides = 3;
        let autoSlideInterval;

        function updateCarousel() {
            const offset = -currentSlide * 100;
            carouselTrack.style.transform = `translateX(${offset}%)`;
            
            indicators.forEach((indicator, index) => {
                if (index === currentSlide) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        }

        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateCarousel();
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 2800);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetAutoSlide();
        });

        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetAutoSlide();
        });

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', function() {
                goToSlide(index);
                resetAutoSlide();
            });
        });

        startAutoSlide();

        const carouselContainer = document.querySelector('.carousel-container');
        carouselContainer.addEventListener('mouseenter', function() {
            clearInterval(autoSlideInterval);
        });

        carouselContainer.addEventListener('mouseleave', function() {
            startAutoSlide();
        });

        // ============================================
        // LANGUAGE SKILLS ANIMATION
        // ============================================
        
        const languageObserverOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };

        const languageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animate')) {
                    entry.target.classList.add('animate');
                    
                    const progressBar = entry.target.querySelector('.progress-bar');
                    const progressWidth = entry.target.getAttribute('data-progress');
                    
                    setTimeout(() => {
                        progressBar.style.width = progressWidth + '%';
                    }, 100);
                }
            });
        }, languageObserverOptions);

        document.querySelectorAll('.language-item').forEach(item => {
            languageObserver.observe(item);
        });

        // ============================================
        // FILTER FUNCTIONALITY (GALLERY PAGES)
        // ============================================
        
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('filter-btn')) {
                const filterValue = e.target.getAttribute('data-filter');
                const pageType = e.target.getAttribute('data-page');
                
                // Remove active class from all filter buttons in this page
                const pageSection = document.querySelector(`#${pageType}-page`);
                if (pageSection) {
                    pageSection.querySelectorAll('.filter-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                }
                
                e.target.classList.add('active');
                
                // Filter gallery items
                const galleryId = pageType === 'wedding' ? 'weddingGallery' : 'graduationGallery';
                const gallery = document.getElementById(galleryId);
                
                if (gallery) {
                    const items = gallery.querySelectorAll('.gallery-item');
                    
                    items.forEach(item => {
                        if (filterValue === 'all') {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'scale(1)';
                            }, 10);
                        } else {
                            if (item.getAttribute('data-category') === filterValue) {
                                item.style.display = 'block';
                                setTimeout(() => {
                                    item.style.opacity = '1';
                                    item.style.transform = 'scale(1)';
                                }, 10);
                            } else {
                                item.style.opacity = '0';
                                item.style.transform = 'scale(0.8)';
                                setTimeout(() => {
                                    item.style.display = 'none';
                                }, 300);
                            }
                        }
                    });
                }
            }
        });

        // ============================================
        // LIGHTBOX FUNCTIONALITY
        // ============================================
        
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');
        const lightboxCounter = document.getElementById('lightboxCounter');
        let currentImageIndex = 0;
        let visibleImages = [];

        function updateVisibleImages() {
            // Get current active page
            const activePage = document.querySelector('.page-section.active');
            if (!activePage) return;
            
            const galleryItems = activePage.querySelectorAll('.gallery-item');
            visibleImages = Array.from(galleryItems).filter(item => {
                return window.getComputedStyle(item).display !== 'none';
            });
        }

        function openLightbox(index) {
            updateVisibleImages();
            currentImageIndex = index;
            const imgSrc = visibleImages[index].querySelector('img').src;
            const imgAlt = visibleImages[index].querySelector('img').alt;
            lightboxImage.src = imgSrc;
            lightboxImage.alt = imgAlt;
            lightboxCounter.textContent = `${index + 1} / ${visibleImages.length}`;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex + 1) % visibleImages.length;
            const imgSrc = visibleImages[currentImageIndex].querySelector('img').src;
            const imgAlt = visibleImages[currentImageIndex].querySelector('img').alt;
            lightboxImage.src = imgSrc;
            lightboxImage.alt = imgAlt;
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${visibleImages.length}`;
        }

        function showPrevImage() {
            currentImageIndex = (currentImageIndex - 1 + visibleImages.length) % visibleImages.length;
            const imgSrc = visibleImages[currentImageIndex].querySelector('img').src;
            const imgAlt = visibleImages[currentImageIndex].querySelector('img').alt;
            lightboxImage.src = imgSrc;
            lightboxImage.alt = imgAlt;
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${visibleImages.length}`;
        }

        document.addEventListener('click', function(e) {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                updateVisibleImages();
                const visibleIndex = visibleImages.indexOf(galleryItem);
                if (visibleIndex !== -1) {
                    openLightbox(visibleIndex);
                }
            }
        });

        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', showNextImage);
        lightboxPrev.addEventListener('click', showPrevImage);

        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            }
        });

        // ============================================
        // GENERAL SCROLL ANIMATION
        // ============================================
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.scroll-animate').forEach(element => {
            observer.observe(element);
        });

        // ============================================
        // HEADER SCROLL EFFECT
        // ============================================
        
        let lastHeaderScroll = 0;
        const header = document.querySelector('header');

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
        
            if (currentScroll > lastHeaderScroll && currentScroll > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        
            if (currentScroll > 100) {
                header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        
            lastHeaderScroll = currentScroll;
        });
        