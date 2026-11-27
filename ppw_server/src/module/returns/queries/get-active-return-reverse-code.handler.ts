import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ReturnRequestQueryRepository } from '../domain/ports/return-request-query.repository';
import { ActiveReturnReverseCodeReadDto } from '../dtos/return-request-read.dto';
import { GetActiveReturnReverseCodeQuery } from './get-active-return-reverse-code.query';

@Injectable()
export class GetActiveReturnReverseCodeHandler {
  constructor(
    @Inject('RETURN_REQUEST_QUERY_REPOSITORY')
    private readonly repository: ReturnRequestQueryRepository,
  ) {}

  async execute(query: GetActiveReturnReverseCodeQuery): Promise<ActiveReturnReverseCodeReadDto> {
    const readModel = await this.repository.findActiveReverseCode(query.returnRequestId);
    if (!readModel) throw new NotFoundException('Active reverse code not found');
    return readModel;
  }
}
