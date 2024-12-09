import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../pages/dashboard'; // Adjust the import path
import * as api from '../../utils/api'; // Adjust import to match your API utilities
import { AuthProvider } from '../contexts/AuthContext'; // Ensure the AuthContext is provided
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { createMockRouter } from './mockRouter'; // Mock Router for Next.js

jest.mock('../../utils/api');

describe('Dashboard Component', () => {
  const mockUserId = '12345';

  const mockRouter = createMockRouter({
    query: {},
  });

  const setup = () =>
    render(
      <RouterContext.Provider value={mockRouter}>
        <AuthProvider value={{ userId: mockUserId }}>
          <Dashboard />
        </AuthProvider>
      </RouterContext.Provider>
    );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders loading state initially', () => {
    setup();
    expect(screen.getByText('Loading portfolio...')).toBeInTheDocument();
  });

  it('redirects to login if user is not authenticated', () => {
    render(
      <RouterContext.Provider value={mockRouter}>
        <AuthProvider value={{ userId: null }}>
          <Dashboard />
        </AuthProvider>
      </RouterContext.Provider>
    );
    expect(mockRouter.push).toHaveBeenCalledWith('/auth/login');
  });

  it('displays an error if MetaMask is not installed', async () => {
    setup();
    Object.defineProperty(window, 'ethereum', {
      value: null,
    });

    fireEvent.click(screen.getByText('Connect to Wallet'));

    expect(await screen.findByText('Please install MetaMask')).toBeInTheDocument();
  });

  it('fetches and displays portfolio data when wallet is connected', async () => {
    const mockPortfolioData = {
      data: {
        holdings: [
          { token: 'TokenA', symbol: 'TA', amount: 100 },
          { token: 'TokenB', symbol: 'TB', amount: 200 },
        ],
      },
    };

    const mockPortfolioValue = { data: 1000 };
    const mockTopCryptos = {
      data: [
        { id: 'btc', name: 'Bitcoin', symbol: 'BTC', current_price: 50000 },
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', current_price: 3000 },
      ],
    };

    jest.spyOn(api, 'getPortfolio').mockResolvedValue(mockPortfolioData);
    jest.spyOn(api, 'getPortfolioValue').mockResolvedValue(mockPortfolioValue);
    jest.spyOn(api, 'getTopCryptos').mockResolvedValue(mockTopCryptos);

    Object.defineProperty(window, 'ethereum', {
      value: {
        request: jest.fn().mockResolvedValue(['0x123']),
      },
    });

    setup();

    fireEvent.click(screen.getByText('Connect to Wallet'));

    expect(await screen.findByText('Total Portfolio Value: $1000')).toBeInTheDocument();
    expect(screen.getByText('TA')).toBeInTheDocument();
    expect(screen.getByText('TB')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
  });

  it('handles API errors gracefully', async () => {
    jest.spyOn(api, 'getPortfolio').mockRejectedValue(new Error('API error'));

    Object.defineProperty(window, 'ethereum', {
      value: {
        request: jest.fn().mockResolvedValue(['0x123']),
      },
    });

    setup();

    fireEvent.click(screen.getByText('Connect to Wallet'));

    expect(await screen.findByText('Failed to connect wallet. Please try again.')).toBeInTheDocument();
  });

  it('fetches and displays price history for top cryptos', async () => {
    const mockTopCryptos = {
      data: [
        { id: 'btc', name: 'Bitcoin', symbol: 'BTC', current_price: 50000 },
      ],
    };

    const mockPriceHistory = {
      data: [
        { timestamp: 1627840800000, price: 48000 },
        { timestamp: 1627927200000, price: 49000 },
      ],
    };

    jest.spyOn(api, 'getTopCryptos').mockResolvedValue(mockTopCryptos);
    jest.spyOn(api, 'getCryptoHistory').mockResolvedValue(mockPriceHistory);

    Object.defineProperty(window, 'ethereum', {
      value: {
        request: jest.fn().mockResolvedValue(['0x123']),
      },
    });

    setup();

    fireEvent.click(screen.getByText('Connect to Wallet'));

    expect(await screen.findByText('Price Movements')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin')).toBeInTheDocument();
  });
});
