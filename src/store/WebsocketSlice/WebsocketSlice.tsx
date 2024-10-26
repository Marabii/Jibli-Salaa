// websocketSlice.ts

import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/utils/apiClient";
import SockJS from "sockjs-client";
import Stomp, { Client, Message } from "stompjs";
import type { UserInfo } from "@/interfaces/userInfo/userInfo";
import type { AppDispatch, RootState } from "@/store/store";
import type { Notification } from "@/interfaces/Chatting/Notification";

// Define the state type
interface WebSocketState {
  connected: boolean;
  notifications: Notification[];
}

// Initial state
const initialState: WebSocketState = {
  connected: false,
  notifications: [],
};

// Module variable to hold the stompClient
let stompClient: Client | null = null;

// Thunk to initialize WebSocket connection
export const initializeWebSocket = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>("websocket/initialize", async (_, { dispatch }) => {
  try {
    // Fetch user info
    const userInfo: UserInfo = await apiClient("/api/protected/getUserInfo");
    if (!userInfo || !userInfo._id) {
      console.error("User info is not available, cannot connect to WebSocket.");
      return;
    }

    const socket = new SockJS(`${process.env.NEXT_PUBLIC_SERVERURL}/ws`);
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      dispatch(setConnected(true));

      // Subscribe to the notification queue
      stompClient?.subscribe(
        `/user/${userInfo._id}/queue/notifications`,
        (message: Message) => {
          const notification: Notification = JSON.parse(message.body);
          dispatch(addNotification(notification));
        }
      );
    });
  } catch (error) {
    console.error("Failed to initialize WebSocket:", error);
  }
});

// Thunk to disconnect WebSocket connection
export const disconnectWebSocket = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>("websocket/disconnect", async (_, { dispatch }) => {
  if (stompClient) {
    stompClient.disconnect(() => {
      dispatch(setConnected(false));
    });
  }
});

// Slice
const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {
    setConnected(state, action: PayloadAction<boolean>) {
      state.connected = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.push(action.payload);
    },
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
  },
});

export const { setConnected, addNotification, setNotifications } =
  websocketSlice.actions;

export default websocketSlice.reducer;
