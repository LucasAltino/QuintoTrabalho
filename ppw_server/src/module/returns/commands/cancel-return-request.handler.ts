import { Inject, Injectable } from '@nestjs/common';
import { ReturnRequestCommandRepository } from '../domain/ports/return-request-command.repository';
import { CancelReturnRequestCommand } from './cancel-return-request.command';
import { executeReturnTransition } from './transition-return-request';

@Injectable()
export class CancelReturnRequestHandler {
  constructor(
    @Inject('RETURN_REQUEST_COMMAND_REPOSITORY')
    private readonly repository: ReturnRequestCommandRepository,
  ) {}

  execute(command: CancelReturnRequestCommand): Promise<void> {
    return executeReturnTransition(this.repository, {
      id: command.id,
      action: 'cancel',
      payload: { justification: command.justification },
      actorId: command.actorId,
    });
  }
}
