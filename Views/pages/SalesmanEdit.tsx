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
  inputStyleBlack,
  height8,
  height83,
} from '../assets/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  get,
  getSalesmanById,
  post,
  showToast,
  updateSalesman,
} from '../services/services';
import NavBarComponent from '../components/NavBarComponent';
import COLOR from '../config/color';
import CustomButton from '../components/CustomButton';
import LOCALSTORAGE from '../config/localStorage';
import Toast from 'react-native-toast-message';

function SalesmanEdit({navigation, route}: any): JSX.Element {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [isDataPostLoading, setIsDataPostLoading] = useState(false);
  const [data, setData] = useState<any>({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(3);

  useEffect(() => {
    var salesmanId = route.params.salesmanId;
    getSalesmanDetails(salesmanId);
  }, []);
  const getSalesmanDetails = (salesmanId: any) => {
    setIsDataLoading(true);
    try {
      AsyncStorage.getItem(LOCALSTORAGE.ID)
        .then(async id => {
          await getSalesmanById('salesman', salesmanId, id)
            .then(res => {
              if (res.data.status) {
                setIsDataLoading(false);
                setData(res.data.data);
                setName(res.data.data.name);
                setEmail(res.data.data.email);
                setCode(res.data.data.code);
                setPassword(res.data.data.originalPassword);
                setPhone(res.data.data.phone);
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: 'Something went wrong',
                });
                setIsDataLoading(false);
              }
            })
            .catch(err => {
              setIsDataLoading(false);
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong',
              });
            });
        })
        .catch(err => {
          setIsDataLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong',
          });
        });
    } catch (error) {
      setIsDataLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
    }
  };

  const submitSalesman = () => {
    setIsDataPostLoading(true);
    if (
      name == '' ||
      email == '' ||
      code == '' ||
      phone == '' ||
      name == undefined ||
      email == undefined ||
      code == undefined ||
      phone == undefined
    ) {
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
              id: data.id,
            };
            await updateSalesman(postedData)
              .then(res => {
                if (res.data.status) {
                  setIsDataPostLoading(false);
                  Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: 'Salesman updated successfully',
                  });
                  getSalesmanDetails(data.id);
                } else {
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Something went wrong',
                  });
                  setIsDataPostLoading(false);
                }
              })
              .catch(err => {
                setIsDataPostLoading(false);
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: 'Something went wrong',
                });
              });
          })
          .catch(err => {
            setIsDataPostLoading(false);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Something went wrong',
            });
          });
      } catch (error) {
        setIsDataPostLoading(false);
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
    //       if (name != '' && email != '' && code != '' && phone != '') {
    //         let postedData = {
    //           name: name,
    //           email: email,
    //           code: code,
    //           password: password,
    //           phone: phone,
    //           role: role,
    //           api_token: token,
    //           id: data.id,
    //         };
    //         post('/users/edit', postedData)
    //           .then(res => {
    //             showToast(res.message);
    //             getSalesmanDetails(data.id);
    //             setIsDataPostLoading(false);
    //           })
    //           .catch(err => {
    //             // console.log(err);
    //             setIsDataPostLoading(false);
    //             showToast(err.message);
    //           });
    //       } else {
    //         showToast('Required field is missing.');
    //         setIsDataPostLoading(false);
    //       }
    //     } else {
    //       showToast('Mobile number should be 10 digit.');
    //       setIsDataPostLoading(false);
    //     }
    //   })
    //   .catch(() => {
    //     setIsDataPostLoading(false);
    //   });
  };

  return (
    <SafeAreaView style={styles.salesmanEditBaseContainer}>
      <View style={styles.salesmanEditHeaderBaseContainer}>
        <HeaderComponent />
      </View>
      <View style={styles.salesmanEditNavbarBaseContainer}>
        <NavBarComponent
          title="Edit Salesman"
          titleColor={COLOR.baseColor}
          navigation={navigation}
        />
      </View>
      <View style={styles.salesmanEditContentBaseContainer}>
        {isDataLoading ? (
          <View style={styles.salesmanEditLoaderBaseContainer}>
            <ActivityIndicator size={30} color={COLOR.baseColor} />
          </View>
        ) : (
          <View style={styles.salesmanEditContentContainer}>
            <ScrollView
              contentContainerStyle={styles.salesmanEditScrollViewContainer}>
              <InputComponents
                value={name}
                placeholder="Name"
                onChangeText={(value: any) => {
                  setName(value);
                }}
                disable={isDataPostLoading}
              />
              <InputComponents
                value={email}
                placeholder="Email"
                onChangeText={(value: any) => {
                  setEmail(value);
                }}
                disable={isDataPostLoading}
              />
              <InputComponents
                value={code}
                placeholder="Code"
                onChangeText={(value: any) => {
                  setCode(value);
                }}
                disable={isDataPostLoading}
              />
              <InputComponents
                value={password}
                placeholder="Password"
                onChangeText={(value: any) => {
                  setPassword(value);
                }}
                disable={isDataPostLoading}
              />
              <InputComponents
                value={phone}
                placeholder="Phone"
                onChangeText={(value: any) => {
                  setPhone(value);
                }}
                disable={isDataPostLoading}
              />
              <CustomButton
                title="Update Salesman"
                backgroundColor={COLOR.baseColor}
                color={COLOR.whiteColor}
                isLoading={isDataPostLoading}
                onClick={submitSalesman}
              />
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
    // <SafeAreaView style={{backgroundColor: '#ededed'}}>
    //   <StatusBar backgroundColor={gulluColor} />
    //   <View style={[height100, primaryGulluLightBackgroundColor]}>
    //     <View style={[{}, height100]}>
    //       <View style={[{}, height8]}>
    //         <HeaderComponent navigation={navigation} title="Salesman edit" />
    //       </View>
    //       <View style={[{}, height83]}>
    //         {getLoader ? (
    //           <ActivityIndicator size={20} color={gulluColor} />
    //         ) : (
    //           <View>
    //             <InputComponents
    //               value={data.name}
    //               placeholder="Name"
    //               inputValue={(value: any) => {
    //                 setName(value);
    //               }}
    //               style={inputStyleBlack}
    //             />
    //             <InputComponents
    //               value={data.email}
    //               placeholder="Email"
    //               inputValue={(value: any) => {
    //                 setEmail(value);
    //               }}
    //               style={inputStyleBlack}
    //             />
    //             <InputComponents
    //               value={data.code}
    //               placeholder="Code"
    //               inputValue={(value: any) => {
    //                 setCode(value);
    //               }}
    //               style={inputStyleBlack}
    //             />
    //             <InputComponents
    //               value={data.password}
    //               placeholder="Password"
    //               inputValue={(value: any) => {
    //                 setPassword(value);
    //               }}
    //               style={inputStyleBlack}
    //             />
    //             <InputComponents
    //               value={data.phone}
    //               placeholder="Phone"
    //               inputValue={(value: any) => {
    //                 setPhone(value);
    //               }}
    //               style={inputStyleBlack}
    //             />

    //             {!loader ? (
    //               <View style={{alignItems: 'center'}}>
    //                 <TouchableOpacity
    //                   onPress={() => {
    //                     submitSalesman();
    //                   }}
    //                   style={[
    //                     {
    //                       width: 'auto',
    //                       backgroundColor: gulluColor,
    //                       borderRadius: 10,
    //                     },
    //                     padding15,
    //                     justifyContentCenter,
    //                   ]}>
    //                   <Text style={[{color: '#fff'}, h3, textAlignCenter]}>
    //                     Update Salesman
    //                   </Text>
    //                 </TouchableOpacity>
    //               </View>
    //             ) : (
    //               <View style={{alignItems: 'center'}}>
    //                 <View
    //                   style={[
    //                     {
    //                       width: 'auto',
    //                       backgroundColor: gulluColor,
    //                       borderRadius: 10,
    //                     },
    //                     padding15,
    //                     justifyContentCenter,
    //                   ]}>
    //                   <ActivityIndicator color="white"></ActivityIndicator>
    //                 </View>
    //               </View>
    //             )}
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
  salesmanEditBaseContainer: {
    flex: 1,
  },
  salesmanEditHeaderBaseContainer: {
    flex: 0.09,
  },
  salesmanEditNavbarBaseContainer: {
    flex: 0.1,
  },
  salesmanEditContentBaseContainer: {
    flex: 0.82,
  },
  salesmanEditLoaderBaseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  salesmanEditContentContainer: {
    flex: 1,
  },
  salesmanEditScrollViewContainer: {
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

export default memo(SalesmanEdit);
