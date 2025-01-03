// Check if the user is already registered
document.getElementById('checkUserForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const mobile = document.getElementById('mobileCheck').value;

  fetch('/check-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.registered) {
        alert('You are already registered. Redirecting to login page.');
        window.location.href = '/login.html';
      } else {
        alert('Mobile number not found. Please proceed with registration.');
        document.getElementById('checkUserForm').style.display = 'none';
        document.getElementById('registrationForm').style.display = 'block';
        document.getElementById('mobile').value = mobile; // Pre-fill the mobile number
      }
    })
    .catch(error => {
      alert('An error occurred. Please try again.');
      console.error(error);
    });
});

// Handle the registration form submission
document.getElementById('registrationForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append('name', document.getElementById('name').value);
  formData.append('age', document.getElementById('age').value);
  formData.append('mobile', document.getElementById('mobile').value);
  formData.append('healthDoc', document.getElementById('healthDoc').files[0]);

  fetch('/register', {
    method: 'POST',
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Registration successful. Proceed to set password.') {
        alert(data.message);
        window.location.href = '/create-password.html';
      } else {
        alert(data.message || 'Registration failed.');
      }
    })
    .catch(error => {
      alert('An error occurred. Please try again.');
      console.error(error);
    });
});
