import React, {memo, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

import InputComponents from '../components/InputComponents';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';

import {
  h3,
  height100,
  height6,
  height85,
  height9,
  inputStyle,
  justifyContentCenter,
  padding15,
  primaryBackgroundColor,
  secondaryBackgroundColor,
  textAlignCenter,
  gulluColor,
  primaryGulluLightBackgroundColor,
  height8,
  height83,
  inputStyleBlack,
} from '../assets/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createVendor, post, showToast} from '../services/services';
import NavBarComponent from '../components/NavBarComponent';
import COLOR from '../config/color';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';
import LOCALSTORAGE from '../config/localStorage';
import ROUTES from '../config/routes';

function VendorCreate({navigation}: any): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [code, setCode] = useState();
  const [password, setPassword] = useState();
  const [phone, setPhone] = useState<String>();
  const [role, setRole] = useState(2);

  const submitVendor = () => {
    setIsLoading(true);
    if (
      name == undefined ||
      name == '' ||
      email == undefined ||
      email == '' ||
      code == undefined ||
      code == '' ||
      password == undefined ||
      password == '' ||
      phone == undefined ||
      phone == ''
    ) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Required field is missing.',
      });
      setIsLoading(false);
    } else if (phone && phone.length != 10) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Mobile number should be 10 digit.',
      });
      setIsLoading(false);
    } else {
      try {
        AsyncStorage.getItem(LOCALSTORAGE.ID)
          .then(async (id: any) => {
            let postedData = {
              name: name,
              email: email,
              code: code,
              password: password,
              phone: phone,
              role: role,
              api_token: id,
            };
            await createVendor(postedData)
              .then((res: any) => {
                if (res.data.status) {
                  setIsLoading(false);
                  Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: res.data.message,
                  });
                  navigation.reset({
                    index: 0,
                    routes: [{name: ROUTES.vendorlistScreen as never}],
                  });
                } else {
                  setIsLoading(false);
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: res.data.message,
                  });
                }
              })
              .catch(err => {
                setIsLoading(false);
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: 'Something went wrong',
                });
              });
          })
          .catch(err => {
            setIsLoading(false);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Something went wrong',
            });
          });
      } catch (error) {
        setIsLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong',
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.createVendorBaseContainer}>
      <View style={styles.createVendorHeaderBaseContainer}>
        <HeaderComponent />
      </View>
      <View style={styles.createVendorNavbarBaseContainer}>
        <NavBarComponent
          title="Create Vendor"
          titleColor={COLOR.baseColor}
          navigation={navigation}
        />
      </View>
      <View style={styles.createVendorContentBaseContainer}>
        <ScrollView contentContainerStyle={styles.createVendorContentContainer}>
          <InputComponents
            value={name}
            placeholder="Name"
            onChangeText={(value: any) => {
              setName(value);
            }}
            backgroundColor={COLOR.whiteColor}
            disable={isLoading}
          />
          <InputComponents
            value={email}
            placeholder="Email"
            onChangeText={(value: any) => {
              setEmail(value);
            }}
            backgroundColor={COLOR.whiteColor}
            disable={isLoading}
          />
          <InputComponents
            value={code}
            placeholder="Code"
            onChangeText={(value: any) => {
              setCode(value);
            }}
            backgroundColor={COLOR.whiteColor}
            disable={isLoading}
          />
          <InputComponents
            value={password}
            placeholder="Password"
            onChangeText={(value: any) => {
              setPassword(value);
            }}
            backgroundColor={COLOR.whiteColor}
            disable={isLoading}
          />
          <InputComponents
            value={phone}
            placeholder="Phone"
            onChangeText={(value: any) => {
              setPhone(value);
            }}
            backgroundColor={COLOR.whiteColor}
            disable={isLoading}
          />
          <CustomButton
            title="Create New Vendor"
            backgroundColor={COLOR.baseColor}
            color={COLOR.whiteColor}
            onClick={submitVendor}
            isLoading={isLoading}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  createVendorBaseContainer: {
    flex: 1,
  },
  createVendorHeaderBaseContainer: {
    flex: 0.09,
  },
  createVendorNavbarBaseContainer: {
    flex: 0.1,
  },
  createVendorContentBaseContainer: {
    flex: 0.82,
  },
  createVendorContentContainer: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
});

export default memo(VendorCreate);
