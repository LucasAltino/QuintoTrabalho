import { ApproveReturnRequestHandler } from './approve-return-request.handler';
import { ReturnRequestCommandRepository } from '../domain/ports/return-request-command.repository';
import { ReturnStatusValue } from '../domain/value-object/return-status.value.object';
import { VersionConflictError } from '../domain/errors';

function request(status: ReturnStatusValue, version = 3) {
  return {
    id: 'rr-1',
    orderId: 'o-1',
    customerId: 'c-1',
    productId: 'p-1',
    type: 'DEVOLUTION' as const,
    reason: 'Damaged',
    description: 'Box opened',
    status,
    trackingCode: null,
    inspectionResult: null,
    rejectionReason: null,
    adjustmentRequestedAt: null,
    adjustmentReason: null,
    version,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
}

describe('ApproveReturnRequestHandler concurrency', () => {
  it('passes the current version and rule origins to the versioned write port', async () => {
    const repository: ReturnRequestCommandRepository = {
      create: jest.fn(),
      loadForCommand: jest.fn().mockResolvedValue(request(ReturnStatusValue.INSPECTING, 7)),
      updateDetails: jest.fn(),
      persistTransition: jest.fn().mockResolvedValue(undefined),
    };
    const handler = new ApproveReturnRequestHandler(repository);

    await handler.execute({
      id: 'rr-1',
      inspectionResult: '  Looks good  ',
      actorId: 'inspector-1',
    });

    expect(repository.persistTransition).toHaveBeenCalledWith(
      expect.objectContaining({ props: expect.objectContaining({ status: expect.anything() }) }),
      7,
      [ReturnStatusValue.INSPECTING],
      ReturnStatusValue.INSPECTING,
      'inspector-1',
      'Action: approve',
      undefined,
    );
  });

  it('surfaces a version conflict when another transition wins', async () => {
    const repository: ReturnRequestCommandRepository = {
      create: jest.fn(),
      loadForCommand: jest.fn().mockResolvedValue(request(ReturnStatusValue.INSPECTING)),
      updateDetails: jest.fn(),
      persistTransition: jest.fn().mockRejectedValue(new VersionConflictError('conflict')),
    };
    const handler = new ApproveReturnRequestHandler(repository);

    await expect(
      handler.execute({ id: 'rr-1', inspectionResult: 'Looks good', actorId: 'inspector-1' }),
    ).rejects.toBeInstanceOf(VersionConflictError);
  });
});
