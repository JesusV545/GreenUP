if (typeof document !== 'undefined') {
  const feedbackForm = document.getElementById('review-form');

  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const feedbackField = document.getElementById('feedbackText');
      const emailField = document.getElementById('feedbackUsername');

      const feedback = feedbackField ? feedbackField.value.trim() : '';
      const email = emailField ? emailField.value.trim() : '';

      if (!feedback) {
        window.alert('Please enter feedback before submitting.');
        return;
      }

      const payload = {
        feedback,
        email,
        feedbackType: 'Complaint',
      };

      try {
        const response = await fetch('/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        const data = await response.json();
        window.alert(data.status || 'Thank you for the feedback!');

        if (feedbackField) {
          feedbackField.value = '';
        }

        if (emailField) {
          emailField.value = '';
        }
      } catch (error) {
        console.error('Error submitting feedback', error);
        window.alert('Unable to submit feedback right now.');
      }
    });
  }
}
