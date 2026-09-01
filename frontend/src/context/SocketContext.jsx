import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';
import { NotificationsAPI } from '../services/api';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);

  const [chatRooms, setChatRooms] = useState({
    general: [],
    teachers: [],
    parents: []
  });

  const socketRef = useRef(null);

  // Fetch real notifications from database
  const fetchLiveNotifications = async () => {
    try {
      const savedUser = localStorage.getItem('eduverse_user');
      let userId = '';
      let role = '';
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          userId = parsed._id || parsed.id || '';
          role = parsed.role || '';
        } catch {}
      }

      const res = await NotificationsAPI.getAll({ userId, role });
      if (Array.isArray(res)) {
        setNotifications(res);
      }
    } catch (err) {
      console.warn('Notification fetch notice:', err);
    } finally {
      setLoadingNotifs(false);
    }
  };

  useEffect(() => {
    fetchLiveNotifications();

    // Connect to backend Socket.IO
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    socketRef.current = io(socketUrl, {
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnectionAttempts: 5
    });

    socketRef.current.on('connect', () => {
      setSocketConnected(true);
      // Join user and role specific rooms
      const savedUser = localStorage.getItem('eduverse_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          socketRef.current.emit('join', {
            userId: parsed._id || parsed.id,
            role: parsed.role
          });
        } catch {}
      }
    });

    socketRef.current.on('disconnect', () => {
      setSocketConnected(false);
    });

    // Real-time notification listener
    socketRef.current.on('new_notification', (notif) => {
      setNotifications((prev) => [notif, ...prev.filter(n => n.id !== notif.id)]);

      // Display interactive alert
      toast((t) => (
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-100">
            <span>{notif.icon || '🔔'}</span>
            <span>{notif.title}</span>
          </div>
          <span className="text-slate-300 text-xxs leading-relaxed">{notif.body}</span>
        </div>
      ), {
        duration: 4000,
        style: {
          background: '#111827',
          color: '#fff',
          border: '1px solid #374151',
          borderRadius: '16px'
        }
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const sendChatMessage = (channel, sender, text) => {
    const newMessage = {
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatRooms((prev) => ({
      ...prev,
      [channel]: [...(prev[channel] || []), newMessage]
    }));
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      const savedUser = localStorage.getItem('eduverse_user');
      let userId = '';
      if (savedUser) {
        userId = JSON.parse(savedUser)._id || JSON.parse(savedUser).id || '';
      }
      await NotificationsAPI.markAllAsRead(userId);
    } catch {}
  };

  const dismissNotification = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id && n._id !== id));
    try {
      await NotificationsAPI.delete(id);
    } catch {}
  };

  const addNotification = async (title, body, category = 'System', priority = 'NORMAL', link = '') => {
    try {
      const created = await NotificationsAPI.create({
        title,
        body,
        category,
        priority,
        link
      });
      if (created) {
        setNotifications((prev) => [created, ...prev]);
      }
    } catch (err) {
      console.warn('Error adding live notification:', err);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socketConnected,
        notifications,
        chatRooms,
        sendChatMessage,
        markAllAsRead,
        dismissNotification,
        addNotification,
        refreshNotifications: fetchLiveNotifications
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
