import api from "@/lib/axios";

export interface OrderItemDto {
  courseId: string;
  courseTitle: string;
  courseThumbnail?: string;
  price: number;
}

export interface StudentOrderDto {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItemDto[];
}

export interface CheckoutResponse {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export const orderApi = {
  checkout: async (): Promise<CheckoutResponse> => {
    const response = await api.post<CheckoutResponse>("/orders/checkout");
    return response.data;
  },

  getOrders: async (): Promise<StudentOrderDto[]> => {
    const response = await api.get<StudentOrderDto[]>("/orders");
    return response.data;
  },

  getOrderById: async (orderId: string): Promise<StudentOrderDto> => {
    const response = await api.get<StudentOrderDto>(`/orders/${orderId}`);
    return response.data;
  },
};
