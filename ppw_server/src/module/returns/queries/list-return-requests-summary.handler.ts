import { Inject, Injectable } from '@nestjs/common';
import { ReturnRequestQueryRepository } from '../domain/ports/return-request-query.repository';
import { ReturnRequestReadDto } from '../dtos/return-request-read.dto';
import { ListReturnRequestsSummaryQuery } from './list-return-requests-summary.query';

@Injectable()
export class ListReturnRequestsSummaryHandler {
  constructor(
    @Inject('RETURN_REQUEST_QUERY_REPOSITORY')
    private readonly repository: ReturnRequestQueryRepository,
  ) {}

  execute(query: ListReturnRequestsSummaryQuery): Promise<ReturnRequestReadDto[]> {
    return this.repository.listSummary(query.customerId);
  }
}
