import { Line } from 'react-chartjs-2';

export default function PortfolioChart({ portfolioData }) {
  const data = {
    labels: portfolioData.map((entry) => entry.date),
    datasets: [
      {
        label: 'Portfolio Value',
        data: portfolioData.map((entry) => entry.value),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return <Line data={data} />;
}
