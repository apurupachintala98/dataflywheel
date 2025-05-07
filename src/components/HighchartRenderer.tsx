import React from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

type Props = {
    type: string;
    rows: Record<string, any>[];
    columns: string[];
  };
  
  const HighchartRenderer: React.FC<Props> = ({ type, rows, columns }) => {  
  if (!rows || rows.length === 0 || columns.length === 0) return null;

  const categories = rows.map((row) => row[columns[0]]);
  const dataSeries = columns.slice(1).map((col) => ({
    name: col,
    data: rows.map((row) => Number(row[col]) || 0),
  }));

  let options = {};

  switch (type) {
    case 'line':
    case 'area':
      options = {
        chart: { type },
        title: { text: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart` },
        xAxis: { categories },
        yAxis: { title: { text: columns[1] } },
        series: dataSeries,
      };
      break;

    case 'column':
      options = {
        chart: { type: 'column' },
        title: { text: 'Column Chart' },
        xAxis: { categories },
        yAxis: { title: { text: columns[1] } },
        series: dataSeries,
      };
      break;

    case 'pie':
      options = {
        chart: { type: 'pie' },
        title: { text: 'Pie Chart (First Row)' },
        series: [{
          name: 'Value',
          colorByPoint: true,
          data: columns.slice(1).map((col) => ({
            name: col,
            y: Number(rows[0][col]) || 0,
          }))
        }]
      };
      break;

    case 'variablePie':
      options = {
        chart: { type: 'variablepie' },
        title: { text: 'Variable Pie Chart (First Row)' },
        tooltip: { pointFormat: '<b>{point.name}</b>: {point.y}' },
        series: [{
          minPointSize: 10,
          innerSize: '40%',
          zMin: 0,
          name: 'values',
          data: columns.slice(1).map((col, idx) => ({
            name: col,
            y: Number(rows[0][col]) || 0,
            z: idx + 1
          }))
        }]
      };
      break;

    case 'radialBar':
      options = {
        chart: {
          polar: true,
          type: 'column'
        },
        title: { text: 'Radial Bar Chart' },
        xAxis: {
          categories: columns.slice(1),
          tickmarkPlacement: 'on',
          lineWidth: 0
        },
        yAxis: { min: 0 },
        series: rows.map((row, idx) => ({
          name: row[columns[0]],
          data: columns.slice(1).map((col) => Number(row[col]) || 0),
          pointPlacement: 'on'
        }))
      };
      break;

    case 'bubble':
      options = {
        chart: { type: 'bubble', plotBorderWidth: 1, zoomType: 'xy' },
        title: { text: 'Bubble Chart' },
        xAxis: { title: { text: columns[1] } },
        yAxis: { title: { text: columns[2] } },
        series: [{
          name: 'Bubble',
          data: rows.map((row) => [
            Number(row[columns[1]]) || 0,
            Number(row[columns[2]]) || 0,
            Number(row[columns[3]]) || 1,
          ])
        }]
      };
      break;

    default:
      return null;
  }

  return <HighchartsReact highcharts={Highcharts} options={options} />;
};

export default HighchartRenderer;
