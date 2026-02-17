// Gallery Lightbox with Video Support
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.querySelector('.lightbox-content');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxVideo = document.querySelector('.lightbox-video');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    if (!lightbox || galleryItems.length === 0) return;

    let currentIndex = 0;
    let mediaItems = [];

    // Collect all gallery items (images and videos)
    galleryItems.forEach((item, index) => {
        const itemType = item.getAttribute('data-type') || 'image';
        const img = item.querySelector('img');
        const video = item.querySelector('video');

        if (itemType === 'video' && item.hasAttribute('data-src')) {
            mediaItems.push({
                type: 'video',
                src: item.getAttribute('data-src'),
                alt: 'Video'
            });
        } else if (img) {
            mediaItems.push({
                type: 'image',
                src: img.src,
                alt: img.alt
            });
        }

        // Add click event
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    // Open lightbox
    function openLightbox(index) {
        currentIndex = index;
        showMedia(currentIndex);
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        // Pause and reset video if playing
        if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.currentTime = 0;
        }
    }

    // Show media (image or video) at index
    function showMedia(index) {
        if (!mediaItems[index]) return;

        const item = mediaItems[index];

        if (item.type === 'video') {
            // Show video, hide image
            lightboxContent.classList.remove('show-image');
            lightboxContent.classList.add('show-video');

            // Set video source
            const videoSource = lightboxVideo.querySelector('source');
            videoSource.src = item.src;
            lightboxVideo.load();

            // Auto-play video
            lightboxVideo.play().catch(err => {
                console.log('Video autoplay prevented:', err);
            });
        } else {
            // Show image, hide video
            lightboxContent.classList.remove('show-video');
            lightboxContent.classList.add('show-image');

            // Pause video if it was playing
            if (lightboxVideo) {
                lightboxVideo.pause();
                lightboxVideo.currentTime = 0;
            }

            // Set image source
            lightboxImage.src = item.src;
            lightboxImage.alt = item.alt;
        }
    }

    // Next media item
    function nextMedia() {
        currentIndex = (currentIndex + 1) % mediaItems.length;
        showMedia(currentIndex);
    }

    // Previous media item
    function prevMedia() {
        currentIndex = (currentIndex - 1 + mediaItems.length) % mediaItems.length;
        showMedia(currentIndex);
    }

    // Event listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevMedia);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextMedia);
    }

    // Close on background click (but not on video controls)
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevMedia();
                break;
            case 'ArrowRight':
                nextMedia();
                break;
        }
    });
});