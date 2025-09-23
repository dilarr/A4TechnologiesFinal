
// TechFlow Solutions - Interactive JavaScript (Fixed Version)

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVIGATION FUNCTIONALITY =====
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== THEME TOGGLE FUNCTIONALITY =====
    // Note: Theme toggle element not present in HTML - functionality disabled
    
    // ===== NAVBAR SCROLL EFFECTS =====
    
    const navbar = document.querySelector('#navbar');
    let lastScrollTop = 0;
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class for styling
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // ===== ANIMATED COUNTERS =====
    
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60 FPS
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString() + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }
    
    // Intersection Observer for counter animation
    const observerOptions = {
        threshold: 0.7,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    if (target) {
                        animateCounter(stat, target);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe stats sections
    const statsSection = document.querySelector('.stats');
    const aboutStats = document.querySelectorAll('.about-stat');
    
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    aboutStats.forEach(stat => {
        const statNumber = stat.querySelector('.stat-number');
        if (statNumber) {
            const target = parseInt(stat.getAttribute('data-count'));
            if (target) {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            animateCounter(statNumber, target);
                            observer.unobserve(entry.target);
                        }
                    });
                }, observerOptions);
                observer.observe(stat);
            }
        }
    });
    
    // ===== PROJECT FILTERING =====
    // Note: Project filtering functionality is now handled in project.js
    // This prevents conflicts between multiple filtering implementations
    
    // ===== FLOATING CARDS ANIMATION FIX =====
    
    // Fix for floating cards visibility and animation
    const floatingCards = document.querySelectorAll('.floating-card');
    
    if (floatingCards.length > 0) {
        // Ensure floating cards are visible and properly styled
        floatingCards.forEach((card, index) => {
            // Make sure cards are visible
            card.style.opacity = '1';
            card.style.visibility = 'visible';
            card.style.background = 'rgba(255, 255, 255, 0.1)';
            card.style.backdropFilter = 'blur(10px)';
            card.style.border = '1px solid rgba(255, 255, 255, 0.2)';
            card.style.color = 'white';
            
            // Add floating animation
            card.style.animation = `float ${3 + index}s ease-in-out infinite`;
            
            // Add hover effects
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.05)';
                this.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            });
        });
    }
    
    // Add floating keyframes if not exist
    if (!document.querySelector('#floating-keyframes')) {
        const style = document.createElement('style');
        style.id = 'floating-keyframes';
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===== SCROLL ANIMATIONS =====
    
    const scrollElements = document.querySelectorAll('.scroll-animate');
    
    if (scrollElements.length > 0) {
        const elementInView = (el, dividend = 1) => {
            const elementTop = el.getBoundingClientRect().top;
            return (
                elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend
            );
        };
        
        const elementOutofView = (el) => {
            const elementTop = el.getBoundingClientRect().top;
            return (
                elementTop > (window.innerHeight || document.documentElement.clientHeight)
            );
        };
        
        const displayScrollElement = (element) => {
            element.classList.add('animate');
        };
        
        const hideScrollElement = (element) => {
            element.classList.remove('animate');
        };
        
        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                if (elementInView(el, 1.25)) {
                    displayScrollElement(el);
                } else if (elementOutofView(el)) {
                    hideScrollElement(el);
                }
            });
        };
        
        window.addEventListener('scroll', handleScrollAnimation);
    }
    
    // ===== FORM HANDLING =====
    
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = 'var(--success-color)';
                
                // Reset form
                this.reset();
                
                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
                
                // Show success message
                showNotification('Message sent successfully!', 'success');
            }, 2000);
        });
    }

    // Handle general site loader (if any - ensure it doesn't conflict with form loader)
    const siteLoader = document.getElementById('loading'); // This is for the *site* loader
    if (siteLoader) {
        // Show loader only during initial page load
        if (document.readyState === 'loading') {
            siteLoader.classList.add('show');
        } else {
            siteLoader.classList.remove('show');
            siteLoader.style.display = 'none';
        }

        // Hide loader when page is fully loaded
        window.addEventListener('load', function() {
            setTimeout(() => {
                siteLoader.classList.remove('show');
                setTimeout(() => {
                    siteLoader.style.display = 'none';
                }, 500); // Match this duration with your CSS transition duration
            }, 1000); // Delay before starting fade out
        });

        // Fallback: ensure loader is hidden after maximum time
        setTimeout(() => {
            if (siteLoader.classList.contains('show')) {
                siteLoader.classList.remove('show');
                setTimeout(() => {
                    siteLoader.style.display = 'none';
                }, 500); // Match this duration with your CSS transition duration
            }
        }, 5000); // Hide after 5 seconds as a fallback
    }

    // ===== NOTIFICATION SYSTEM =====
    
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '90px',
            right: '20px',
            background: getNotificationColor(type),
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            transform: 'translateX(400px)',
            transition: 'all 0.3s ease',
            zIndex: '10000',
            maxWidth: '400px',
            minWidth: '300px'
        });
        
        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            margin-left: auto;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            removeNotification(notification);
        }, 5000);
        
        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            removeNotification(notification);
        });
    }
    
    function getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    function getNotificationColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#6366f1'
        };
        return colors[type] || colors.info;
    }
    
    function removeNotification(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // ===== PARALLAX EFFECTS =====
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.section-bg-image');
        
        if (parallaxElements.length > 0) {
            parallaxElements.forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
        
        // Floating cards parallax - Updated
        if (floatingCards.length > 0) {
            floatingCards.forEach((card, index) => {
                const speed = 0.1 + (index * 0.05);
                const currentTransform = card.style.transform || '';
                const yTransform = `translateY(${scrolled * speed}px)`;
                
                // Preserve existing transforms
                if (currentTransform.includes('scale') || currentTransform.includes('translate')) {
                    // Don't override hover effects
                    if (!card.matches(':hover')) {
                        card.style.transform = yTransform;
                    }
                } else {
                    card.style.transform = yTransform;
                }
            });
        }
    });
    
    // ===== FLOATING ELEMENTS ANIMATION =====
    
    function animateFloatingElements() {
        const floatingIcons = document.querySelectorAll('.floating-icon');
        
        if (floatingIcons.length > 0) {
            floatingIcons.forEach((icon, index) => {
                const baseDelay = index * 1000;
                
                setInterval(() => {
                    icon.style.transform = 'translateY(-10px) scale(1.1)';
                    setTimeout(() => {
                        icon.style.transform = 'translateY(0) scale(1)';
                    }, 500);
                }, 3000 + baseDelay);
            });
        }
    }
    
    animateFloatingElements();
    
    // ===== CLIENTS CONTINUOUS SCROLL =====
    // Pure CSS animation handles the continuous scrolling
    // No JavaScript needed for the basic functionality

    // ===== LOADING SCREEN =====
    
    // The general site loader is now handled by the contact form's submit handler.
    // This block is no longer needed for the site-wide loader.

    // ===== PROJECT CAROUSEL FUNCTIONALITY =====
    // Note: Project carousel functionality is now handled in project.js
    // This prevents conflicts between multiple carousel implementations
    
    // ===== INTERACTIVE HOVER EFFECTS =====
    
    // Service cards hover effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Team cards video play/pause
    const teamCards = document.querySelectorAll('.team-card');
    if (teamCards.length > 0) {
        teamCards.forEach(card => {
            const video = card.querySelector('video');
            
            if (video) {
                card.addEventListener('mouseenter', function() {
                    video.play();
                });
                
                card.addEventListener('mouseleave', function() {
                    video.pause();
                });
            }
        });
    }
    
    // ===== DYNAMIC BACKGROUND ANIMATIONS =====
    
    function createParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random position and size
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const animationDuration = Math.random() * 10 + 10;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: var(--primary-color);
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                opacity: 0.1;
                animation: float ${animationDuration}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
                pointer-events: none;
                z-index: -1;
            `;
            
            hero.appendChild(particle);
        }
    }
    
    createParticles();
    
    // ===== TYPEWRITER EFFECT =====
    
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Apply typewriter effect to hero title when in view
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter(heroTitle, originalText, 50);
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(heroTitle);
    }
    
    // ===== FORM VALIDATION =====
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            const value = input.value.trim();
            
            // Remove previous error styling
            input.style.borderColor = '';
            
            if (!value) {
                input.style.borderColor = 'var(--danger-color)';
                isValid = false;
            } else if (input.type === 'email' && !validateEmail(value)) {
                input.style.borderColor = 'var(--danger-color)';
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Add validation to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showNotification('Please fill in all required fields correctly.', 'error');
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateForm(form);
            });
        });
    });
    
    // ===== CURSOR TRAIL EFFECT =====
    
    function createCursorTrail() {
        const trail = [];
        const trailLength = 10;
        
        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: var(--primary-color);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                opacity: ${1 - i / trailLength};
                transform: scale(${1 - i / trailLength});
                transition: all 0.1s ease;
            `;
            document.body.appendChild(dot);
            trail.push(dot);
        }
        
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        function updateTrail() {
            for (let i = trail.length - 1; i > 0; i--) {
                trail[i].style.left = trail[i - 1].style.left;
                trail[i].style.top = trail[i - 1].style.top;
            }
            
            trail[0].style.left = mouseX + 'px';
            trail[0].style.top = mouseY + 'px';
            
            requestAnimationFrame(updateTrail);
        }
        
        updateTrail();
    }
    
    // Enable cursor trail on desktop only
    if (window.innerWidth > 768) {
        // createCursorTrail(); // Commented out to disable cursor trail
    }
    
    // Mobile menu functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    function initMobileMenu() {
        if (mobileMenuToggle && mobileNav) {
            mobileMenuToggle.removeEventListener('click', handleMobileMenuClick);
            mobileMenuToggle.addEventListener('click', handleMobileMenuClick);

            if (window.innerWidth <= 768) {
                // Removed inline styles, CSS media queries will handle display.
            }
        }
    }

    function handleMobileMenuClick() {
        this.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
    }

    initMobileMenu();

    window.addEventListener('resize', function() {
        if (window.innerWidth <= 768) {
            initMobileMenu();
        }
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    document.addEventListener('click', function(e) {
        if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Background slideshow functionality
    const slides = document.querySelectorAll('.slide');
    const heroTitleEl = document.querySelector('.hero h1');
    const heroSubEl = document.querySelector('.hero .hero-sub');
    let currentSlide = 0;

    const titles = [
        'Welcome to A4Technologies',
        'Build. Ship. Scale.',
        'Cloud-Native & AI-Ready',
        'Secure. Performant. Reliable.',
        'Your Partner in Digital Growth',
        'Comprehensive IT Solutions'
    ];
    const subtitles = [
        'Engineering modern software that scales with your ambition.',
        'From idea to production with quality and speed.',
        'Future-proof platforms with automation and intelligence.',
        'Best practices, clean code, and measurable outcomes.',
        'Let\'s turn your vision into a product users love.',
        'Explore our full range of professional services below.'
    ];

    function updateHeroText(index) {
        if (!heroTitleEl || !heroSubEl) return;
        heroTitleEl.classList.add('text-exit');
        heroSubEl.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        heroSubEl.style.opacity = '0';
        heroSubEl.style.filter = 'blur(8px)';
        heroSubEl.style.transform = 'translateY(20px) translateX(10px)';

        setTimeout(() => {
            heroTitleEl.textContent = titles[index % titles.length];
            heroTitleEl.classList.remove('text-exit');
            heroTitleEl.classList.add('text-enter');
            void heroTitleEl.offsetWidth;
            heroTitleEl.classList.add('text-enter-active');

            heroSubEl.textContent = subtitles[index % subtitles.length];
            heroSubEl.style.opacity = '1';
            heroSubEl.style.filter = 'blur(0)';
            heroSubEl.style.transform = 'translateY(0) translateX(0)';

            setTimeout(() => {
                heroTitleEl.classList.remove('text-enter', 'text-enter-active');
            }, 650);
        }, 250);
    }

    function showNextSlide() {
        document.body.style.overflowX = 'hidden';
        
        slides[currentSlide].classList.remove('active', 'next', 'prev');
        slides[currentSlide].classList.add('prev');
        currentSlide = (currentSlide + 1) % slides.length;
        
        const nextSlideIndex = (currentSlide + 1) % slides.length;
        slides[nextSlideIndex].classList.add('next');
        slides[currentSlide].classList.add('active');
        
        updateHeroText(currentSlide);
        
        setTimeout(() => {
            document.body.style.overflowX = 'hidden';
        }, 100);
    }

    slides[0]?.classList.add('active');
    slides[1]?.classList.add('next');
    updateHeroText(0);
    setInterval(showNextSlide, 5000);

    window.addEventListener('resize', () => {
        const slideshowContainer = document.querySelector('.slideshow-container');
        if (slideshowContainer) {
            slideshowContainer.style.overflow = 'hidden';
        }
        document.body.style.overflowX = 'hidden';
    });

    // ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all major sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease';
        animationObserver.observe(section);
    });
    
    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function for frequent events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Apply optimizations to scroll events (only if scroll elements exist)
    if (typeof handleScrollAnimation !== 'undefined') {
        const optimizedScrollHandler = throttle(handleScrollAnimation, 100);
        window.removeEventListener('scroll', handleScrollAnimation);
        window.addEventListener('scroll', optimizedScrollHandler);
    }
    
    // ===== DYNAMIC CONTENT LOADING =====
    
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // ===== ACCESSIBILITY ENHANCEMENTS =====
    
    // Focus management for mobile menu
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    function trapFocus(element) {
        const focusableContent = element.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusableElement) {
                        firstFocusableElement.focus();
                        e.preventDefault();
                    }
                }
            }
            
            if (e.key === 'Escape') {
                // Close mobile menu if open
                const mobileNav = document.getElementById('mobileNav');
                const mobileMenuToggle = document.getElementById('mobileMenuToggle');
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.classList.remove('active');
                    }
                }
            }
        });
    }
    
    // Mobile navigation focus management handled in index.html
    
    // ===== EASTER EGGS =====
    
    // Konami code easter egg
    let konamiCode = [];
    const konamiSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.code);
        
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateEasterEgg();
            konamiCode = [];
        }
    });
    
    function activateEasterEgg() {
        // Create rainbow effect
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        // Add rainbow keyframes if not exists
        if (!document.querySelector('#rainbow-styles')) {
            const style = document.createElement('style');
            style.id = 'rainbow-styles';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        showNotification('🎉 Easter egg activated! Rainbow mode enabled!', 'success');
        
        // Reset after 5 seconds
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});