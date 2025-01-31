import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AppPage.css';

const AppPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [app, setApp] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(5);
    const [editingReview, setEditingReview] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(userData);
        fetchAppDetails();
        fetchReviews();
    }, [id]);

    const fetchAppDetails = async () => {
        try {
            const response = await axios.get(`/api/apps/${id}`);
            setApp(response.data);
        } catch (error) {
            setError('Error fetching app details');
            console.error('Error fetching app details:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/api/reviews/${id}`);
            setReviews(response.data);
        } catch (error) {
            setError('Error fetching reviews');
            console.error('Error fetching reviews:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            if (editingReview) {
                // Update existing review
                await axios.put(`/api/reviews/${editingReview._id}`, {
                    content: newReview,
                    rating,
                    userId: user._id
                });
                setEditingReview(null);
            } else {
                // Create new review
                await axios.post(`/api/reviews/${id}`, {
                    content: newReview,
                    rating,
                    userId: user._id,
                    userName: user.name
                });
            }
            setNewReview('');
            setRating(5);
            fetchReviews();
            setError('');
        } catch (error) {
            setError('Error submitting review');
            console.error('Error with review:', error);
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setNewReview(review.content);
        setRating(review.rating);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await axios.delete(`/api/reviews/${reviewId}?userId=${user._id}`);
                fetchReviews();
                setError('');
            } catch (error) {
                setError('Error deleting review');
                console.error('Error deleting review:', error);
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
        setNewReview('');
        setRating(5);
    };

    if (!app) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="app-page">
            <header>
                <button className="back-btn" onClick={() => navigate('/home')}>
                    ← Back
                </button>
                <button className="logout-btn" onClick={() => {
                    localStorage.removeItem('user');
                    navigate('/login');
                }}>
                    Logout
                </button>
            </header>

            <main>
                <div className="app-details">
                    <img src={app.icon} alt={app.name} className="app-icon" />
                    <div className="app-info">
                        <h1>{app.name}</h1>
                        <p className="developer">{app.developer}</p>
                        <div className="rating">
                            <span>★</span>
                            <span>{app.rating}</span>
                        </div>
                        <p className="description">{app.description}</p>
                    </div>
                </div>

                <div className="reviews-section">
                    <h2>{editingReview ? 'Edit Review' : 'Write a Review'}</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmitReview} className="review-form">
                        <div className="rating-input">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className={star <= rating ? 'star active' : 'star'}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            placeholder="Write your review..."
                            required
                        />
                        <div className="form-buttons">
                            <button type="submit" className="submit-btn">
                                {editingReview ? 'Update Review' : 'Submit Review'}
                            </button>
                            {editingReview && (
                                <button 
                                    type="button" 
                                    onClick={handleCancelEdit}
                                    className="cancel-btn"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="reviews-list">
                        <h3>All Reviews</h3>
                        {reviews.length === 0 ? (
                            <p className="no-reviews">No reviews yet. Be the first to review!</p>
                        ) : (
                            reviews.map((review) => (
                                <div key={review._id} className="review-card">
                                    <div className="review-header">
                                        <h4>{review.userName}</h4>
                                        <div className="review-rating">
                                            {'★'.repeat(review.rating)}
                                            {'☆'.repeat(5 - review.rating)}
                                        </div>
                                    </div>
                                    <p className="review-content">{review.content}</p>
                                    <div className="review-footer">
                                        <span className="review-date">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                        {user._id === review.userId && (
                                            <div className="review-actions">
                                                <button 
                                                    onClick={() => handleEditReview(review)}
                                                    className="edit-btn"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteReview(review._id)}
                                                    className="delete-btn"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AppPage;
