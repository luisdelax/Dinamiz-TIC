import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { AppColors } from '../../constants/Colors';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
}

const AppButton: React.FC<ButtonProps> = ({ onPress, title, variant = 'primary', style }) => {
  const buttonStyle = [
    styles.button,
    styles[`${variant}Button`],
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`${variant}Text`],
  ];

  return (
    <Pressable style={({ pressed }) => [buttonStyle, pressed && styles.pressed]} onPress={onPress}>
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: AppColors.primary,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: AppColors.primary,
  },
  dangerButton: {
    backgroundColor: AppColors.error,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: AppColors.primary,
  },
  dangerText: {
    color: '#fff',
  },
  pressed: {
    opacity: 0.8,
  },
});

export default AppButton;
