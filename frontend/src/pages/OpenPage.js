import React from 'react';
import { useNavigate } from 'react-router-dom';
import './OpenPage.css';

const OpenPage = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/login');
    };

    return (
        <div className="open-page">
            <div className="logo-container" onClick={handleLogoClick}>
                <img src="/logo.webp" alt="Play Store Clone Logo" className="logo" />
            </div>
        </div>
    );
};

export default OpenPage;
