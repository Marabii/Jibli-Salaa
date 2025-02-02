export enum NotificationType {
  MESSAGE = "MESSAGE",
  ORDER_ACCEPTED = "ORDER_ACCEPTED",
}

export type NotificationContent =
  | MessageNotificationContent
  | OrderAcceptedNotificationContent;

export interface Notification {
  id: string;
  notificationType: NotificationType;
  notificationData: NotificationContent;
}

export interface MessageNotificationContent {
  type: NotificationType.MESSAGE;
  id: string;
  recipientId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  count?: number;
}

export interface OrderAcceptedNotificationContent {
  type: NotificationType.ORDER_ACCEPTED;
  orderId: string;
  travelerId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
}
