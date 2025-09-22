const select = (selector, scope = document) => scope.querySelector(selector);

const ensureMessageContainer = (form) => {
  let message = form.querySelector('[data-feedback-alert]');
  if (!message) {
    message = document.createElement('div');
    message.setAttribute('data-feedback-alert', '');
    message.className = 'alert alert-info mt-3';
    message.style.display = 'none';
    form.appendChild(message);
  }
  return message;
};

const showMessage = (element, message, variant = 'info') => {
  if (!element) return;
  element.textContent = message;
  element.className = `alert alert-${variant} mt-3`;
  element.style.display = message ? 'block' : 'none';
};

if (typeof document !== 'undefined') {
  const feedbackForm = select('#feedback-form');

  if (feedbackForm) {
    const feedbackField = select('#feedbackText', feedbackForm);
    const emailField = select('#feedbackUsername', feedbackForm);
    const messageBox = ensureMessageContainer(feedbackForm);

    feedbackForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const feedback = feedbackField ? feedbackField.value.trim() : '';
      const email = emailField ? emailField.value.trim() : '';

      if (!feedback) {
        showMessage(messageBox, 'Please enter feedback before submitting.', 'warning');
        return;
      }

      const payload = {
        body: feedback,
        topic: email ? `Feedback from ${email}` : 'Feedback',
      };

      try {
        const response = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data?.message || 'Request failed');
        }

        showMessage(messageBox, 'Thank you for the feedback!', 'success');

        if (feedbackField) {
          feedbackField.value = '';
        }

        if (emailField) {
          emailField.value = '';
        }
      } catch (error) {
        console.error('Error submitting feedback', error);
        showMessage(
          messageBox,
          'Unable to submit feedback right now. Please try again later.',
          'danger'
        );
      }
    });
  }
}
