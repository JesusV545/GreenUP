const loginFormHandler = async (event) => {
  event.preventDefault();

  const emailField = document.querySelector('#loginName');
  const passwordField = document.querySelector('#loginPassword');

  if (!emailField || !passwordField) {
    return;
  }

  const email = emailField.value.trim();
  const password = passwordField.value.trim();

  if (!email || !password) {
    window.alert('Please provide both email and password.');
    return;
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      window.location.replace('/products');
      return;
    }

    let message = 'Login failed. Please try again.';
    try {
      const data = await response.json();
      if (data?.message) {
        message = data.message;
      }
    } catch (parseError) {
      // ignore JSON parse issues and fall back to default message
    }

    window.alert(message);
  } catch (error) {
    window.alert('Unable to reach the server. Please try again later.');
  }
};

const navigateTo = (path) => (event) => {
  event.preventDefault();
  window.location.replace(path);
};

if (typeof document !== 'undefined') {
  const loginButton = document.getElementById('loginbutton');
  const signupNav = document.getElementById('signup');
  const registerLink = document.querySelector('#reg-btn');
  const cartLink = document.querySelector('#cart-btn');
  const aboutUsLink = document.querySelector('#about-us');

  if (loginButton) {
    loginButton.addEventListener('click', loginFormHandler);
  }

  if (signupNav) {
    signupNav.addEventListener('click', navigateTo('/signup'));
  }

  if (registerLink) {
    registerLink.addEventListener('click', navigateTo('/signup'));
  }

  if (cartLink) {
    cartLink.addEventListener('click', navigateTo('/cart'));
  }

  if (aboutUsLink) {
    aboutUsLink.addEventListener('click', navigateTo('/about-us'));
  }
}
