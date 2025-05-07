import Highcharts from 'highcharts';

export const setupHighchartsModules = async () => {
  const HighchartsMore = (await import('highcharts/highcharts-more')).default;
  const VariablePie = (await import('highcharts/modules/variable-pie')).default;
  const Exporting = (await import('highcharts/modules/exporting')).default;
  const Accessibility = (await import('highcharts/modules/accessibility')).default;
  const Highcharts3D = (await import('highcharts/highcharts-3d')).default;

  HighchartsMore(Highcharts);
  VariablePie(Highcharts);
  Exporting(Highcharts);
  Accessibility(Highcharts);
  Highcharts3D(Highcharts);
};

export default Highcharts;
