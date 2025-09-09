 // Project filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.getAttribute('data-filter');
    
    // Update active button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Filter projects
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});


// Contact form functionality with null check
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        
        if (btnText) {
          btnText.style.display = 'none';
          btnText.textContent = 'Sending...';
          
          setTimeout(() => {
            btnText.style.display = 'block';
            btnText.textContent = 'Message Sent!';
            
            setTimeout(() => {
              btnText.textContent = 'Send Message';
            }, 3000);
          }, 2000);
        }
      });
    }
