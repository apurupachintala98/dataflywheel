// import React, { useEffect, useState } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, FormControl, InputLabel, Select, MenuItem, Box, Typography
// } from '@mui/material';
// import HighchartRenderer from '../components/HighchartRenderer';

// interface ChartModalProps {
//   open: boolean;
//   onClose: () => void;
//   chartData: Record<string, any>[];
// }

// const Chart: React.FC<ChartModalProps> = ({ open, onClose, chartData }) => {
//   const [chartType, setChartType] = useState('line');
//   const [xAxisKey, setXAxisKey] = useState('');
//   const [yAxisKey, setYAxisKey] = useState('');

//   const dataKeys = Array.isArray(chartData) && chartData.length > 0 ? Object.keys(chartData[0]) : [];
//   const limitedData = chartData.slice(0, 20);

//   useEffect(() => {
//     if (dataKeys.length >= 2 && !xAxisKey && !yAxisKey) {
//       setXAxisKey(dataKeys[0]);
//       setYAxisKey(dataKeys[1]);
//     }
//   }, [dataKeys, xAxisKey, yAxisKey]);

//   const hasSufficientData = limitedData.length > 0 && xAxisKey && yAxisKey;

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Select Chart Options</DialogTitle>
//       <DialogContent>
//         <FormControl fullWidth sx={{ mt: 2 }}>
//           <InputLabel>Chart Type</InputLabel>
//           <Select value={chartType} onChange={(e) => setChartType(e.target.value)}>
//             <MenuItem value="line">Line</MenuItem>
//             <MenuItem value="area">Area</MenuItem>
//             <MenuItem value="column">Column</MenuItem>
//             <MenuItem value="pie">Pie</MenuItem>
//             <MenuItem value="variablePie">Variable Pie</MenuItem>
//             <MenuItem value="radialBar">Radial Bar</MenuItem>
//             <MenuItem value="bubble">Bubble</MenuItem>
//           </Select>
//         </FormControl>

//         <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
//           <FormControl fullWidth>
//             <InputLabel>X Axis</InputLabel>
//             <Select value={xAxisKey} onChange={(e) => setXAxisKey(e.target.value)}>
//               {dataKeys.map(key => <MenuItem key={key} value={key}>{key}</MenuItem>)}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth>
//             <InputLabel>Y Axis</InputLabel>
//             <Select value={yAxisKey} onChange={(e) => setYAxisKey(e.target.value)}>
//               {dataKeys.map(key => <MenuItem key={key} value={key}>{key}</MenuItem>)}
//             </Select>
//           </FormControl>
//         </Box>

//         {hasSufficientData ? (
//           <Box sx={{ mt: 4 }}>
//             <HighchartRenderer
//               type={chartType}
//               rows={limitedData}
//               columns={dataKeys}
//               xAxisKey={xAxisKey}
//               yAxisKey={yAxisKey}
//             />
//           </Box>
//         ) : (
//           <Typography color="error" sx={{ mt: 4 }}>
//             No sufficient data to display the chart.
//           </Typography>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} variant="contained" fullWidth>Close</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default Chart;

import React, { useEffect, useState, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControl, InputLabel, Select, MenuItem, Box, Typography
} from '@mui/material';
import HighchartRenderer from '../components/HighchartRenderer';

interface ChartModalProps {
  open: boolean;
  onClose: () => void;
  chartData: Record<string, any>[];
}

const Chart: React.FC<ChartModalProps> = ({ open, onClose, chartData }) => {
  const [chartType, setChartType] = useState('line');
  const [xAxisKey, setXAxisKey] = useState('');
  const [yAxisKey, setYAxisKey] = useState('');

  // Identify keys that have at least one non-empty value
  const validKeys = useMemo(() => {
    if (!Array.isArray(chartData)) return [];
    const first20 = chartData.slice(0, 20);
    if (first20.length === 0) return [];

    return Object.keys(first20[0]).filter((key) =>
      first20.some((row) => row[key] !== null && row[key] !== undefined && row[key] !== '')
    );
  }, [chartData]);

  // Set initial axis keys
  useEffect(() => {
    if (validKeys.length >= 2 && !xAxisKey && !yAxisKey) {
      setXAxisKey(validKeys[0]);
      setYAxisKey(validKeys[1]);
    }
  }, [validKeys, xAxisKey, yAxisKey]);

  // Filter rows that have valid data for both axes
  const filteredData = useMemo(() => {
    return chartData
      .filter((row) =>
        row[xAxisKey] !== null &&
        row[xAxisKey] !== undefined &&
        row[xAxisKey] !== '' &&
        row[yAxisKey] !== null &&
        row[yAxisKey] !== undefined &&
        row[yAxisKey] !== ''
      )
      .slice(0, 50); // Limit to 50 for performance
  }, [chartData, xAxisKey, yAxisKey]);

  const hasSufficientData = filteredData.length > 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Chart Options</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Chart Type</InputLabel>
          <Select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="area">Area</MenuItem>
            <MenuItem value="column">Column</MenuItem>
            <MenuItem value="pie">Pie</MenuItem>
            <MenuItem value="variablePie">Variable Pie</MenuItem>
            <MenuItem value="radialBar">Radial Bar</MenuItem>
            <MenuItem value="bubble">Bubble</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>X Axis</InputLabel>
            <Select value={xAxisKey} onChange={(e) => setXAxisKey(e.target.value)}>
              {validKeys.map((key) => (
                <MenuItem key={key} value={key}>{key}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Y Axis</InputLabel>
            <Select value={yAxisKey} onChange={(e) => setYAxisKey(e.target.value)}>
              {validKeys.map((key) => (
                <MenuItem key={key} value={key}>{key}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {hasSufficientData ? (
          <Box sx={{ mt: 4 }}>
            <HighchartRenderer
              type={chartType}
              rows={filteredData}
              columns={validKeys}
              xAxisKey={xAxisKey}
              yAxisKey={yAxisKey}
            />
          </Box>
        ) : (
          <Typography color="error" sx={{ mt: 4 }}>
            No sufficient data to display the chart. Try selecting different axes.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" fullWidth>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Chart;
