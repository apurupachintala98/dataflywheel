// import React, { useState, useEffect } from 'react';
// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, FormControl, InputLabel, Select, MenuItem, Box
// } from '@mui/material';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';

// require('highcharts/highcharts-more')(Highcharts);
// require('highcharts/modules/variable-pie')(Highcharts);
// require('highcharts/modules/exporting')(Highcharts);
// require('highcharts/modules/accessibility')(Highcharts);
// require('highcharts/highcharts-3d')(Highcharts);
// // import HighchartsMore from 'highcharts/highcharts-more';
// // import VariablePie from 'highcharts/modules/variable-pie';
// // import Accessibility from 'highcharts/modules/accessibility';
// // import Exporting from 'highcharts/modules/exporting';
// // import Highcharts3D from 'highcharts/highcharts-3d';
// import HighchartRenderer from '../components/HighchartRenderer';

// // HighchartsMore(Highcharts);
// // VariablePie(Highcharts);
// // Accessibility(Highcharts);
// // Exporting(Highcharts);
// // Highcharts3D(Highcharts);

// const CHART_OPTIONS = [
//   'line',
//   'area',
//   'radialBar',
//   'column',
//   'pie',
//   'variablePie',
//   'bubble',
// ];

// interface ChartModalProps {
//   open: boolean;
//   onClose: () => void;
//   rows: any[];
//   columns: string[];
//   shouldRender: boolean;
// }

// const Chart: React.FC<ChartModalProps> = ({ open, onClose, rows, columns, shouldRender }) => {
//   const [selectedChart, setSelectedChart] = useState('line');
//   const [xAxisKey, setXAxisKey] = useState('');
//   const [yAxisKey, setYAxisKey] = useState('');

// //   useEffect(() => {
// //     if (!shouldRender) return;
// //     HighchartsMore(Highcharts);
// //     variablePie(Highcharts);
// //     exporting(Highcharts);
// //     accessibility(Highcharts);
// //     Highcharts3D(Highcharts);
// //   }, [shouldRender]);

//   useEffect(() => {
//     if (columns.length >= 2) {
//       setXAxisKey(columns[0]);
//       setYAxisKey(columns[1]);
//     }
//   }, [columns]);

// //   if (!shouldRender) return null;

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
//               <MenuItem key={type} value={type}>{type}</MenuItem>
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

//         <div style={{ marginTop: '20px' }}>
//           <HighchartRenderer
//             type={selectedChart}
//             rows={rows}
//             columns={columns}
//             xAxisKey={xAxisKey}
//             yAxisKey={yAxisKey}
//           />
//         </div>
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
  Button, FormControl, InputLabel, Select, MenuItem, Box
} from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import HighchartsMore from 'highcharts/highcharts-more';
import VariablePie from 'highcharts/modules/variable-pie';
import Exporting from 'highcharts/modules/exporting';
import Accessibility from 'highcharts/modules/accessibility';
import Highcharts3D from 'highcharts/highcharts-3d';

import HighchartRenderer from '../components/HighchartRenderer';

if (typeof HighchartsMore === 'function') HighchartsMore(Highcharts);
if (typeof VariablePie === 'function') VariablePie(Highcharts);
if (typeof Exporting === 'function') Exporting(Highcharts);
if (typeof Accessibility === 'function') Accessibility(Highcharts);
if (typeof Highcharts3D === 'function') Highcharts3D(Highcharts);

const CHART_OPTIONS = [
  'Line',
  'Area',
  'RadialBar',
  'Column',
  'Pie',
  'VariablePie',
  'Bubble',
];

interface ChartModalProps {
  open: boolean;
  onClose: () => void;
  rows: any[];
  columns: string[];
  shouldRender: boolean;
}

const Chart: React.FC<ChartModalProps> = ({ open, onClose, rows, columns, shouldRender }) => {
  const [selectedChart, setSelectedChart] = useState('line');
  const [xAxisKey, setXAxisKey] = useState('');
  const [yAxisKey, setYAxisKey] = useState('');

  useEffect(() => {
    if (columns.length >= 2) {
      setXAxisKey(columns[0]);
      setYAxisKey(columns[1]);
    }
  }, [columns]);

  if (!shouldRender) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Chart Type</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={selectedChart}
            label="Chart Type"
            onChange={(e) => setSelectedChart(e.target.value)}
          >
            {CHART_OPTIONS.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>X Axis</InputLabel>
            <Select
              value={xAxisKey}
              label="X Axis"
              onChange={(e) => setXAxisKey(e.target.value)}
            >
              {columns.map(col => (
                <MenuItem key={col} value={col}>{col}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Y Axis</InputLabel>
            <Select
              value={yAxisKey}
              label="Y Axis"
              onChange={(e) => setYAxisKey(e.target.value)}
            >
              {columns.map(col => (
                <MenuItem key={col} value={col}>{col}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mt: 3 }}>
          <HighchartRenderer
            type={selectedChart}
            rows={rows}
            columns={columns}
            xAxisKey={xAxisKey}
            yAxisKey={yAxisKey}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Chart;
