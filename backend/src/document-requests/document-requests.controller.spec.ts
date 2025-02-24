import { Test, TestingModule } from '@nestjs/testing';
import { DocumentRequestsController } from './document-requests.controller';

describe('DocumentRequestsController', () => {
  let controller: DocumentRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentRequestsController],
    }).compile();

    controller = module.get<DocumentRequestsController>(DocumentRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
