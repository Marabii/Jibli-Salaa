export enum NotificationType {
  MESSAGE = "MESSAGE",
  ORDER_ACCEPTED = "ORDER_ACCEPTED",
  ORDER_FINALIZED = "ORDER_FINALIZED",
  NEGOTIATION_REJECTED = "NEGOTIATION_REJECTED",
  NEGOTIATION_PENDING = "NEGOTIATION_PENDING",
  ITEM_PAID = "ITEM_PAID",
}

export type NotificationContent =
  | MessageNotificationContent
  | OrderAcceptedNotificationContent
  | OrderFinalizedNotificationContent
  | NegotiationRejectedNotificationContent
  | NegotiationPendingNotificationContent
  | ItemPaidNotificationContent;

export interface Notification {
  id: string;
  notificationType: NotificationType;
  notificationData: NotificationContent;
  recipientId: string;
  orderId: string;
}

export interface MessageNotificationContent {
  type: NotificationType.MESSAGE;
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  count?: number;
}

export interface OrderAcceptedNotificationContent {
  type: NotificationType.ORDER_ACCEPTED;
  productName: string;
  travelerName: string;
  content: string;
  timestamp: Date;
}

export interface OrderFinalizedNotificationContent {
  type: NotificationType.ORDER_FINALIZED;
  productName: string;
  travelerName: string;
  content: string;
  timestamp: Date;
}

export interface NegotiationRejectedNotificationContent {
  type: NotificationType.NEGOTIATION_REJECTED;
  productName: string;
  travelerName: string;
  content: string;
  timestamp: Date;
}

export interface NegotiationPendingNotificationContent {
  type: NotificationType.NEGOTIATION_PENDING;
  productName: string;
  buyerId: string;
  content: string;
  timestamp: Date;
}

export interface ItemPaidNotificationContent {
  type: NotificationType.ITEM_PAID;
  productName: string;
  buyerName: string;
  content: string;
  timestamp: Date;
}
