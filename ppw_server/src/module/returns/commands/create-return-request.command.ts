import { ReturnTypeValue } from '../domain/entity/return-request.entity';

export type CreateReturnRequestInput = {
  orderId: string;
  productId: string;
  type: ReturnTypeValue;
  reason: string;
  description: string;
  trackingCode?: string | null;
  items: { orderItemId: string; quantity: number }[];
};

export type CreateReturnRequestCommand = CreateReturnRequestInput & {
  customerId: string;
};
