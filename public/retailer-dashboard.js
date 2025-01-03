// Handle Retailer Logout
document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('retailerStoreId'); // Clear the session
    window.location.href = '/retailer-login.html'; // Redirect to login page
  });
  
  // QR Scanner
  document.getElementById('openScannerButton').addEventListener('click', function () {
    document.getElementById('scannerContainer').style.display = 'block';
    startScanner();
  });
  
  function startScanner() {
    const video = document.getElementById('qrScannerVideo');
    const qrCodeResult = document.getElementById('qrCodeResult');
    
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(function (stream) {
        video.srcObject = stream;
        video.play();
        scanQRCode(video, qrCodeResult);
      })
      .catch(function (error) {
        console.error('Error accessing camera:', error);
        alert('Camera access required to scan QR codes.');
      });
  }
  
  function scanQRCode(video, qrCodeResult) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
  
    function scanFrame() {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
  
      if (code) {
        video.srcObject.getTracks().forEach(track => track.stop());
        qrCodeResult.textContent = `QR Code Data: ${code.data}`;
      } else {
        requestAnimationFrame(scanFrame);
      }
    }
    scanFrame();
  }
  