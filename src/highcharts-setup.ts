import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import VariablePie from 'highcharts/modules/variable-pie';
import Exporting from 'highcharts/modules/exporting';
import Accessibility from 'highcharts/modules/accessibility';
import Highcharts3D from 'highcharts/highcharts-3d';

HighchartsMore(Highcharts);
VariablePie(Highcharts);
Exporting(Highcharts);
Accessibility(Highcharts);
Highcharts3D(Highcharts);

export default Highcharts;