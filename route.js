const express = require('express');
const router = express.Router(); // Use express.Router
const controller = require('./controller'); // Correct import path for controller

// Render login page as the first page
router.get('/login', controller.loginPage);

// Render register page
router.get('/register', controller.registerPage);

router.get('/about', controller.aboutPage);
router.get('/pricing', controller.pricingPage);
router.get('/faq', controller.faqPage);
router.get('/feedback', controller.feedbackpage);

// Register and Login functionality
router.post('/register', controller.register);
router.post('/login', controller.login);

// Home page route, protected by JWT authentication
router.get('/home', controller.authenticateToken, controller.home);

// Logout route
router.get('/logout', controller.logout);

module.exports = router; // Correct export
