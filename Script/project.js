
    document.addEventListener('DOMContentLoaded', function() {
        // Mobile Carousel Functionality
        const track = document.getElementById('projectsCarouselTrack');
        const prevBtn = document.getElementById('projectsPrevBtn');
        const nextBtn = document.getElementById('projectsNextBtn');
        const cards = document.querySelectorAll('.mobile-carousel .project-card');

        let currentIndex = 0;

        // Function to get currently visible project cards
        function getVisibleCards() {
            return document.querySelectorAll('.project-card[style="display: flex;"]');
        }

        // Function to update carousel position
        function updateCarousel() {
            const visibleCards = getVisibleCards();
            if (visibleCards.length === 0) return; // No cards to display

            const track = document.getElementById('projectsCarouselTrack');
            if (!track) return; // Ensure track exists

            const cardWidth = visibleCards[0].offsetWidth +
                             parseInt(getComputedStyle(visibleCards[0]).marginLeft) +
                             parseInt(getComputedStyle(visibleCards[0]).marginRight);
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

            // Update button states
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex === visibleCards.length - 1;

            // Show/hide carousel buttons based on visible cards count
            if (prevBtn) prevBtn.style.display = visibleCards.length > 1 ? 'block' : 'none';
            if (nextBtn) nextBtn.style.display = visibleCards.length > 1 ? 'block' : 'none';
        }

        if (track && prevBtn && nextBtn) {
            // Next button click handler
            nextBtn.addEventListener('click', function() {
                if (currentIndex < getVisibleCards().length - 1) {
                    currentIndex++;
                    updateCarousel();
                }
            });

            // Previous button click handler
            prevBtn.addEventListener('click', function() {
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                }
            });

            // Initialize carousel
            updateCarousel();

            // Update on window resize
            window.addEventListener('resize', () => {
                // Re-filter to get correct visible cards on resize if needed (though filter already handles this)
                const activeFilterButton = document.querySelector('.filter-btn.active');
                if (activeFilterButton) {
                    const filterValue = activeFilterButton.getAttribute('data-filter');
                    document.querySelectorAll('.project-card').forEach(card => {
                        const category = card.getAttribute('data-category');
                        if (filterValue === 'all' || filterValue === category) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                }
                currentIndex = 0; // Reset index on resize to prevent issues
                updateCarousel();
            });
        }

        // Filter functionality
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                // Filter projects
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filterValue === 'all' || filterValue === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Reset mobile carousel if it's visible
                if (window.getComputedStyle(document.querySelector('.mobile-carousel')).display !== 'none') {
                    currentIndex = 0;
                    // Ensure cards are filtered before updating carousel
                    setTimeout(updateCarousel, 0); // Use setTimeout to ensure DOM updates first
                }
            });
        });

        // Initial display of all cards (ensure they are 'flex' for carousel calculation)
        projectCards.forEach(card => card.style.display = 'flex');
        // Initial carousel update for "All" category
        updateCarousel();

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
                const caseId = this.getAttribute('data-case');
                const projectCard = this.closest('.project-card');
                const logoImg = projectCard.querySelector('.project-client-logo img');
                const logoSrc = logoImg ? logoImg.src : '';
                openModal(parseInt(caseId), logoSrc); // Convert caseId to an integer
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
