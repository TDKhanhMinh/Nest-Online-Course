import api from "@/lib/axios";

export interface CartItemSummary {
  courseId: string;
  title: string;
  slug: string;
  thumbnailUrl?: string;
  price: number;
  instructorName: string;
  categoryName: string;
}

export interface CartResponse {
  studentId: string;
  items: CartItemSummary[];
  totalItems: number;
  totalAmount: number;
}

export const cartApi = {
  getCart: async (): Promise<CartResponse> => {
    const response = await api.get<CartResponse>("/cart");
    return response.data;
  },

  addToCart: async (courseId: string): Promise<CartResponse> => {
    const response = await api.post<CartResponse>("/cart/items", { courseId });
    return response.data;
  },

  removeFromCart: async (courseId: string): Promise<CartResponse> => {
    const response = await api.delete<CartResponse>(`/cart/items/${courseId}`);
    return response.data;
  },

  clearCart: async (): Promise<void> => {
    await api.delete("/cart");
  },
};
