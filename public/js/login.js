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

  const response = await fetch('/api/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    window.location.replace('/product');
  } else {
    window.alert('Login failed. Please try again.');
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
    signupNav.addEventListener('click', navigateTo('signUp'));
  }

  if (registerLink) {
    registerLink.addEventListener('click', navigateTo('signUp'));
  }

  if (cartLink) {
    cartLink.addEventListener('click', navigateTo('cart'));
  }

  if (aboutUsLink) {
    aboutUsLink.addEventListener('click', navigateTo('aboutUs'));
  }
}
