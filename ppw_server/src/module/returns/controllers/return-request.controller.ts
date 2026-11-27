import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../../auth/auth.types';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApproveReturnRequestHandler } from '../commands/approve-return-request.handler';
import { CancelReturnRequestHandler } from '../commands/cancel-return-request.handler';
import { CompleteReturnRequestHandler } from '../commands/complete-return-request.handler';
import { CreateReturnRequestHandler } from '../commands/create-return-request.handler';
import { CreateReturnRequestInput } from '../commands/create-return-request.command';
import { PostReturnRequestHandler } from '../commands/post-return-request.handler';
import { ReceiveReturnRequestHandler } from '../commands/receive-return-request.handler';
import { RejectReturnRequestHandler } from '../commands/reject-return-request.handler';
import { RequestReturnAdjustmentHandler } from '../commands/request-return-adjustment.handler';
import { StartReturnInspectionHandler } from '../commands/start-return-inspection.handler';
import { UpdateReturnDetailsHandler } from '../commands/update-return-details.handler';
import { UpdateReturnDetailsInput } from '../commands/update-return-details.command';
import { ActiveReturnReverseCodeReadDto, ReturnRequestReadDto } from '../dtos/return-request-read.dto';
import { ReturnRequestIdDto } from '../dtos/return-request-id.dto';
import { GetActiveReturnReverseCodeHandler } from '../queries/get-active-return-reverse-code.handler';
import { GetReturnRequestByIdHandler } from '../queries/get-return-request-by-id.handler';
import { ListReturnRequestsSummaryHandler } from '../queries/list-return-requests-summary.handler';
import { RequireReturnAction, ReturnPermissionsGuard } from '../presentation/return-permissions.guard';

@Controller('returns')
@UseGuards(JwtAuthGuard)
export class ReturnRequestController {
  constructor(
    private readonly createReturn: CreateReturnRequestHandler,
    private readonly updateReturnDetails: UpdateReturnDetailsHandler,
    private readonly postReturn: PostReturnRequestHandler,
    private readonly receiveReturn: ReceiveReturnRequestHandler,
    private readonly startInspection: StartReturnInspectionHandler,
    private readonly approveReturn: ApproveReturnRequestHandler,
    private readonly rejectReturn: RejectReturnRequestHandler,
    private readonly requestAdjustment: RequestReturnAdjustmentHandler,
    private readonly completeReturn: CompleteReturnRequestHandler,
    private readonly cancelReturn: CancelReturnRequestHandler,
    private readonly getReturnById: GetReturnRequestByIdHandler,
    private readonly listReturnSummaries: ListReturnRequestsSummaryHandler,
    private readonly getActiveReverseCode: GetActiveReturnReverseCodeHandler,
  ) {}

  @Get()
  @RequireReturnAction('list')
  @UseGuards(ReturnPermissionsGuard)
  listar(@Req() request: AuthenticatedRequest): Promise<ReturnRequestReadDto[]> {
    const customerId = request.user.role === Role.CUSTOMER ? request.user.id : undefined;
    return this.listReturnSummaries.execute({ customerId });
  }

  @Post()
  @RequireReturnAction('create')
  @UseGuards(ReturnPermissionsGuard)
  async criar(
    @Body() input: CreateReturnRequestInput,
    @Req() request: AuthenticatedRequest,
  ): Promise<ReturnRequestIdDto> {
    const id = await this.createReturn.execute({ ...input, customerId: request.user.id });
    return { id };
  }

  @Get(':id')
  @RequireReturnAction('read')
  @UseGuards(ReturnPermissionsGuard)
  buscar(@Param('id') id: string): Promise<ReturnRequestReadDto> {
    return this.getReturnById.execute({ id });
  }

  @Get(':id/reverse-code')
  @RequireReturnAction('readReverseCode')
  @UseGuards(ReturnPermissionsGuard)
  codigoReverso(@Param('id') id: string): Promise<ActiveReturnReverseCodeReadDto> {
    return this.getActiveReverseCode.execute({ returnRequestId: id });
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireReturnAction('update')
  @UseGuards(ReturnPermissionsGuard)
  atualizar(@Param('id') id: string, @Body() input: UpdateReturnDetailsInput): Promise<void> {
    return this.updateReturnDetails.execute({ id, input });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireReturnAction('update')
  @UseGuards(ReturnPermissionsGuard)
  atualizarPatch(@Param('id') id: string, @Body() input: UpdateReturnDetailsInput): Promise<void> {
    return this.updateReturnDetails.execute({ id, input });
  }

  @Post(':id/post')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireReturnAction('post')
  @UseGuards(ReturnPermissionsGuard)
  postar(
    @Param('id') id: string,
    @Body() payload: { trackingCode: string; reverseCode: string },
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    return this.postReturn.execute({ id, ...payload, actorId: request.user.id });
  }

  @Post(':id/receive')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireReturnAction('receive')
  @UseGuards(ReturnPermissionsGuard)
  receber(@Param('id') id: string, @Req() request: AuthenticatedRequest): Promise<void> {
    return this.receiveReturn.execute({ id, actorId: request.user.id });
  }

  @Post(':id/start-inspection')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireReturnAction('startInspection')
  @UseGuards(ReturnPermissionsGuard)
  iniciarInspecao(@Param('id') id: string, @Req() request: AuthenticatedRequest): Promise<void> {
    return this.startInspection.execute({ id, actorId: request.user.id });
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireReturnAction('approve')
  @UseGuards(ReturnPermissionsGuard)
  aprovar(
    @Param('id') id: string,
    @Body() payload: { inspectionResult: string },
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    return this.approveReturn.execute({ id, ...payload, actorId: request.user.id });
  }

  @Post(':id/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireReturnAction('reject')
  @UseGuards(ReturnPermissionsGuard)
  rejeitar(
    @Param('id') id: string,
    @Body() payload: { rejectionReason: string },
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    return this.rejectReturn.execute({ id, ...payload, actorId: request.user.id });
  }

  @Post(':id/request-adjustment')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireReturnAction('requestAdjustment')
  @UseGuards(ReturnPermissionsGuard)
  solicitarAjuste(
    @Param('id') id: string,
    @Body() payload: { adjustmentReason: string },
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    return this.requestAdjustment.execute({ id, ...payload, actorId: request.user.id });
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireReturnAction('complete')
  @UseGuards(ReturnPermissionsGuard)
  concluir(@Param('id') id: string, @Req() request: AuthenticatedRequest): Promise<void> {
    return this.completeReturn.execute({ id, actorId: request.user.id });
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequireReturnAction('cancel')
  @UseGuards(ReturnPermissionsGuard)
  cancelar(
    @Param('id') id: string,
    @Body() payload: { justification: string },
    @Req() request: AuthenticatedRequest,
  ): Promise<void> {
    return this.cancelReturn.execute({ id, ...payload, actorId: request.user.id });
  }
}
