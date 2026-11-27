import { Injectable } from '@nestjs/common';
import { Prisma, ReturnStatus } from '@prisma/client';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  ActiveReturnReverseCodeReadDto,
  ReturnRequestReadDto,
} from '../../dtos/return-request-read.dto';
import { ReturnRequestQueryRepository } from '../../domain/ports/return-request-query.repository';
import { ReturnStatusValue } from '../../domain/value-object/return-status.value.object';

const returnRequestReadSelect = {
  id: true,
  orderId: true,
  customerId: true,
  productId: true,
  type: true,
  reason: true,
  description: true,
  status: true,
  trackingCode: true,
  inspectionResult: true,
  rejectionReason: true,
  adjustmentRequestedAt: true,
  adjustmentReason: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  items: { select: { quantity: true } },
} satisfies Prisma.ReturnRequestSelect;

type ReturnRequestProjection = Prisma.ReturnRequestGetPayload<{
  select: typeof returnRequestReadSelect;
}>;

const STATUS_LABELS: Record<ReturnStatus, string> = {
  REQUESTED: 'Solicitado',
  POSTED: 'Postado',
  RECEIVED: 'Recebido',
  INSPECTING: 'Em inspeção',
  ADJUSTMENT_REQUESTED: 'Ajuste solicitado',
  APPROVED: 'Aprovado',
  REJECTED: 'Rejeitado',
  COMPLETED: 'Concluído',
  CANCELLED: 'Cancelado',
};

@Injectable()
export class ReturnRequestPrismaQueryRepository implements ReturnRequestQueryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findReadModelById(id: string): Promise<ReturnRequestReadDto | null> {
    const request = await this.prisma.returnRequest.findUnique({
      where: { id },
      select: returnRequestReadSelect,
    });
    return request ? toReadDto(request) : null;
  }

  async listSummary(customerId?: string): Promise<ReturnRequestReadDto[]> {
    const requests = await this.prisma.returnRequest.findMany({
      where: customerId ? { customerId } : undefined,
      orderBy: { createdAt: 'desc' },
      select: returnRequestReadSelect,
    });
    return requests.map(toReadDto);
  }

  async findActiveReverseCode(
    returnRequestId: string,
  ): Promise<ActiveReturnReverseCodeReadDto | null> {
    const reverseCode = await this.prisma.reverseCode.findFirst({
      where: { returnRequestId, usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { expiresAt: 'asc' },
      select: { code: true },
    });
    return reverseCode;
  }
}

function toReadDto(request: ReturnRequestProjection): ReturnRequestReadDto {
  return {
    id: request.id,
    orderId: request.orderId,
    customerId: request.customerId,
    productId: request.productId,
    type: request.type,
    reason: request.reason,
    description: request.description,
    status: request.status as ReturnStatusValue,
    statusLabel: STATUS_LABELS[request.status],
    trackingCode: request.trackingCode,
    inspectionResult: request.inspectionResult,
    rejectionReason: request.rejectionReason,
    adjustmentRequestedAt: request.adjustmentRequestedAt?.toISOString() ?? null,
    adjustmentReason: request.adjustmentReason,
    version: request.version,
    createdAt: request.createdAt.toISOString(),
    updatedAt: request.updatedAt.toISOString(),
    itemCount: request.items.length,
    totalItemQuantity: request.items.reduce((total, item) => total + item.quantity, 0),
  };
}
