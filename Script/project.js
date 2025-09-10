
    document.addEventListener('DOMContentLoaded', function() {
        // Enhanced Mobile Carousel Functionality
        const track = document.getElementById('projectsCarouselTrack');
        const prevBtn = document.getElementById('projectsPrevBtn');
        const nextBtn = document.getElementById('projectsNextBtn');
        
        if (!track || !prevBtn || !nextBtn) return;

        let currentIndex = 0;
        let isAnimating = false;
        let autoPlayInterval;

        // Function to get currently visible project cards in mobile carousel
        function getVisibleCards() {
            return track.querySelectorAll('.project-card[style*="display: flex"], .project-card:not([style*="display: none"])');
        }

        // Function to get cards per view based on screen size
        function getCardsPerView() {
            if (window.innerWidth <= 480) return 1;
            if (window.innerWidth <= 768) return 1;
            return 1; // Always show 1 card at a time for better mobile experience
        }

        // Function to update carousel position with smooth animation
        function updateCarousel(smooth = true) {
            const visibleCards = getVisibleCards();
            if (visibleCards.length === 0) return;

            const cardsPerView = getCardsPerView();
            const maxIndex = Math.max(0, visibleCards.length - cardsPerView);
            currentIndex = Math.min(currentIndex, maxIndex);

            const cardWidth = visibleCards[0].offsetWidth + 
                             parseInt(getComputedStyle(visibleCards[0]).marginLeft) + 
                             parseInt(getComputedStyle(visibleCards[0]).marginRight);
            
            const translateX = -(currentIndex * cardWidth);
            
            if (smooth) {
                track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            } else {
                track.style.transition = 'none';
            }
            
            track.style.transform = `translateX(${translateX}px)`;

            // Update button states
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
            
            // Add visual feedback for disabled buttons
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
        }

        // Next button click handler
        nextBtn.addEventListener('click', function() {
            if (isAnimating) return;
            
            const visibleCards = getVisibleCards();
            const cardsPerView = getCardsPerView();
            const maxIndex = Math.max(0, visibleCards.length - cardsPerView);
            
            if (currentIndex < maxIndex) {
                isAnimating = true;
                currentIndex++;
                updateCarousel();
                
                setTimeout(() => {
                    isAnimating = false;
                }, 400);
            }
        });

        // Previous button click handler
        prevBtn.addEventListener('click', function() {
            if (isAnimating) return;
            
            if (currentIndex > 0) {
                isAnimating = true;
                currentIndex--;
                updateCarousel();
                
                setTimeout(() => {
                    isAnimating = false;
                }, 400);
            }
        });

        // Touch/swipe support for mobile
        let startX = 0;
        let startY = 0;
        let isDragging = false;

        track.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            track.style.transition = 'none';
        });

        track.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            const diffX = startX - currentX;
            const diffY = startY - currentY;
            
            // Only handle horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY)) {
                e.preventDefault();
                
                const visibleCards = getVisibleCards();
                if (visibleCards.length === 0) return;
                
                const cardWidth = visibleCards[0].offsetWidth + 
                                 parseInt(getComputedStyle(visibleCards[0]).marginLeft) + 
                                 parseInt(getComputedStyle(visibleCards[0]).marginRight);
                
                const currentTranslate = -(currentIndex * cardWidth);
                const newTranslate = currentTranslate - diffX;
                
                track.style.transform = `translateX(${newTranslate}px)`;
            }
        });

        track.addEventListener('touchend', function(e) {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            const threshold = 50; // Minimum swipe distance
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    // Swipe left - next
                    nextBtn.click();
                } else {
                    // Swipe right - previous
                    prevBtn.click();
                }
            } else {
                // Snap back to current position
                updateCarousel();
            }
        });

        // Auto-play functionality
        function startAutoPlay() {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
            
            autoPlayInterval = setInterval(() => {
                const visibleCards = getVisibleCards();
                const cardsPerView = getCardsPerView();
                const maxIndex = Math.max(0, visibleCards.length - cardsPerView);
                
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0; // Loop back to start
                }
                updateCarousel();
            }, 5000); // Change slide every 5 seconds
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        // Pause auto-play on hover/touch
        track.addEventListener('mouseenter', stopAutoPlay);
        track.addEventListener('mouseleave', startAutoPlay);
        track.addEventListener('touchstart', stopAutoPlay);
        track.addEventListener('touchend', () => {
            setTimeout(startAutoPlay, 3000); // Resume after 3 seconds
        });

        // Initialize carousel
        updateCarousel(false);
        startAutoPlay();

        // Update on window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                currentIndex = 0; // Reset index on resize
                updateCarousel(false);
            }, 250);
        });

        // Enhanced Filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                // Filter projects with smooth animation
                projectCards.forEach((card, index) => {
                    const category = card.getAttribute('data-category');
                    const isVisible = filterValue === 'all' || filterValue === category;

                    if (isVisible) {
                        card.style.display = 'flex';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(-20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });

                // Reset mobile carousel if it's visible
                if (window.getComputedStyle(document.querySelector('.mobile-carousel')).display !== 'none') {
                    currentIndex = 0;
                    // Ensure cards are filtered before updating carousel
                    setTimeout(() => {
                        updateCarousel(false);
                        startAutoPlay(); // Restart auto-play after filtering
                    }, 100);
                }
            });
        });

        // Initial display of all cards (ensure they are 'flex' for carousel calculation)
        projectCards.forEach(card => {
            card.style.display = 'flex';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        
        // Initial carousel update for "All" category
        setTimeout(() => {
            updateCarousel(false);
        }, 100);

        // Modal functionality
        const modalOverlay = document.getElementById('caseStudyModal');
        const modalClose = document.getElementById('modalClose');
        const modalImage = document.getElementById('modalImage');
        const modalLogo = document.getElementById('modalLogo');
        const modalTitle = document.getElementById('modalTitle');
        const modalSubtitle = document.getElementById('modalSubtitle');
        const modalClient = document.getElementById('modalClient');
        const modalApproach = document.getElementById('modalApproach');

        // Case study data
        const caseStudies = {
            1: {
                image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                title: "Application Development",
                subtitle: "Swiss Heritage",
                client: "The client registration process currently relies on a manual, paper-based system, which has proven to be inefficient and cumbersome. This approach makes it challenging to accurately track client registrations, as well as manage and maintain contact information. As a result, there is a significant risk of lost documents, miscommunication, and delays in processing. The lack of a streamlined system not only hinders organizational efficiency but also affects the quality of service provided to clients. An upgrade to a digital registration system could greatly enhance tracking capabilities and improve overall communication.",
                approach: [
                    "Implemented custome CRM platform to enter customer data",
                    "Emberdad the online registration to current company website",
                    "Store customer information in a SharePoint",
                    "generate Power BI report platform "
                ]
            },
            2: {
                image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                title: "IT Infrastructure Support",
                subtitle: "BusinessPlex",
                client: "<p>BusinessPlex has successfully relocated to a new facility and is initiating a comprehensive restructuring of its network infrastructure. This includes the optimisation of Windows laptops for enhanced performance and security, as well as the redesign of meeting rooms to facilitate better collaboration and communication. The goal is to create a more efficient working environment that supports the company's growth and enhances productivity for all employees.</p>",
                approach: [
                    "Set up Ubiquiti router and wireless access points for continuous internet and network support",
                    "Set up new laptops (10 x laptops) workstations",
                    "Configured the Active Directory and the environment specified by O365",
                    "Configured a firewall that can monitor and control the traffic on the network "
                ]
            },
            3: {
                image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                title: "SharePoint and OneDrive",
                subtitle: "Southbank Montessori",
                client: "<p>Southbank has been utilizing Microsoft Word and Excel for their daily work, but they have not been backing up or saving files in the file repository. Instead, the documents were saved on the local device. Additionally, they lacked the capability for team members to work on a document simultaneously</p>",
                approach: [
                    "Introduced OneDrive and SharePoint as file repositories",
                    "Data backup system integrated with OneDrive and SharePoint",
                    "Team members can now work simultaneously on a single document, making changes and tracking them",
                    "Introduced new storage solutions to prevent data loss"
                ]
            },
            4: {
                image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                title: "Cyber Security Audit",
                subtitle: "BusinessPlex",
                client: "<p>The legal firm of Hasintha. Corporation is on the rise, and as they continue to grow, they're looking to ensure their ICT security is up to par. An audit is on the horizon, and they're ready to take their tech to the next level. </p>",
                approach: [
                    "Audit activities identified in O365, security groups, file repositories, IT processes, and infrastructure",
                    "Every item in the audit activity was thoroughly reviewed to identify issues and recommendations",
                    "Provided a detailed report with recommendations to help a legal firm improve its security measures"

                ]
            },
            5: {
                image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                title: "IT Service Desk Operations and Management",
                subtitle: "Southbank Montessori",
                client: "<p>Southbank Montessori, was searching for a reliable and service-oriented ICT provider to manage their IT infrastructure. They needed a provider who could offer both on-site and remote ICT support to ensure that their IT environment was stable, secure, and always up-to-date. </p>",
                approach: [
                    "Carried out initial assessment to identify the infrastructure and service environment",
                    "Implemented a service desk portal to log IT issues",
                    "Introduced regular site visits to capture new issues and discuss them with staff",
                    "Monthly meeting with management about the IT improvement and future roadmap",
                    "Set up a remote desktop environment where issues can be resolved remotely"
                ]
            },
            6: {
                image: "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
                title: "Microsoft 365 Configuration and SharePoint ",
                subtitle: "Swiss Heritage",
                client: "<p>Swiss Heritage had been utilising Google Business for their email communications and document storage needs. However, management expressed dissatisfaction with this solution, feeling it lacked the comprehensive features they required. In search of a more integrated and holistic approach, they began exploring options that would encompass both email functionality and seamless integration with SharePoint for enhanced collaboration and document management.</p>",
                approach: [
                    "Correctly identified the Microsoft Office 365 license type for the organisation, resulting in cost savings and access to bundled features such as Teams, OneDrive, Power BI, and the Office package",
                    "Restructure the email administration portal and limit the admin access",
                    "Improved security, email sharing, and spam detection in the admin portal ",
                    "Setup SharePoint as a document management platform and enable users to work simultaneously"
                ]
            }
        };

        // Function to open modal with case study data
        function openModal(caseId, logoSrc) {
            const caseStudy = caseStudies[caseId];

            if (caseStudy) {
                modalImage.src = caseStudy.image;
                modalImage.alt = caseStudy.title;
                modalLogo.src = logoSrc;
                modalLogo.alt = "Client Logo";
                modalTitle.textContent = caseStudy.title;
                modalSubtitle.textContent = caseStudy.subtitle;
                modalClient.innerHTML = caseStudy.client;

                // Clear previous approach items
                modalApproach.innerHTML = '';

                // Add approach items
                caseStudy.approach.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    modalApproach.appendChild(li);
                });

                // Show modal
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
        }

        // Add click event to all "View Case Study" buttons
        const viewButtons = document.querySelectorAll('.view-case-study');
        viewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const projectCard = this.closest('.project-card');
                // Prefer explicit data-case on the button; fallback to the card's data-case
                let caseId = this.getAttribute('data-case') || (projectCard && projectCard.getAttribute('data-case'));
                if (!caseId) return; // no case id found
                const logoImg = projectCard ? projectCard.querySelector('.project-client-logo img') : null;
                const logoSrc = logoImg ? logoImg.src : '';
                openModal(parseInt(caseId, 10), logoSrc);
            });
        });

        // Close modal functionality
        modalClose.addEventListener('click', function() {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        });

        // Close modal when clicking outside content
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = ''; // Re-enable scrolling
            }
        });
    });
