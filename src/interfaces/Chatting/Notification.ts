export interface Notification {
  content: string;
  timestamp: number; // or string if your timestamp is in ISO format
  senderId: string;
  [key: string]: any; // Additional properties if any
}
