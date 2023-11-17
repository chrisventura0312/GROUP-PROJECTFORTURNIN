// CommentSection.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const CommentSection = ({ reviewId }) => {
    const navigate = useNavigate();
    const [commentBody, setCommentBody] = useState('');
    const [userId, setUserId] = useState('');
    const [errors, setErrors] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/session', { withCredentials: true })
            .then(response => {
                if (response.data.loggedIn) {
                    console.log('User is logged in, user ID:', response.data.userId, 'Username:', response.data.username);
                    setUserId(response.data.userId);
                } else {
                    console.log('User is not logged in');
                }
            })
            .catch(error => {
                console.log('Error getting session:', error);
            });
    }, []);

    useEffect(() => {
        // Fetch comments specific to the reviewId
        axios.get(`http://localhost:8000/api/comments/${reviewId}`)
            .then(response => {
                setComments(response.data);
            })
            .catch(error => {
                console.error('Error fetching comments for the review:', error);
            });
    }, [reviewId]);

    const submitHandler = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/api/comments', {
            commentBody,
            userId,
            reviewId
        }, { withCredentials: true })
            .then((res) => {
                console.log(res);
                // Clear input field after successful submission
                setCommentBody('');
                // Fetch updated comments after successful submission
                axios.get(`http://localhost:8000/api/comments/${reviewId}`)
                    .then(response => {
                        setComments(response.data);
                    })
                    .catch(error => {
                        console.error('Error fetching comments for the review:', error);
                    });
            })
            .catch((err) => {
                console.log(err);

                if (err.response) {
                    console.error('Server responded with error status:', err.response.status);

                    const errorResponse = err.response.data;

                    if (errorResponse && typeof errorResponse === 'object' && errorResponse.errors) {
                        const errorArr = [];
                        for (const key of Object.keys(errorResponse.errors)) {
                            errorArr.push(errorResponse.errors[key].message);
                        }

                        setErrors(errorArr);
                    }
                } else {
                    console.error('Server responded with error:', err.message);
                }
            });
    }

    return (
        <div className="container-fluid d-flex justify-content-center align-items-center h-100">
            <div className="container">
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            name="commentBody"
                            placeholder="Add comment..."
                            value={commentBody}
                            rows={5} // Adjust the number of rows as needed
                            cols={60} // Adjust the number of columns as needed
                            onChange={(e) => setCommentBody(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Submit
                    </button>
                </form>
                {errors.map((err, index) => (
                    <p key={index}>{err}</p>
                ))}
                <div className="list-group mt-4">
                    <h2 className="mb-4"><span style={{ borderBottom: '2px solid #007bff' }}>Comments for this Review</span></h2>
                    {comments.map(comment => (
                        <div key={comment._id} className="list-group-item">
                            <p className="mb-0">{comment.commentBody}</p>
                            <small className="text-muted">By: {comment.userName}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CommentSection;
