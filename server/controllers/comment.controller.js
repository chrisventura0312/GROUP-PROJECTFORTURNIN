const mongoose = require("mongoose");
const Comment = require("../models/comment.model");
const User = require("../models/user.model");

const getAllComments = async (req, res) => {
    try {
        console.log("Getting all comments...");
        let comments;

        if (req.params.id) {
            // If reviewId is provided, filter comments for that review
            comments = await Comment.find({ reviewId: req.params.id });
        } else {
            // If no reviewId is provided, get all comments
            comments = await Comment.find();
        }

        // Convert comments to plain JavaScript objects
        comments = comments.map(comment => comment.toObject());

        // Fetch the user for each comment
        for (let comment of comments) {
            const user = await User.findById(comment.userId);
            if (user) {
                comment.userName = user.userName; // Add the userName to the comment
            }
        }

        if (comments.length === 0) {
            console.log("No comments found");
            return res.status(404).json({ error: 'No comments found' });
        }
        res.json(comments);
        console.log("Comments:", comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getComment = async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.id);
        if (!comment) {
            console.log("Comment not found");
            return res.status(404).json({ message: 'Comment not found' });
        }

        const user = await User.findById(comment.userId);
        if (user) {
            comment = comment.toObject();
            comment.userName = user.userName;
        }

        res.json(comment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

const createNewComment = (req, res) => {
    console.log('POST /api/comments request received');

    console.log('Request Body:', req.body);

    Comment.create(req.body)
        .then(newComment => {
            console.log('New comment created:', newComment);
            res.status(201).json({ comment: newComment });
        })
        .catch(err => {
            console.error('Error creating new comment:', err);
            res.status(500).json({ message: "Error creating new comment", error: err });
        });
};

const deleteComment = (req, res) => {
    console.log(`DELETE /api/comments/${req.params.id} request received`);
    Comment.deleteOne({ _id: req.params.id })
        .then(result => {
            console.log('Comment deleted:', result);
            res.json({ result: result });
        })
        .catch(err => {
            console.error('Error deleting comment:', err);
            res.status(500).json({ message: "Error deleting comment", error: err });
        });
};

module.exports = {
    getAllComments,
    getComment,
    createNewComment,
    deleteComment
};
