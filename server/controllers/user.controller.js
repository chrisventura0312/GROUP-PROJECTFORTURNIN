const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const mongoose = require('mongoose');


// Register a new user
const registerUser = async (req, res) => {
    try {
        // Extract user data from the request body
        const { userName, email, password, confirmPassword } = req.body;
        console.log("Registering:", req.body);

        // Check if password and confirm password match
        if (password !== confirmPassword) {
            console.log("ERROR: Passwords do not match!");
            return res.status(400).json({ error: 'Passwords do not match!' });
        }

        // Create a new user instance
        console.log("Creating user...");
        const user = new User({ userName, email, password });
        console.log("User created:", user);

        // Save the user to the database
        console.log("Saving user to database...");
        await user.save();
      // Log in the user by storing their user ID in the session
        console.log("Logging in user...");
        req.session.userId = user._id;
        req.session.username = user.userName; // Storing the username in the session
        req.session.save(); // Save the session data to the database 
        console.log("User Session ID:", req.session.userId);

        // Respond with a success message or user data
        res.status(201).json({ message: 'User registered and logged in successfully. ' + "Session ID: " + req.session.userId});
        console.log("User saved and logged in!");
    } catch (error) {
 // Handle any errors that occur during registration
        if (error instanceof mongoose.Error.ValidationError) {
            return res.status(400).json({ error: Object.values(error.errors).map(e => e.message) });
        }
        if (error.name === 'MongoError' && error.code === 11000) {
            // Handle unique index violation (email already exists)
            console.log("ERROR:", error);
            res.status(400).json({ error: 'Email is already taken!' });
        } else if (error.name === 'ValidationError') {
            // Handle validation errors
            res.status(400).json({ error: error.message });
        } else {
            // Handle any other errors
            res.status(500).json({ error: error.message });
        }
        console.log("ERROR:", error);
    }
};

// Login user and store user data in session
const loginUser = async (req, res) => {
    try {
        // Extract the username/email and password from the request body
        const { userName, password } = req.body;
        console.log("Logging in:", req.body);

        // Find the user by username or email
        console.log("Finding user...");
        const user = await User.findOne({ $or: [{ userName }] });

        if (!user) {
        // User not found
        console.log("User not found");
        return res.status(404).json({ error: 'User not found!' });
        }

        // Compare the provided password with the stored hashed password
        console.log("Comparing password...");
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
        // Incorrect password
        console.log("Incorrect password");
        return res.status(401).json({ error: 'Invalid password!' });
        }

        // Store user data in session
        console.log("req.session:", req.session);
        console.log("Storing user data in session...");
        req.session.userId = user._id;
        req.session.username = user.userName; // Storing the username in the session

        req.session.save(err => {
            if (err) {
                console.log("ERROR:", err);
                res.status(500).json({ error: err.message });
            } else {
                console.log("User Name:", req.session.username, "Session ID:", req.session.userId);
                res.json({ username: user.userName, userId: user._id }); // Sending the username and user ID to the client
            }
        });        
        console.log("req.session:", req.session);
        console.log("User Session ID:", req.session.userId);
        // Respond with a success message
        console.log("User logged in successfully!");
    } catch (error) {
        // Handle any errors that occur during login
        console.log("ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// Logout user and clear session data
const logoutUser = (req, res) => {
    try {
        // Clear the session data
        console.log("Currently Signed in Session:", req.session.userId);
        req.session.destroy(err => {
            if(err) {
                console.log("ERROR:", err);
                res.status(500).json({ error: err.message });
            } else {
                console.log("Session destroyed");
                // Respond with a success message
                console.log("User logged out successfully");
                res.json({ message: 'User logged out successfully' });
            }
        }); 
    } catch (error) {
        // Handle any errors that occur during logout 
        console.log("ERROR:", error);
        res.status(500).json({ error: error.message });
    }
};

// Export the controller actions
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};