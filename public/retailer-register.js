document.getElementById('retailerRegisterForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const retailerData = {
    storeId: document.getElementById('storeId').value,
    storeName: document.getElementById('storeName').value,
    contactNumber: document.getElementById('contactNumber').value,
  };

  fetch('/retailer-register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(retailerData),
  })
    .then(response => response.json())
    .then(data => {
      alert(data.message || 'Registration successful.');
      if (data.success) {
        window.location.href = '/create-retailer-password.html';
      }
    })
    .catch(error => {
      alert('An error occurred during registration.');
      console.error(error);
    });
});
