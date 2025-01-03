// Simple client-side validation for retailer registration form
document.querySelector('form').addEventListener('submit', function(event) {
    const storeId = document.getElementById('storeId').value;
    const storeName = document.getElementById('storeName').value;
    const contactNumber = document.getElementById('contactNumber').value;
    const password = document.getElementById('password').value;
  
    if (!storeId || !storeName || !contactNumber || !password) {
      event.preventDefault();
      alert('All fields are required!');
    }
  });
  