import React, {memo, useEffect, useState} from 'react';

import {StyleSheet, TextInput, View, Text} from 'react-native';
import {
  inputStyle,
  inputStyleBlack,
  secondaryBackgroundColor,
} from '../assets/styles';
import COLOR from '../config/color';

function InputComponents({
  placeholder,
  value = null,
  onChangeText,
  title,
  type,
  Icon,
  isSecureEntry = false,
  disable = false,
  backgroundColor,
  borderInclude = true,
}: any): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputBaseContainer}>
      {title && <Text style={styles.inputTitleText}>{title}</Text>}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: isFocused ? COLOR.baseColor : COLOR.placeholderColor,
            backgroundColor,
            borderWidth: borderInclude ? 1 : 0,
            elevation: borderInclude ? 0 : 10,
          },
        ]}>
        {Icon && Icon}
        <TextInput
          style={[styles.inputField]}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={type}
          value={value}
          placeholderTextColor={secondaryBackgroundColor}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          selectionColor={COLOR.baseColor}
          secureTextEntry={isSecureEntry}
          editable={!disable}
        />
      </View>
    </View>
  );
}

export default memo(InputComponents);

const styles = StyleSheet.create({
  inputBaseContainer: {
    gap: 8,
  },
  inputTitleText: {
    color: COLOR.placeholderColor,
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: COLOR.placeholderColor,
  },
  inputField: {
    flex: 1,
    color: COLOR.blackColor,
  },
});
