import React from 'react';
import { VegaLite } from 'react-vega';

interface ChartProps {
  chartData: any;
  onClose?: () => void;
}

const Chart: React.FC<ChartProps> = ({ chartData, onClose }) => {
  if (!chartData || !chartData.$schema) return null;

  return (
    <div style={{ padding: 20 }}>
      {onClose && <button onClick={onClose}>Close</button>}
      <VegaLite spec={chartData} />
    </div>
  );
};

export default Chart;
