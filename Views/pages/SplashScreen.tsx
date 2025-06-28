import {View, Text, StyleSheet, Image, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import ASSETS from '../assets';
import COLOR from '../config/color';
import {BlurView} from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import DIMENSIONS from '../config/dimensions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import ROUTES from '../config/routes';

const SplashScreen = () => {
  const gulluLogo = useRef(new Animated.Value(0)).current;
  const navigate = useNavigation();

  useEffect(() => {
    startLogoAnimation();
    setTimeout(() => {
      AsyncStorage.getItem('id')
        .then((res: any) => {
          console.log();
          if (res != null) {
            console.log('-----> TO HOME ');
            navigate.reset({
              index: 0,
              routes: [{name: ROUTES.homeScreen as never}],
            });
          } else {
            console.log('-----> TO LOGIN ');
            navigate.reset({
              index: 0,
              routes: [{name: ROUTES.loginScreen as never}],
            });
          }
        })
        .catch(() => {
          console.log('-----> TO LOGIN ');
          navigate.reset({
            index: 0,
            routes: [{name: ROUTES.loginScreen as never}],
          });
        });
    }, 3000);
  }, []);

  const startLogoAnimation = () => {
    Animated.spring(gulluLogo, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 100,
    }).start();
  };

  return (
    <View style={styles.splashBaseContainer}>
      <View style={styles.splashImageBaseContainer}>
        <Animated.Image
          source={ASSETS.splashBackImage}
          style={[
            styles.splashBackImage,
            {
              opacity: gulluLogo.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
        />
      </View>
      <BlurView
        style={styles.splashContentBlurContainer}
        blurType="light"
        blurAmount={2}
        reducedTransparencyFallbackColor="white"
      />
      <View style={styles.splashContentBaseContainer}>
        <LinearGradient
          colors={[
            COLOR.transparentColor,
            `${COLOR.baseColor}77`,
            COLOR.transparentColor,
          ]}
          style={styles.splashContentContainer}>
          <Animated.Image
            source={ASSETS.gulluLogo}
            style={[
              styles.splashLogoImage,
              {
                transform: [
                  {
                    scale: gulluLogo.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                ],
              },
            ]}
          />
        </LinearGradient>
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  splashBaseContainer: {
    flex: 1,
    position: 'relative',
  },
  splashImageBaseContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLOR.baseColor,
  },
  splashBackImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  splashContentBlurContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  splashContentBaseContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: `${COLOR.baseColor}66`,
  },
  splashContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogoImage: {
    width: DIMENSIONS.height / 3,
    height: DIMENSIONS.height / 3,
    resizeMode: 'contain',
  },
});
