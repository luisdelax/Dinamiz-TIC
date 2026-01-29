import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa'; // Assuming react-icons is used
import { useNotifications } from '../../context/NotificationsContext';
import NotificationList from './NotificationList';
import './NotificationIcon.css'; // We will create this file for styles

const NotificationIcon = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { unreadCount } = useNotifications();

    const toggleList = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="notification-container">
            <button onClick={toggleList} className="notification-icon-button">
                <FaBell />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>
            {isOpen && <NotificationList onClose={() => setIsOpen(false)} />}
        </div>
    );
};

export default NotificationIcon;
