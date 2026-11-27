import { Inject, Injectable } from '@nestjs/common';
import { ReturnRequestCommandRepository } from '../domain/ports/return-request-command.repository';
import { ApproveReturnRequestCommand } from './approve-return-request.command';
import { executeReturnTransition } from './transition-return-request';

@Injectable()
export class ApproveReturnRequestHandler {
  constructor(
    @Inject('RETURN_REQUEST_COMMAND_REPOSITORY')
    private readonly repository: ReturnRequestCommandRepository,
  ) {}

  execute(command: ApproveReturnRequestCommand): Promise<void> {
    return executeReturnTransition(this.repository, {
      id: command.id,
      action: 'approve',
      payload: { inspectionResult: command.inspectionResult },
      actorId: command.actorId,
    });
  }
}
