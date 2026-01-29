import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AppColors } from '../../constants/Colors';

interface SegmentedControlProps {
  options: string[];
  selectedOption: string;
  onSelectOption: (option: string) => void;
  renderOption?: (option: string) => string;
}

const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, selectedOption, onSelectOption, renderOption }) => {
  return (
    <View style={styles.segmentedControl}>
      {options.map((option) => (
        <Pressable
          key={option}
          style={[styles.segment, selectedOption === option && styles.segmentActive]}
          onPress={() => onSelectOption(option)}
        >
          <Text style={[styles.segmentText, selectedOption === option && styles.segmentTextActive]}>
            {renderOption ? renderOption(option) : option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: AppColors.segmentedControlBackground,
    borderRadius: 12,
    margin: 24,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: AppColors.segmentedControlActive,
    borderRadius: 10,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    color: AppColors.segmentedControlText,
    fontSize: 14,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: AppColors.segmentedControlTextActive,
    fontWeight: 'bold',
  },
});

export default SegmentedControl;
