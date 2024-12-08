import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { getPortfolio } from '../utils/api'; // Updated import

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const { data } = await getPortfolio(localStorage.getItem('userId')); // Fetch user's portfolio
        setPortfolio(data);
      } catch (err) {
        console.error("Error fetching portfolio data", err);
        router.push('/auth/login');
      }
    };

    if (!localStorage.getItem('token')) {
      router.push('/auth/login');
    } else {
      fetchPortfolioData();
    }
  }, []);

  return (
    <div>
      <Header />
      <main>
        <h1>Your Portfolio</h1>
        {portfolio ? (
          <div>
            <h2>Portfolio Overview</h2>
            <p>Total Value: ${portfolio.totalValue}</p>
          </div>
        ) : (
          <p>Loading portfolio...</p>
        )}
      </main>
    </div>
  );
}
