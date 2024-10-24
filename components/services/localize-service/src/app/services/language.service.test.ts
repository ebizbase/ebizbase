import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { LanguageService } from './language.service';
import { Language } from '../schemas/language';
import { EliteLogger } from '@ebizbase/nest-elite-logger';
import { GrpcUnavailableException } from '@ebizbase/nest-grpc-exceptions';
import { Metadata } from '@grpc/grpc-js';
import { Model } from 'mongoose';

describe('LanguageService', () => {
  let service: LanguageService;
  let model: Model<Language>;

  const mockLanguageModel = {
    ensureIndexes: jest.fn(),
    countDocuments: jest.fn(),
    insertMany: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanguageService,
        {
          provide: getModelToken(Language.name),
          useValue: mockLanguageModel,
        },
        {
          provide: EliteLogger,
          useValue: {
            debug: jest.fn(),
            info: jest.fn(),
            trace: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LanguageService>(LanguageService);
    model = module.get<Model<Language>>(getModelToken(Language.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('onModuleInit', () => {
    it('should ensure indexes and seed languages if none exist', async () => {
      mockLanguageModel.countDocuments.mockResolvedValue(0);
      const seedingLanguagesSpy = jest.spyOn(service, 'seedingLanguages').mockResolvedValue();

      await service.onModuleInit();

      expect(mockLanguageModel.ensureIndexes).toHaveBeenCalled();
      expect(mockLanguageModel.countDocuments).toHaveBeenCalled();
      expect(seedingLanguagesSpy).toHaveBeenCalled();
    });

    it('should not seed languages if they already exist', async () => {
      mockLanguageModel.countDocuments.mockResolvedValue(1);
      const seedingLanguagesSpy = jest.spyOn(service, 'seedingLanguages').mockResolvedValue();

      await service.onModuleInit();

      expect(mockLanguageModel.ensureIndexes).toHaveBeenCalled();
      expect(mockLanguageModel.countDocuments).toHaveBeenCalled();
      expect(seedingLanguagesSpy).not.toHaveBeenCalled();
    });
  });

  describe('seedingLanguages', () => {
    it('should insert default languages', async () => {
      await service.seedingLanguages();

      expect(mockLanguageModel.insertMany).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ code: 'en', name: 'English', isDefault: true, isActive: true }),
          expect.objectContaining({
            code: 'vi',
            name: 'Tiếng Việt',
            isDefault: false,
            isActive: true,
          }),
        ])
      );
    });
  });

  describe('getActiveLanguages', () => {
    it('should return active languages', async () => {
      const mockLanguages = [
        {
          code: 'en',
          name: 'English',
          isActive: true,
          toObject: jest.fn().mockReturnValue({ code: 'en', name: 'English', isActive: true }),
        },
      ];
      mockLanguageModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockLanguages),
      });

      const metadata = new Metadata();
      const result = await service.getActiveLanguages(metadata);

      const { toObject, ...expected } = mockLanguages[0];
      expect(result).toEqual([expected]);
      expect(mockLanguageModel.find).toHaveBeenCalledWith({ isActive: true });
    });

    it('should throw GrpcUnavailableException on specific error codes', async () => {
      const error = { code: 10061, message: 'Connection error' };
      mockLanguageModel.find.mockReturnValue({
        exec: jest.fn().mockRejectedValue(error),
      });

      const metadata = new Metadata();

      await expect(service.getActiveLanguages(metadata)).rejects.toThrow(GrpcUnavailableException);
      expect(metadata.get('error')).toBeDefined();
    });

    it('should rethrow other errors', async () => {
      const error = new Error();
      mockLanguageModel.find.mockReturnValue({
        exec: jest.fn().mockRejectedValue(error),
      });
      const metadata = new Metadata();
      await expect(service.getActiveLanguages(metadata)).rejects.toThrow(error);
    });
  });
});
