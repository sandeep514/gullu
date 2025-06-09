import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import ASSETS from '../assets';
import COLOR from '../config/color';
import {BlurView} from '@react-native-community/blur';

const SplashScreen = () => {
  return (
    <View style={styles.splashBaseContainer}>
      <View style={styles.splashImageBaseContainer}>
        <Image source={ASSETS.splashBackImage} style={styles.splashBackImage} />
      </View>
      <BlurView
        style={styles.splashContentBlurContainer}
        blurType="light"
        blurAmount={2}
        reducedTransparencyFallbackColor="white"
      />
      <View style={styles.splashContentBaseContainer}></View>
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
});
