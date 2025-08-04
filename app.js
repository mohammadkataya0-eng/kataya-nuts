const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth'); // ✅ <-- ADD THIS

const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON and form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', authRoutes); // ✅ <-- ADD THIS

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/bag', (req, res) => {
  res.render('bag');
});

app.get('/checkout', (req, res) => {
  res.render('checkout');
});

const categoryRoutes = require('./routes/category');
const itemRoutes = require('./routes/item');

app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);

app.get('/admin', (req, res) => {
  res.render('admin/dashboard');
});
app.get('/admin-login', (req, res) => {
  res.render('admin/login');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Kataya Nuts running on http://localhost:${PORT}`);
});
