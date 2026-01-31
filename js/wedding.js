        // Loading Screen with Line Progress Bar
        let progressValue = 0;
        const progressBarFill = document.getElementById('progressBarFill');
        const loadingPercentage = document.getElementById('loadingPercentage');
        const loadingScreen = document.getElementById('loadingScreen');
        const body = document.body;
        
        // Simulate loading progress with pause at 69%
        let isStuckAt69 = false;
        
        const loadingInterval = setInterval(function() {
            // Check if we should pause at 69%
            if (progressValue >= 69 && progressValue < 70 && !isStuckAt69) {
                progressValue = 69;
                isStuckAt69 = true;
                
                // Stuck at 69% for 1.2 seconds
                setTimeout(function() {
                    isStuckAt69 = false;
                }, 1200);
            } else if (!isStuckAt69) {
                progressValue += Math.random() * 15; // Random increment for realistic effect
            }
            
            if (progressValue >= 100 && !isStuckAt69) {
                progressValue = 100;
                clearInterval(loadingInterval);
                
                // Complete loading after reaching 100%
                setTimeout(function() {
                    loadingScreen.classList.add('fade-out');
                    body.classList.remove('loading');
                    
                    setTimeout(function() {
                        loadingScreen.style.display = 'none';
                    }, 1000);
                }, 300);
            }
            
            // Update progress bar (percentage text is hidden)
            progressBarFill.style.width = progressValue + '%';
            loadingPercentage.textContent = Math.floor(progressValue) + '%';
        }, 100);

        // Dark Mode Toggle
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

        // Mobile Menu Toggle
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

        // Filter Functionality
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                galleryItems.forEach(item => {
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
            });
        });

        // Lightbox Functionality
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');
        const lightboxCounter = document.getElementById('lightboxCounter');
        let currentImageIndex = 0;
        let visibleImages = [];

        function updateVisibleImages() {
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

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                updateVisibleImages();
                const visibleIndex = visibleImages.indexOf(item);
                openLightbox(visibleIndex);
            });
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

        // Scroll Animation
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

        // Header scroll effect
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