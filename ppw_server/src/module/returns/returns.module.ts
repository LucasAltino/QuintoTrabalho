import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ApproveReturnRequestHandler } from './commands/approve-return-request.handler';
import { CancelReturnRequestHandler } from './commands/cancel-return-request.handler';
import { CompleteReturnRequestHandler } from './commands/complete-return-request.handler';
import { CreateReturnRequestHandler } from './commands/create-return-request.handler';
import { PostReturnRequestHandler } from './commands/post-return-request.handler';
import { ReceiveReturnRequestHandler } from './commands/receive-return-request.handler';
import { RejectReturnRequestHandler } from './commands/reject-return-request.handler';
import { RequestReturnAdjustmentHandler } from './commands/request-return-adjustment.handler';
import { StartReturnInspectionHandler } from './commands/start-return-inspection.handler';
import { UpdateReturnDetailsHandler } from './commands/update-return-details.handler';
import { ReturnRequestCommandRepository } from './domain/ports/return-request-command.repository';
import { ReturnRequestQueryRepository } from './domain/ports/return-request-query.repository';
import { ReturnRequestPrismaCommandRepository } from './infrastructure/adapters/return-request-prisma-command.repository';
import { ReturnRequestPrismaQueryRepository } from './infrastructure/adapters/return-request-prisma-query.repository';
import { ProportionalRefundCalculator } from './domain/refund/proportional-refund-calculator';
import { ReturnRequestController } from './controllers/return-request.controller';
import { ReturnPermissionsGuard } from './presentation/return-permissions.guard';
import { GetActiveReturnReverseCodeHandler } from './queries/get-active-return-reverse-code.handler';
import { GetReturnRequestByIdHandler } from './queries/get-return-request-by-id.handler';
import { ListReturnRequestsSummaryHandler } from './queries/list-return-requests-summary.handler';

@Module({
  imports: [AuthModule],
  controllers: [ReturnRequestController],
  providers: [
    ReturnPermissionsGuard,
    { provide: 'REFUND_STRATEGY', useClass: ProportionalRefundCalculator },
    ReturnRequestPrismaCommandRepository,
    ReturnRequestPrismaQueryRepository,
    {
      provide: 'RETURN_REQUEST_COMMAND_REPOSITORY',
      useExisting: ReturnRequestPrismaCommandRepository,
    },
    {
      provide: 'RETURN_REQUEST_QUERY_REPOSITORY',
      useExisting: ReturnRequestPrismaQueryRepository,
    },
    CreateReturnRequestHandler,
    UpdateReturnDetailsHandler,
    PostReturnRequestHandler,
    ReceiveReturnRequestHandler,
    StartReturnInspectionHandler,
    ApproveReturnRequestHandler,
    RejectReturnRequestHandler,
    RequestReturnAdjustmentHandler,
    CompleteReturnRequestHandler,
    CancelReturnRequestHandler,
    GetReturnRequestByIdHandler,
    ListReturnRequestsSummaryHandler,
    GetActiveReturnReverseCodeHandler,
  ],
})
export class ReturnsModule {}
