const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs')
const route = require('./route');
const path = require('path'); // Add this

const app = express();

// Middleware to parse JSON request body
app.use(express.json());  // This is equivalent to body-parser.json()

// To handle URL-encoded data (e.g., from form submissions)
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files (like CSS, JS) if necessary
app.use(express.static(path.join(__dirname, 'public'))); // Correct this

// MongoDB connection setup
const dbURI = "mongodb+srv://milankr903:Milan12345@cluster0.kobuq.mongodb.net/?retryWrites=true&w=majority&appName=maidMatch";
mongoose.connect(dbURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use(express.json()); // To handle JSON requests

app.use((req, res, next) => {
  if (req.path === '/') {
    return res.redirect('/maid-match/login'); // Redirect when the initial route is '/'
  }
  next(); // Continue to other routes
});

app.use('/maid-match/', route); // Correct route usage

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}/maid-match`);
});
