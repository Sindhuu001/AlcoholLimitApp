document.getElementById('passwordForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const passwordData = {
      storeId: document.getElementById('storeId').value,
      password: document.getElementById('password').value,
    };
  
    fetch('/set-retailer-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordData),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message || 'Password set successfully.');
        if (data.success) {
          window.location.href = '/retailer-login.html'; // Redirect to login page
        }
      })
      .catch(error => {
        alert('An error occurred while setting the password.');
        console.error(error);
      });
  });
  