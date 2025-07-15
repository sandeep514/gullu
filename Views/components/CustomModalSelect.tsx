import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import COLOR from '../config/color';

const CustomModalSelect = ({
  placeholder,
  value,
  Icon,
  onClick,
}: {
  placeholder: string;
  value: any;
  Icon?: any;
  onClick?: () => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.customModalSelectBaseContainer}
      onPress={onClick}>
      <Text
        style={[
          styles.customModalSelectText,
          {
            color: value ? COLOR.blackColor : COLOR.placeholderColor,
          },
        ]}>
        {value ? value : placeholder}
      </Text>
      <View style={styles.customModalSelectIconContainer}>{Icon && Icon}</View>
    </TouchableOpacity>
  );
};

export default CustomModalSelect;

const styles = StyleSheet.create({
  customModalSelectBaseContainer: {
    borderColor: COLOR.placeholderColor,
    borderWidth: 1,
    padding: 18,
    borderRadius: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customModalSelectText: {},
  customModalSelectIconContainer: {},
});
