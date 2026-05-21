export type PaymentMethod = "online" | "wallet";

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

export interface PaymentMethodSectionProps {
  paymentMethod: PaymentMethod;
  totalPrice: number;
  walletBalance: number;
  walletLoading?: boolean;
  hasInsufficientFunds: boolean;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onFundWallet: () => void;
  /** Unique prefix for radio `id`s when multiple pickers can mount (e.g. modals). */
  radioIdPrefix?: string;
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
  errors?: Partial<Record<keyof ContactFormData, string>>;
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
