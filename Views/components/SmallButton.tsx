import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

const SmallButton = ({
  backgroundColor,
  title,
  color,
  Icon,
  onPress,
}: {
  backgroundColor: string;
  color: string;
  title: string;
  Icon?: any;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.smallButtonBaseContainer,
        {backgroundColor: backgroundColor},
      ]}>
      {Icon && Icon}
      <Text style={[styles.smallButtonText, {color: color}]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SmallButton;

const styles = StyleSheet.create({
  smallButtonBaseContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
