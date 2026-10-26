import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';
import { parseDate } from '../utils/dateUtils';

const screenWidth = Dimensions.get('window').width;

const SleepChart = ({ data = [], title = 'Sleep Duration (hrs)' }) => {
  const { colors } = useTheme();

  if (!data || data.length === 0) return null;

  // Process data for the chart: expects newest first, so we reverse it to chronological
  const chronologicalData = [...data].reverse();
  
  const labels = chronologicalData.map(d => {
    const date = parseDate(d.date);
    return date ? format(date, 'EEE') : ''; // Mon, Tue...
  });
  
  const values = chronologicalData.map(d => Number((d.durationMinutes / 60).toFixed(1))); // in hours

  // Calculate quick stats
  const totalHours = values.reduce((acc, curr) => acc + curr, 0);
  const avgHours = (totalHours / values.length).toFixed(1);
  const maxHours = Math.max(...values);

  const chartData = {
    labels: labels.length > 7 ? labels.filter((_, i) => i % 2 === 0) : labels,
    datasets: [
      {
        data: values.length > 0 ? values : [0],
        color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
        strokeWidth: 3
      }
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
    labelColor: () => colors.textSecondary,
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 1,
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: colors.primary
    },
    propsForBackgroundLines: {
      strokeDasharray: '4',
      stroke: colors.borderLight,
      strokeWidth: 1,
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.borderLight, shadowColor: colors.cardShadow }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>
            <Icon name="trending-up" size={16} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>

        <View style={[styles.statsSummary, { backgroundColor: colors.surfaceSubtle }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg: <Text style={[styles.statValue, { color: colors.text }]}>{avgHours}h</Text></Text>
          <Text style={[styles.statDivider, { color: colors.textMuted }]}>•</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Peak: <Text style={[styles.statValue, { color: colors.text }]}>{maxHours}h</Text></Text>
        </View>
      </View>

      <LineChart
        data={chartData}
        width={screenWidth - 56}
        height={210}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withVerticalLines={false}
        yAxisSuffix="h"
        fromZero={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 3,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  statsSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  statValue: {
    fontWeight: '700',
    color: colors.text,
  },
  statDivider: {
    marginHorizontal: 4,
    color: colors.textMuted,
    fontSize: 10,
  },
  chart: {
    marginVertical: 4,
    borderRadius: 16,
    paddingRight: 16,
  }
});

export default SleepChart;
