import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

const StatCard = ({ title, value, subtitle, icon, color, fullWidth, trend }) => {
  const { colors } = useTheme();
  const cardColor = color || colors.primary;

  return (
    <View style={[styles.card, fullWidth && styles.fullWidth, { backgroundColor: colors.surface, borderColor: colors.borderLight, shadowColor: colors.cardShadow }]}>
      <View style={styles.headerRow}>
        <View style={[styles.iconWrapper, { backgroundColor: `${cardColor}18` }]}>
          <Icon name={icon} size={18} color={cardColor} />
        </View>
        {trend && (
          <View style={[styles.trendBadge, { backgroundColor: trend.positive ? colors.successSoft : colors.errorSoft }]}>
            <Icon 
              name={trend.positive ? 'arrow-up-right' : 'arrow-down-right'} 
              size={12} 
              color={trend.positive ? colors.success : colors.error} 
            />
            <Text style={[styles.trendText, { color: trend.positive ? colors.success : colors.error }]}>
              {trend.label}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        {subtitle && <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 20,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 3,
    margin: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  fullWidth: {
    flex: 0,
    width: '100%',
    marginHorizontal: 0,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 2,
  },
  content: {
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  }
});

export default StatCard;
