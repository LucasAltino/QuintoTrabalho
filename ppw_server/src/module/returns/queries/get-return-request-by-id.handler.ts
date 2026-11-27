import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReturnRequestQueryRepository } from '../domain/ports/return-request-query.repository';
import { ReturnRequestReadDto } from '../dtos/return-request-read.dto';
import { GetReturnRequestByIdQuery } from './get-return-request-by-id.query';

@Injectable()
export class GetReturnRequestByIdHandler {
  constructor(
    @Inject('RETURN_REQUEST_QUERY_REPOSITORY')
    private readonly repository: ReturnRequestQueryRepository,
  ) {}

  async execute(query: GetReturnRequestByIdQuery): Promise<ReturnRequestReadDto> {
    const readModel = await this.repository.findReadModelById(query.id);
    if (!readModel) throw new NotFoundException('Return request not found');
    return readModel;
  }
}
