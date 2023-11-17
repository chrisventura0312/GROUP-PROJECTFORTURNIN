const Review = require('../models/review.model');
const User = require('../models/user.model');

module.exports.getAllReviews = async (req, res) => {
    try {
        console.log("Getting all reviews...");
        let reviews = await Review.find(); //finds all reviews in the database

        // Convert reviews to plain JavaScript objects
        reviews = reviews.map(review => review.toObject());

        // Fetch the user for each review
        for (let review of reviews) {
            const user = await User.findById(review.userId);
            if (user) {
                review.userName = user.userName; // Add the userName to the review
            }
        }

        if (reviews.length === 0) { //checking if there are any reviews in the database
            console.log("No reviews found");
            return res.status(404).json({ error: 'No reviews found' });
        }
        res.json(reviews); //sends the reviews to the client 
        console.log("Reviews:", reviews);
    } catch (err) { //catching any errors
        res.status(500).json({ message: err.message });
    }
}

module.exports.getReview = async (req, res) => {
    try {
        let review = await Review.findById(req.params.id); // finds the review in the database
        if (!review) {
            console.log("Review not found");
            return res.status(404).json({ message: 'Review not found' });
        }

        const user = await User.findById(review.userId);
        if (user) {
            review = review.toObject(); // Convert the Mongoose document to a plain JavaScript object
            review.userName = user.userName; // Add the userName to the review
        }

        res.json(review); // sends the review to the client 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

module.exports.createReview = async (req, res) => {
    console.log('createReview controller called');
    try {
        const { songTitle, artistName, review, rating, songLink ,userId } = req.body;
        console.log('Received review data:', { songTitle, artistName, review, rating, songLink ,userId });
        const newReview = await Review.create({
            songTitle,
            artistName,
            review,
            rating,
            songLink,
            userId
        });
        console.log("New review created by: ", userId, ": ", newReview);
        res.status(201).json(newReview);
    }
    catch (err) {
        console.error('Error creating review:', err);
        if (err.name === 'ValidationError') {
            const errors = {};
            for (const field in err.errors) {
                errors[field] = err.errors[field].message;
            }
            return res.status(400).json({ errors });
        }
        return res.status(500).json({ error: 'Failed to create a new review', details: err.message });
    }
}

module.exports.updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            console.log("Review not found");
            return res.status(404).json({ message: 'Review not found' });
        }

        console.log('User is authenticated, userId:', req.session.userId);
        console.log('User ID in session:', req.session.userId.toString());
        console.log('User ID associated with the review:', review.userId.toString());

        if (req.session.userId.toString() !== review.userId.toString()) {
            console.log('Unauthorized: User can only update their own reviews');
            console.log('Length of session user ID:', req.session.userId.toString().length);
            console.log('Length of review user ID:', review.userId.toString().length);
            console.log('Session user ID:', req.session.userId.toString());
            console.log('Review user ID:', review.userId.toString());
            
            return res.status(403).json({ message: 'You can only update your own reviews!' });
        }

        console.log('User is authorized to update the review');

        const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });

        console.log('Review updated successfully');

        res.json(updatedReview);
    } catch (err) {
        console.error('Error updating review:', err);

        if (err.message) {
            console.error('Error message:', err.message);
        }

        res.status(500).json({ message: 'An error occurred while updating the review' });
    }
};



module.exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id); // find the review

        if (!review) {
            console.log("Review not found");
            return res.status(404).json({ message: 'Review not found' });
        }
        
        // check if the userId in session matches the userId associated with the review
        if (req.session.userId.toString() !== review.userId.toString()) {
            return res.status(403).json({ message: 'You can only delete your own reviews' });
        }

        // if the user is authorized, delete the review
        await Review.findByIdAndDelete(req.params.id);
        console.log('Review deleted successfully');
        res.json({ message: 'Review deleted' }); // send confirmation to the client 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};
