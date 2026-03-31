import { useMutation } from "@tanstack/react-query";
import http from "@/lib/http";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { fetchUserProfile } from "@/store/authSlice";
import type { AddAddressPayload, UpdateProfilePayload } from "@/types/profile";

export function profileLabelToApi(label: "Home" | "Work" | "Other"): string {
  if (label === "Home") return "home";
  if (label === "Work") return "work";
  return "other";
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useProfileAPI = () => {
  const dispatch = useAppDispatch();

  // ✏️ Update Profile
  const updateProfileMutation = useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const response = await http.patch("/users/me", payload);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(fetchUserProfile());
      toast.success(data?.responseMessage || "Profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to update profile"
      );
    },
  });

  // 📍 Add Address
  const addAddressMutation = useMutation({
    mutationFn: async (payload: AddAddressPayload) => {
      const response = await http.post("/users/addresses", payload);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(fetchUserProfile());
      toast.success(data?.responseMessage || "Address added successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to add address"
      );
    },
  });

  // ✏️ Update Address
  const updateAddressMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string | number; payload: AddAddressPayload }) => {
      const response = await http.patch(`/users/addresses/${id}`, payload);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(fetchUserProfile());
      toast.success(data?.responseMessage || "Address updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to update address"
      );
    },
  });

  // 📷 Upload Profile Photo
  const uploadPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("photo", file);
      formData.append("photoUrl", "");
      const response = await http.patch("/users/profile-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(fetchUserProfile());
      toast.success(data?.responseMessage || "Profile photo updated!");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to upload photo"
      );
    },
  });

  // 🗑️ Delete Address
  const deleteAddressMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const response = await http.delete(`/users/addresses/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(fetchUserProfile());
      toast.success(data?.responseMessage || "Address removed.");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.responseMessage ||
          error?.response?.data?.message ||
          "Failed to delete address"
      );
    },
  });

  return {
    // ✏️ Update Profile
    updateProfileAsync: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,

    // 📍 Add Address
    addAddressAsync: addAddressMutation.mutateAsync,
    isAddingAddress: addAddressMutation.isPending,
    addAddressError: addAddressMutation.error,

    // ✏️ Update Address
    updateAddressAsync: updateAddressMutation.mutateAsync,
    isUpdatingAddress: updateAddressMutation.isPending,

    // 🗑️ Delete Address
    deleteAddressAsync: deleteAddressMutation.mutateAsync,
    isDeletingAddress: deleteAddressMutation.isPending,

    // 📷 Upload Profile Photo
    uploadPhotoAsync: uploadPhotoMutation.mutateAsync,
    isUploadingPhoto: uploadPhotoMutation.isPending,
  };
};
