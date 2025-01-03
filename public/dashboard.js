// Generate QR code functionality
document.getElementById('urlForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const documentUrl = document.getElementById('documentUrl').value;
  
    fetch('/generate-qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentUrl }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.qrCode) {
          alert('QR Code generated successfully!');
          document.getElementById('qrCodeContainer').style.display = 'block';
          document.getElementById('qrCodeImage').src = data.qrCode;
        } else {
          alert(data.message || 'An error occurred. Please try again.');
        }
      })
      .catch(error => {
        alert('An error occurred while generating the QR code.');
        console.error(error);
      });
  });
  
  // Logout functionality
  document.getElementById('logoutButton').addEventListener('click', function () {
    fetch('/logout', { method: 'POST' })
      .then(() => {
        alert('You have been logged out.');
        window.location.href = '/login.html';
      })
      .catch(error => {
        alert('An error occurred while logging out.');
        console.error(error);
      });
  });
  