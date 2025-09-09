  (function() {
            // Main Testimonials Carousel
            let currentMainSlide = 0;
            const totalMainSlides = 2;
            const mainTestimonialsTrack = document.getElementById('mainTestimonialsTrack');
            const mainPrevBtn = document.getElementById('mainTestimonialsPrevBtn');
            const mainNextBtn = document.getElementById('mainTestimonialsNextBtn');

            // Extended Testimonials Carousel
            let currentExtendedSlide = 0;
            const totalExtendedSlides = 3;
            const extendedTestimonialsTrack = document.getElementById('extendedTestimonialsTrack');
            const extendedPrevBtn = document.getElementById('extendedTestimonialsPrevBtn');
            const extendedNextBtn = document.getElementById('extendedTestimonialsNextBtn');

            function updateMainTestimonialsCarousel() {
                if (!mainTestimonialsTrack) return;
                
                const translateX = -currentMainSlide * (100 / totalMainSlides);
                mainTestimonialsTrack.style.transform = `translateX(${translateX}%)`;
                
                // Update button states
                if (mainPrevBtn) mainPrevBtn.disabled = currentMainSlide === 0;
                if (mainNextBtn) mainNextBtn.disabled = currentMainSlide === totalMainSlides - 1;
            }

            function updateExtendedTestimonialsCarousel() {
                if (!extendedTestimonialsTrack) return;
                
                const translateX = -currentExtendedSlide * (100 / totalExtendedSlides);
                extendedTestimonialsTrack.style.transform = `translateX(${translateX}%)`;
                
                // Update button states
                if (extendedPrevBtn) extendedPrevBtn.disabled = currentExtendedSlide === 0;
                if (extendedNextBtn) extendedNextBtn.disabled = currentExtendedSlide === totalExtendedSlides - 1;
            }

            function nextMainSlide() {
                if (currentMainSlide < totalMainSlides - 1) {
                    currentMainSlide++;
                    updateMainTestimonialsCarousel();
                }
            }

            function prevMainSlide() {
                if (currentMainSlide > 0) {
                    currentMainSlide--;
                    updateMainTestimonialsCarousel();
                }
            }

            function nextExtendedSlide() {
                if (currentExtendedSlide < totalExtendedSlides - 1) {
                    currentExtendedSlide++;
                    updateExtendedTestimonialsCarousel();
                }
            }

            function prevExtendedSlide() {
                if (currentExtendedSlide > 0) {
                    currentExtendedSlide--;
                    updateExtendedTestimonialsCarousel();
                }
            }

            // Event listeners for main testimonials
            if (mainNextBtn) mainNextBtn.addEventListener('click', nextMainSlide);
            if (mainPrevBtn) mainPrevBtn.addEventListener('click', prevMainSlide);

            // Event listeners for extended testimonials
            if (extendedNextBtn) extendedNextBtn.addEventListener('click', nextExtendedSlide);
            if (extendedPrevBtn) extendedPrevBtn.addEventListener('click', prevExtendedSlide);

            // Touch/swipe support for main testimonials
            let startX = 0;
            let endX = 0;

            if (mainTestimonialsTrack) {
                mainTestimonialsTrack.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                });

                mainTestimonialsTrack.addEventListener('touchmove', (e) => {
                    endX = e.touches[0].clientX;
                });

                mainTestimonialsTrack.addEventListener('touchend', () => {
                    const threshold = 50;
                    const distance = startX - endX;

                    if (Math.abs(distance) > threshold) {
                        if (distance > 0) {
                            nextMainSlide();
                        } else {
                            prevMainSlide();
                        }
                    }
                });
            }

            // Touch/swipe support for extended testimonials
            if (extendedTestimonialsTrack) {
                extendedTestimonialsTrack.addEventListener('touchstart', (e) => {
                    startX = e.touches[0].clientX;
                });

                extendedTestimonialsTrack.addEventListener('touchmove', (e) => {
                    endX = e.touches[0].clientX;
                });

                extendedTestimonialsTrack.addEventListener('touchend', () => {
                    const threshold = 50;
                    const distance = startX - endX;

                    if (Math.abs(distance) > threshold) {
                        if (distance > 0) {
                            nextExtendedSlide();
                        } else {
                            prevExtendedSlide();
                        }
                    }
                });
            }

            // Initialize carousels
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    updateMainTestimonialsCarousel();
                    updateExtendedTestimonialsCarousel();
                });
            } else {
                updateMainTestimonialsCarousel();
                updateExtendedTestimonialsCarousel();
            }
        })();