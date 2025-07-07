/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {useCallback, useEffect, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  ImageBackground,
  View,
  FlatList,
  ActivityIndicator,
  Linking,
  Image,
  Share,
} from 'react-native';

import {
  flexDirectionRow,
  goldenColor,
  gulluColor,
  gulluFont,
  h4,
  h5,
  height10,
  height100,
  height8,
  height83,
  height9,
  height90,
  inputStyleBlack,
  marginRight10,
  marginTop30,
  primaryGulluLightBackgroundColor,
  textAlignCenter,
} from '../assets/styles';
import FooterComponent from '../components/FooterComponent';
import HeaderComponent from '../components/HeaderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {get, pendingOrders} from '../services/services';
import {imagePath} from '../services/Client';
import {useIsFocused} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import InputComponents from '../components/InputComponents';
import {memo} from 'react';
import LOCALSTORAGE from '../config/localStorage';

function Dashboard({navigation}: any) {
  const [loader, setLoader] = useState(false);
  const [role, setRole] = useState();
  const [selectedOrderData, SetSelectedOrderData] = useState('');
  const [OriginalPending, setOriginalPending] = useState([]);
  const [pending, setPending] = useState([]);
  const [ready, setReady] = useState({});
  const [delivered, setDelivered] = useState({});
  const [allOrdersList, setAllOrdersList] = useState([]);
  const [searchableData, setSearchableData] = useState([]);

  useEffect(() => {
    NetInfo.fetch().then(state => {
      console.log(state);
      if (state.type == 'cellular') {
        console.log('You are using mobile data to upload 30MB data.');
      } else {
        if (500 > 400) {
          console.log('sixe of attachment is 2MB, this will take');
        }
      }
    });
  }, []);
  const wait = timeout => {
    // Defined the timeout function for testing purpose
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const shareOnWhatsapp = item => {
    const shareOptions = {
      title: 'Title',
      message:
        '*GULLU EXCLUSIVE ORDERS* \n' +
        '' +
        'Order Number: ' +
        item?.order_number +
        '\n Item: ' +
        item?.item?.name +
        '\n Color: ' +
        item?.color +
        '\n Ready Date: ' +
        item?.ready_date +
        '\n Vendor: ' +
        item?.vendor?.name +
        '\n URL: ' +
        imagePath +
        '' +
        item?.attachments[0]?.attachment,
      subject: 'Subject',
    };
    Share.share(shareOptions);
  };
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const getImageData = imagePath => {
    return new Promise((resolve, reject) => {
      get(imagePath)
        .then(data => {
          // resolve{ uri : 'data:image/jpeg;base64,'+data.data };
        })
        .catch(error => {
          console.log(err);
        });
    });
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    getData();
    wait(2000).then(() => setIsRefreshing(false));
  }, []);

  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    AsyncStorage.getItem('role')
      .then(roleId => {
        setRole(roleId);
      })
      .catch(err => {
        // console.log(err);
      });
    getData();
  }, []);
  useEffect(() => {
    getData();
  }, [isFocused]);

  const getData = async () => {
    console.log('getData');
    setLoader(true);
    try {
      AsyncStorage.getItem(LOCALSTORAGE.ID).then(async id => {
        await pendingOrders(id)
          .then(res => {
            console.log(`PENDING ORDERS ${JSON.stringify(res)}`);
          })
          .catch(err => {
            console.log(JSON.stringify(err));
          });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const searchOrder = searchableText => {
    if (searchableText.length > 0) {
      let newSearchableArray = [];
      let alreadyAvailableProductId = [];
      if (OriginalPending.length > 0) {
        OriginalPending.filter(list => {
          let searchableLowercase: any;

          // search order number
          searchableLowercase = list.order_number.toLowerCase();
          if (searchableLowercase.includes(searchableText.toLowerCase())) {
            if (!alreadyAvailableProductId.includes(list.id)) {
              newSearchableArray.push(list);
              alreadyAvailableProductId.push(list.id);
            }
          }

          //search Vendor
          let vendor = list.vendor?.name;
          if (vendor != undefined) {
            searchableLowercase = vendor.toLowerCase();
            if (searchableLowercase.includes(searchableText.toLowerCase())) {
              if (!alreadyAvailableProductId.includes(list.id)) {
                newSearchableArray.push(list);
                alreadyAvailableProductId.push(list.id);
              }
            }
          }

          //search Salesman
          let salesman = list.salesman?.name;
          if (salesman != undefined) {
            searchableLowercase = salesman.toLowerCase();
            if (searchableLowercase.includes(searchableText.toLowerCase())) {
              if (!alreadyAvailableProductId.includes(list.id)) {
                newSearchableArray.push(list);
                alreadyAvailableProductId.push(list.id);
              }
            }
          }

          // search item
          let item = list?.item?.name;
          if (item != undefined) {
            searchableLowercase = item.toLowerCase();
            if (searchableLowercase.includes(searchableText.toLowerCase())) {
              if (!alreadyAvailableProductId.includes(list.id)) {
                newSearchableArray.push(list);
                alreadyAvailableProductId.push(list.id);
              }
            }
          }
        });
        setSearchableData(newSearchableArray);
        setPending(newSearchableArray);
      }
    } else {
      setPending(OriginalPending);
    }
  };

  const shortnerURL = async url => {
    return url;

    const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
    const data = await response.json();
    console.log(data);
    return data.result.full_short_link;
  };

  const Item = ({item}: any) => (
    <Pressable
      onPress={() => {
        navigation.push('orderEdit', {orderData: item});
      }}
      style={[
        item?.pending_days > 15
          ? styles.itemGreen
          : item?.pending_days <= 15 && item.pending_days >= 10
          ? styles.itemYellow
          : styles.itemRed,
      ]}>
      <View style={[{}, flexDirectionRow]}>
        <View style={[marginRight10, {width: '58%', overflow: 'scroll'}]}>
          {role != undefined && role == 1 ? (
            <View>
              <View
                style={{
                  margin: 0,
                  backgroundColor: '#000',
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  alignSelf: 'flex-start',
                }}>
                <Text
                  onPress={() => {
                    Linking.openURL('tel:' + item?.salesman.phone);
                  }}
                  style={{color: '#fff'}}>
                  Call Vendor
                </Text>
              </View>
            </View>
          ) : null}
          <View style={[{}, flexDirectionRow]}>
            <Text style={[{fontWeight: 'bold'}, h5, gulluFont, marginRight10]}>
              Order Number
            </Text>
            <Text
              style={[
                {marginTop: 0, flex: 1, flexWrap: 'wrap'},
                h5,
                gulluFont,
              ]}>
              {item?.order_number}
            </Text>
          </View>
          <View style={[{}, flexDirectionRow]}>
            <Text style={[{fontWeight: 'bold'}, h5, gulluFont, marginRight10]}>
              Item{' '}
            </Text>
            <Text
              style={[
                {marginTop: 0, flex: 1, flexWrap: 'wrap'},
                h5,
                gulluFont,
              ]}>
              {item?.item?.name}{' '}
            </Text>
          </View>
          <View style={[{}, flexDirectionRow]}>
            <Text style={[{fontWeight: 'bold'}, h5, gulluFont, marginRight10]}>
              Color
            </Text>
            <Text
              style={[
                {marginTop: 0, flex: 1, flexWrap: 'wrap'},
                h5,
                gulluFont,
              ]}>
              {item?.color}
            </Text>
          </View>
          <View style={[{}, flexDirectionRow]}>
            <Text style={[{fontWeight: 'bold'}, h5, gulluFont, marginRight10]}>
              Ready date
            </Text>
            <Text
              style={[
                {marginTop: 0, flex: 1, flexWrap: 'wrap'},
                h5,
                gulluFont,
              ]}>
              {item?.ready_date}
            </Text>
          </View>

          {role == 1 ? (
            <View>
              <View style={[{}, flexDirectionRow]}>
                <Text
                  style={[{fontWeight: 'bold'}, h5, gulluFont, marginRight10]}>
                  Buffer date
                </Text>
                <Text
                  style={[
                    {marginTop: 0, flex: 1, flexWrap: 'wrap'},
                    h5,
                    gulluFont,
                  ]}>
                  {item?.buffered_ready_date}
                </Text>
                {/* <Text style={[{ marginTop: 0 }, h5, gulluFont]}>{item?.pending_days} ({ item?.buffered_ready_date })</Text> */}
              </View>
              <View style={[{}, flexDirectionRow]}>
                <Text
                  style={[{fontWeight: 'bold'}, h5, gulluFont, marginRight10]}>
                  Days left
                </Text>
                <Text style={[{marginTop: 0}, h5, gulluFont]}>
                  {item?.pending_days}{' '}
                </Text>

                {/* <Text style={[{ marginTop: 0 }, h5, gulluFont]}>{item?.pending_days} ({ item?.buffered_ready_date })</Text> */}
              </View>

              <View style={[{}, flexDirectionRow]}>
                <Text
                  style={[{fontWeight: 'bold'}, h5, gulluFont, marginRight10]}>
                  Delivery Date
                </Text>
                <Text
                  style={[
                    {marginTop: 0, flex: 1, flexWrap: 'wrap'},
                    h5,
                    gulluFont,
                  ]}>
                  {item?.delivery_date}
                </Text>
              </View>
              <View style={[{}, flexDirectionRow]}>
                <Text
                  style={[{fontWeight: 'bold'}, h5, gulluFont, marginRight10]}>
                  Salesman
                </Text>
                <Text
                  style={[
                    {marginTop: 0, flex: 1, flexWrap: 'wrap'},
                    h5,
                    gulluFont,
                  ]}>
                  {item?.salesman?.name}
                </Text>
              </View>
              <View style={[{}, flexDirectionRow]}>
                <Text
                  style={[{fontWeight: 'bold'}, h5, gulluFont, marginRight10]}>
                  Vendor
                </Text>
                <Text
                  style={[
                    {marginTop: 0, flex: 1, flexWrap: 'wrap'},
                    h5,
                    gulluFont,
                  ]}>
                  {item?.vendor?.name}
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        <View style={{width: '40%'}}>
          <View style={{marginBottom: 20}}>
            <ImageBackground
              source={{uri: imagePath + '' + item?.attachments[0]?.attachment}}
              resizeMode="contain"
              style={{height: 100, width: 100}}
            />
          </View>
          <Pressable
            style={{}}
            onPress={() => {
              shareOnWhatsapp(item);
            }}>
            <View
              style={{
                alignContent: 'flex-end',
                alignItems: 'flex-end',
                marginRight: 20,
              }}>
              {/* <Text>Whatsapp</Text> */}
              <Image
                source={require('../assets/images/3670051.png')}
                style={{height: 40, width: 40}}
              />
            </View>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
  return (
    <SafeAreaView style={styles.dashboardBaseContainer}>
      <View style={styles.dashboardHeaderBaseContainer}>
        <HeaderComponent navigation={navigation} isHomeScreen={true} />
      </View>
      <View style={styles.dashboardContentBaseContainer}></View>
    </SafeAreaView>
    // <SafeAreaView style={{backgroundColor: '#ededed'}}>
    //   <StatusBar backgroundColor={gulluColor} />
    //   <View style={[height100, primaryGulluLightBackgroundColor]}>
    //     <View style={[{}, height100]}>
    //       <View style={[{}, height8]}>
    //         <HeaderComponent navigation={navigation} title="Pending Orders" />
    //       </View>

    //       {/* <View style={[{}, height83]}>
    //         <View>
    //           <View style={[{}, height10]}>
    //             <InputComponents
    //               placeholder="Search Order , Vendor , Salesman"
    //               style={[{}, inputStyleBlack]}
    //               inputValue={(value: any) => {
    //                 searchOrder(value);
    //               }}
    //             />
    //           </View>
    //           <View style={[{}, height90]}>
    //             {loader ? (
    //               <ActivityIndicator size={20} color={gulluColor} />
    //             ) : pending != undefined && pending != '' ? (
    //               Object.values(pending)?.length > 0 ? (
    //                 <View>
    //                   <View>
    //                     <FlatList
    //                       refreshing={isRefreshing} // Added pull to refesh state
    //                       onRefresh={onRefresh} // Added pull to refresh control
    //                       data={Object.values(pending)}
    //                       renderItem={({item}) => <Item item={item} />}
    //                       keyExtractor={item => item?.id}
    //                       showsVerticalScrollIndicator={false}
    //                     />
    //                   </View>
    //                 </View>
    //               ) : (
    //                 <View style={{justifyContent: 'center'}}>
    //                   <Text
    //                     style={[
    //                       h4,
    //                       {color: gulluColor, textAlign: 'center'},
    //                       marginTop30,
    //                     ]}>
    //                     No pending orders available
    //                   </Text>
    //                 </View>
    //               )
    //             ) : null}
    //           </View>
    //         </View>
    //         {role != undefined && role == 1 ? (
    //           <Pressable
    //             onPress={() => {
    //               navigation.push('ordercreate');
    //             }}
    //             style={[
    //               {
    //                 backgroundColor: gulluColor,
    //                 height: 70,
    //                 width: 70,
    //                 padding: 0,
    //                 margin: 0,
    //                 borderRadius: 100,
    //                 right: 10,
    //                 position: 'absolute',
    //                 bottom: 0,
    //               },
    //             ]}>
    //             <Text
    //               style={[
    //                 {
    //                   fontSize: 50,
    //                   padding: 0,
    //                   margin: 0,
    //                   top: -5,
    //                   color: goldenColor,
    //                 },
    //                 textAlignCenter,
    //               ]}>
    //               +
    //             </Text>
    //           </Pressable>
    //         ) : null}
    //       </View> */}
    //     </View>
    //   </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dashboardBaseContainer: {
    flex: 1,
  },
  dashboardHeaderBaseContainer: {
    flex: 0.2,
  },
  dashboardContentBaseContainer: {
    flex: 1,
  },
});

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
//   itemRed: {
//     backgroundColor: 'red',
//     padding: 15,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 10,
//   },
//   itemYellow: {
//     backgroundColor: 'yellow',
//     padding: 15,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 10,
//   },
//   itemGreen: {
//     backgroundColor: 'lightgreen',
//     padding: 15,
//     marginVertical: 8,
//     marginHorizontal: 16,
//     borderRadius: 10,
//   },
// });

export default Dashboard;
