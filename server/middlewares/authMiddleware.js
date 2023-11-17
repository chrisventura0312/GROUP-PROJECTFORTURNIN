function isAuthenticated(req, res, next) {
    console.log('isAuthenticated middleware called');
    if (req.session && req.session.userId) {
        console.log('User is authenticated, userId:', req.session.userId);
        next();
    } else {
        console.log('User is not authenticated');
        res.status(401).json({ message: 'Unauthorized! Please log in.' });
    }
}

module.exports = isAuthenticated;