import React from 'react';
import { useNotifications } from '../../context/NotificationsContext';
import './NotificationList.css'; // We will create this file for styles

const NotificationList = ({ onClose }) => {
    const { notifications, markAsRead, markAllAsRead } = useNotifications();

    return (
        <div className="notification-list-container">
            <div className="notification-list-header">
                <h3>Notificaciones</h3>
                <button 
                    onClick={() => {
                        markAllAsRead();
                    }}
                    className="mark-all-read-button"
                >
                    Marcar todas como leídas
                </button>
            </div>
            <ul className="notification-list">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <li key={notification.id} className={notification.is_read ? 'read' : 'unread'}>
                            <h4>{notification.title}</h4>
                            <p>{notification.message}</p>
                            <small>{new Date(notification.created_at).toLocaleString()}</small>
                            {!notification.is_read && (
                                <button 
                                    onClick={() => markAsRead(notification.id)}
                                    className="mark-read-button"
                                >
                                    Marcar como leída
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <li className="no-notifications">No tienes notificaciones.</li>
                )}
            </ul>
            <button onClick={onClose} className="close-button">Cerrar</button>
        </div>
    );
};

export default NotificationList;
