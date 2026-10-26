import styled from "styled-components";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { DataPoint } from "@club/components/vision/ui/charts";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

export function PriceRangeChart({ datax }: { datax: DataPoint[] }) {
  // Agrupa movimentações por hora e conta quantas ocorreram
  const activityMap: Record<string, number> = {};

  datax.forEach((point) => {
    const timeKey = point.time.substring(0, 5); // Pega apenas HH:MM
    activityMap[timeKey] = (activityMap[timeKey] || 0) + 1;
  });

  // Define os labels (tempo) e os valores de atividade
  const labels = Object.keys(activityMap).sort(); // Ordenamos os tempos
  const datasetValues = labels.map((key) => {
    const count = activityMap[key];
    return count >= 5 ? 100 : count * 20; // Se muitas transações, high; poucas, low
  });

  const data = {
    labels,
    datasets: [
      {
        data: datasetValues,
        borderColor: "#20d380",
        tension: 0.4,
        pointRadius: 0,
        fill: true,
        backgroundColor: "rgba(32, 211, 128, 0.2)",
      },
    ],
  };

  
  const options = {
    responsive: true,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <ChartContainer>
      <Line data={data} options={options} />
      <PriceRangeIndicator style={{ left: "20%" }} />
      <PriceRangeIndicator style={{ left: "80%" }} />
    </ChartContainer>
  );
}


const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #151614;
  border-radius: 12px;
  padding: 16px;
  margin: 24px 0;
`

const PriceRangeIndicator = styled.div`
  position: absolute;
  top: 0;
  width: 2px;
  height: 100%;
  background: #1ea762;
  cursor: ew-resize;
`

