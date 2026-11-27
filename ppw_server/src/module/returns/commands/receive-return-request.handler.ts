import { Inject, Injectable } from '@nestjs/common';
import { ReturnRequestCommandRepository } from '../domain/ports/return-request-command.repository';
import { ReceiveReturnRequestCommand } from './receive-return-request.command';
import { executeReturnTransition } from './transition-return-request';

@Injectable()
export class ReceiveReturnRequestHandler {
  constructor(
    @Inject('RETURN_REQUEST_COMMAND_REPOSITORY')
    private readonly repository: ReturnRequestCommandRepository,
  ) {}

  execute(command: ReceiveReturnRequestCommand): Promise<void> {
    return executeReturnTransition(this.repository, {
      id: command.id,
      action: 'receive',
      payload: {},
      actorId: command.actorId,
    });
  }
}
