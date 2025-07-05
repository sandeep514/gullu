import React, {memo, useEffect, useState} from 'react';
import {Image, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import InputComponents from '../components/InputComponents';
import {login} from '../services/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import COLOR from '../config/color';
import ASSETS from '../assets';
import DIMENSIONS from '../config/dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';
import LOCALSTORAGE from '../config/localStorage';
import {useNavigation} from '@react-navigation/native';
import ROUTES from '../config/routes';

function Login({navigation}: any): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigation();
  const Icon = MaterialIcons as unknown as any;

  function ValidateEmail(input: any) {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (input.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  const resetField = () => {
    setEmail('');
    setPassword('');
  };

  const tryLogin = async () => {
    setIsLoading(true);
    if (email == '' || email == undefined) {
      Toast.show({
        type: 'error',
        text1: 'Email is required',
        text2: 'Please enter email',
      });
      setIsLoading(false);
      return;
    } else if (password == '' || password == undefined) {
      Toast.show({
        type: 'error',
        text1: 'Password is required',
        text2: 'Please enter password',
      });
      setIsLoading(false);
      return;
    } else if (!ValidateEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Email is invalid',
        text2: 'Please enter valid email',
      });
      setIsLoading(false);
      return;
    } else {
      try {
        const response = await login(email, password);
        // console.log(JSON.stringify(response));
        if (response.data.status) {
          AsyncStorage.setItem(
            LOCALSTORAGE.APITOKEN,
            response.data.data.api_token,
          );
          AsyncStorage.setItem(LOCALSTORAGE.EMAIL, response.data.data.email);
          AsyncStorage.setItem(
            LOCALSTORAGE.ID,
            response.data.data.id.toString(),
          );
          AsyncStorage.setItem(LOCALSTORAGE.NAME, response.data.data.name);
          AsyncStorage.setItem(LOCALSTORAGE.PHONE, response.data.data.phone);
          AsyncStorage.setItem(
            LOCALSTORAGE.ROLE,
            response.data.data.role.toString(),
          );
          navigate.reset({
            index: 0,
            routes: [{name: ROUTES.landingPage as never}],
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: 'Something went wrong',
          });
          setIsLoading(false);
          resetField();
          return;
        }
      } catch (error: any) {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Something went wrong',
        });
        setIsLoading(false);
        resetField();
      }
    }
  };

  return (
    <SafeAreaView style={styles.loginBaseContainer}>
      <View style={styles.loginBaseLogoBaseContainer}>
        <Image source={ASSETS.gulluLogo} style={styles.loginLogoImage} />
        <View style={styles.loginLogoUpperBaseContainer}>
          <LinearGradient
            colors={[`${COLOR.whiteColor}22`, COLOR.transparentColor]}
            style={styles.loginLogoUpperContainer}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          />
          <LinearGradient
            colors={[COLOR.transparentColor, `${COLOR.whiteColor}22`]}
            style={styles.loginLogoUpperContainer}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          />
        </View>
      </View>
      <View style={styles.loginBaseContentBaseContainer}>
        <View style={styles.loginBaseContentInputBaseContainer}>
          <InputComponents
            title="Email Address"
            placeholder="Email or Mobile"
            value={email}
            onChangeText={(value: any) => {
              setEmail(value);
            }}
            Icon={
              <Icon
                name="mail-outline"
                color={COLOR.blackColor}
                size={DIMENSIONS.width / 20}
              />
            }
            disable={isLoading}
          />
          <InputComponents
            title="Password"
            placeholder="Password"
            value={password}
            onChangeText={(value: any) => {
              setPassword(value);
            }}
            Icon={
              <Icon
                name="lock-outline"
                color={COLOR.blackColor}
                size={DIMENSIONS.width / 20}
              />
            }
            isSecureEntry={true}
            disable={isLoading}
          />
        </View>
        <View style={styles.loginBaseContentButtonBaseContainer}>
          <CustomButton
            title={'Login'}
            backgroundColor={COLOR.baseColor}
            color={COLOR.whiteColor}
            isLoading={isLoading}
            onClick={tryLogin}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loginBaseContainer: {
    flex: 1,
  },
  loginBaseLogoBaseContainer: {
    position: 'relative',
    flex: 1,
    backgroundColor: `${COLOR.baseColor}DD`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginLogoUpperBaseContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  loginLogoUpperContainer: {
    flex: 1,
  },
  loginLogoImage: {
    width: DIMENSIONS.width / 2.5,
    height: DIMENSIONS.width / 2.5,
    resizeMode: 'contain',
  },
  loginBaseContentBaseContainer: {
    flex: 1.5,
    padding: 40,
    gap: 40,
  },
  loginBaseContentInputBaseContainer: {
    gap: 20,
  },
  loginBaseContentButtonBaseContainer: {},
});

export default memo(Login);
