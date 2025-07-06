// server/index.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Create the Express App ---
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// --- Database Connection ---
mongoose.connect(process.env.DATABASE_URI)
.then(() => console.log("MongoDB connected successfully."))
.catch((err) => console.error("MongoDB connection error:", err));

// --- Import Consolidated Routes ---
const catalogueRoutes = require('./routes/catalogue');
const userRoutes = require('./routes/user');

// --- Use Routes with Base Paths ---
// All requests to /catalogue/... will be handled by catalogueRoutes
app.use('/catalogue', catalogueRoutes);
// All requests to /user/... will be handled by userRoutes
app.use('/user', userRoutes);

// --- Root Route for Health Check ---
app.get('/', (req, res) => {
    res.send('Clean Catalogue API is running!');
});

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});