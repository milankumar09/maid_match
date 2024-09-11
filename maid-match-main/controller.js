const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./model'); 

// JWT Secret key
const JWT_SECRET = 'your_jwt_secret_key';

// Helper function to authenticate JWT token
const authenticateToken = (req, res, next) => {
    let token;
    
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        token = authHeader.split(' ')[1];
    } else if (req.query.token) {
        token = req.query.token;  // Extract token from the query parameter
    }

    if (!token) return res.redirect('/maid-match/login');
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.redirect('/maid-match/login');
        req.user = user;
        next();
    });
};

// Serve the login page
const loginPage = (req, res) => {
    res.render('login'); // Renders login.ejs
};

// Serve the register page
const registerPage = (req, res) => {
    res.render('register'); // Renders register.ejs
};

const aboutPage = (req, res) =>{
    res.render('about')
}

const pricingPage = (req, res) =>{
    res.render('pricing')
}

const faqPage = (req, res) =>{
    res.render('faq')
}

const feedbackpage = (req, res) =>{
    res.render('feedback')
}
// Handle user registration
const register = async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.redirect('/maid-match/login'); // After registration, redirect to login page
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user here' });
    }
};

// Handle user login
const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.render('login', { error: 'Invalid credentials' });
    }

    try {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'Invalid credentials' });
        }

        const accessToken = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
        // Redirect to home.ejs after login
        res.redirect(`/maid-match/home?token=${accessToken}`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

// Serve the home page (protected route)
const home = (req, res) => {
    res.render('home', { name: req.user.name, email: req.user.email });
};

// Handle logout
const logout = (req, res) => {
    // Clear token client-side
    res.redirect('/maid-match/login');
};

// Export controller functions
module.exports = { loginPage, registerPage, authenticateToken, register, login, home, logout, aboutPage, pricingPage, faqPage, feedbackpage };
