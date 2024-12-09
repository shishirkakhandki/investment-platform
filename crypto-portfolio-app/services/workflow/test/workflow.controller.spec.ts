import { Test, TestingModule } from '@nestjs/testing';
import { WorkflowController } from './workflow.controller';
import { WorkflowService } from './workflow.service';
import { HttpException } from '@nestjs/common';

describe('WorkflowController', () => {
  let workflowController: WorkflowController;
  let workflowService: WorkflowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkflowController],
      providers: [
        {
          provide: WorkflowService,
          useValue: {
            getPortfolioDetails: jest.fn(),
            calculatePortfolioValue: jest.fn(),
            getTopCryptos: jest.fn(),
            signup: jest.fn(),
            login: jest.fn(),
            updatePassword: jest.fn(),
            getCryptoHistory: jest.fn(),
          },
        },
      ],
    }).compile();

    workflowController = module.get<WorkflowController>(WorkflowController);
    workflowService = module.get<WorkflowService>(WorkflowService);
  });

  it('should be defined', () => {
    expect(workflowController).toBeDefined();
  });

  describe('getUserPortfolio', () => {
    it('should return portfolio details', async () => {
      const mockResponse = { details: [] };
      jest
        .spyOn(workflowService, 'getPortfolioDetails')
        .mockResolvedValue(mockResponse);

      const result = await workflowController.getUserPortfolio(
        '123',
        'walletAddress',
        'providerUrl',
        ['token1', 'token2'],
      );

      expect(result).toEqual(mockResponse);
      expect(workflowService.getPortfolioDetails).toHaveBeenCalledWith(
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
        .spyOn(workflowService, 'calculatePortfolioValue')
        .mockResolvedValue(mockResponse);

      const result = await workflowController.getPortfolioValue(
        '123',
        'walletAddress',
        'providerUrl',
        ['token1', 'token2'],
      );

      expect(result).toEqual(mockResponse);
      expect(workflowService.calculatePortfolioValue).toHaveBeenCalledWith(
        '123',
        'walletAddress',
        'providerUrl',
        ['token1', 'token2'],
      );
    });
  });

  describe('getTopCryptos', () => {
    it('should return top cryptos', async () => {
      const mockResponse = [{ name: 'Bitcoin', price: 20000 }];
      jest.spyOn(workflowService, 'getTopCryptos').mockResolvedValue(mockResponse);

      const result = await workflowController.getTopCryptos();

      expect(result).toEqual({ data: mockResponse });
      expect(workflowService.getTopCryptos).toHaveBeenCalled();
    });
  });

  describe('signup', () => {
    it('should create a user', async () => {
      const mockResponse = { success: true };
      jest.spyOn(workflowService, 'signup').mockResolvedValue(mockResponse);

      const result = await workflowController.signup({
        username: 'testuser',
        userId: 'test123',
        password: 'password',
      });

      expect(result).toEqual(mockResponse);
      expect(workflowService.signup).toHaveBeenCalledWith({
        username: 'testuser',
        userId: 'test123',
        password: 'password',
      });
    });
  });

  describe('login', () => {
    it('should log in a user', async () => {
      const mockResponse = { token: 'abcd' };
      jest.spyOn(workflowService, 'login').mockResolvedValue(mockResponse);

      const result = await workflowController.login({
        userId: 'test123',
        password: 'password',
      });

      expect(result).toEqual(mockResponse);
      expect(workflowService.login).toHaveBeenCalledWith({
        userId: 'test123',
        password: 'password',
      });
    });
  });

  describe('updatePassword', () => {
    it('should update the password', async () => {
      const mockResponse = { success: true };
      jest.spyOn(workflowService, 'updatePassword').mockResolvedValue(mockResponse);

      const result = await workflowController.updatePassword({
        userId: 'test123',
        oldPassword: 'oldPass',
        newPassword: 'newPass',
      });

      expect(result).toEqual(mockResponse);
      expect(workflowService.updatePassword).toHaveBeenCalledWith({
        userId: 'test123',
        oldPassword: 'oldPass',
        newPassword: 'newPass',
      });
    });
  });

  describe('getCryptoHistory', () => {
    it('should return historical crypto data', async () => {
      const mockResponse = [{ date: '2023-01-01', price: 20000 }];
      jest
        .spyOn(workflowService, 'getCryptoHistory')
        .mockResolvedValue(mockResponse);

      const result = await workflowController.getCryptoHistory('BTC', '7d');

      expect(result).toEqual(mockResponse);
      expect(workflowService.getCryptoHistory).toHaveBeenCalledWith(
        'BTC',
        '7d',
      );
    });
  });
});
