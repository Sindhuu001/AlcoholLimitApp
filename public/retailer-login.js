document.getElementById('retailerLoginForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const loginData = {
      storeId: document.getElementById('storeId').value,
      password: document.getElementById('password').value,
    };
  
    fetch('/retailer-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message || 'Login successful.');
        if (data.success) {
          window.location.href = '/retailer-dashboard.html';
        }
      })
      .catch(error => {
        alert('An error occurred during login.');
        console.error(error);
      });
  });
  