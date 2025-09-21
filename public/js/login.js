const select = (selector) => document.querySelector(selector);

const setAlert = (element, message) => {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle('is-visible', Boolean(message));
};

const setControlValidity = (input, isValid) => {
  if (!input) return;
  input.classList.toggle('is-invalid', !isValid);
};

const handleResponse = async (response) => {
  if (response.ok) {
    return null;
  }
  try {
    const data = await response.json();
    return data?.message || 'Something went wrong. Please try again.';
  } catch (error) {
    return 'Something went wrong. Please try again.';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = select('#login-form');
  const signupForm = select('#signup-form');
  const loginAlert = select('[data-alert="login"]');
  const signupAlert = select('[data-alert="signup"]');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const emailInput = select('#login-email');
      const passwordInput = select('#login-password');

      const email = emailInput?.value.trim();
      const password = passwordInput?.value.trim();

      const isEmailValid = Boolean(email);
      const isPasswordValid = Boolean(password);

      setControlValidity(emailInput, isEmailValid);
      setControlValidity(passwordInput, isPasswordValid);

      if (!isEmailValid || !isPasswordValid) {
        setAlert(loginAlert, 'Please provide your email and password.');
        return;
      }

      setAlert(loginAlert, '');

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const message = await handleResponse(response);

        if (message) {
          setAlert(loginAlert, message);
          setControlValidity(emailInput, false);
          setControlValidity(passwordInput, false);
          return;
        }

        window.location.replace('/products');
      } catch (error) {
        setAlert(loginAlert, 'Unable to reach the server. Please try again later.');
      }
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const nameInput = select('#signup-name');
      const emailInput = select('#signup-email');
      const passwordInput = select('#signup-password');

      const name = nameInput?.value.trim();
      const email = emailInput?.value.trim();
      const password = passwordInput?.value.trim();

      const isNameValid = name.length >= 2;
      const isEmailValid = Boolean(email);
      const isPasswordValid = password.length >= 8;

      setControlValidity(nameInput, isNameValid);
      setControlValidity(emailInput, isEmailValid);
      setControlValidity(passwordInput, isPasswordValid);

      if (!isNameValid || !isEmailValid || !isPasswordValid) {
        setAlert(signupAlert, 'Please complete all fields with valid information.');
        return;
      }

      setAlert(signupAlert, '');

      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const message = await handleResponse(response);

        if (message) {
          setAlert(signupAlert, message);
          setControlValidity(emailInput, false);
          return;
        }

        window.location.replace('/products');
      } catch (error) {
        setAlert(signupAlert, 'Unable to create your account right now. Please retry in a moment.');
      }
    });
  }
});
