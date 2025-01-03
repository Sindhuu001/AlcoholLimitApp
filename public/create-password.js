document.getElementById('passwordForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validate password
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  if (!passwordRegex.test(password)) {
    alert('Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.');
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  // Submit password to the server
  fetch('/set-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })
    .then((response) => {
      if (response.ok) {
        alert('Password set successfully!');
        window.location.href = '/login.html'; // Redirect to login page
      } else {
        return response.json().then((data) => {
          throw new Error(data.message || 'Failed to set password.');
        });
      }
    })
    .catch((error) => {
      alert(error.message);
    });
});
