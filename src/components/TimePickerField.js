import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { format } from 'date-fns';

const TimePickerField = ({ label, value, onChange, icon = 'clock', iconColor }) => {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const activeIconColor = iconColor || colors.primary;

  const formattedTime = value ? format(value, 'h:mm') : '--:--';
  const period = value ? format(value, 'a') : '';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TouchableOpacity 
        style={[styles.pickerButton, { backgroundColor: colors.surface, borderColor: colors.borderLight, shadowColor: colors.cardShadow }]} 
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <View style={styles.leftRow}>
          <View style={[styles.iconBox, { backgroundColor: `${activeIconColor}15` }]}>
            <Icon name={icon} size={18} color={activeIconColor} />
          </View>
          <View style={styles.timeContainer}>
            <Text style={[styles.timeText, { color: colors.text }]}>{formattedTime}</Text>
            {period ? <Text style={[styles.periodText, { color: colors.textSecondary }]}>{period}</Text> : null}
          </View>
        </View>

        <Icon name="chevron-down" size={18} color={colors.textMuted} />
      </TouchableOpacity>

      <DatePicker
        modal
        open={open}
        date={value || new Date()}
        mode="time"
        title={`Select ${label}`}
        onConfirm={(date) => {
          setOpen(false);
          onChange(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        textColor={colors.text}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    borderRadius: 16,
    padding: 12,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  timeText: {
    fontSize: 17,
    color: colors.text,
    fontWeight: '800',
  },
  periodText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
    marginLeft: 4,
  }
});

export default TimePickerField;
