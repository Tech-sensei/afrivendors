export interface SavedCard {
  id: string;
  lastFour: string;
  brand: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
}

export interface WalletCardInput {
  cardNumber: string;
  cardName: string;
  cardExpiry: string;
  cardCvv: string;
  saveAsDefault: boolean;
}

export interface WalletFundDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedCards: SavedCard[];
  onDeleteCard: (cardId: string) => void;
  onFundWallet: (
    amount: string,
    paymentMethod: string,
    cardData?: WalletCardInput
  ) => void;
}

export type TransactionType = "debit" | "credit" | "refund";
export type TransactionStatus = "completed" | "pending" | "refunded";

export interface Transaction {
  id: number;
  date: string;
  type: TransactionType;
  vendor: string;
  service: string;
  amount: number;
  status: TransactionStatus;
  reference: string;
}

export interface TransactionDetailProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export interface BookingFundWalletDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
