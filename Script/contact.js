 const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const submitBtnLoading = document.getElementById('submitBtnLoading'); // Get reference to the loading spinner
        const messageDiv = document.getElementById('messageDiv');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            console.log('📝 Form submitted!');
            setLoadingState(true);
            hideMessage();
            
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            console.log('📤 Creating WhatsApp message with data:', formData);

            try {
                // Create WhatsApp message template
                const whatsappMessage = `*New Contact Form Submission*
\n*Name:* ${formData.name}
*Email:* ${formData.email}
*Subject:* ${formData.subject}
\n*Message:*
${formData.message}`;
                
                // Encode the message for URL
                const encodedMessage = encodeURIComponent(whatsappMessage);
                
                // WhatsApp phone number (+94776844558)
                const phoneNumber = '94776844558';
                
                // Create WhatsApp URL
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
                
                // Open WhatsApp in a new tab
                window.open(whatsappUrl, '_blank');
                
                console.log('✅ WhatsApp message created and opened');
                showMessage('🎉 Message prepared! WhatsApp will open with your message. Thank you for contacting us!', 'success');
                form.reset();

            } catch (error) {
                console.error('❌ Error creating WhatsApp message:', error);
                showMessage('❌ Error preparing WhatsApp message. Please try again.', 'error');
            } finally {
                setLoadingState(false);
            }
        });

        function setLoadingState(isLoading) {
            submitBtn.disabled = isLoading;
            if (isLoading) {
                if (btnText) btnText.style.display = 'none'; // Hide original text
                if (submitBtnLoading) {
                    submitBtnLoading.style.display = 'flex'; // Show loading spinner
                    submitBtnLoading.setAttribute('aria-hidden', 'false');
                }
            } else {
                if (btnText) btnText.style.display = 'inline'; // Show original text
                if (submitBtnLoading) {
                    submitBtnLoading.style.display = 'none'; // Hide loading spinner
                    submitBtnLoading.setAttribute('aria-hidden', 'true');
                }
            }
        }

        function showMessage(text, type) {
            messageDiv.textContent = text;
            messageDiv.className = `message ${type}`;
            messageDiv.style.display = 'block';
            
            setTimeout(() => {
                hideMessage();
            }, 6000);
        }

        function hideMessage() {
            messageDiv.style.display = 'none';
        }

        // No backend connection needed for WhatsApp integration
        console.log('WhatsApp integration ready');