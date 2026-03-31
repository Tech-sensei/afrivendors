export type PaymentMethod = "venue" | "online" | "wallet";

export interface BookingService {
  id: string;
  name: string;
  price: number;
}

export interface BookingTimedService extends BookingService {
  duration: string;
}

export interface BookingVendorSummary {
  id: string;
  name: string;
  location: string;
  image: string;
}

export interface BookingSummaryProps {
  selectedServices: BookingService[];
  date: Date | undefined;
  selectedTime: string;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  isSubmitting: boolean;
  isFormValid: boolean;
  onSubmit: () => void;
}

export interface SelectedServicesCardProps {
  vendor: BookingVendorSummary;
  selectedServices: BookingTimedService[];
  onRemoveService: (serviceId: string) => void;
  onAddService: () => void;
}

export interface CardFormData {
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
}

export interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethod;
  totalPrice: number;
  cardFormData: CardFormData;
  hasInsufficientFunds: boolean;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onCardFormDataChange: (data: Partial<CardFormData>) => void;
  onFundWallet: () => void;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface ContactInformationFormProps {
  formData: ContactFormData;
  onFormDataChange: (data: Partial<ContactFormData>) => void;
}

export interface DateTimeSelectionProps {
  date: Date | undefined;
  selectedTime: string;
  onDateChange: (date: Date | undefined) => void;
  onTimeChange: (time: string) => void;
}

export interface EmptyStateProps {
  vendorId: string | null;
  onBack: () => void;
}
