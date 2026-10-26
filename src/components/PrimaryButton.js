import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

const PrimaryButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle,
  disabled, 
  icon, 
  iconPosition = 'left',
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'medium'      // 'small' | 'medium' | 'large'
}) => {
  const { colors } = useTheme();
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';
  const isGhost = variant === 'ghost';
  const isDanger = variant === 'danger';

  const getButtonStyles = () => {
    const list = [styles.button];

    if (size === 'small') list.push(styles.btnSmall);
    if (size === 'large') list.push(styles.btnLarge);

    if (isSecondary) list.push([styles.btnSecondary, { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderLight }]);
    else if (isOutline) list.push([styles.btnOutline, { borderColor: colors.primary }]);
    else if (isGhost) list.push(styles.btnGhost);
    else if (isDanger) list.push([styles.btnDanger, { backgroundColor: colors.error, shadowColor: colors.error }]);
    else list.push([styles.btnPrimary, { backgroundColor: colors.primary, shadowColor: colors.primary }]);

    if (disabled) list.push([styles.disabled, { backgroundColor: colors.surfaceSubtle, borderColor: colors.borderLight }]);
    if (style) list.push(style);

    return list;
  };

  const getTextColor = () => {
    if (disabled) return colors.textMuted;
    if (isOutline || isGhost) return colors.primary;
    if (isSecondary) return colors.text;
    if (isDanger) return '#FFFFFF';
    return '#FFFFFF';
  };

  const iconColor = getTextColor();
  const iconSize = size === 'small' ? 16 : size === 'large' ? 22 : 18;

  return (
    <TouchableOpacity 
      style={getButtonStyles()} 
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
    >
      <View style={styles.contentRow}>
        {icon && iconPosition === 'left' && (
          <Icon name={icon} size={iconSize} color={iconColor} style={styles.iconLeft} />
        )}
        <Text style={[styles.text, { color: getTextColor() }, size === 'small' && styles.textSmall, textStyle]}>
          {title}
        </Text>
        {icon && iconPosition === 'right' && (
          <Icon name={icon} size={iconSize} color={iconColor} style={styles.iconRight} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSmall: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  btnLarge: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 18,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  btnSecondary: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  btnGhost: {
    backgroundColor: 'transparent',
  },
  btnDanger: {
    backgroundColor: colors.error,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  disabled: {
    backgroundColor: colors.borderLight,
    borderColor: colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textSmall: {
    fontSize: 14,
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  }
});

export default PrimaryButton;
