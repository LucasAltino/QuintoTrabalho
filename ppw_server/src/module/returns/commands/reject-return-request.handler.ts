import { Inject, Injectable } from '@nestjs/common';
import { ReturnRequestCommandRepository } from '../domain/ports/return-request-command.repository';
import { RejectReturnRequestCommand } from './reject-return-request.command';
import { executeReturnTransition } from './transition-return-request';

@Injectable()
export class RejectReturnRequestHandler {
  constructor(
    @Inject('RETURN_REQUEST_COMMAND_REPOSITORY')
    private readonly repository: ReturnRequestCommandRepository,
  ) {}

  execute(command: RejectReturnRequestCommand): Promise<void> {
    return executeReturnTransition(this.repository, {
      id: command.id,
      action: 'reject',
      payload: { rejectionReason: command.rejectionReason },
      actorId: command.actorId,
    });
  }
}
