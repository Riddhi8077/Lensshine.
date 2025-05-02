require('dotenv').config();
const express = require('express');
const multer = require('multer');
const Razorpay = require('razorpay');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Models
const userSchema = new mongoose.Schema({
    phone: String,
    email: String,
    firstName: String,
    lastName: String,
    password: String,
    otp: String,
    otpExpires: Date,
    verified: Boolean
});
const User = mongoose.model('User', userSchema);

// Payment Gateways
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// File Upload Setup
const upload = multer({ dest: 'uploads/' });

// Dummy Product Data
const products = [
    {
        id: 1,
        name: 'Classic Aviator',
        price: 50.00,
        image: 'assets/images/product1.jpg',
    },
    {
        id: 2,
        name: 'Round Sunglasses',
        price: 60.00,
        image: 'assets/images/product2.jpg',
    },
];

// ==================== ROUTES ====================

// Product Routes
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Prescription Upload
app.post('/api/upload-prescription', upload.single('prescription'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    res.json({ message: 'Prescription uploaded successfully!', file: req.file });
});

// Payment Routes
app.post('/api/create-razorpay-order', (req, res) => {
    const { amount } = req.body;
    const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR',
    };
    razorpay.orders.create(options, (err, order) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(order);
    });
});

app.post('/api/create-stripe-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Amount in cents
            currency: 'usd',
        });
        res.json({ client_secret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Authentication Routes (OTP Simulation)
app.post('/api/send-otp', async (req, res) => {
    try {
        const { phone } = req.body;
        
        if (!phone) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number is required' 
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        await User.findOneAndUpdate(
            { phone },
            { otp, otpExpires },
            { upsert: true, new: true }
        );

        // In a real app, you would send this OTP via SMS
        // For development, we'll just log it and return it
        console.log(`OTP for ${phone}: ${otp}`);
        
        res.json({ 
            success: true, 
            message: 'OTP generated (check server logs)',
            otp: otp // Only for development - remove in production
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to generate OTP' });
    }
});

app.post('/api/verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const user = await User.findOne({ phone });
        
        if (!user || user.otp !== otp || user.otpExpires < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired OTP' });
        }

        user.verified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Verification failed' });
    }
});

app.post('/api/register', async (req, res) => {
    try {
        const { phone, email, firstName, lastName, password } = req.body;
        const user = await User.findOne({ phone, verified: true });
        
        if (!user) {
            return res.status(400).json({ error: 'Phone not verified' });
        }

        // In production: Hash password before saving
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.password = password;
        await user.save();

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Static File Routes
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});