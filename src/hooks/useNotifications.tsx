"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import SockJS from "sockjs-client";
import Stomp, { Client, Message } from "stompjs";
import apiClient from "@/utils/apiClient";
import { ApiResponse } from "@/interfaces/Apis/ApiResponse";
import {
  MessageNotificationContent,
  Notification,
  NotificationType,
} from "@/interfaces/Websockets/Notification";
import { useDispatch } from "react-redux";
import { usePathname, useSearchParams } from "next/navigation";
import {
  setNotifications,
  addNotification,
  removeNotification,
} from "@/store/slices/notificationsSlice";
import type { AppDispatch } from "@/store/store";

export function useNotifications() {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState<string | null>(null);
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const IS_PRODUCTION = JSON.parse(
    process.env.NEXT_PUBLIC_IS_PRODUCTION || "false"
  );

  // Create a ref for the current pathname.
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  // Create a ref for the current search parameters.
  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const fetchUserInfo = useCallback(async () => {
    try {
      const res: ApiResponse<{ _id: string }> = await apiClient(
        "/api/protected/getUserInfo"
      );
      if (res?.data?._id) {
        setUserId(res.data._id);
      }
    } catch (err) {
      setUserId(null);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    try {
      const response: ApiResponse<Notification[]> = await apiClient(
        "/api/protected/notifications"
      );
      const fetchedNotifications = response.data || [];
      dispatch(setNotifications(fetchedNotifications));
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  }, [userId, dispatch]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await apiClient(
          `/api/protected/notifications/markAsRead/${notificationId}`,
          {
            method: "DELETE",
          }
        );
        dispatch(removeNotification(notificationId));
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
      }
    },
    [dispatch]
  );

  const connectToWebSocket = useCallback(() => {
    if (!userId || stompClient) return;

    const endpoint =
      process.env.NEXT_PUBLIC_SERVERURL + (IS_PRODUCTION ? "/wss" : "/ws");
    console.log("IS_PRODUCTION: ", IS_PRODUCTION);
    console.log(endpoint);
    const socket = new SockJS(endpoint, undefined, {
      transports: ["websocket"],
    });

    const stomp = Stomp.over(socket);

    stomp.connect({}, () => {
      stomp.subscribe(
        `/user/${userId}/queue/notifications`,
        async (message: Message) => {
          try {
            const newNotification: Notification = JSON.parse(message.body);

            if (newNotification.notificationType === NotificationType.MESSAGE) {
              const messageNotificationContent =
                newNotification.notificationData as MessageNotificationContent;

              // Check if the user is currently on the `/negotiate` page with the same recipientId as the sender.
              if (
                pathnameRef.current === "/negotiate" &&
                searchParamsRef.current.get("recipientId") ===
                  messageNotificationContent.senderId
              ) {
                await markAsRead(newNotification.id);
              } else {
                dispatch(addNotification(newNotification));
              }
            } else {
              dispatch(addNotification(newNotification));
            }
          } catch (err) {
            console.error("Error parsing incoming notification:", err);
          }
        }
      );
      // Register the user on the server side
      stomp.send("/app/user.addUser", {}, JSON.stringify({ userId: userId }));
    });

    setStompClient(stomp);

    return () => {
      stomp.disconnect(() => {
        console.log("Disconnected");
      });
    };
  }, [userId, stompClient, IS_PRODUCTION, markAsRead, dispatch]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

  useEffect(() => {
    connectToWebSocket();
  }, [connectToWebSocket]);

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId, fetchNotifications]);

  useEffect(() => {
    return () => {
      if (stompClient) {
        stompClient.disconnect(() => {
          console.log("Disconnected from notifications WebSocket");
        });
      }
    };
  }, [stompClient]);

  return {
    markAsRead,
  };
}
