import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../constants/colors';
import { format } from 'date-fns';

const TimePickerField = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false);

  // If value is a string "HH:mm", convert to Date for the picker.
  // Actually, we should keep state as Date objects in the parent and format when saving.
  // We expect `value` to be a Date object.

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.pickerButton} 
        onPress={() => setOpen(true)}
      >
        <Text style={styles.timeText}>
          {value ? format(value, 'h:mm a') : 'Select Time'}
        </Text>
        <Icon name="clock" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <DatePicker
        modal
        open={open}
        date={value || new Date()}
        mode="time"
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
    marginBottom: 20,
    flex: 1,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  timeText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  }
});

export default TimePickerField;
