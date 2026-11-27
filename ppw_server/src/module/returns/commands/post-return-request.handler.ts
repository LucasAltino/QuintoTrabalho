import { Inject, Injectable } from '@nestjs/common';
import { ReturnRequestCommandRepository } from '../domain/ports/return-request-command.repository';
import { PostReturnRequestCommand } from './post-return-request.command';
import { executeReturnTransition } from './transition-return-request';

@Injectable()
export class PostReturnRequestHandler {
  constructor(
    @Inject('RETURN_REQUEST_COMMAND_REPOSITORY')
    private readonly repository: ReturnRequestCommandRepository,
  ) {}

  execute(command: PostReturnRequestCommand): Promise<void> {
    return executeReturnTransition(this.repository, {
      id: command.id,
      action: 'post',
      payload: { trackingCode: command.trackingCode, reverseCode: command.reverseCode },
      actorId: command.actorId,
    });
  }
}
