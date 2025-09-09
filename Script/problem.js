 (function() {
            let currentSlide = 0;
            const totalSlides = 6;
            const track = document.getElementById('carouselTrack');
            const dots = document.querySelectorAll('.dot');

            // Check if carousel elements exist before proceeding
            if (!track || dots.length === 0) {
                console.warn('Carousel elements not found - skipping initialization');
                return;
            }

            function updateCarousel() {
                const translateX = -currentSlide * (100 / totalSlides);
                track.style.transform = `translateX(${translateX}%)`;
                
                // Update dots
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }

            function goToSlide(slideIndex) {
                currentSlide = slideIndex;
                updateCarousel();
            }

            function nextSlide() {
                if (currentSlide < totalSlides - 1) {
                    currentSlide++;
                    updateCarousel();
                }
            }

            function prevSlide() {
                if (currentSlide > 0) {
                    currentSlide--;
                    updateCarousel();
                }
            }

            // Make goToSlide globally accessible for dot navigation
            window.goToSlide = goToSlide;

            // Touch/swipe support for mobile
            let startX = 0;
            let endX = 0;

            if (track) {
                track.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                });

                track.addEventListener('touchmove', (e) => {
                    endX = e.touches[0].clientX;
                });

                track.addEventListener('touchend', () => {
                    const threshold = 50; // minimum distance for a swipe
                    const distance = startX - endX;

                    if (Math.abs(distance) > threshold) {
                        if (distance > 0) {
                            nextSlide(); // swipe left, go to next
                        } else {
                            prevSlide(); // swipe right, go to previous
                        }
                    }
                });
            }

            // Auto-play functionality
            let autoplayInterval;

            function startAutoplay() {
                autoplayInterval = setInterval(() => {
                    if (currentSlide < totalSlides - 1) {
                        nextSlide();
                    } else {
                        currentSlide = 0;
                        updateCarousel();
                    }
                }, 5000); // Change slide every 5 seconds
            }

            function stopAutoplay() {
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                }
            }

            // Start autoplay and pause on hover/touch
            if (track) {
                startAutoplay();

                track.addEventListener('mouseenter', stopAutoplay);
                track.addEventListener('mouseleave', startAutoplay);
                track.addEventListener('touchstart', stopAutoplay);
            }

            // Initialize carousel when DOM is ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', updateCarousel);
            } else {
                updateCarousel();
            }
        })();