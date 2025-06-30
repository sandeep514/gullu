import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import COLOR from '../config/color';

const CustomButton = ({
  title,
  backgroundColor,
  color,
  isLoading,
  onClick,
}: {
  title: string;
  backgroundColor?: string;
  color: string;
  isLoading?: boolean;
  onClick?: () => void;
}) => {
  return (
    <TouchableOpacity
      disabled={isLoading}
      activeOpacity={0.8}
      style={[
        styles.customButtonBaseContainer,
        {
          backgroundColor,
        },
      ]}
      onPress={onClick}>
      {isLoading ? (
        <ActivityIndicator color={color} size={'small'} />
      ) : (
        <Text style={[styles.customButtonText, {color}]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  customButtonBaseContainer: {
    backgroundColor: COLOR.placeholderColor,
    padding: 18,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
