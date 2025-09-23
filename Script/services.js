class ServicesCarousel {
    constructor() {
        this.grid = document.getElementById('servicesGrid');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dotsContainer = document.getElementById('dotsContainer');
        this.slideGroups = this.grid.querySelectorAll('.slide-group');
        this.serviceCards = this.grid.querySelectorAll('.service-card');
        this.currentIndex = 0;
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        this.isModalOpen = false; // Track if a modal is currently open
        
        // Responsive breakpoints:
        // Mobile: <= 768px - shows 1 card per slide (9 total slides)
        // Tablet: 769-1024px - shows 2 cards per slide (could be 4-5 slides)
        // Desktop: > 1024px - shows 3 cards per slide (3 total slides)
        this.totalSlides = this.getTotalSlides();
        
        this.init();
        this.bindReadMoreButtons();
        this.bindFooterServiceLinks();
        this.handleResize();
    }
    
    getTotalSlides() {
        if (this.isMobile) {
            return 9; // 1 card per slide - each individual card is a slide
        } else if (this.isTablet) {
            return Math.ceil(9 / 2); // 2 cards per slide = 5 slides
        } else {
            return 3; // 3 cards per slide - each slide group is a slide
        }
    }
    
    init() {
        this.restructureForMobile();
        this.createDots();
        this.bindEvents();
        this.updateCarousel();
        this.updateButtonStates();
    }

    restructureForMobile() {
        if (this.isMobile) {
            // On mobile, restructure HTML so each card is its own slide
            const allCards = Array.from(this.serviceCards);
            this.grid.innerHTML = '';
            
            allCards.forEach(card => {
                const slideGroup = document.createElement('div');
                slideGroup.className = 'slide-group';
                slideGroup.appendChild(card);
                this.grid.appendChild(slideGroup);
            });
            
            // Update references
            this.slideGroups = this.grid.querySelectorAll('.slide-group');
            this.serviceCards = this.grid.querySelectorAll('.service-card');
        } else {
            // On desktop/tablet, restore original structure with 3 cards per slide group
            const allCards = Array.from(this.serviceCards);
            this.grid.innerHTML = '';
            
            // Create 3 slide groups with 3 cards each
            for (let i = 0; i < 3; i++) {
                const slideGroup = document.createElement('div');
                slideGroup.className = 'slide-group';
                
                for (let j = 0; j < 3; j++) {
                    const cardIndex = i * 3 + j;
                    if (cardIndex < allCards.length) {
                        slideGroup.appendChild(allCards[cardIndex]);
                    }
                }
                
                this.grid.appendChild(slideGroup);
            }
            
            // Update references
            this.slideGroups = this.grid.querySelectorAll('.slide-group');
            this.serviceCards = this.grid.querySelectorAll('.service-card');
        }
        
        // Re-bind read more buttons after restructuring
        this.bindReadMoreButtons();
    }

    createDots() {
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    updateCarousel() {
        let translateX = 0;
        
        if (this.isMobile) {
            // Mobile: move exactly one card width per step, computed precisely
            const perSlidePercent = 100 / this.totalSlides; // avoids rounding issues
            translateX = -(this.currentIndex * perSlidePercent);
        } else if (this.isTablet) {
            // Tablet: move two card widths per step (22.222% per slide)
            translateX = -(this.currentIndex * 22.222);
        } else {
            // Desktop: move one slide group width per step (33.333% per slide group)
            translateX = -(this.currentIndex * 33.333);
        }
        
        this.grid.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }

    handleResize() {
        window.addEventListener('resize', () => {
            const wasMobile = this.isMobile;
            const wasTablet = this.isTablet;
            
            // Update breakpoint flags
            this.isMobile = window.innerWidth <= 768;
            this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

            // Only recreate if mode changed
            if (wasMobile !== this.isMobile || wasTablet !== this.isTablet) {
                // Restructure HTML for new mode
                this.restructureForMobile();
                
                // Recompute total slides based on new mode
                this.totalSlides = this.getTotalSlides();

                // Reset to first slide when switching modes to avoid out-of-bounds
                this.currentIndex = 0;

                // Recreate dots for new mode
                this.createDots();
                
                // Update carousel immediately
                this.updateCarousel();
                this.updateButtonStates();
            }
        });
    }

    updateButtonStates() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.totalSlides - 1;
        
        // Add visual feedback for disabled buttons
        this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
        this.nextBtn.style.opacity = this.currentIndex >= this.totalSlides - 1 ? '0.5' : '1';
    }

    goToSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.totalSlides - 1));
        this.updateCarousel();
        this.updateButtonStates();
    }
    
    prevSlide() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
            this.updateButtonStates();
        }
    }
    
    nextSlide() {
        if (this.currentIndex < this.totalSlides - 1) {
            this.currentIndex++;
            this.updateCarousel();
            this.updateButtonStates();
        }
    }

    next() {
        this.nextSlide();
    }

    prev() {
        this.prevSlide();
    }

    bindReadMoreButtons() {
        // Remove existing event listeners to prevent duplicates
        const existingBtns = document.querySelectorAll('#services .read-more-btn');
        existingBtns.forEach(btn => {
            // Clone the button to remove all event listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
        });
        
        // Map service titles to their corresponding page filenames
        const servicePageMap = {
            "Application Development": "ApplicationDevelopment.html",
            "IT Support": "IT Support.html",
            "AI and Automation": "AIandAutomation.html",
            "Website and Social Media Marketing": "WebsiteandSocial Media.html", // Fixed this mapping
            "Internet and Network Setup": "InternetandNetworkSetup.html",
            "Desktop / Laptop Setup and Updating": "DesktopLaptopSetupandUpdating.html",
            "IT Security and Security Audit": "ITSecurityandSecurityAudit.html",
            "Email and Communication": "EmailandCommunication.html",
            "Document Management": "DocumentManagement.html"
        };

        // Re-bind read more buttons after restructuring
        const readMoreBtns = document.querySelectorAll('#services .read-more-btn');
        const serviceCards = document.querySelectorAll('#services .service-card');

        readMoreBtns.forEach((btn, index) => {
            const card = serviceCards[index];
            const titleElement = card.querySelector('h3');
            const title = titleElement ? titleElement.textContent.trim() : '';
            
            // Get the corresponding page filename
            const pageFile = servicePageMap[title];
            
            if (pageFile) {
                // Change button to a link that opens in the same window
                btn.outerHTML = `<a href="ProjectPages/${pageFile}" class="read-more-btn">Read More</a>`;
            } else {
                // Fallback to original button behavior if no mapping found
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    console.log('Service page not found for:', title);
                });
            }
        });
    }

    bindFooterServiceLinks() {
        // Footer service links trigger corresponding popup
        const footerServiceLinks = document.querySelectorAll('footer a[data-target]');
        footerServiceLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const title = link.getAttribute('data-target');
                if (!title) return;
                e.preventDefault();
                // Make sure the services section is in view so the in-section modal is visible
                const servicesSection = document.getElementById('services');
                if (servicesSection) {
                    // Account for fixed topbar/nav using CSS scroll-margin on #services
                    servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Open shortly after scrolling starts to ensure visibility
                    setTimeout(() => this.showServicePopupByTitle(title), 200);
                } else {
                    this.showServicePopupByTitle(title);
                }
            });
        });
    }

    formatServiceContent(details) {
        // Split the content by double newlines to separate sections
        const sections = details.split('\n\n');
        let formattedContent = '';
        
        sections.forEach((section, index) => {
            if (section.trim().startsWith('• ')) {
                // This is a bullet point section
                const questions = section.split('\n').filter(line => line.trim().startsWith('• '));
                if (questions.length > 0) {
                    formattedContent += '<ul style="margin: 1rem 0; padding-left: 1.5rem;">';
                    questions.forEach(question => {
                        const cleanQuestion = question.replace('• ', '').trim();
                        formattedContent += `<li style="margin-bottom: 0.75rem; color: var(--text-secondary); line-height: 1.5;">${cleanQuestion}</li>`;
                    });
                    formattedContent += '</ul>';
                }
            } else if (section.trim()) {
                // This is a paragraph section
                formattedContent += `<p style="margin-bottom: 1rem; color: var(--text-secondary); line-height: 1.6;">${section.trim()}</p>`;
            }
        });
        
        return formattedContent;
    }

    showServiceDetails(service) {
        // Prevent multiple modals from being opened
        if (this.isModalOpen) {
            console.log('Modal already open, ignoring request');
            return;
        }
        
        this.isModalOpen = true;
        
        // Create modal overlay within Services section to prevent page scroll/jump
        const servicesSection = document.getElementById('services');
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            padding: 10px;
            box-sizing: border-box;
        `;

        // Enhanced mobile detection and sizing
        const isMobileModal = window.innerWidth <= 480;
        const isSmallTablet = window.innerWidth > 480 && window.innerWidth <= 768;
        const isLargeTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        
        // Create modal content with enhanced responsive sizing
        const modalContent = document.createElement('div');
        
        let modalWidth, modalPadding, fontSize, titleSize, lineHeight;
        
        if (isMobileModal) {
            modalWidth = '100%';
            modalPadding = '1rem';
            fontSize = '0.875rem';
            titleSize = '1.125rem';
            lineHeight = '1.4';
        } else if (isSmallTablet) {
            modalWidth = '95%';
            modalPadding = '1.25rem';
            fontSize = '0.9rem';
            titleSize = '1.25rem';
            lineHeight = '1.5';
        } else if (isLargeTablet) {
            modalWidth = '85%';
            modalPadding = '1.5rem';
            fontSize = '0.95rem';
            titleSize = '1.35rem';
            lineHeight = '1.5';
        } else {
            modalWidth = '600px';
            modalPadding = '2rem';
            fontSize = '1rem';
            titleSize = '1.5rem';
            lineHeight = '1.6';
        }
        
        modalContent.style.cssText = `
            background: var(--bg-primary);
            border-radius: ${isMobileModal ? '12px' : 'var(--radius-xl)'};
            padding: ${modalPadding};
            max-width: ${modalWidth};
            width: ${modalWidth};
            max-height: ${isMobileModal ? '95vh' : '90vh'};
            overflow-y: auto;
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-xl);
            box-sizing: border-box;
            margin: ${isMobileModal ? '5px' : '0'};
        `;

        // Parse and format the service details with responsive styling
        const formattedContent = this.formatServiceContentResponsive(service.details, fontSize, lineHeight);
        
        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: ${isMobileModal ? '1rem' : '1.5rem'}; gap: ${isMobileModal ? '0.75rem' : '1rem'};">
                <h3 style="color: var(--text-primary); font-size: ${titleSize}; font-weight: 600; margin: 0; line-height: 1.3; flex: 1; word-wrap: break-word;">${service.title}</h3>
                <button id="closeModal" class="modal-close" style="
                    background: rgba(255, 255, 255, 0.1);
                    border: none;
                    color: var(--text-secondary);
                    font-size: ${isMobileModal ? '1.25rem' : '1.5rem'};
                    cursor: pointer;
                    padding: ${isMobileModal ? '8px' : '5px'};
                    border-radius: 50%;
                    width: ${isMobileModal ? '40px' : '35px'};
                    height: ${isMobileModal ? '40px' : '35px'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    flex-shrink: 0;
                    -webkit-tap-highlight-color: transparent;
                    position: relative;
                    z-index: 1001;
                    pointer-events: auto;
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                " title="Close modal">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div style="color: var(--text-secondary); line-height: ${lineHeight}; font-size: ${fontSize}; word-wrap: break-word; overflow-wrap: break-word;">
                ${formattedContent}
            </div>
        `;

        modal.appendChild(modalContent);
        // Ensure services section is a positioning context
        const previousSectionPosition = servicesSection.style.position;
        if (getComputedStyle(servicesSection).position === 'static') {
            servicesSection.style.position = 'relative';
        }
        servicesSection.appendChild(modal);

        // Close modal events - Simplified and reliable approach
        const closeBtn = modalContent.querySelector('#closeModal');
        let isClosing = false; // Prevent multiple close attempts
        
        // Simple close function
        const closeModal = () => {
            if (isClosing) return; // Prevent multiple close attempts
            isClosing = true;
            
            if (modal && modal.parentElement) {
                modal.parentElement.removeChild(modal);
            }
            // Restore services section positioning if altered
            servicesSection.style.position = previousSectionPosition || '';
            
            // Reset modal open flag
            this.isModalOpen = false;
            
            // Clean up event listeners
            document.removeEventListener('keydown', handleEscape);
            window.removeEventListener('orientationchange', handleOrientationChange);
            window.removeEventListener('resize', handleOrientationChange);
        };
        
        // Use a single, reliable click handler
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            closeModal();
            return false;
        }, { once: true }); // Use once: true to prevent multiple listeners
        
        // Add visual feedback
        closeBtn.addEventListener('mousedown', function() {
            this.style.background = 'rgba(255, 255, 255, 0.3)';
        });
        
        closeBtn.addEventListener('mouseup', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        // Enhanced touch handling for modal overlay
        let startY = 0;
        modal.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        modal.addEventListener('touchend', (e) => {
            // Only close if touch started and ended on the modal overlay (not content)
            if (e.target === modal && !isClosing) {
                const endY = e.changedTouches[0].clientY;
                const diffY = Math.abs(startY - endY);
                // Only close if not much vertical movement (not scrolling)
                if (diffY < 10) {
                    closeModal();
                }
            }
        }, { passive: true });
        
        // Modal overlay click handler - prevent conflicts with close button
        modal.addEventListener('click', (e) => {
            if (e.target === modal && !isClosing) {
                closeModal();
            }
        });

        // Close with Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape' && !isClosing) {
                closeModal();
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Handle orientation changes on mobile
        const handleOrientationChange = () => {
            if (isClosing) return; // Don't handle orientation changes if already closing
            // Small delay to let the browser adjust
            setTimeout(() => {
                const newIsMobile = window.innerWidth <= 480;
                const newIsSmallTablet = window.innerWidth > 480 && window.innerWidth <= 768;
                
                if (newIsMobile !== isMobileModal && !isClosing) {
                    // Recreate modal with new sizing if device orientation changed significantly
                    closeModal();
                    this.showServiceDetails(service);
                }
            }, 100);
        };
        
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);
    }

    // New method to show service details by title
    showServicePopupByTitle(title) {
        // Prevent multiple modals from being opened
        if (this.isModalOpen) {
            console.log('Modal already open, ignoring request');
            return;
        }
        
        const normalizedTitle = (title || '').toString().trim().toLowerCase();
        const details = Array.isArray(this.serviceDetails) ? this.serviceDetails : [];
        const service = details.find(s => (s.title || '').toString().trim().toLowerCase() === normalizedTitle);
        if (service) {
            this.showServiceDetails(service);
        } else {
            console.error(`Service with title "${title}" not found.`);
        }
    }

    formatServiceContentResponsive(details, fontSize, lineHeight) {
        // Split the content by double newlines to separate sections
        const sections = details.split('\n\n');
        let formattedContent = '';
        
        const isMobileModal = window.innerWidth <= 480;
        const listPadding = isMobileModal ? '1rem' : '1.5rem';
        const listMargin = isMobileModal ? '0.75rem 0' : '1rem 0';
        const listItemMargin = isMobileModal ? '0.5rem' : '0.75rem';
        const paragraphMargin = isMobileModal ? '0.75rem' : '1rem';
        
        sections.forEach((section, index) => {
            if (section.trim().startsWith('• ')) {
                // This is a bullet point section
                const questions = section.split('\n').filter(line => line.trim().startsWith('• '));
                if (questions.length > 0) {
                    formattedContent += `<ul style="margin: ${listMargin}; padding-left: ${listPadding};">`;
                    questions.forEach(question => {
                        const cleanQuestion = question.replace('• ', '').trim();
                        formattedContent += `<li style="margin-bottom: ${listItemMargin}; color: var(--text-secondary); line-height: ${lineHeight}; word-wrap: break-word; overflow-wrap: break-word;">${cleanQuestion}</li>`;
                    });
                    formattedContent += '</ul>';
                }
            } else if (section.trim()) {
                // This is a paragraph section
                formattedContent += `<p style="margin-bottom: ${paragraphMargin}; color: var(--text-secondary); line-height: ${lineHeight}; word-wrap: break-word; overflow-wrap: break-word;">${section.trim()}</p>`;
            }
        });
        
        return formattedContent;
    }

    bindEvents() {
        this.nextBtn.addEventListener('click', () => this.next());
        this.prevBtn.addEventListener('click', () => this.prev());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prev();
            if (e.key === 'ArrowRight') this.next();
        });

        // Enhanced touch/swipe support with better mobile handling
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let startTime = 0;
        
        this.grid.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startTime = Date.now();
            isDragging = true;
        }, { passive: true });
        
        this.grid.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });
        
        this.grid.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const diffX = startX - currentX;
            const timeDiff = Date.now() - startTime;
            const velocity = Math.abs(diffX) / timeDiff;
            
            // Require minimum distance or high velocity for swipe
            if (Math.abs(diffX) > 50 || velocity > 0.3) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            isDragging = false;
        }, { passive: true });

        // Add mouse wheel support for desktop
        this.grid.addEventListener('wheel', (e) => {
            // Only handle horizontal scrolling or when no vertical scroll
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.deltaY === 0) {
                e.preventDefault();
                if (e.deltaX > 0 || e.deltaY > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        }, { passive: false });
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.servicesCarousel = new ServicesCarousel();
});