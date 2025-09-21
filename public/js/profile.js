const newFormHandler = async (event) => {
  event.preventDefault();

  const nameField = document.querySelector('#name1');
  const emailField = document.querySelector('#email1');
  const passwordField = document.querySelector('#password1');

  if (!nameField || !emailField || !passwordField) {
    return;
  }

  const name = nameField.value.trim();
  const email = emailField.value.trim();
  const password = passwordField.value.trim();

  if (!name || !email || !password) {
    window.alert('Please complete all fields.');
    return;
  }

  const response = await fetch('/api/auth', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.ok) {
    window.location.replace('/products');
  } else {
    window.alert('Unable to create account. Please try again.');
  }
};

if (typeof document !== 'undefined') {
  const signupButton = document.querySelector('#signup-btn');

  if (signupButton) {
    signupButton.addEventListener('click', newFormHandler);
  }
}
