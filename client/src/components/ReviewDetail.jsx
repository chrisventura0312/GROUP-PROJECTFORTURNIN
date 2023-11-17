// ReviewDetail.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// CSS imports
import './css/ReviewDetail.css';

// Component imports
import CommentSection from './CommentSection';
import NavBar from './NavBar';

const ReviewDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [review, setReview] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/session', { withCredentials: true })
            .then(response => {
                if (response.data.loggedIn) {
                    setIsLoggedIn(true);
                    setUserId(response.data.userId);
                    console.log('User is logged in, user ID:', response.data.userId, ', Username:', response.data.username);
                } else {
                    navigate('/login');
                }
            })
            .catch(error => {
                console.error('Error checking session:', error);
            });
    }, [navigate]);

    useEffect(() => {
        if (isLoggedIn) {
            axios.get(`http://localhost:8000/api/reviews/${id}`, { withCredentials: true })
                .then(response => {
                    console.log(response.data);
                    setReview(response.data);
                })
                .catch(error => {
                    console.error('Error fetching reviews:', error);
                });
        }
    }, [isLoggedIn, id]);

    const deleteReview = () => {
        axios.delete(`http://localhost:8000/api/reviews/${id}`, { withCredentials: true })
            .then(response => {
                console.log('Review deleted:', response.data);
                navigate('/reviews');
            })
            .catch(error => {
                console.error('Error deleting review:', error);
            });
    };

    if (!isLoggedIn) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <NavBar className="mb-3" />
            <div className="container-spacing">
                <div className="container ReviewDetail mt-6">
                    <div className="reviewDetails bg-light p-4 rounded">
                        <div className="d-flex align-items-baseline">
                            <h1 className="mr-3">{review.songTitle}</h1>
                            <h6>By: {review.artistName}</h6>
                        </div>
                        <h6>Reviewed by: {review.userName}</h6>
                        <p>{review.review}</p>
                        <p>Rating: {review.rating}</p>

                        <iframe
                            title="Spotify Web Player"
                            src={`${review.songLink}`}
                            width="650"
                            height="100"
                            allowtransparency="true"
                            allow="encrypted-media"
                        ></iframe>

                        <div className="reviewButton d-flex justify-content-between mt-4">
                            <button onClick={() => navigate(`/reviews`)} className="btn btn-secondary">Back</button>
                            {isLoggedIn && review.userId === userId && (
                                <div className="d-flex">
                                    <button onClick={() => navigate(`/reviews/${review._id}/edit`)} className="btn btn-warning">Edit</button>
                                    <button onClick={deleteReview} className="btn btn-danger ml-4">Delete</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="commentSection mt-4">
                        <CommentSection reviewId={id} userId={userId} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewDetail;
