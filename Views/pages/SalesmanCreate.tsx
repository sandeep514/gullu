import React, {memo, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
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

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import InputComponents from '../components/InputComponents';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';

import {
  cardBackgroundColor,
  h1,
  h2,
  h3,
  height10,
  height100,
  height14,
  height15,
  height20,
  height4,
  height5,
  height50,
  height6,
  height80,
  height82,
  height84,
  height85,
  height87,
  height9,
  height90,
  height92,
  inputStyleBlack,
  justifyContentCenter,
  padding15,
  padding20,
  primaryBackgroundColor,
  primaryColor,
  screenheight,
  secondaryBackgroundColor,
  textAlignCenter,
  inputStyle,
  gulluColor,
  primaryGulluLightBackgroundColor,
  height8,
  height83,
} from '../assets/styles';
import {createSalesman, post, showToast} from '../services/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavBarComponent from '../components/NavBarComponent';
import COLOR from '../config/color';
import CustomButton from '../components/CustomButton';
import Toast from 'react-native-toast-message';
import LOCALSTORAGE from '../config/localStorage';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function SalesmanCreate({navigation}: any): JSX.Element {
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [code, setCode] = useState();
  const [password, setPassword] = useState();
  const [phone, setPhone] = useState<String>();
  const [role, setRole] = useState(3);

  useEffect(() => {}, []);

  const submitSalesman = () => {
    setIsLoading(true);
    if (
      name == undefined ||
      name == '' ||
      code == undefined ||
      code == '' ||
      password == undefined ||
      password == '' ||
      phone == undefined ||
      phone == '' ||
      email == undefined ||
      email == ''
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
            const postedData = {
              name: name,
              code: code,
              password: password,
              phone: phone,
              email: email,
              role: role,
              api_token: id,
            };
            await createSalesman(postedData)
              .then(res => {
                if (res.data.status) {
                  setIsLoading(false);
                  Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: res.data.message,
                  });
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'salesmanlist' as never}],
                  });
                } else {
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: res.data.message,
                  });
                  setIsLoading(false);
                }
              })
              .catch(err => {
                console.log(JSON.stringify(err));
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
    // AsyncStorage.getItem('id')
    //   .then(token => {
    //     if (phone.length == 10) {
    //       if (name != '' && code != '' && password != '' && phone != '') {
    //         let postedData = {
    //           name: name,
    //           code: code,
    //           password: password,
    //           phone: phone,
    //           role: role,
    //           api_token: token,
    //         };
    //         post('/users/create', postedData)
    //           .then(res => {
    //             if (res.status == true) {
    //               showToast(res.message);
    //             } else {
    //               showToast(res.message);
    //             }
    //             setIsLoading(false);
    //             navigation.push('salesmanlist');
    //           })
    //           .catch(err => {
    //             showToast(err.message);
    //             setIsLoading(false);
    //           });
    //       } else {
    //         showToast('Required field is missing.');
    //         setIsLoading(false);
    //       }
    //     } else {
    //       showToast('Mobile number should be 10 digit.');
    //       setIsLoading(false);
    //     }
    //   })
    //   .catch(() => {
    //     setIsLoading(false);
    //   });
  };

  return (
    <SafeAreaView style={styles.salesmanCreateBaseContainer}>
      <View style={styles.salesmanCreateHeaderBaseContainer}>
        <HeaderComponent />
      </View>
      <View style={styles.salesmanCreateNavbarBaseContainer}>
        <NavBarComponent
          title="Create Salesman"
          titleColor={COLOR.baseColor}
          navigation={navigation}
        />
      </View>
      <View style={styles.salesmanCreateContentBaseContainer}>
        <ScrollView
          contentContainerStyle={styles.salesmanCreateContentContainer}>
          <InputComponents
            placeholder="Name"
            value={name}
            onChangeText={(value: any) => {
              setName(value);
            }}
            disable={isLoading}
          />
          <InputComponents
            placeholder="Email"
            value={email}
            onChangeText={(value: any) => {
              setEmail(value);
            }}
            disable={isLoading}
          />
          <InputComponents
            placeholder="Code"
            value={code}
            onChangeText={(value: any) => {
              setCode(value);
            }}
            disable={isLoading}
          />
          <InputComponents
            placeholder="Password"
            value={password}
            onChangeText={(value: any) => {
              setPassword(value);
            }}
            disable={isLoading}
          />
          <InputComponents
            placeholder="Phone"
            value={phone}
            onChangeText={(value: any) => {
              setPhone(value);
            }}
            disable={isLoading}
          />
          <CustomButton
            title="Create New Salesman"
            backgroundColor={COLOR.baseColor}
            color={COLOR.whiteColor}
            isLoading={isLoading}
            onClick={submitSalesman}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
    // <SafeAreaView style={{backgroundColor: '#ededed'}}>
    //   <StatusBar backgroundColor={gulluColor} />
    //   <View style={[height100, primaryGulluLightBackgroundColor]}>
    //     <View style={[{}, height100]}>
    //       <View style={[{}, height8]}>
    //         <HeaderComponent navigation={navigation} title="Create Salesman" />
    //       </View>
    //       <View style={[{}, height83]}>
    //         <InputComponents
    //           placeholder="Name"
    //           inputValue={(value: any) => {
    //             setName(value);
    //           }}
    //           style={inputStyleBlack}
    //         />
    //         <InputComponents
    //           placeholder="Email"
    //           inputValue={(value: any) => {
    //             setEmail(value);
    //           }}
    //           style={inputStyleBlack}
    //         />
    //         <InputComponents
    //           placeholder="Code"
    //           inputValue={(value: any) => {
    //             setCode(value);
    //           }}
    //           style={inputStyleBlack}
    //         />
    //         <InputComponents
    //           placeholder="Password"
    //           inputValue={(value: any) => {
    //             setPassword(value);
    //           }}
    //           style={inputStyleBlack}
    //         />
    //         <InputComponents
    //           placeholder="Phone"
    //           inputValue={(value: any) => {
    //             setPhone(value);
    //           }}
    //           style={inputStyleBlack}
    //         />
    //         {!loader ? (
    //           <View style={{alignItems: 'center'}}>
    //             <TouchableOpacity
    //               onPress={() => {
    //                 submitSalesman();
    //               }}
    //               style={[
    //                 {
    //                   width: 'auto',
    //                   backgroundColor: gulluColor,
    //                   borderRadius: 10,
    //                 },
    //                 padding15,
    //                 justifyContentCenter,
    //               ]}>
    //               <Text style={[{color: '#fff'}, h3, textAlignCenter]}>
    //                 Create New Salesman
    //               </Text>
    //             </TouchableOpacity>
    //           </View>
    //         ) : (
    //           <View style={{alignItems: 'center'}}>
    //             <View
    //               style={[
    //                 {
    //                   width: 'auto',
    //                   backgroundColor: gulluColor,
    //                   borderRadius: 10,
    //                 },
    //                 padding15,
    //                 justifyContentCenter,
    //               ]}>
    //               <ActivityIndicator color="white"></ActivityIndicator>
    //             </View>
    //           </View>
    //         )}
    //       </View>
    //       <View style={[{}, height9]}>
    //         <FooterComponent navigation={navigation} />
    //       </View>
    //     </View>
    //   </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  salesmanCreateBaseContainer: {
    flex: 1,
  },
  salesmanCreateHeaderBaseContainer: {
    flex: 0.09,
  },
  salesmanCreateNavbarBaseContainer: {
    flex: 0.1,
  },
  salesmanCreateContentBaseContainer: {
    flex: 0.82,
  },
  salesmanCreateContentContainer: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: StatusBar.currentHeight || 0,
//   },
//   item: {
//     backgroundColor: secondaryBackgroundColor,
//     padding: 15,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 10,
//   },
// });

export default memo(SalesmanCreate);
