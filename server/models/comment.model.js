const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commentBody: {
        type: String,
        required: [true, "Comment is required"],
        minlength: [3, "Comment must be at least 3 characters long"],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviewId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
    },

    
}, 
    { timestamps: {
        createdAt: true,
        updatedAt: true
    } 
});


module.exports = mongoose.model('Comment', commentSchema);

