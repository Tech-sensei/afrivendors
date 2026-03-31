export type AddressLabel = "Home" | "Work" | "Other";

export interface ProfileAddress {
  id: string;
  label: AddressLabel;
  street: string;
  city: string;
  region: string;
  country?: string;
  isDefault: boolean;
}

export interface ProfileAddressFormValues {
  label: AddressLabel;
  street: string;
  city: string;
  region: string;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  country?: string;
  dob?: string | null;
  gender?: string | null;
}

export interface AddAddressPayload {
  label: string;
  streetAddress: string;
  city: string;
  state: string;
}

export interface ProfileAddressDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  address: ProfileAddress | null;
  isSubmitting?: boolean;
  onSave: (
    values: ProfileAddressFormValues,
    editingId: string | null
  ) => void | Promise<void>;
}
