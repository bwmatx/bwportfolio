// ── Video Filter Functionality ──
const filterBtnsL1 = document.querySelectorAll('.filter-btn-l1');
const filterBtnsL2 = document.querySelectorAll('.filter-btn-l2');
const landscapeFilters = document.getElementById('landscape-filters');
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryGrid = document.getElementById('galleryGrid');

let currentFormat = 'landscape';
let currentCategory = 'teasers';

function updateGalleryLayout(format) {
    if (format === 'landscape') {
        galleryGrid.classList.remove('grid-cols-2', 'sm:grid-cols-3', 'md:grid-cols-4');
        galleryGrid.classList.add('grid-cols-1', 'md:grid-cols-2');
    } else {
        galleryGrid.classList.remove('grid-cols-1', 'md:grid-cols-2');
        galleryGrid.classList.add('grid-cols-2', 'sm:grid-cols-3', 'md:grid-cols-4');
    }
}

function applyFilters() {
    galleryItems.forEach(item => {
        if (item.style.display !== 'none') {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.92) translateY(8px)';
        }
    });

    setTimeout(() => {
        let i = 0;
        galleryItems.forEach(item => {
            const itemFormat = item.getAttribute('data-format');
            const itemCategory = item.getAttribute('data-category');
            
            const matchFormat = itemFormat === currentFormat;
            const matchCategory = currentFormat === 'portrait' || itemCategory === currentCategory;

            if (!matchFormat || !matchCategory) {
                item.style.display = 'none';
                item.style.opacity = '0';
                item.style.transform = 'scale(0.92) translateY(8px)';
                item.classList.add('hidden');
            } else {
                const randX = (Math.random() - 0.5) * 24; 
                const randY = 14 + Math.random() * 20;    
                const delay = i * 45;                      
                i++;

                item.style.display = 'block';
                item.classList.remove('hidden');
                item.style.transition = 'none'; 
                item.style.opacity = '0';
                item.style.transform = `scale(0.88) translate(${randX}px, ${randY}px)`;

                setTimeout(() => {
                    item.style.transition = 'opacity 0.42s ease, transform 0.42s cubic-bezier(0.22,0.61,0.36,1)';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1) translate(0, 0)';
                }, delay + 30);
            }
        });
    }, 360);
}

filterBtnsL1.forEach(btn => {
    btn.addEventListener('click', function() {
        this.classList.add('ripple');
        setTimeout(() => this.classList.remove('ripple'), 600);

        filterBtnsL1.forEach(b => {
            b.classList.remove('active', 'bg-primary-teal', 'text-white');
            b.classList.add('bg-white', 'border', 'text-zinc-600', 'hover:bg-zinc-50', 'hover:text-zinc-800');
        });
        
        this.classList.remove('bg-white', 'border', 'text-zinc-600', 'hover:bg-zinc-50', 'hover:text-zinc-800');
        this.classList.add('active', 'bg-primary-teal', 'text-white');

        currentFormat = this.getAttribute('data-format');
        
        if (currentFormat === 'portrait') {
            landscapeFilters.style.opacity = '0';
            setTimeout(() => { landscapeFilters.style.display = 'none'; }, 300);
        } else {
            landscapeFilters.style.display = 'flex';
            setTimeout(() => { landscapeFilters.style.opacity = '1'; }, 10);
        }

        updateGalleryLayout(currentFormat);
        applyFilters();
    });
});

filterBtnsL2.forEach(btn => {
    btn.addEventListener('click', function() {
        this.classList.add('ripple');
        setTimeout(() => this.classList.remove('ripple'), 600);

        filterBtnsL2.forEach(b => {
            b.classList.remove('active', 'bg-primary-teal', 'text-white');
            b.classList.add('bg-white', 'border', 'text-zinc-600', 'hover:bg-zinc-50', 'hover:text-zinc-800');
        });
        
        this.classList.remove('bg-white', 'border', 'text-zinc-600', 'hover:bg-zinc-50', 'hover:text-zinc-800');
        this.classList.add('active', 'bg-primary-teal', 'text-white');

        currentCategory = this.getAttribute('data-category');
        applyFilters();
    });
});

// Initialize Gallery
updateGalleryLayout('landscape');

// ── Video Modal Functionality ──
const videoModal = document.getElementById('videoModal');
const videoModalClose = document.getElementById('videoModalClose');
const videoElement = document.querySelector('video-player video');
const mediaPosterImg = document.querySelector('video-player media-poster img');

function openVideoModal(videoSrc, posterSrc) {
    if(videoElement) videoElement.src = videoSrc;
    if(mediaPosterImg) mediaPosterImg.src = posterSrc;
    
    videoModal.classList.remove('hidden');
    videoModal.style.display = 'flex';
    // force reflow
    void videoModal.offsetWidth;
    videoModal.classList.remove('opacity-0');
    videoModal.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';
    
    // Play video if possible
    setTimeout(() => {
        if(videoElement) {
            videoElement.play().catch(e => console.log('Auto-play prevented:', e));
        }
    }, 100);
}

function closeVideoModal() {
    if(videoElement) videoElement.pause();
    
    videoModal.classList.remove('opacity-100');
    videoModal.classList.add('opacity-0');
    
    setTimeout(() => {
        videoModal.classList.add('hidden');
        videoModal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const videoSrc = item.getAttribute('data-video');
        if (!videoSrc) return;
        const posterSrc = item.getAttribute('data-poster');
        openVideoModal(videoSrc, posterSrc);
    });
});

videoModalClose?.addEventListener('click', closeVideoModal);

videoModal?.addEventListener('click', (e) => {
    if (e.target === videoModal) closeVideoModal();
});

document.addEventListener('keydown', (e) => {
    if (!videoModal?.classList.contains('hidden')) {
        if (e.key === 'Escape') closeVideoModal();
    }
});