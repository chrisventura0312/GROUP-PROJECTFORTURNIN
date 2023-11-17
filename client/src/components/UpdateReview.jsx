import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import './css/ReviewForm.css';

import NavBar from './NavBar';

const UpdateReview = () => {
    const { id } = useParams();
    const [songTitle, setSongTitle] = useState('');
    const [artistName, setArtistName] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(1);
    const [songLink, setSongLink] = useState('');
    const [userId, setUserId] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Check the user's session
        axios.get('http://localhost:8000/api/session', { withCredentials: true })
            .then(response => {
                if (response.data.loggedIn) {
                    console.log('User is logged in, user ID:', response.data.userId, 'Username:', response.data.username);
                    setUserId(response.data.userId);
                } else {
                    console.log('User is not logged in');
                    // Handle the case where the user is not logged in, redirect or show a login message
                }
            })
            .catch(error => {
                console.error('Error getting session:', error);
            });
    }, []);

    useEffect(() => {
        // Fetch the existing review data
        axios.get(`http://localhost:8000/api/reviews/${id}`, { withCredentials: true })
            .then(response => {
                setSongTitle(response.data.songTitle);
                setArtistName(response.data.artistName);
                setReview(response.data.review);
                setRating(response.data.rating);
                setSongLink(response.data.songLink);
            })
            .catch(error => {
                console.error('Error fetching existing review data:', error);
            });
    }, [id]);

    const updateReview = (e) => {
        e.preventDefault();
        console.log("Updating review...");
    
        axios.put(`http://localhost:8000/api/reviews/${id}`, {
            songTitle,
            artistName,
            review,
            rating,
            songLink,
            userId,
        }, { withCredentials: true })
            .then((res) => {
                console.log("Review updated successfully");
                console.log(res.data);  // Log the response data
                navigate(`/reviews/${id}`);
            })
            .catch((err) => {
                console.error('Error updating review:', err);
    
                if (err.response) {
                    console.log('Response status:', err.response.status);
                    console.log('Response data:', err.response.data);
    
                    if (err.response.data && err.response.data.errors) {
                        setErrors(err.response.data.errors);
                    } else {
                        setErrors({ message: 'An error occurred' });
                    }
                } else if (err.request) {
                    console.error('No response received:', err.request);
                } else {
                    console.error('Error setting up the request:', err.message);
                }
            });
    };
    
    
    

    return (
        <div className="container mt-4">
            <NavBar />
            <h1>Update a Review</h1>
            <form onSubmit={updateReview}>
                {Object.keys(errors).map((key, index) => (
                    <div key={index} className="alert alert-danger">
                        {errors[key].message}
                    </div>
                ))}
                <div className="mb-3">
                    <label htmlFor="songTitle" className="form-label">Song Title:</label>
                    <input type="text" className="form-control" name="songTitle" value={songTitle} onChange={(e) => setSongTitle(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="artistName" className="form-label">Artist Name:</label>
                    <input type="text" className="form-control" name="artistName" value={artistName} onChange={(e) => setArtistName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="review" className="form-label">Review:</label>
                    <textarea className="form-control" name="review" value={review} onChange={(e) => setReview(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label">Rating:</label>
                    <input type="number" className="form-control" name="rating" value={rating} onChange={(e) => setRating(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="songLink" className="form-label">Song Link:</label>
                    <input type="text" className="form-control" name="songLink" value={songLink} onChange={(e) => setSongLink(e.target.value)} />
                </div>
                <div className="d-flex justify-content-between h-100">
                    <button type="submit" className="btn btn-primary mr-2">Update</button>
                    <button type="button" className="btn btn-danger ml-2" onClick={() => navigate(`/reviews/${id}`)}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateReview;
