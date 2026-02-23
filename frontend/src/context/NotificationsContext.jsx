import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../api/notifications';
import { useAuth } from '../auth/AuthContext'; // Assuming you have an AuthContext to check if user is authenticated

const NotificationsContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationsContext);
};

export const NotificationsProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const { isAuthenticated } = useAuth(); // Get auth state

    const fetchNotifications = useCallback(async () => {
        if (!isAuthenticated) return; // Don't fetch if not logged in
        try {
            const response = await getNotifications();
            setNotifications(response.data);
            const unread = response.data.filter(n => !n.is_read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchNotifications(); // Initial fetch
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [fetchNotifications]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await markNotificationAsRead(notificationId);
            fetchNotifications(); // Re-fetch to update state
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsAsRead();
            fetchNotifications(); // Re-fetch to update state
        } catch (error) {
            console.error("Failed to mark all notifications as read:", error);
        }
    };

    const value = {
        notifications,
        unreadCount,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
    };

    return (
        <NotificationsContext.Provider value={value}>
            {children}
        </NotificationsContext.Provider>
    );
};
