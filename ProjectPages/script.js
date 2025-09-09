 // Simple animation for list items
            document.addEventListener('DOMContentLoaded', function() {
                const listItems = document.querySelectorAll('.approach-list li');
                
                listItems.forEach((item, index) => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, 200 * index);
                });
                
                // Animation for client image frame
                const clientFrame = document.querySelector('.client-image-frame');
                clientFrame.style.transform = 'scale(0.9)';
                clientFrame.style.opacity = '0';
                
                setTimeout(() => {
                    clientFrame.style.transition = 'all 0.8s ease';
                    clientFrame.style.transform = 'scale(1)';
                    clientFrame.style.opacity = '1';
                }, 500);
                
                // Animation for back button
                const backButton = document.querySelector('.back-button');
                backButton.style.opacity = '0';
                backButton.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    backButton.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    backButton.style.opacity = '1';
                    backButton.style.transform = 'translateY(0)';
                }, 300);

                // Check if image failed to load and show placeholder
                const clientLogo = document.querySelector('.client-logo');
                const logoPlaceholder = document.getElementById('logo-placeholder');
                
                if (clientLogo && clientLogo.complete && clientLogo.naturalHeight === 0) {
                    clientLogo.style.display = 'none';
                    logoPlaceholder.style.display = 'flex';
                }
            });