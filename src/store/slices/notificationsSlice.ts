// notificationsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "@/interfaces/Websockets/Notification";

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      const newNotification = action.payload;
      const existingNotificationIndex = state.notifications.findIndex(
        (notification) => notification.id === newNotification.id
      );
      if (existingNotificationIndex !== -1) {
        state.notifications[existingNotificationIndex] = newNotification;
      } else state.notifications.push(newNotification);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

export const { setNotifications, addNotification, removeNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
