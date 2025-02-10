export interface Transfers {
  _id: string;
  receiverId: string;
  senderId: string;
  transferId: string;
  quoteId: string;
  sourceCurrency: string;
  targetCurrency: string;
  sourceAmount: number;
  targetAmount: number;
  didBuyerPay: boolean;
}
