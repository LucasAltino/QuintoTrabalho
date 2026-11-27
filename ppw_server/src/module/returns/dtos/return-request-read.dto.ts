import { ReturnTypeValue } from '../domain/entity/return-request.entity';
import { ReturnStatusValue } from '../domain/value-object/return-status.value.object';

/** Projection returned to the Next.js returns screen; it is not an ORM entity. */
export type ReturnRequestReadDto = {
  id: string;
  orderId: string;
  customerId: string;
  productId: string;
  type: ReturnTypeValue;
  reason: string;
  description: string;
  status: ReturnStatusValue;
  statusLabel: string;
  trackingCode: string | null;
  inspectionResult: string | null;
  rejectionReason: string | null;
  adjustmentRequestedAt: string | null;
  adjustmentReason: string | null;
  version: number;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
  totalItemQuantity: number;
};

export type ActiveReturnReverseCodeReadDto = {
  code: string;
};
