import { useEffect, useState } from 'react';
import apiClient from '../utils/api';

export default function CryptoList() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const { data } = await apiClient.get('/workflow/crypto/top10'); // Updated endpoint
        setPrices(data);
      } catch (error) {
        console.error("Error fetching top cryptos", error);
      }
    };
    fetchPrices();
  }, []);

  return (
    <ul>
      {prices.map((crypto) => (
        <li key={crypto.symbol}>
          {crypto.name} - ${crypto.price}
        </li>
      ))}
    </ul>
  );
}
