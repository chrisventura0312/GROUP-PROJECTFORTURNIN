const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const userRoutes = require('./routes/user.route');
const commentRoutes = require('./routes/comment.route');
const reviewRoutes = require('./routes/review.route');
const isAuthenticated = require('./middlewares/authMiddleware');

const app = express();

// Create a new MongoDB store
const store = new MongoDBStore({
    uri: 'mongodb://localhost:27017',
    collection: 'userSessions'
});

// Log any errors from the store
store.on('error', function (error) {
    console.log(error);
});

// Configure express-session middleware
app.use(
    session({
        secret: 'ooga-booga', // Secret key to encrypt/decrypt session data
        resave: false,
        saveUninitialized: false, // Only save sessions when a property has been added to req.session
        store: store, // Store session data in MongoDB
        cookie: {
            secure: false, // Set to true if using HTTPS 
            maxAge: 24 * 60 * 60 * 1000, // Session expiration time (1 day)
            sameSite: 'lax', // lax for local development and strict for production
        },
    })
);

// Configure CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

// Configure Content Security Policy
app.use((req, res, next) => {
    console.log('Setting CSP header');
    res.setHeader('Content-Security-Policy', "frame-src 'self' https://open.spotify.com");
    next();
});

// Configure body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session API endpoint
app.get('/api/session', isAuthenticated, (req, res) => {
    if (req.session.userId) {
        res.json({ loggedIn: true, userId: req.session.userId, username: req.session.username });
    } else {
        res.json({ loggedIn: false });
    }
});

// Connect to MongoDB
require('./config/mongoose.config');

// Configure routes
commentRoutes(app);
userRoutes(app);
reviewRoutes(app);

// Start the server
app.listen(8000, () => console.log('Listening on port: 8000'));
