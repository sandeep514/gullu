import {Image, StyleSheet, Text, View} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import ASSETS from '../assets';
import DIMENSIONS from '../config/dimensions';
import COLOR from '../config/color';
import CustomButton from '../components/CustomButton';
import NetInfo from '@react-native-community/netinfo';
import {useNavigation} from '@react-navigation/native';
import ROUTES from '../config/routes';
import {useState} from 'react';
import Toast from 'react-native-toast-message';

const NoInternet = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const handleTryAgain = () => {
    setIsLoading(true);
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        navigation.reset({
          index: 0,
          routes: [{name: ROUTES.splashScreen as never}],
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'No Internet',
          text2: 'Please check your internet connection',
        });
      }
    });
    setIsLoading(false);
  };

  return (
    <View style={styles.noInternetBaseContainer}>
      <View style={styles.noInternetHeaderBaseContainer}>
        <HeaderComponent badNetwork={true} />
      </View>
      <View style={styles.noInternetContentBaseContainer}>
        <View style={styles.noInternetContentImageBaseContainer}>
          <Image
            source={ASSETS.noInternetImage}
            style={{width: DIMENSIONS.width / 4, height: DIMENSIONS.width / 4}}
          />
          <Text style={styles.noInternetContentHeaderText}>
            Internet Disconnected
          </Text>
          <Text style={styles.noInternetContentText}>
            No internet connection. Please try again
          </Text>
        </View>
        <View style={styles.noInternetContentButtonBaseContainer}>
          <CustomButton
            backgroundColor={COLOR.baseColor}
            color={COLOR.whiteColor}
            title="Try Again"
            onClick={handleTryAgain}
            isLoading={isLoading}
          />
        </View>
      </View>
    </View>
  );
};

export default NoInternet;

const styles = StyleSheet.create({
  noInternetBaseContainer: {
    flex: 1,
  },
  noInternetHeaderBaseContainer: {
    flex: 0.1,
  },
  noInternetContentBaseContainer: {
    flex: 1,
  },
  noInternetContentImageBaseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  noInternetContentHeaderText: {
    color: COLOR.blackColor,
    fontWeight: 'bold',
    fontSize: 18,
  },
  noInternetContentText: {
    color: COLOR.placeholderColor,
    fontSize: 14,
  },
  noInternetContentButtonBaseContainer: {
    padding: 20,
  },
});
