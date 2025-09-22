const performLogout = async () => {
  const response = await fetch('/api/auth/logout', {
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
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-action="logout"], #logout');
    if (!trigger) return;

    event.preventDefault();
    performLogout();
  });
}
