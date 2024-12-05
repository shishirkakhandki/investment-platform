import { useEffect, useState } from 'react';
import apiClient from '../utils/api';

export default function CryptoList() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      const { data } = await apiClient.get('/cryptocurrency/top-prices');
      setPrices(data);
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
