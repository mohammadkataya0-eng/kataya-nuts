const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { initDB } = require('./config/db');

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/category');
const itemRoutes = require('./routes/item');

const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables
dotenv.config();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON and form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/items', itemRoutes);

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/signin', (req, res) => {
  res.render('signin');
});

app.get('/bag', (req, res) => {
  res.render('bag');
});

app.get('/checkout', (req, res) => {
  res.render('checkout');
});

app.get('/profile', (req, res) => {
  res.render('profile');
});

app.get('/admin', (req, res) => {
  res.render('admin/dashboard');
});

// Start server after DB is ready
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Kataya Nuts running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err.message);
    process.exit(1);
  });
