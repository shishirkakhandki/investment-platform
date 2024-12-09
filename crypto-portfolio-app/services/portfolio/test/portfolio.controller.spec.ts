import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

describe('PortfolioController', () => {
  let portfolioController: PortfolioController;
  let portfolioService: PortfolioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PortfolioController],
      providers: [
        {
          provide: PortfolioService,
          useValue: {
            getPortfolio: jest.fn(),
            calculatePortfolioValue: jest.fn(),
          },
        },
      ],
    }).compile();

    portfolioController = module.get<PortfolioController>(PortfolioController);
    portfolioService = module.get<PortfolioService>(PortfolioService);
  });

  it('should be defined', () => {
    expect(portfolioController).toBeDefined();
  });

  describe('getPortfolio', () => {
    it('should return portfolio data', async () => {
      const mockResponse = { portfolio: [] };
      jest
        .spyOn(portfolioService, 'getPortfolio')
        .mockResolvedValue(mockResponse);

      const result = await portfolioController.getPortfolio(
        '123',
        'walletAddress',
        'providerUrl',
        ['token1', 'token2'],
      );

      expect(result).toEqual(mockResponse);
      expect(portfolioService.getPortfolio).toHaveBeenCalledWith(
        '123',
        'walletAddress',
        'providerUrl',
        ['token1', 'token2'],
      );
    });
  });

  describe('getPortfolioValue', () => {
    it('should return portfolio value', async () => {
      const mockResponse = { totalValue: 100 };
      jest
        .spyOn(portfolioService, 'calculatePortfolioValue')
        .mockResolvedValue(mockResponse);

      const result = await portfolioController.getPortfolioValue(
        '123',
        'walletAddress',
        'providerUrl',
        ['token1', 'token2'],
      );

      expect(result).toEqual(mockResponse);
      expect(portfolioService.calculatePortfolioValue).toHaveBeenCalledWith(
        '123',
        'walletAddress',
        'providerUrl',
        ['token1', 'token2'],
      );
    });
  });
});
