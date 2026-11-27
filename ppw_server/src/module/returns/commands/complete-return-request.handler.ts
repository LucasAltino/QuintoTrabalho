import { Inject, Injectable } from '@nestjs/common';
import { ReturnRequestCommandRepository } from '../domain/ports/return-request-command.repository';
import { CompleteReturnRequestCommand } from './complete-return-request.command';
import { executeReturnTransition } from './transition-return-request';

@Injectable()
export class CompleteReturnRequestHandler {
  constructor(
    @Inject('RETURN_REQUEST_COMMAND_REPOSITORY')
    private readonly repository: ReturnRequestCommandRepository,
  ) {}

  execute(command: CompleteReturnRequestCommand): Promise<void> {
    return executeReturnTransition(this.repository, {
      id: command.id,
      action: 'complete',
      payload: {},
      actorId: command.actorId,
    });
  }
}
