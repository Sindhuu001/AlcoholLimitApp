const express = require('express');
const multer = require('multer');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
  })
);

// Simulated database
const users = [];

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes

// Home route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Registration route
app.post('/register', upload.single('healthDoc'), (req, res) => {
  const { name, age, mobile } = req.body;
  const healthDoc = req.file;

  // Input validation
  if (!name || !age || !mobile || !healthDoc) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (parseInt(age, 10) < 21) {
    return res.status(400).json({ message: 'Age must be 21 or older.' });
  }

  // Save user details (without password yet)
  users.push({
    name,
    age: parseInt(age, 10),
    mobile,
    healthDocPath: healthDoc.path,
    password: null, // Password to be set later
  });

  // Save mobile in session for password creation
  req.session.mobile = mobile;

  res.status(200).json({ message: 'Registration successful. Proceed to set password.' });
});

// Set password route
app.post('/set-password', (req, res) => {
  const { password } = req.body;
  const mobile = req.session.mobile;

  if (!mobile) {
    return res.status(403).json({ message: 'Session expired. Please register again.' });
  }

  const user = users.find((user) => user.mobile === mobile);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  // Save password
  user.password = password; // In production, hash the password
  req.session.mobile = null; // Clear session after setting password

  res.status(200).json({ message: 'Password set successfully.' });
});

// Login route
app.post('/login', (req, res) => {
  const { mobile, password } = req.body;

  // Find user
  const user = users.find((user) => user.mobile === mobile && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid mobile number or password.' });
  }

  res.status(200).json({ message: 'Login successful.', user });
});
// Route to check if a user is already registered
app.post('/check-user', (req, res) => {
    const { mobile } = req.body;
  
    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required.' });
    }
  
    const existingUser = users.find(user => user.mobile === mobile);
    if (existingUser) {
      return res.status(200).json({ registered: true });
    }
  
    return res.status(200).json({ registered: false });
  });
  const QRCode = require('qrcode');
// Serve the dashboard page
app.get('/dashboard', (req, res) => {
    res.sendFile(__dirname + '/public/dashboard.html');
  });
  


// Route to generate QR code from a URL
app.post('/generate-qr', async (req, res) => {
  const { documentUrl } = req.body;

  if (!documentUrl) {
    return res.status(400).json({ message: 'Document URL is required.' });
  }

  try {
    // Generate QR code containing the provided URL
    const qrCodeDataUrl = await QRCode.toDataURL(documentUrl);

    res.status(200).json({ message: 'QR Code generated successfully.', qrCode: qrCodeDataUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate QR code. Please try again.' });
  }
});

  
// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));
// Logout route
app.post('/logout', (req, res) => {
    // Clear user session or token logic here (if implemented)
    res.status(200).send('Logged out successfully');
  });






  const retailers = []; // Temporary storage for retailers

  app.post('/retailer-register', (req, res) => {
  const { storeId, storeName, contactNumber } = req.body;

  // Check if Store ID is already registered
  if (retailers.find(r => r.storeId === storeId)) {
    return res.status(400).json({ success: false, message: 'Store ID already registered.' });
  }

  // Save retailer information
  retailers.push({ storeId, storeName, contactNumber });
  res.status(200).json({ success: true, message: 'Retailer registered successfully.', storeId });
});

  
app.post('/set-retailer-password', (req, res) => {
    const { storeId, password } = req.body;
  
    // Find retailer by Store ID
    const retailer = retailers.find(r => r.storeId === storeId);
  
    if (!retailer) {
      return res.status(400).json({ success: false, message: 'Invalid Store ID.' });
    }
  
    // Set the password
    retailer.password = password;
    res.status(200).json({ success: true, message: 'Password set successfully.' });
  });
 
  
  
 // Assuming retailers is an array or database of registered retailers
app.post('/retailer-login', (req, res) => {
    const { storeId, password } = req.body;
    const retailer = retailers.find(r => r.storeId === storeId && r.password === password);
  
    if (retailer) {
      // Store the retailer's Store ID in the session or send it back in the response
      // Here, we can use a session management technique, or we simply return a success message with the Store ID.
      req.session.retailerStoreId = storeId; // Using session (if you're using session-based authentication)
      res.status(200).json({ success: true, message: 'Login successful', storeId: retailer.storeId });
    } else {
      res.status(401).json({ success: false, message: 'Invalid Store ID or Password' });
    }
  });
  // Route to get the retailer dashboard (only accessible if logged in)
app.get('/retailer-dashboard', (req, res) => {
    if (!req.session.retailerStoreId) {
      return res.status(401).json({ success: false, message: 'Please log in first.' });
    }
  
    res.status(200).json({ success: true, message: `Welcome to the dashboard of Store ID: ${req.session.retailerStoreId}` });
  });
  
  // Route for logout (clear session)
  app.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Logout failed.' });
      }
      res.status(200).json({ success: true, message: 'Logged out successfully.' });
    });
  });
  
  // Route to handle QR code scanning (Just an example, you can customize this as per your needs)
  app.post('/scan-qr', (req, res) => {
    const { qrCodeData } = req.body;
  
    // Example QR code data processing (you can extend it)
    if (!qrCodeData) {
      return res.status(400).json({ success: false, message: 'Invalid QR code data.' });
    }
  
    // Here you would typically fetch the user details related to the QR code
    // For now, we just send a success response
    res.status(200).json({ success: true, message: `Scanned QR code with data: ${qrCodeData}` });
  });
  
  // Default route to handle requests for static files (e.g., HTML)
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
  
  
 

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
