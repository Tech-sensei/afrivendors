import http from "@/lib/http";

export interface CreateVendorReviewPayload {
  rating: number;
  comment: string;
}

export async function createVendorReview(
  vendorNumericId: number,
  payload: CreateVendorReviewPayload
) {
  const response = await http.post(
    `/users/vendors/${vendorNumericId}/reviews`,
    payload
  );
  return response.data;
}
