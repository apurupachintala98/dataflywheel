import Highcharts from 'highcharts';

export const setupHighchartsModules = async () => {
  const { default: HighchartsMore } = await import('highcharts/highcharts-more');
  const { default: VariablePie } = await import('highcharts/modules/variable-pie');
  const { default: Exporting } = await import('highcharts/modules/exporting');
  const { default: Accessibility } = await import('highcharts/modules/accessibility');
  const { default: Highcharts3D } = await import('highcharts/highcharts-3d');

  if (typeof HighchartsMore === 'function') HighchartsMore(Highcharts);
  if (typeof VariablePie === 'function') VariablePie(Highcharts);
  if (typeof Exporting === 'function') Exporting(Highcharts);
  if (typeof Accessibility === 'function') Accessibility(Highcharts);
  if (typeof Highcharts3D === 'function') Highcharts3D(Highcharts);
};

export default Highcharts;
