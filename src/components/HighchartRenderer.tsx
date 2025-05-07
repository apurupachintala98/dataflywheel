import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

interface Props {
  type: string;
  rows: Record<string, any>[];
  columns: string[];
  xAxisKey: string;
  yAxisKey: string;
}

const HighchartRenderer: React.FC<Props> = ({ type, rows, columns, xAxisKey, yAxisKey }) => {
  const validData = Array.isArray(rows) ? rows : [];
  const dataKeys = validData.length > 0 ? Object.keys(validData[0]) : [];
  const limitedData = validData.slice(0, 50);
  const hasSufficientData = limitedData.length > 0 && xAxisKey && yAxisKey;

  if (!hasSufficientData) {
    return (
      <p style={{ marginTop: '20px', color: 'red' }}>
        No sufficient data to display the chart. Please provide valid data and select valid axes.
      </p>
    );
  }

  let options: Highcharts.Options = {
    title: { text: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart` },
    series: [],
  };

  const categories = limitedData.map(row => row[xAxisKey]);
  const values = limitedData.map(row => Number(row[yAxisKey]) || 0);

  switch (type) {
    case 'line':
    case 'area':
    case 'column': {
      options = {
        chart: { type },
        title: { text: `${type} chart` },
        xAxis: { categories, title: { text: xAxisKey } },
        yAxis: { title: { text: yAxisKey } },
        series: [{ type: type as any, name: yAxisKey, data: values }],
      };
      break;
    }

    case 'pie': {
      options = {
        chart: { type: 'pie' },
        title: { text: 'Pie Chart' },
        series: [{
          type: 'pie',
          name: yAxisKey,
          data: limitedData.map((row) => ({
            name: String(row[xAxisKey]),
            y: Number(row[yAxisKey]) || 0,
          }))
        }],
      };
      break;
    }

    case 'variablePie': {
      options = {
        chart: { type: 'variablepie' },
        title: { text: 'Variable Pie Chart' },
        tooltip: { pointFormat: '<b>{point.name}</b>: {point.y}' },
        series: [{
          type: 'variablepie',
          minPointSize: 10,
          innerSize: '40%',
          zMin: 0,
          name: yAxisKey,
          data: limitedData.map((row, idx) => ({
            name: String(row[xAxisKey]),
            y: Number(row[yAxisKey]) || 0,
            z: idx + 1,
          }))
        }]
      };
      break;
    }

    case 'radialBar': {
      options = {
        chart: {
          polar: true,
          type: 'column',
        },
        title: { text: 'Radial Bar Chart' },
        xAxis: {
          categories,
          tickmarkPlacement: 'on',
          lineWidth: 0,
        },
        yAxis: { min: 0 },
        series: [{
          type: 'column',
          name: yAxisKey,
          data: values,
          pointPlacement: 'on'
        }]
      };
      break;
    }

    case 'bubble': {
      const zAxisKey = dataKeys.find(key => key !== xAxisKey && key !== yAxisKey) || yAxisKey;
      options = {
        chart: { type: 'bubble', plotBorderWidth: 1 },
        title: { text: 'Bubble Chart' },
        xAxis: { title: { text: xAxisKey } },
        yAxis: { title: { text: yAxisKey } },
        series: [{
          type: 'bubble',
          name: 'Bubble',
          data: limitedData.map((row) => ([
            Number(row[xAxisKey]) || 0,
            Number(row[yAxisKey]) || 0,
            Number(row[zAxisKey]) || 1,
          ]))
        }],
      };
      break;
    }

    default:
      return null;
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default HighchartRenderer;
