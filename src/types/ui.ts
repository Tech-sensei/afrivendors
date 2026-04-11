import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  confirmButtonVariant?: "default" | "destructive";
}

export interface LogoutConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
}

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  type?: "default" | "message" | "create" | "edit" | "view";
  footer?: ReactNode;
  children: ReactNode;
}

export interface OptionCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

export interface UserMenuProps {
  onNavigate?: (page: string) => void;
  currentPage?: string;
  onLogout?: () => void;
  userInitials?: string;
  userName?: string;
  userEmail?: string;
  profilePhoto?: string | null;
}
