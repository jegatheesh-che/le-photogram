/**
 * Contact & Booking Form Interactive Handler
 */
export function initForms() {
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Send Inquiry';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Transmitting...';
      }

      setTimeout(() => {
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success-banner';
        successMsg.innerHTML = `
          <div class="form-success-icon">✓</div>
          <div class="form-success-text">
            <h4>THANK YOU FOR REACHING OUT</h4>
            <p>Your inquiry has been received. Our studio team will review your celebration date and respond within 24 to 48 hours.</p>
          </div>
        `;
        contactForm.style.display = 'none';
        contactForm.parentNode.insertBefore(successMsg, contactForm.nextSibling);
      }, 700);
    });
  }

  const bookingForm = document.querySelector('#booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting form...';
      }

      setTimeout(() => {
        const successMsg = document.createElement('div');
        successMsg.className = 'form-success-banner';
        successMsg.innerHTML = `
          <div class="form-success-icon">✓</div>
          <div class="form-success-text">
            <h4>CONSULTATION RESERVED</h4>
            <p>We look forward to meeting you. A calendar confirmation and private consultation link have been dispatched to your email.</p>
          </div>
        `;
        bookingForm.style.display = 'none';
        bookingForm.parentNode.insertBefore(successMsg, bookingForm.nextSibling);
      }, 700);
    });
  }
}
