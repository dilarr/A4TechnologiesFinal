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

            console.log('📤 Sending data:', formData);

            try {
                console.log('🌐 Making request to backend...');
                const response = await fetch('http://localhost:3001/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                console.log('📨 Response received:', response.status);

                const result = await response.json();
                console.log('📋 Response data:', result);

                if (result.success) {
                    console.log('✅ Success! Email should be sent');
                    showMessage('🎉 Message sent successfully! Thank you for contacting us. We will get back to you soon!', 'success');
                    form.reset();
                } else {
                    console.log('❌ Backend returned error:', result.message);
                    showMessage(`❌ ${result.message}`, 'error');
                }

            } catch (error) {
                console.error('❌ Frontend error:', error);
                showMessage('❌ Connection error. Please make sure the backend server is running on port 4000', 'error');
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

        // Check backend server connection on load
        window.addEventListener('load', async () => {
            try {
                const response = await fetch('http://localhost:3001/contact', { method: 'HEAD' });
                if (response.ok) {
                    console.log('✅ Backend server connection successful');
                }
            } catch (error) {
                console.log('❌ Backend server connection failed - make sure to run: npm run start:dev in the backend folder (port 4000)');
            }
        });