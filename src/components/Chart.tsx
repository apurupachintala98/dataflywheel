// ChartModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import HighchartsMore from 'highcharts/highcharts-more';
import variablePie from 'highcharts/modules/variable-pie';
import accessibility from 'highcharts/modules/accessibility';
import Highcharts3D from 'highcharts/highcharts-3d';
import exporting from 'highcharts/modules/exporting';
import HighchartRenderer from '../components/HighchartRenderer';

const CHART_OPTIONS = [
  'line',
  'area',
  'radialBar',
  'column',
  'pie',
  'variablePie',
  'bubble',
];

type ChartModalProps = {
    open: boolean;
    onClose: () => void;
    rows: any[];
    columns: string[];
    shouldRender: boolean;
  };
  
  
  const Chart: React.FC<ChartModalProps> = ({ open, onClose, rows, columns, shouldRender }) => {
    const [selectedChart, setSelectedChart] = useState('line');
  
    useEffect(() => {
      if (!shouldRender) return;
      const loadModules = async () => {
        const HighchartsMore = await import('highcharts/highcharts-more');
        const VariablePie = await import('highcharts/modules/variable-pie');
        const Exporting = await import('highcharts/modules/exporting');
        const Accessibility = await import('highcharts/modules/accessibility');
        const Highcharts3D = await import('highcharts/highcharts-3d');
  
        HighchartsMore.default(Highcharts);
        VariablePie.default(Highcharts);
        Exporting.default(Highcharts);
        Accessibility.default(Highcharts);
        Highcharts3D.default(Highcharts);
      };
  
      loadModules();
    }, [shouldRender]);
  
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

        <div style={{ marginTop: '20px' }}>
          <HighchartRenderer type={selectedChart} rows={rows} columns={columns} />
        </div>
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
