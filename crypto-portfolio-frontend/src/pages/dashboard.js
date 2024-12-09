import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getPortfolio, getPortfolioValue, getTopCryptos, getCryptoHistory } from '../../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const [topCryptos, setTopCryptos] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [priceHistory, setPriceHistory] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();
  const { userId } = useAuth();

  const extractData = (response) => {
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (response?.data?.data && Array.isArray(response.data.data)) return response.data.data;
    return [];
  };

  const fetchPriceHistory = async (cryptoIds) => {
    try {
      const history = {};
      const range = '7d'; // Example: Fetch data for the last 7 days
      for (const id of cryptoIds) {
  
        const data = await getCryptoHistory(id, range); // Pass both `id` and `range`
        history[id] = data.data; // Assume `prices` is an array of [timestamp, price] pairs
      }
      setPriceHistory(history);
    } catch (error) {
      console.error('Failed to fetch price history:', error);
  
      if (error.response && error.response.status === 429) {
        setErrorMessage('You have exceeded the rate limit. Please try again later.');
      } else {
        setErrorMessage('Unable to fetch historical prices at this time.');
      }
  
      setPriceHistory((prevState) => prevState || {}); // Keep previous data if available
    }
  };
  
  const connectWalletAndFetchData = async () => {
    if (!window.ethereum) {
      setErrorMessage('Please install MetaMask');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const walletAddress = accounts[0];
      setWalletAddress(walletAddress);
      setWalletConnected(true);

      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const tokenAddresses = [
        '0x8FCd98aA4fe4b73fe3A66e83486FE4a69De9c358',
        '0xd5205901F28a0722eA25C3C7732561c8561F1fB5',
      ];
      const providerUrl =
        chainId === '0x1'
          ? 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'
          : 'https://web3.blockxnet.com';

      const portfolioData = await getPortfolio(userId, walletAddress, providerUrl, tokenAddresses);
      
      setPortfolio(portfolioData.data || { holdings: [] });

      const value = await getPortfolioValue(userId, walletAddress, providerUrl, tokenAddresses);
      setPortfolioValue(value.data || 0);

      const topCryptosResponse = await getTopCryptos();
      const cryptosData = extractData(topCryptosResponse);
      setTopCryptos(cryptosData);

      // Fetch price history for the top 5 cryptos
      if (cryptosData.length > 0) {
        const cryptoIds = cryptosData.slice(0, 1).map((crypto) => crypto.id);  // Changed from 10 to 5
        fetchPriceHistory(cryptoIds);
      }
    } catch (error) {
      console.error('Failed to connect wallet or fetch data:', error);
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
    <div className="dashboard">
      <main className="dashboard-main">
        <h1>Your Portfolio</h1>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Display loading state only after wallet is connected */}
        {!walletConnected ? (
          <p>Connecting wallet...</p>
        ) : portfolio ? (
          <div className="portfolio-container">
            <section className="overview-section">
              <h2>Portfolio Overview</h2>
              <p>Total Portfolio Value: ${portfolioValue || 0}</p>
            </section>

            <section className="tokens-section">
              <h3>Your Tokens</h3>
              {portfolio.holdings && portfolio.holdings.length > 0 ? (
                <table className="tokens-table">
                  <thead>
                    <tr>
                      <th>Token</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.holdings.map((token) => (
                      <tr key={token.token}>
                        <td>{token.symbol}</td>
                        <td>{token.amount} tokens</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No tokens found in your portfolio.</p>
              )}
            </section>

            <section className="top-cryptos-section">
              <h3>Top 10 Cryptocurrencies</h3>
              {topCryptos.length > 0 ? (
                <table className="top-cryptos-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Symbol</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCryptos.map((crypto) => (
                      <tr key={crypto.id}>
                        <td>{crypto.name}</td>
                        <td>{crypto.symbol}</td>
                        <td>${crypto.current_price || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No cryptocurrencies found.</p>
              )}
            </section>

            <section className="chart-section">
              <h3>Price Movements</h3>
              {topCryptos.length > 0 && (
                <div className="chart-container">
                  <Line
                    data={{
                      labels: priceHistory[topCryptos[0]?.id]?.map(item =>
                        new Date(item.timestamp).toLocaleDateString()
                      ),
                      datasets: topCryptos.map((crypto, index) => ({
                        label: crypto.name,
                        data: priceHistory[crypto.id]?.map(item => item.price),
                        borderColor: `hsl(${(index / 10) * 360}, 70%, 50%)`,
                        fill: false,
                      })),
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Price Movements of Top 10 Cryptocurrencies' },
                      },
                    }}
                  />
                </div>
              )}
            </section>
          </div>
        ) : (
          <p>Loading portfolio...</p>
        )}

        <div className="wallet-connect-section">
          {!walletConnected ? (
            <button onClick={connectWalletAndFetchData} className="connect-button">Connect to Wallet</button>
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
