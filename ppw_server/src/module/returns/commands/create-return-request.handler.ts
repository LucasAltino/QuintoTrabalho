import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PayloadValidationError } from '../domain/errors';
import { ReturnRequestEntity } from '../domain/entity/return-request.entity';
import { ReturnRequestCommandRepository } from '../domain/ports/return-request-command.repository';
import { ReturnStatus, ReturnStatusValue } from '../domain/value-object/return-status.value.object';
import { CreateReturnRequestCommand } from './create-return-request.command';

@Injectable()
export class CreateReturnRequestHandler {
  constructor(
    @Inject('RETURN_REQUEST_COMMAND_REPOSITORY')
    private readonly repository: ReturnRequestCommandRepository,
  ) {}

  async execute(command: CreateReturnRequestCommand): Promise<string> {
    const { customerId, ...input } = command;
    if (!input || typeof input !== 'object' || (input.type !== 'DEVOLUTION' && input.type !== 'EXCHANGE')) {
      throw new PayloadValidationError('Invalid return type');
    }
    if (
      !Array.isArray(input.items) ||
      input.items.length === 0 ||
      input.items.some(
        (item) =>
          !item ||
          typeof item !== 'object' ||
          typeof item.orderItemId !== 'string' ||
          item.orderItemId.trim().length === 0 ||
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0,
      )
    ) {
      throw new PayloadValidationError('At least one valid return item is required');
    }
    if (
      !hasText(input.orderId) ||
      !hasText(input.productId) ||
      !hasText(input.reason) ||
      !hasText(input.description) ||
      (input.trackingCode !== undefined && input.trackingCode !== null && !hasText(input.trackingCode))
    ) {
      throw new PayloadValidationError('orderId, productId, reason, and description are required');
    }

    const now = new Date();
    const request = new ReturnRequestEntity({
      id: randomUUID(),
      orderId: input.orderId.trim(),
      customerId,
      productId: input.productId.trim(),
      type: input.type,
      reason: input.reason.trim(),
      description: input.description.trim(),
      status: ReturnStatus.from(ReturnStatusValue.REQUESTED),
      trackingCode: input.trackingCode?.trim() ?? null,
      inspectionResult: null,
      rejectionReason: null,
      adjustmentRequestedAt: null,
      adjustmentReason: null,
      version: 0,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
    const items = input.items.map((item) => ({
      orderItemId: item.orderItemId.trim(),
      quantity: item.quantity,
    }));

    await this.repository.create(request, items);
    return request.props.id;
  }
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
