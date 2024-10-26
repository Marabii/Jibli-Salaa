// NotificationsComponent.tsx

"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useState, useEffect, useRef } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { Notification } from "@/interfaces/Chatting/Notification";
import Link from "next/link";
import useOutsideClick from "@/hooks/useOutsideClick";
import {
  setNotifications,
  addNotification,
  removeNotification,
} from "@/store/notificationsSlice";
import axios from "axios";

const NotificationsComponent = () => {
  useWebSocket();
  const dispatch = useAppDispatch();

  const notifications = useAppSelector((state) => state.notifications.all);
  const webSocketNotification = useAppSelector(
    (state) => state.websocket.notification
  );

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications from backend when component mounts
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/protected/notifications");
        if (response.status === 200) {
          dispatch(setNotifications(response.data));
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, [dispatch]);

  // Add WebSocket notification to Redux store
  useEffect(() => {
    if (webSocketNotification) {
      dispatch(addNotification(webSocketNotification));
    }
  }, [webSocketNotification, dispatch]);

  // Use the useOutsideClick hook
  useOutsideClick(dropdownRef, () => setShowDropdown(false));

  // Function to mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      const response = await axios.delete(
        `/api/protected/notification/${id}/read`
      );
      if (response.status === 200) {
        dispatch(removeNotification(id));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  return (
    <div className="relative z-20 inline-block">
      <button
        className="relative focus:outline-none"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        <IoMdNotificationsOutline size={24} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3 h-3 bg-green-500 rounded-full"></span>
        )}
      </button>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute right-0 w-64 mt-2 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg"
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="px-4 py-2 text-gray-500">No notifications</li>
            ) : (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="flex items-center px-4 py-2 hover:bg-gray-100"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {notification.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    Mark as Read
                  </button>
                  <Link
                    href={`/negotiate/${notification.senderId}`}
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsComponent;
