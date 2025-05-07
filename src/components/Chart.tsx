// import React, { useState, useEffect } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, FormControl, InputLabel, Select, MenuItem, Box
// } from '@mui/material';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';

// import HighchartsMore from 'highcharts/highcharts-more';
// import VariablePie from 'highcharts/modules/variable-pie';
// import Exporting from 'highcharts/modules/exporting';
// import Accessibility from 'highcharts/modules/accessibility';
// import Highcharts3D from 'highcharts/highcharts-3d';

// import HighchartRenderer from '../components/HighchartRenderer';

// if (typeof HighchartsMore === 'function') HighchartsMore(Highcharts);
// if (typeof VariablePie === 'function') VariablePie(Highcharts);
// if (typeof Exporting === 'function') Exporting(Highcharts);
// if (typeof Accessibility === 'function') Accessibility(Highcharts);
// if (typeof Highcharts3D === 'function') Highcharts3D(Highcharts);

// const CHART_OPTIONS = [
//     { label: 'Line', value: 'line' },
//     { label: 'Area', value: 'area' },
//     { label: 'Radial Bar', value: 'radialBar' },
//     { label: 'Column', value: 'column' },
//     { label: 'Pie', value: 'pie' },
//     { label: 'Variable Pie', value: 'variablePie' },
//     { label: 'Bubble', value: 'bubble' },
//   ];

//   interface ChartModalProps {
//     open: boolean;
//     onClose: () => void;
//     chartData: Record<string, any>[]; // Accepts raw SQL result array
//   }

//   const Chart: React.FC<ChartModalProps> = ({ open, onClose, chartData = [] }) => {
//     const rows = Array.isArray(chartData) ? chartData : [];
//     const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
//   const [selectedChart, setSelectedChart] = useState('line');
//   const [xAxisKey, setXAxisKey] = useState('');
//   const [yAxisKey, setYAxisKey] = useState('');

//   useEffect(() => {
//     if (columns.length >= 2) {
//       setXAxisKey(columns[0]);
//       setYAxisKey(columns[1]);
//     }
//   }, [columns]);

//   if (!shouldRender) return null;

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>Select Chart Type</DialogTitle>
//       <DialogContent>
//         <FormControl fullWidth sx={{ mt: 2 }}>
//           <InputLabel>Chart Type</InputLabel>
//           <Select
//             value={selectedChart}
//             label="Chart Type"
//             onChange={(e) => setSelectedChart(e.target.value)}
//           >
//             {CHART_OPTIONS.map((type) => (
//               <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
//           <FormControl fullWidth>
//             <InputLabel>X Axis</InputLabel>
//             <Select
//               value={xAxisKey}
//               label="X Axis"
//               onChange={(e) => setXAxisKey(e.target.value)}
//             >
//               {columns.map(col => (
//                 <MenuItem key={col} value={col}>{col}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControl fullWidth>
//             <InputLabel>Y Axis</InputLabel>
//             <Select
//               value={yAxisKey}
//               label="Y Axis"
//               onChange={(e) => setYAxisKey(e.target.value)}
//             >
//               {columns.map(col => (
//                 <MenuItem key={col} value={col}>{col}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Box>

//         <Box sx={{ mt: 3 }}>
//           <HighchartRenderer
//             type={selectedChart}
//             rows={rows}
//             columns={columns}
//             xAxisKey={xAxisKey}
//             yAxisKey={yAxisKey}
//           />
//         </Box>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary" variant="contained">
//           Close
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default Chart;

import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, FormControl, InputLabel, Select, MenuItem, Box, Typography
} from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import HighchartsMore from 'highcharts/highcharts-more';
import VariablePie from 'highcharts/modules/variable-pie';
import Exporting from 'highcharts/modules/exporting';
import Accessibility from 'highcharts/modules/accessibility';
import Highcharts3D from 'highcharts/highcharts-3d';

// Register optional Highcharts modules
if (typeof HighchartsMore === 'function') HighchartsMore(Highcharts);
if (typeof VariablePie === 'function') VariablePie(Highcharts);
if (typeof Exporting === 'function') Exporting(Highcharts);
if (typeof Accessibility === 'function') Accessibility(Highcharts);
if (typeof Highcharts3D === 'function') Highcharts3D(Highcharts);

interface ChartModalProps {
    open: boolean;
    onClose: () => void;
    chartData: Record<string, any>[];
}

const Chart: React.FC<ChartModalProps> = ({ open, onClose, chartData = [] }) => {
    const [chartType, setChartType] = useState('line');
    const [xAxisKey, setXAxisKey] = useState('');
    const [yAxisKey, setYAxisKey] = useState('');

    const validData = Array.isArray(chartData) && chartData.length > 0 ? chartData : [];
    const dataKeys = validData.length > 0 ? Object.keys(validData[0]) : [];
    const limitedData = validData.slice(0, 20);
    const hasSufficientData = limitedData.length > 0 && xAxisKey && yAxisKey;

    useEffect(() => {
        if (dataKeys.length >= 2) {
            setXAxisKey(dataKeys[0]);
            setYAxisKey(dataKeys[1]);
        }
    }, [open, dataKeys]);

    const getChartOptions = (): Highcharts.Options => ({
        chart: { type: chartType as any },
        title: { text: `Showing only top ${limitedData.length} data points` },
        credits: { enabled: false },
        xAxis: { categories: limitedData.map(item => item[xAxisKey]) },
        series: [{
            type: chartType as any,
            name: yAxisKey,
            data: limitedData.map(item => item[yAxisKey])
        }]
    });


    const options = getChartOptions();

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Select Chart Options</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="chart-type-label">Chart Type</InputLabel>
                    <Select
                        labelId="chart-type-label"
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                    >
                        <MenuItem value="line">Line</MenuItem>
                        <MenuItem value="area">Area</MenuItem>
                        <MenuItem value="pie">Pie</MenuItem>
                        <MenuItem value="column">Column</MenuItem>
                        <MenuItem value="variablePie">Variable Pie</MenuItem>
                        <MenuItem value="radialBar">Radial Bar</MenuItem>
                        <MenuItem value="bubble">Bubble</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel id="x-axis-label">X Axis</InputLabel>
                        <Select
                            labelId="x-axis-label"
                            value={xAxisKey}
                            onChange={(e) => setXAxisKey(e.target.value)}
                        >
                            {dataKeys.map(key => (
                                <MenuItem key={key} value={key}>{key}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>


                    <FormControl fullWidth>
                        <InputLabel id="y-axis-label">Y Axis</InputLabel>
                        <Select
                            labelId="y-axis-label"
                            value={yAxisKey}
                            onChange={(e) => setYAxisKey(e.target.value)}
                        >
                            {dataKeys.map(key => (
                                <MenuItem key={key} value={key}>{key}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                </Box>

                {hasSufficientData ? (
                    <Box sx={{ mt: 4 }}>
                        <HighchartsReact highcharts={Highcharts} options={options} />
                    </Box>
                ) : (
                    <Typography color="error" sx={{ mt: 4 }}>
                        No sufficient data to display the chart. Please provide valid data and select valid axes.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary" fullWidth>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Chart;
