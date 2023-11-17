const CommentController = require("../controllers/comment.controller");

module.exports = app => {
    app.get("/api/comments/:id?", CommentController.getAllComments); // Make the reviewId parameter optional
    app.get("/api/comments/:id", CommentController.getComment);
    app.post("/api/comments", CommentController.createNewComment);
    app.delete("/api/comments/:id", CommentController.deleteComment);
};