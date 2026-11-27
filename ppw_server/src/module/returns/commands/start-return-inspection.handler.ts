import { Inject, Injectable } from '@nestjs/common';
import { ReturnRequestCommandRepository } from '../domain/ports/return-request-command.repository';
import { StartReturnInspectionCommand } from './start-return-inspection.command';
import { executeReturnTransition } from './transition-return-request';

@Injectable()
export class StartReturnInspectionHandler {
  constructor(
    @Inject('RETURN_REQUEST_COMMAND_REPOSITORY')
    private readonly repository: ReturnRequestCommandRepository,
  ) {}

  execute(command: StartReturnInspectionCommand): Promise<void> {
    return executeReturnTransition(this.repository, {
      id: command.id,
      action: 'startInspection',
      payload: {},
      actorId: command.actorId,
    });
  }
}
