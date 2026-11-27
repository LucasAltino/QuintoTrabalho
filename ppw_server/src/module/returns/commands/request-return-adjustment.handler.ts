import { Inject, Injectable } from '@nestjs/common';
import { ReturnRequestCommandRepository } from '../domain/ports/return-request-command.repository';
import { RequestReturnAdjustmentCommand } from './request-return-adjustment.command';
import { executeReturnTransition } from './transition-return-request';

@Injectable()
export class RequestReturnAdjustmentHandler {
  constructor(
    @Inject('RETURN_REQUEST_COMMAND_REPOSITORY')
    private readonly repository: ReturnRequestCommandRepository,
  ) {}

  execute(command: RequestReturnAdjustmentCommand): Promise<void> {
    return executeReturnTransition(this.repository, {
      id: command.id,
      action: 'requestAdjustment',
      payload: { adjustmentReason: command.adjustmentReason },
      actorId: command.actorId,
    });
  }
}
