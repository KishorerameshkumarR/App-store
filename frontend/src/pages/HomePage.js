import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

const HomePage = () => {
    const navigate = useNavigate();
    const [apps, setApps] = useState([]);
    const [category, setCategory] = useState('all');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(userData);
        fetchApps();
    }, [category]);

    const fetchApps = async () => {
        try {
            const response = await axios.get(`/api/apps?category=${category}`);
            setApps(response.data);
        } catch (error) {
            console.error('Error fetching apps:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };
    
    const handleAppClick = (appId) => {
        navigate(`/app/${appId}`);
    };

    return (
        <div className="home-page">
            <header>
                <div className="profile-section">
                    <img 
                        src={user?.profilePicture || '/default-profile.png'} 
                        alt="Profile" 
                        className="profile-pic"
                    />
                    <span>{user?.name}</span>
                </div>
                <nav>
                    <div className="categories">
                        <button 
                            className={category === 'all' ? 'active' : ''} 
                            onClick={() => setCategory('all')}
                        >
                            All
                        </button>
                        <button 
                            className={category === 'games' ? 'active' : ''} 
                            onClick={() => setCategory('games')}
                        >
                            Games
                        </button>
                        <button 
                            className={category === 'apps' ? 'active' : ''} 
                            onClick={() => setCategory('apps')}
                        >
                            Apps
                        </button>
                        <button 
                            className={category === 'books' ? 'active' : ''} 
                            onClick={() => setCategory('books')}
                        >
                            Books
                        </button>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </nav>
            </header>

            <main className="apps-grid">
                {apps.map((app) => (
                    <div 
                        key={app._id} 
                        className="app-card"
                        onClick={() => handleAppClick(app._id)}
                    >
                        <img src={app.icon} alt={app.name} />
                        <h3>{app.name}</h3>
                        <p>{app.developer}</p>
                        <div className="rating">
                            <span>★</span>
                            <span>{app.rating}</span>
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default HomePage;
