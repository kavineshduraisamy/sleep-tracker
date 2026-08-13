import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { colors } from '../constants/colors';
import { format } from 'date-fns';
import { parseDate } from '../utils/dateUtils';

const screenWidth = Dimensions.get('window').width;

const SleepChart = ({ data, title }) => {
  if (!data || data.length === 0) return null;

  // Process data for the chart: expects newest first, so we reverse it to chronological
  const chronologicalData = [...data].reverse();
  
  const labels = chronologicalData.map(d => {
    const date = parseDate(d.date);
    return date ? format(date, 'EE') : ''; // e.g. Mon, Tue
  });
  
  const values = chronologicalData.map(d => Number((d.durationMinutes / 60).toFixed(1))); // convert to hours for chart

  const chartData = {
    labels: labels.length > 7 ? [] : labels, // Hide labels if too many days
    datasets: [
      {
        data: values,
        color: (opacity = 1) => `rgba(94, 96, 206, ${opacity})`,
        strokeWidth: 3
      }
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    color: (opacity = 1) => `rgba(94, 96, 206, ${opacity})`,
    labelColor: (opacity = 1) => colors.textSecondary,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primary
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.border,
      strokeOpacity: 0.5,
    }
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth - 48}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withVerticalLines={false}
        yAxisSuffix="h"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
    marginVertical: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  }
});

export default SleepChart;
