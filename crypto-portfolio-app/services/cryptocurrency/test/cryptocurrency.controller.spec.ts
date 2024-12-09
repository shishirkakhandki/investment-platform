import { Test, TestingModule } from '@nestjs/testing';
import { CryptocurrencyController } from './cryptocurrency.controller';
import { CryptocurrencyService } from './cryptocurrency.service';

describe('CryptocurrencyController', () => {
  let controller: CryptocurrencyController;
  let service: CryptocurrencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptocurrencyController],
      providers: [
        {
          provide: CryptocurrencyService,
          useValue: {
            getTop10Cryptocurrencies: jest.fn(),
            getHistoricalPrices: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CryptocurrencyController>(CryptocurrencyController);
    service = module.get<CryptocurrencyService>(CryptocurrencyService);
  });

  it('should fetch top 10 cryptocurrencies', async () => {
    const mockData = [{ name: 'Bitcoin' }, { name: 'Ethereum' }];
    jest.spyOn(service, 'getTop10Cryptocurrencies').mockResolvedValue(mockData);

    const result = await controller.getTop10Cryptocurrencies();
    expect(result).toEqual(mockData);
    expect(service.getTop10Cryptocurrencies).toHaveBeenCalledTimes(1);
  });

  it('should fetch historical prices', async () => {
    const mockData = { symbol: 'BTC', prices: [100, 200, 300] };
    jest.spyOn(service, 'getHistoricalPrices').mockResolvedValue(mockData);

    const result = await controller.getHistoricalPrices('BTC', '1d');
    expect(result).toEqual(mockData);
    expect(service.getHistoricalPrices).toHaveBeenCalledWith('BTC', '1d');
  });
});
