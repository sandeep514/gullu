import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import COLOR from '../config/color';

type TabData = {
  title: string;
  value: number;
  color: string;
};

const CustomTab = ({
  data,
  selected,
  onPress,
}: {
  data?: TabData[];
  selected?: number;
  onPress?: any;
}) => {
  return (
    <View style={styles.customTabBaseContainer}>
      {data &&
        data.map((item, index) => {
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              key={item.value}
              onPress={() => {
                onPress(item.value);
              }}
              style={[
                styles.customTabItemBaseContainer,
                {
                  backgroundColor:
                    item.value === selected ? item.color : COLOR.whiteColor,
                  borderWidth: item.value === selected ? 0 : 1,
                },
              ]}>
              <Text
                style={[
                  styles.customTabItemText,
                  {
                    color:
                      item.value === selected
                        ? COLOR.whiteColor
                        : COLOR.placeholderColor,
                  },
                ]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

export default CustomTab;

const styles = StyleSheet.create({
  customTabBaseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  customTabItemBaseContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderColor: COLOR.placeholderColor,
    borderRadius: 10,
    borderWidth: 1,
  },
  customTabItemText: {
    color: COLOR.whiteColor,
  },
});
