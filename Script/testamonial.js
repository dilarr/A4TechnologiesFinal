(function() {
    class TestimonialsCarousel {
        constructor() {
            this.track = document.getElementById('testimonialsTrack');
            this.prevBtn = document.getElementById('testimonialsPrevBtn');
            this.nextBtn = document.getElementById('testimonialsNextBtn');
            this.dotsContainer = document.getElementById('testimonialsDots');
            this.cards = this.track ? this.track.querySelectorAll('.testimonial-card') : [];
            this.currentIndex = 0;
            this.isMobile = window.innerWidth <= 768;
            this.totalCards = this.cards.length;
            
            // Calculate total slides based on screen size
            this.totalSlides = this.getTotalSlides();
            
            this.init();
            this.bindEvents();
            this.handleResize();
        }
        
        getTotalSlides() {
            // Always show 1 card per slide on both mobile and desktop
            return this.totalCards;
        }
        
        init() {
            this.createDots();
            this.updateCarousel();
            this.updateButtonStates();
        }
        
        createDots() {
            if (!this.dotsContainer) return;
            
            this.dotsContainer.innerHTML = '';
            for (let i = 0; i < this.totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'testimonials-dot';
                if (i === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.goToSlide(i));
                this.dotsContainer.appendChild(dot);
            }
        }
        
        updateCarousel() {
            if (!this.track) return;
            
            // Both desktop and mobile: move one card width per step
            const translateX = -(this.currentIndex * 20); // 20% per card (100% / 5 cards)
            
            this.track.style.transform = `translateX(${translateX}%)`;
            
            // Update dots
            if (this.dotsContainer) {
                const dots = this.dotsContainer.querySelectorAll('.testimonials-dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === this.currentIndex);
                });
            }
        }
        
        updateButtonStates() {
            if (this.prevBtn) {
                this.prevBtn.disabled = this.currentIndex === 0;
                this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
            }
            if (this.nextBtn) {
                this.nextBtn.disabled = this.currentIndex >= this.totalSlides - 1;
                this.nextBtn.style.opacity = this.currentIndex >= this.totalSlides - 1 ? '0.5' : '1';
            }
        }
        
        goToSlide(index) {
            this.currentIndex = Math.max(0, Math.min(index, this.totalSlides - 1));
            this.updateCarousel();
            this.updateButtonStates();
        }
        
        nextSlide() {
            if (this.currentIndex < this.totalSlides - 1) {
                this.currentIndex++;
                this.updateCarousel();
                this.updateButtonStates();
            }
        }
        
        prevSlide() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.updateCarousel();
                this.updateButtonStates();
            }
        }
        
        handleResize() {
            let resizeTimeout;
            window.addEventListener('resize', () => {
                // Debounce resize events for better performance
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    const wasMobile = this.isMobile;
                    this.isMobile = window.innerWidth <= 768;
                    
                    // Update carousel if needed (for future enhancements)
                    if (wasMobile !== this.isMobile) {
                        this.updateCarousel();
                        this.updateButtonStates();
                    }
                }, 150);
            });
        }
        
        bindEvents() {
            // Button events
            if (this.nextBtn) {
                this.nextBtn.addEventListener('click', () => this.nextSlide());
            }
            if (this.prevBtn) {
                this.prevBtn.addEventListener('click', () => this.prevSlide());
            }
            
            // Arrow key navigation
            document.addEventListener('keydown', (e) => {
                // Only handle arrow keys when testimonials section is in view
                const testimonialsSection = document.getElementById('testimonials');
                if (testimonialsSection && this.isElementInViewport(testimonialsSection)) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        this.prevSlide();
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        this.nextSlide();
                    }
                }
            });
            
            // Touch/swipe support
            if (this.track) {
                let startX = 0;
                let endX = 0;
                
                this.track.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                }, { passive: true });
                
                this.track.addEventListener('touchmove', (e) => {
                    endX = e.touches[0].clientX;
                }, { passive: true });
                
                this.track.addEventListener('touchend', () => {
                    const threshold = 50;
                    const distance = startX - endX;
                    
                    if (Math.abs(distance) > threshold) {
                        if (distance > 0) {
                            this.nextSlide();
                        } else {
                            this.prevSlide();
                        }
                    }
                }, { passive: true });
            }
        }
        
        isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
    }
    
    // Initialize carousel when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.testimonialsCarousel = new TestimonialsCarousel();
        });
    } else {
        window.testimonialsCarousel = new TestimonialsCarousel();
    }
})();