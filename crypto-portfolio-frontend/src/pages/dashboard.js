import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getPortfolio, getPortfolioValue, getTopCryptos } from '../../utils/api';
import Header from '../components/Header';
import { useAuth } from './AuthContext';

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const [topCryptos, setTopCryptos] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();
  const { userId } = useAuth();

  const extractData = (response) => {
    // Handle various possible API response structures
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (response?.data?.data && Array.isArray(response.data.data)) return response.data.data;
    return [];
  };

  const connectWalletAndFetchData = async () => {
    if (!window.ethereum) {
      setErrorMessage('Please install MetaMask');
      return;
    }

    try {
      // Wallet Connection
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const walletAddress = accounts[0];
      setWalletAddress(walletAddress);
      setWalletConnected(true);

      // Chain ID
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      
      // Token Addresses (hardcoded for now)
      const tokenAddresses = [
        '0x8FCd98aA4fe4b73fe3A66e83486FE4a69De9c358', 
        '0xd5205901F28a0722eA25C3C7732561c8561F1fB5'
      ];

      // Provider URL (simplified)
      const providerUrl = chainId === '0x1' 
        ? 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'
        : 'https://web3.blockxnet.com';

      // Fetch Portfolio Data
      try {
        const portfolioData = await getPortfolio(userId, walletAddress, providerUrl, tokenAddresses);
        console.log("Portfolio data: "+JSON.stringify(portfolioData))
        setPortfolio(portfolioData.data || { holdings: [] });
      } catch (portfolioError) {
        console.error('Portfolio fetch error:', portfolioError);
        setPortfolio({ holdings: [] });
      }

      // Fetch Portfolio Value
      try {
        const value = await getPortfolioValue(userId, walletAddress, providerUrl, tokenAddresses);
        console.log("Value: "+JSON.stringify(value))
        setPortfolioValue(value.data || 0);
      } catch (valueError) {
        console.error('Portfolio value fetch error:', valueError);
        setPortfolioValue(0);
      }

      // Fetch Top Cryptos
      try {
        const topCryptosResponse = await getTopCryptos();
        const cryptosData = extractData(topCryptosResponse);
        setTopCryptos(cryptosData);
      } catch (cryptosError) {
        console.error('Top cryptos fetch error:', cryptosError);
        setTopCryptos([]);
      }

    } catch (error) {
      console.error('Wallet connection error:', error);
      setErrorMessage('Failed to connect wallet. Please try again.');
    }
  };

  useEffect(() => {
    if (!userId) {
      router.push('/auth/login');
    } else {
      connectWalletAndFetchData();
    }
  }, [userId, router]);

  return (
    <div>
      <main>
        <h1>Your Portfolio</h1>
        
        {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}

        {portfolio ? (
          <div>
            <h2>Portfolio Overview</h2>
            <p>Total Portfolio Value: ${portfolioValue || 0}</p>

            <h3>Top 10 Cryptocurrencies</h3>
            <ul>
              {topCryptos.length > 0 ? (
                topCryptos.map((crypto) => (
                  <li key={crypto.id}>
                    {crypto.name} ({crypto.symbol}): ${crypto.current_price || 'N/A'}
                  </li>
                ))
              ) : (
                <p>No cryptocurrencies found</p>
              )}
            </ul>

            <h3>Your Holdings</h3>
            <ul>
              {portfolio.holdings && portfolio.holdings.length > 0 ? (
                portfolio.holdings.map((holding) => (
                  <li key={holding.symbol}>
                    {holding.symbol}: {holding.amount} tokens, 
                    Value: ${holding.amount * (holding.usdValue || 0)}
                  </li>
                ))
              ) : (
                <p>No holdings available</p>
              )}
            </ul>
          </div>
        ) : (
          <p>Loading portfolio...</p>
        )}

        <div>
          {!walletConnected ? (
            <button onClick={connectWalletAndFetchData}>Connect to Wallet</button>
          ) : (
            <div>
              <p>Wallet Connected: {walletAddress}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}