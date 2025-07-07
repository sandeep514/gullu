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
  iconName,
  IconComponent,
  iconColor,
  iconSize,
  iconPadding,
  title,
  backgroundColor,
  color,
  isLoading,
  onClick,
}: {
  iconName?: string;
  IconComponent?: any;
  iconColor?: string;
  iconSize?: number;
  iconPadding?: number;
  title?: string;
  backgroundColor?: string;
  color?: string;
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
          padding: iconName ? iconPadding || 10 : 18,
          borderRadius: iconName ? 12 : 50,
        },
      ]}
      onPress={onClick}>
      {isLoading ? (
        <ActivityIndicator color={color} size={'small'} />
      ) : (
        <>
          {IconComponent ? (
            <IconComponent
              name={iconName}
              color={iconColor}
              size={iconSize || 15}
            />
          ) : (
            <Text style={[styles.customButtonText, {color}]}>{title}</Text>
          )}
        </>
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
