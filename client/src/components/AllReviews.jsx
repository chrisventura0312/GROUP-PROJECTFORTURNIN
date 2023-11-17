import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import NavBar from './NavBar';

const AllReviews = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null); // Add this line

    useEffect(() => {
        axios.get('http://localhost:8000/api/session', { withCredentials: true })
            .then(response => {
                if (response.data.loggedIn) {
                    setIsLoggedIn(true);
                    setUserId(response.data.userId); // Add this line
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
            // Fetch reviews if the user is logged in
            axios.get('http://localhost:8000/api/reviews', { withCredentials: true })
                .then(reviewResponse => {
                    console.log(reviewResponse.data);
                    setReviews(reviewResponse.data);
                })
                .catch(reviewError => {
                    console.error('Error fetching reviews:', reviewError);
                    navigate('/reviews');
                });
        }
    }, [navigate, isLoggedIn]); // Add isLoggedIn to the dependency array

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8000/api/reviews/${id}`, { withCredentials: true })
            .then(response => {
                // Remove the deleted review from the state
                setReviews(reviews.filter(review => review._id !== id));
            })
            .catch(error => {
                console.error('Error deleting review:', error);
            });
    };

    return (
        <>
        <NavBar />
        <div className="AllReviews container">
            <h1 className="my-4">All Reviews</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Song Title</th>
                        <th>Artist Name</th>
                        <th>Rating</th>
                        <th>Posted By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map((review, index) => (
                        <tr key={index}>
                        <td><Link to={`/reviews/${review._id}`}>{review.songTitle}</Link></td>
                        <td>{review.artistName}</td>
                        <td>{review.rating}</td>
                        <td>{review.userName }</td>
                        <td>
                        {review.userId === userId && (
                            <>
                            <Link to={`/reviews/${review._id}/edit`}>Edit</Link> 
                            <button style={{ marginLeft: '10px', backgroundColor: 'red', fontSize: '18px' }} onClick={() => handleDelete(review._id)}>Delete</button>
                            </>
                        )}
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
}

export default AllReviews;