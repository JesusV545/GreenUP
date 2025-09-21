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
          throw new Error('Request failed');
        }

        window.alert('Thank you for the feedback!');

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
