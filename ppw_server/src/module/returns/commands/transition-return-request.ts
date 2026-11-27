import { NotFoundException } from '@nestjs/common';
import { ReturnRequestEntity, ReturnRequestRecord } from '../domain/entity/return-request.entity';
import { ReturnRequestCommandRepository } from '../domain/ports/return-request-command.repository';
import { TRANSITION_RULES, TransitionPayload } from '../domain/transition/return-transition-rules';
import { ReturnStatus } from '../domain/value-object/return-status.value.object';
import { TransitionAction } from './return-actions';

type ReturnTransition = {
  id: string;
  action: TransitionAction;
  payload: TransitionPayload;
  actorId: string;
};

/** Shared application mechanics used by business-named command handlers. */
export async function executeReturnTransition(
  repository: ReturnRequestCommandRepository,
  command: ReturnTransition,
): Promise<void> {
  const current = await repository.loadForCommand(command.id);
  if (!current) throw new NotFoundException('Return request not found');

  const entity = toEntity(current);
  const rule = TRANSITION_RULES[command.action];
  const transitioned = entity.transition(rule, command.payload);
  const justification = getAuditJustification(command.action, command.payload, rule.name);
  const reverseCode =
    command.action === 'post' && 'reverseCode' in command.payload
      ? command.payload.reverseCode.trim()
      : undefined;

  await repository.persistTransition(
    transitioned,
    entity.props.version,
    rule.from,
    entity.props.status.getValue(),
    command.actorId,
    justification,
    reverseCode,
  );
}

function toEntity(request: ReturnRequestRecord): ReturnRequestEntity {
  return new ReturnRequestEntity({ ...request, status: ReturnStatus.from(request.status) });
}

function getAuditJustification(
  action: TransitionAction,
  payload: TransitionPayload,
  ruleName: string,
): string {
  if (action === 'reject' && 'rejectionReason' in payload) return payload.rejectionReason.trim();
  if (action === 'requestAdjustment' && 'adjustmentReason' in payload) return payload.adjustmentReason.trim();
  if (action === 'cancel' && 'justification' in payload) return payload.justification.trim();
  return `Action: ${ruleName}`;
}
