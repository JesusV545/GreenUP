const logout = async () => {
  const response = await fetch('/api/users/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    window.location.replace('/');
  } else {
    window.alert('Unable to log out. Please try again.');
  }
};

if (typeof document !== 'undefined') {
  const logoutButton = document.querySelector('#logout');

  if (logoutButton) {
    logoutButton.addEventListener('click', logout);
  }
}
