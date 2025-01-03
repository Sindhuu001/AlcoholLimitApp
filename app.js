function navigateTo(role) {
    if (role === 'user') {
      window.location.href = '/register.html'; // Redirect to registration page
    } else if (role === 'retailer') {
      window.location.href = '/retailer'; // Redirect to retailer page
    }
  }
  