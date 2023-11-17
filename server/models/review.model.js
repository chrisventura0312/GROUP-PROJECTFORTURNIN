const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    songTitle: {
        type: String,
        required: [true, "Song title is required!"],
        minlength: [1, "Title must be at least 1 character long"],
    },
    artistName: {
        type: String,
        required: [true, "Artist name is required!"],
        minlength: [1, "Artists' name must be at least 1 character long!"],
    }, 
    review: {
        type: String,
        required: [true, "Review is required!"],
        minlength: [5, "Review must be at least 5 characters long!"],
    },
    rating: {
        type: Number,
        required: [true, "Rating is required!"],
        min: [1, "Rating must be between 1 and 5!"],
        max: [10, "Rating must be between 1 and 10!"],
    },
    songLink: {
        type: String,
        required: [true, "Song link is required!"],
        minlength: [1, "Song link must be at least 1 character long!"],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, //foreign key to the User model (one-to-many) so that each review belongs to a user
        ref: 'User',
    },
}, 
    { timestamps: { 
        createdAt: true, 
        updatedAt: true
    } 
});

module.exports = mongoose.model('Review', reviewSchema);