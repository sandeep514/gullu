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

import AsyncStorage from '@react-native-async-storage/async-storage';
import {getVendorById, updateVendor} from '../services/services';
import NavBarComponent from '../components/NavBarComponent';
import COLOR from '../config/color';
import LOCALSTORAGE from '../config/localStorage';
import Toast from 'react-native-toast-message';
import {Input} from '@rneui/base';
import CustomButton from '../components/CustomButton';

function VendorEdit({navigation, route}: any): JSX.Element {
  const [isDataPostLoading, setIsDataPostLoading] = useState(false);
  const [isDataGetLoading, setIsDataGetLoading] = useState(true);
  const [data, setData] = useState<any>({});

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [code, setCode] = useState();
  const [password, setPassword] = useState();
  const [phone, setPhone] = useState<String>();
  const [role, setRole] = useState(2);

  useEffect(() => {
    var vendorId = route.params.vendorId;
    getVendorDetails(vendorId);
  }, []);

  const getVendorDetails = (vendorId: any) => {
    setIsDataGetLoading(true);
    AsyncStorage.getItem(LOCALSTORAGE.ID)
      .then(async (id: any) => {
        await getVendorById('vendor', vendorId, id)
          .then((res: any) => {
            if (res.data.status) {
              setData(res.data.data);
              setName(res.data.data.name);
              setEmail(res.data.data.email);
              setCode(res.data.data.code);
              setPassword(res.data.data.originalPassword);
              setPhone(res.data.data.phone);
              setIsDataGetLoading(false);
            } else {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong',
              });
              setIsDataGetLoading(false);
            }
          })
          .catch((err: any) => {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Something went wrong',
            });
            setIsDataGetLoading(false);
          });
      })
      .catch((err: any) => {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Something went wrong',
        });
        setIsDataGetLoading(false);
      });
  };

  const submitVendor = () => {
    setIsDataPostLoading(true);
    try {
      if (name == '' || email == '' || code == '' || phone == '') {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Required field is missing.',
        });
        setIsDataPostLoading(false);
      } else if (phone && phone.length != 10) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Mobile number should be 10 digit.',
        });
        setIsDataPostLoading(false);
      } else {
        AsyncStorage.getItem(LOCALSTORAGE.ID).then(async (id: any) => {
          let postedData = {
            name: name,
            email: email,
            code: code,
            password: password,
            phone: phone,
            role: role,
            api_token: id,
            id: data.id,
          };
          await updateVendor(postedData)
            .then((res: any) => {
              if (res.data.status) {
                Toast.show({
                  type: 'success',
                  text1: 'Success',
                  text2: res.data.message,
                });
                getVendorDetails(data.id);
                setIsDataPostLoading(false);
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: res.data.message,
                });
                setIsDataPostLoading(false);
              }
            })
            .catch((err: any) => {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong',
              });
              setIsDataPostLoading(false);
            });
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
      setIsDataPostLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.editVendorBaseContainer}>
      <View style={styles.editVendorHeaderBaseContainer}>
        <HeaderComponent />
      </View>
      <View style={styles.editVendorNavbarBaseContainer}>
        <NavBarComponent
          title={`Edit Vendor`}
          titleColor={COLOR.baseColor}
          navigation={navigation}
        />
      </View>
      <View style={styles.editVendorContentBaseContainer}>
        {isDataGetLoading ? (
          <View style={styles.editVendorLoaderContainer}>
            <ActivityIndicator size={30} color={COLOR.baseColor} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.editVendorContentContainer}>
            <InputComponents
              value={name}
              placeholder="Name"
              onChangeText={(value: any) => {
                setName(value);
              }}
              backgroundColor={COLOR.whiteColor}
              disable={isDataPostLoading}
            />
            <InputComponents
              value={email}
              placeholder="Email"
              onChangeText={(value: any) => {
                setEmail(value);
              }}
              backgroundColor={COLOR.whiteColor}
              disable={isDataPostLoading}
            />
            <InputComponents
              value={code}
              placeholder="Code"
              onChangeText={(value: any) => {
                setCode(value);
              }}
              backgroundColor={COLOR.whiteColor}
              disable={isDataPostLoading}
            />
            <InputComponents
              value={password}
              placeholder="Password"
              onChangeText={(value: any) => {
                setPassword(value);
              }}
              backgroundColor={COLOR.whiteColor}
              disable={isDataPostLoading}
            />
            <InputComponents
              value={phone}
              placeholder="Phone"
              onChangeText={(value: any) => {
                setPhone(value);
              }}
              backgroundColor={COLOR.whiteColor}
              disable={isDataPostLoading}
            />
            <CustomButton
              title="Update Vendor"
              backgroundColor={COLOR.baseColor}
              color={COLOR.whiteColor}
              isLoading={isDataPostLoading}
              onClick={submitVendor}
            />
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  editVendorBaseContainer: {
    flex: 1,
  },
  editVendorHeaderBaseContainer: {
    flex: 0.09,
  },
  editVendorNavbarBaseContainer: {
    flex: 0.1,
  },
  editVendorContentBaseContainer: {
    flex: 0.82,
  },
  editVendorLoaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editVendorContentContainer: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
});

export default memo(VendorEdit);
