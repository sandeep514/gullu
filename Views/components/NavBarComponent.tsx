import {StyleSheet, Text, View} from 'react-native';
import CustomButton from './CustomButton';
import AntDesign from 'react-native-vector-icons/AntDesign';
import COLOR from '../config/color';

const NavBarComponent = ({
  backgroundColor,
  title,
  titleColor,
  navigation,
}: {
  backgroundColor?: string;
  title?: string;
  titleColor?: string;
  navigation?: any;
}) => {
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View
      style={[
        styles.navbarBaseContainer,
        {
          backgroundColor,
        },
      ]}>
      <View style={styles.navbarButtonBaseContainer}>
        <CustomButton
          iconName="left"
          iconPadding={8}
          IconComponent={AntDesign}
          iconColor={COLOR.blackColor}
          backgroundColor={`${COLOR.baseColor}55`}
          onClick={handleBackPress}
        />
      </View>
      <View style={styles.navbarContentBaseContainer}>
        <Text
          style={[
            styles.navbarContentTitle,
            {
              color: titleColor,
            },
          ]}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default NavBarComponent;

const styles = StyleSheet.create({
  navbarBaseContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  navbarButtonBaseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navbarContentBaseContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  navbarContentTitle: {
    fontSize: 20,
  },
});
