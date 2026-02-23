import api from './axios';

/**
 * Fetches notifications for the current user.
 * @param {boolean} unreadOnly - If true, fetches only unread notifications.
 * @returns {Promise<Array>} A promise that resolves to an array of notifications.
 */
export const getNotifications = (unreadOnly = false) => {
    const params = unreadOnly ? { unread: 'true' } : {};
    return api.get('/notifications/', { params });
};

/**
 * Marks a specific notification as read.
 * @param {number} notificationId - The ID of the notification to mark as read.
 * @returns {Promise} A promise that resolves when the operation is complete.
 */
export const markNotificationAsRead = (notificationId) => {
    return api.patch(`/notifications/${notificationId}/mark-as-read/`, {});
};

/**
 * Marks all unread notifications for the current user as read.
 * @returns {Promise} A promise that resolves when the operation is complete.
 */
export const markAllNotificationsAsRead = () => {
    return api.post('/notifications/mark-all-as-read/');
};
