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
        // Re-bind read more buttons after restructuring
        const readMoreBtns = document.querySelectorAll('#services .read-more-btn');
        const serviceDetails = [
            {
                title: "Application Development",
                details: "• Are you still using multiple Excel sheets to manage your client information?\n\n• Do you spend hours every week combining reports from different sources?\n\n• Is your team entering the same data in more than one system?\n\n• Do you struggle to track project progress in real time?\n\n• Are important business updates still shared by email instead of a central platform?\n\n• Do you find it difficult to know which version of a document is the latest?\n\n• Are your customer details scattered across different files and tools?\n\n• Do you face delays because approvals or updates are manual?\n\n• Is it hard to get a clear picture of your sales or operations at a glance?\n\n• Is it hard to get a clear picture of your sales or operations at a glance?\n\nIf you answered yes to any of these questions, our expert development team can help you build the perfect solution. We specialize in creating custom applications using the latest technologies like React, Node.js, Python, and cloud platforms. Our development process includes thorough planning, agile development, comprehensive testing, and seamless deployment with ongoing support and maintenance."
            },
            {
                title: "IT Support",
                details: "• Do you often encounter problems with your computer or internet that you can't solve on your own?\n\n• Is your team losing precious time while waiting for technical issues to get fixed?\n\n• Are you concerned about what would happen if your computer suddenly crashed?\n\n• Are your important files and emails backed up and secure?\n\n• Do you have a plan ready in case your business experiences a cyber-attack?\n\n• Are your software updates and security fixes handled regularly?\n\n• Do you have a clear contact when there's a tech problem?\n\n• Is slow Wi-Fi or network outages making it hard for your team to work efficiently?\n\n• Are you confident that your business data is protected from hackers and viruses?\n\n• Do you find yourself spending more time fixing tech problems than actually running your business?\n\nIf any of these challenges sound familiar, our IT support team is here to help. We provide both remote and on-site support with guaranteed response times, proactive monitoring, and comprehensive solutions to keep your technology running smoothly and securely."
            },
            {
                title: "AI and Automation",
                details: "• Do you or your team spend hours every week doing the same repetitive tasks?\n\n• Are you still entering the same data into multiple systems manually?\n\n• Do you find it difficult to analyze large amounts of data to make decisions?\n\n• Are you missing opportunities because tasks take too long to complete?\n\n• Do you wish routine approvals, reminders, or follow-ups could happen automatically?\n\n• Would your team be more productive if they had more time for high-value work instead of admin tasks?\n\nIf you're ready to embrace the future of business technology, our AI and automation experts can help. We specialize in creating intelligent solutions that streamline repetitive tasks, provide valuable insights through machine learning, and help you make data-driven decisions that drive growth and efficiency."
            },
            {
                title: "Website and Social Media Marketing",
                details: "• Do your customers find it difficult to get the latest information about your business online?\n\n• Is your website outdated, slow, or hard to use on mobile phones?\n\n• Do you struggle to get new leads or sales through your website?\n\n• When people search for your business online, are you confident they can find you easily?\n\n• Do you want to reach more customers online? Are your competitors more visible on Google or social media than you?\n\n• Do you post on social media but see little engagement or results?\n\n• Is managing multiple social media accounts taking too much of your time?\n\n• Do you know if your website and social media are bringing you real business value?\n\n• Are you missing out on potential customers because you don't advertise online?\n\n• Do you wish you had a clear online strategy that works 24/7 to bring in clients?\n\nCome to us for help! We specialize in enhancing your social media marketing strategy and ensuring that the same posts are published on multiple platforms, including Facebook, Instagram, LinkedIn, and more. Additionally, we focus on optimizing your website for better visibility in Google Search."
            },
            {
                title: "Internet and Network Setup",
                details: "• Still relying on a small Telstra or Optus modem and struggling with weak Wi-Fi as you move around the office?\n\n• Do staff complain about constant internet dropouts, especially those working further away from the modem?\n\n• Have you noticed employees spending time on YouTube or Facebook during work hours, but not sure how to manage it?\n\n• Are some staff even playing online games on company devices when they should be working?\n\n• Is everyone in your office — including guests — using the same Wi-Fi password? (This makes it easy for hackers to get in!)\n\n• Would you like better visibility and control over internet usage in your workplace?\n\n• Is video conferencing often lagging or cutting out due to poor connectivity?\n\n• Do you have trouble managing multiple devices (computers, printers, phones) on your network?\n\n• Are your business systems at risk because your router or firewall is outdated?\n\n• Do you spend more time fixing internet issues than focusing on your business?\n\nIf any of these situations sound familiar and you need assistance, we have solutions for you. We are well-versed in trusted names in technology, such as Cisco and Ubiquiti, and can help meet your needs."
            },
            {
                title: "Desktop / Laptop Setup and Updating",
                details: "• Do you have multiple laptops and desktops but aren't sure if they're updated with the latest security and system patches?\n\n• When software needs an update, are you spending hours going from computer to computer to install it manually?\n\n• Do you know how many computers your business owns, how old they are, or when they should be replaced?\n\n• Do you buy new computers but struggle to set them up the right way?\n\n• Do you worry that your computer might be slow or unsafe because it's not updated?\n\n• Is installing software, email, and security tools on new devices taking too much of your time?\n\n• Do you have different staff using computers set up in different ways (no standard setup)?\n\n• Are important files and settings lost when you replace or upgrade computers?\n\n• Do you know if your devices are protected with antivirus and security tools?\n\n• Is your team frustrated by slow, unpatched, or outdated laptops?\n\n• Would it save you time if every new device was ready-to-use on day one with all apps and security configured?\n\nIf you want someone to manage your desktop computers and ensure that updates and security measures are properly implemented, we can help. We can set up your computers on a centralized management platform where you can oversee Windows updates, application installations, and much more!"
            },
            {
                title: "IT Security and Security Audit",
                details: "• Have you ever discovered that a former employee still had access to their old email account?\n\n• Are you getting annoying emails like 'You won a trip to Bali' or 'Register to win a million dollars' and not sure how to block them?\n\n• Do you worry that staff might click on unsafe links, even in emails that look trusted?\n\n• Is your company still storing all passwords in a single Excel sheet?\n\n• Could employees copy sensitive business information onto USB drives or share it without approval?\n\n• Are team members still writing down login passwords on sticky notes stuck to their screens?\n\n• Would your staff benefit from simple training on how to spot fake emails, manage passwords securely, and avoid online scams?\n\n• Are you interested in security standards like the Essential 8, but not sure where to begin?\n\n• Do you want an expert audit to check the strength of your email, network, and IT security?\n\nIf you are experiencing any of these issues, we can help. IT security is critically important, and small companies are often targeted by hackers more than larger ones."
            },
            {
                title: "Email and Communication",
                details: "• Are you still using personal email accounts for business communication?\n\n• Do you struggle to keep all your emails organized in one place?\n\n• Is it hard to find important messages when you need them?\n\n• Do you worry about losing emails or important attachments?\n\n• Are your team members using different tools for chat, calls, and emails, making communication confusing?\n\n• Do you experience delays because emails or messages are missed?\n\n• Is sharing calendars, tasks, or documents with your team difficult?\n\n• Are you concerned about the security of your business emails?\n\n• Do you wish there was a way to communicate with clients and team members more efficiently?\n\n• Would your team be more productive with a centralized, secure communication system?\n\nIf any of these situations sound familiar and you need assistance, please let us know. We specialise in Outlook, shared mailboxes, email forwarding, email backups, email monitoring, and much more."
            },
            {
                title: "Document Management",
                details: "• Are your important documents scattered across multiple computers, emails, or drives?\n\n• Do you struggle to find the latest version of a file when you need it?\n\n• Is sharing documents with your team slow or complicated?\n\n• Do you worry about losing critical files due to accidental deletion or hardware failure?\n\n• Are paper documents still taking up space and slowing down your workflow?\n\n• Do you spend too much time manually organising or naming files?\n\n• Are approvals or document workflows taking longer than they should?\n\n• Is it hard to track who accessed or edited a document?\n\n• Do you face security risks with sensitive documents being stored in unsecured locations?\n\n• Would your team benefit from a centralised, easy-to-use system for all documents?\n\n If any of these situations sound familiar, we can help you manage and share your documents more effectively. Just let us know what you need, and we can explore cost-effective, reliable, and user-friendly solutions for you!"
            }
        ];

        // Expose details for use from footer links and other triggers
        this.serviceDetails = serviceDetails;

        readMoreBtns.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Clicked Read More button. Index:', index, 'Service Details:', serviceDetails[index]);
                // Ensure serviceDetails[index] exists before trying to access its properties
                if (serviceDetails[index]) {
                    this.showServiceDetails(serviceDetails[index]);
                } else {
                    console.error(`Service details not found for index: ${index}`);
                }
            });
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
                <button id="closeModal" style="
                    background: none;
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
                " ontouchstart="" onmouseover="this.style.background='var(--border-color)'; this.style.color='var(--text-primary)'" onmouseout="this.style.background='none'; this.style.color='var(--text-secondary)'">
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

        // Close modal events
        const closeBtn = modalContent.querySelector('#closeModal');
        const closeModal = () => {
            if (modal.parentElement) {
                modal.parentElement.removeChild(modal);
            }
            // Restore services section positioning if altered
            servicesSection.style.position = previousSectionPosition || '';
        };
        
        // Close instantly on first press/tap
        closeBtn.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            closeModal();
        }, { once: true });
        
        // Enhanced touch handling for mobile
        let startY = 0;
        modal.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        modal.addEventListener('touchend', (e) => {
            // Only close if touch started and ended on the modal overlay (not content)
            if (e.target === modal) {
                const endY = e.changedTouches[0].clientY;
                const diffY = Math.abs(startY - endY);
                // Only close if not much vertical movement (not scrolling)
                if (diffY < 10) {
                    closeModal();
                }
            }
        }, { passive: true });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Close with Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        // Handle orientation changes on mobile
        const handleOrientationChange = () => {
            // Small delay to let the browser adjust
            setTimeout(() => {
                const newIsMobile = window.innerWidth <= 480;
                const newIsSmallTablet = window.innerWidth > 480 && window.innerWidth <= 768;
                
                if (newIsMobile !== isMobileModal) {
                    // Recreate modal with new sizing if device orientation changed significantly
                    closeModal();
                    this.showServiceDetails(service);
                }
            }, 100);
        };
        
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);
        
        // Clean up event listeners when modal closes
        const originalClose = closeModal;
        const newCloseModal = () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            window.removeEventListener('resize', handleOrientationChange);
            originalClose();
        };
        
        closeBtn.removeEventListener('click', closeModal);
        closeBtn.addEventListener('click', newCloseModal);
        
        modal.removeEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) newCloseModal();
        });
    }

    // New method to show service details by title
    showServicePopupByTitle(title) {
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