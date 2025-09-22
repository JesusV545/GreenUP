const select = (selector, scope = document) => scope.querySelector(selector);

const setMessage = (element, message, variant = 'danger') => {
  if (!element) return;
  element.textContent = message;
  element.className = `alert alert-${variant} ${message ? 'is-visible' : ''}`.trim();
  element.style.display = message ? 'block' : 'none';
};

const toggleInvalid = (input, isValid) => {
  if (!input) return;
  input.classList.toggle('is-invalid', !isValid);
};

document.addEventListener('DOMContentLoaded', () => {
  const form = select('#standalone-signup-form');
  if (!form) {
    return;
  }

  const nameInput = select('#ssu-name', form);
  const emailInput = select('#ssu-email', form);
  const passwordInput = select('#ssu-password', form);
  const alertBox =
    select('[data-alert="standalone-signup"]', form.parentElement) ||
    select('[data-alert="standalone-signup"]');
  const submitButton = select('[data-submit]', form);

  const validate = () => {
    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const password = passwordInput?.value.trim() || '';

    const nameValid = name.length >= 2;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordValid = password.length >= 8;

    toggleInvalid(nameInput, nameValid);
    toggleInvalid(emailInput, emailValid);
    toggleInvalid(passwordInput, passwordValid);

    return { name, email, password, nameValid, emailValid, passwordValid };
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const { name, email, password, nameValid, emailValid, passwordValid } = validate();

    if (!nameValid || !emailValid || !passwordValid) {
      setMessage(alertBox, 'Please complete all fields with valid information.');
      return;
    }

    setMessage(alertBox, '');

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent;
      submitButton.textContent = 'Creating account...';
    }

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = data?.message || 'Unable to create your account right now.';
        setMessage(alertBox, message);
        toggleInvalid(emailInput, false);
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalText || 'Sign up';
        }
        return;
      }

      window.location.replace('/products');
    } catch (error) {
      setMessage(alertBox, 'Network error. Please try again in a moment.');
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText || 'Sign up';
      }
    }
  });
});
