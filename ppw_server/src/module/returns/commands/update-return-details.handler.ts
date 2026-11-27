import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReturnRequestEntity, ReturnRequestRecord } from '../domain/entity/return-request.entity';
import { PayloadValidationError } from '../domain/errors';
import { ReturnRequestCommandRepository } from '../domain/ports/return-request-command.repository';
import { ReturnStatus } from '../domain/value-object/return-status.value.object';
import { UpdateReturnDetailsCommand } from './update-return-details.command';

@Injectable()
export class UpdateReturnDetailsHandler {
  constructor(
    @Inject('RETURN_REQUEST_COMMAND_REPOSITORY')
    private readonly repository: ReturnRequestCommandRepository,
  ) {}

  async execute(command: UpdateReturnDetailsCommand): Promise<void> {
    const { input } = command;
    if (!input || typeof input !== 'object') {
      throw new PayloadValidationError('Request payload must be an object');
    }
    for (const value of [input.reason, input.description]) {
      if (value !== undefined && !hasText(value)) {
        throw new PayloadValidationError('Updated reason and description must not be empty');
      }
    }
    if (input.trackingCode !== undefined && input.trackingCode !== null && !hasText(input.trackingCode)) {
      throw new PayloadValidationError('trackingCode must not be empty');
    }

    const current = await this.repository.loadForCommand(command.id);
    if (!current) throw new NotFoundException('Return request not found');
    const request = toEntity(current).updateDetails({
      reason: input.reason,
      description: input.description,
      trackingCode: input.trackingCode,
    });
    await this.repository.updateDetails(request);
  }
}

function toEntity(request: ReturnRequestRecord): ReturnRequestEntity {
  return new ReturnRequestEntity({ ...request, status: ReturnStatus.from(request.status) });
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
