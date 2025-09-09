 const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const submitBtnLoading = document.getElementById('submitBtnLoading'); // Get reference to the loading spinner
        const messageDiv = document.getElementById('messageDiv');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            setLoadingState(true);
            hideMessage();
            
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            try {
                const response = await fetch('/send-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (result.success) {
                    showMessage('🎉 Message sent successfully! මම ලඟදීම reply කරන්නම්', 'success');
                    form.reset();
                } else {
                    showMessage(`❌ ${result.message}`, 'error');
                }

            } catch (error) {
                console.error('Error:', error);
                showMessage('❌ Connection error. Server එක run වෙනවද බලන්න', 'error');
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

        // Check server connection on load
        window.addEventListener('load', async () => {
            try {
                const response = await fetch('/', { method: 'HEAD' });
                if (response.ok) {
                    console.log('✅ Server connection successful');
                }
            } catch (error) {
                console.log('❌ Server connection failed');
            }
             });