import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { getPortfolioData } from '../../utils/api';  // Assuming you have a function to fetch portfolio data

export default function Dashboard() {
  const [portfolio, setPortfolio] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // If wallet is not connected, redirect to login page
    if (!localStorage.getItem('token')) {
      router.push('/auth/login');
    } else {
      // Fetch portfolio data here
      fetchPortfolioData();
    }
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const data = await getPortfolioData(); // Fetch the user's portfolio
      setPortfolio(data);
    } catch (err) {
      console.error("Error fetching portfolio data", err);
    }
  };

  return (
    <div>
      <Header />
      <main>
        <h1>Your Portfolio</h1>
        {portfolio ? (
          <div>
            <h2>Portfolio Overview</h2>
            <p>Total Value: ${portfolio.totalValue}</p>
            {/* Display other portfolio data here */}
          </div>
        ) : (
          <p>Loading portfolio...</p>
        )}
      </main>
    </div>
  );
}
