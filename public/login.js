document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const mobile = document.getElementById('mobile').value.trim();
  const password = document.getElementById('password').value;

  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mobile, password }),
  })
    .then((response) => {
      if (response.ok) {
        alert('Login successful!');
        window.location.href = '/dashboard.html'; // Redirect to user dashboard
      } else {
        return response.json().then((data) => {
          throw new Error(data.message || 'Invalid credentials.');
        });
      }
    })
    .catch((error) => {
      alert(error.message);
    });
});
