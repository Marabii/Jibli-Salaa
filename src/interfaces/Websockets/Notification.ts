export enum NotificationType {
  MESSAGE = "MESSAGE",
  ORDER_ACCEPTED = "ORDER_ACCEPTED",
  ORDER_FINALIZED = "ORDER_FINALIZED",
  NEGOTIATION_REJECTED = "NEGOTIATION_REJECTED",
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
  orderId: string;
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
