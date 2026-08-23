/* =============================================================
   contact.js — Contact form AJAX submission on contact.html
   Runs only on contact.html.

   What it does:
   1. Intercepts the form submit event (prevents a full-page redirect)
   2. Validates all required fields client-side before sending
   3. POSTs the form data to Formspree via fetch()
   4. On success: hides the form, shows the #formSuccess message
   5. On error: re-enables the submit button with a clear message

   Setup required:
   - Sign up at formspree.io (free)
   - Create a new form and copy its endpoint
   - Replace the `action` value on #contactForm in contact.html:
     action="https://formspree.io/f/YOUR-FORM-ID"
   ============================================================= */

(function () {
  'use strict';

  const form       = document.getElementById('contactForm');
  const submitBtn  = document.getElementById('contactSubmitBtn');
  const successMsg = document.getElementById('formSuccess');

  // Guard: if the form doesn't exist on this page, do nothing
  if (!form || !submitBtn || !successMsg) return;

  // ── Field references ────────────────────────────────────────
  const nameInput    = document.getElementById('contactName');
  const emailInput   = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');

  const requiredFields = [nameInput, emailInput, subjectInput, messageInput];

  // ── Validation helpers ──────────────────────────────────────

  /** Mark a field as invalid — adds .input-error CSS class. */
  function markInvalid(field) {
    field.classList.add('input-error');
    field.setAttribute('aria-invalid', 'true');
  }

  /** Clear an invalid field's error state. */
  function markValid(field) {
    field.classList.remove('input-error');
    field.removeAttribute('aria-invalid');
  }

  /**
   * Validate a single field.
   * Returns true if valid, false if not.
   */
  function validateField(field) {
    const empty = !field.value.trim();

    // For email inputs, also check format validity via browser API
    const badEmail = field.type === 'email' && !field.validity.valid;

    if (empty || badEmail) {
      markInvalid(field);
      return false;
    }
    markValid(field);
    return true;
  }

  // Clear error state as soon as the user starts correcting a field
  requiredFields.forEach(field => {
    field.addEventListener('input', () => markValid(field));
    field.addEventListener('change', () => markValid(field)); // for <select>
  });

  // ── Form submit handler ─────────────────────────────────────
  form.addEventListener('submit', async e => {
    e.preventDefault(); // stop the browser doing a full-page POST

    // Validate every required field
    let isValid = true;
    requiredFields.forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) {
      // Scroll to the first invalid field so the user sees what needs fixing
      const firstError = form.querySelector('.input-error');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError?.focus();
      return;
    }

    // ── Disable the button and show a loading state ──────────
    submitBtn.disabled    = true;
    submitBtn.textContent = 'Sending…';

    try {
      // Formspree accepts a standard FormData object.
      // The `Accept: application/json` header tells Formspree
      // to respond with JSON instead of redirecting the page.
      const res = await fetch(form.action, {
        method:  'POST',
        headers: { 'Accept': 'application/json' },
        body:    new FormData(form)
      });

      if (!res.ok) {
        // Formspree returns structured errors in the JSON body
        const data = await res.json().catch(() => ({}));
        const msg  = data?.errors?.[0]?.message ?? 'Submission failed';
        throw new Error(msg);
      }

      // ── Success ──────────────────────────────────────────
      // Hide the form and show the confirmation message.
      form.classList.add('hidden');
      successMsg.classList.remove('hidden');

      // Move focus into the success block so screen readers
      // announce it immediately
      successMsg.setAttribute('tabindex', '-1');
      successMsg.focus();

      // Smooth-scroll to the success message
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
      // ── Error ─────────────────────────────────────────────
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Send Message →';

      // Show an inline error message below the submit button
      // (only insert it once — avoid duplicates on repeated errors)
      if (!document.getElementById('formError')) {
        const errEl      = document.createElement('p');
        errEl.id         = 'formError';
        errEl.role       = 'alert';
        errEl.textContent = `Something went wrong: ${err.message}. Please try again, or email us directly at hello@aionioslife.com.`;
        errEl.style.cssText = 'color:#c0392b; font-size:0.875rem; margin-top:0.75rem;';
        submitBtn.insertAdjacentElement('afterend', errEl);
      }
    }
  });

})();
