/**
 * Luxury Split Form Interactive Submission & Validation Controller
 */
export function initLuxurySplitForm(formSelector = '#sampleBookingForm') {
  const form = document.querySelector(formSelector);
  if (!form) return;

  // Set minimum date to today
  const dateInput = form.querySelector('input[type="date"]');
  if (dateInput) {
    try {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    } catch (e) {}

    const triggerPicker = () => {
      try {
        if (typeof dateInput.showPicker === 'function') dateInput.showPicker();
      } catch (err) {}
    };

    dateInput.addEventListener('click', triggerPicker);
    dateInput.addEventListener('focus', triggerPicker);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Transmitting Reservation...';
    }

    setTimeout(() => {
      const successMsg = document.createElement('div');
      successMsg.className = 'form-success-banner';
      successMsg.innerHTML = `
        <div class="form-success-icon" aria-hidden="true">&#10003;</div>
        <div class="form-success-text">
          <h4>CONSULTATION RESERVED</h4>
          <p>Your celebration date inquiry has been received. Our studio team will review your destination calendar and follow up within 24 hours.</p>
        </div>
      `;
      form.style.display = 'none';
      form.parentNode.insertBefore(successMsg, form.nextSibling);
    }, 750);
  });
}
