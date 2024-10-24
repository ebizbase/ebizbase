import { Test, TestingModule } from '@nestjs/testing';
import { LocalizeController } from './localize.controller';
import { LanguageService } from '../services/localize.service';
import { of, firstValueFrom } from 'rxjs';
import { common, google, localize } from '../../protobuf';
import { Translation } from '../schemas/translation.schema';

describe('LocalizeController', () => {
  let localizeController: LocalizeController;
  let languageService: LanguageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalizeController],
      providers: [
        {
          provide: LanguageService,
          useValue: {
            getLanguages: jest.fn(),
            changeDefaultLanguage: jest.fn(),
            listTranslations: jest.fn(),
            updateTranslation: jest.fn(),
          },
        },
      ],
    }).compile();

    localizeController = module.get<LocalizeController>(LocalizeController);
    languageService = module.get<LanguageService>(LanguageService);
  });

  it('should be defined', () => {
    expect(localizeController).toBeDefined();
  });

  describe('listLanguages', () => {
    it('should return an observable of languages', (done) => {
      const mockLanguages = [
        {
          id: '1',
          name: 'English',
          code: 'en',
          isDefault: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Spanish',
          code: 'es',
          isDefault: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(languageService, 'getLanguages').mockResolvedValue(mockLanguages);
      localizeController.listLanguages({} as common.Listing).subscribe((result) => {
        expect(result).toEqual({ languages: mockLanguages });
        done();
      });
    });
  });

  describe('changeDefaultLanguage', () => {
    it('should return an observable of google.protobuf.Empty', (done) => {
      jest
        .spyOn(languageService, 'changeDefaultLanguage')
        .mockImplementation(() => Promise.resolve());
      localizeController
        .changeDefaultLanguage({ id: '1' } as localize.ChangeDefaultLanguageRequest)
        .subscribe((result) => {
          expect(result).toEqual({});
          done();
        });
    });
  });

  describe('listTranslations', () => {
    it('should return an observable of translations', async () => {
      const mockTranslations: Array<Translation> = [
        {
          service: 'test',
          languageCode: '1',
          key: 'key1',
          value: 'value1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          service: 'test',
          languageCode: '1',
          key: 'key2',
          value: 'value2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(languageService, 'listTranslations').mockResolvedValue(mockTranslations);

      const result = await firstValueFrom(
        localizeController.listTranslations({} as common.Listing)
      );
      expect(result).toEqual({ translations: mockTranslations });
    });
  });

  describe('updateTranslation', () => {
    it('should return an observable of translations', (done) => {
      jest.spyOn(languageService, 'updateTranslation').mockResolvedValue();
      localizeController
        .updateTranslation({} as localize.UpdateTranslactionRequest)
        .subscribe((result) => {
          expect(result).toEqual({});
          done();
        });
    });
  });
});
