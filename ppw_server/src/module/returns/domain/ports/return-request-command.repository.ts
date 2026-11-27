import { ReturnRequestEntity, ReturnRequestRecord } from '../entity/return-request.entity';
import { ReturnStatusValue } from '../value-object/return-status.value.object';
import { ReturnQuantity } from '../refund/refund-strategy';

/** Write-side persistence port. Reads here only load an aggregate before a command validates it. */
export interface ReturnRequestCommandRepository {
  create(request: ReturnRequestEntity, items: ReturnQuantity[]): Promise<void>;
  loadForCommand(id: string): Promise<ReturnRequestRecord | null>;
  updateDetails(request: ReturnRequestEntity): Promise<void>;
  persistTransition(
    request: ReturnRequestEntity,
    expectedVersion: number,
    from: ReturnStatusValue[],
    previousStatus: ReturnStatusValue,
    actorId: string,
    justification: string,
    reverseCode?: string,
  ): Promise<void>;
}
