import { ActiveReturnReverseCodeReadDto, ReturnRequestReadDto } from '../../dtos/return-request-read.dto';

/** Read-side persistence port. Its methods only project data and never mutate state. */
export interface ReturnRequestQueryRepository {
  findReadModelById(id: string): Promise<ReturnRequestReadDto | null>;
  listSummary(customerId?: string): Promise<ReturnRequestReadDto[]>;
  findActiveReverseCode(returnRequestId: string): Promise<ActiveReturnReverseCodeReadDto | null>;
}
