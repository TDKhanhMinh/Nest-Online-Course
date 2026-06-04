import api from "@/lib/axios";

export interface InitiatePaymentResponse {
  paymentUrl: string;
  gatewayOrderId?: string;
  transactionId: string;
}

export interface CapturePayPalResponse {
  status: string;
  orderId: string;
}

export interface PaymentStatusResponse {
  orderId: string;
  totalAmount: number;
  orderStatus: string;
  paymentMethod?: string;
  paidAt?: string;
  transaction?: {
    id: string;
    status: string;
    gatewayTransactionNo?: string;
    currency: string;
    amount: number;
  };
}

export const paymentApi = {
  initiatePayment: async (input: {
    orderId: string;
    paymentMethod: 'PAYPAL' | 'VNPAY';
    locale?: 'vn' | 'en';
  }): Promise<InitiatePaymentResponse> => {
    const response = await api.post<InitiatePaymentResponse>("/payments/initiate", input);
    return response.data;
  },

  capturePayPal: async (input: { paypalOrderId: string }): Promise<CapturePayPalResponse> => {
    const response = await api.post<CapturePayPalResponse>("/payments/paypal-capture", input);
    return response.data;
  },

  getPaymentStatus: async (orderId: string): Promise<PaymentStatusResponse> => {
    const response = await api.get<PaymentStatusResponse>(`/payments/status/${orderId}`);
    return response.data;
  },
};
