import {memo, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  ImageBackground,
  View,
  PermissionsAndroid,
  Alert,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {
  height100,
  padding10,
  height6,
  height85,
  height9,
  justifyContentCenter,
  secondaryBackgroundColor,
  textAlignCenter,
  height15,
  flexDirectionRow,
  marginRight10,
  h5,
  gulluColor,
  primaryGulluLightBackgroundColor,
  marginBottom10,
  paddingVertical4,
} from '../assets/styles';
import InputComponents from '../components/InputComponents';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import {get, getOrderList} from '../services/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {imagePath} from '../services/Client';
import {ActivityIndicator} from 'react-native';
import {inputStyleBlack} from '../assets/styles';
import {goldenColor} from '../assets/styles';
import {gulluFont} from '../assets/styles';

var RNFS = require('react-native-fs');
import XLSX from 'xlsx';
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function OrderList({navigation}): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [loader, setLoader] = useState(false);
  const [pending, setPending] = useState({});
  const [ready, setReady] = useState({});
  const [delivered, setDelivered] = useState({});
  const [pendingAll, setPendingAll] = useState({});
  const [readyAll, setReadyAll] = useState({});
  const [deliveredAll, setDeliveredAll] = useState({});
  const [selectedOrderStatus, SetSelectedOrderStatus] = useState('');

  const [allOrdersList, setAllOrdersList] = useState([]);

  const [searchableData, setSearchableData] = useState([]);
  const [defaultSearchValue, setDefaultSearchValue] = useState();

  const [selectedOrderData, SetSelectedOrderData] = useState('');

  useEffect(() => {
    console.log('selectedOrderData');
    console.log(selectedOrderData[0]);
    AsyncStorage.getItem('role').then(userRole => {
      console.log(userRole);
    });
  }, []);

  const handleClick = async () => {
    try {
      // Check for Permission (check if permission is already given or not)
      let isPermitedExternalStorage = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );

      if (!isPermitedExternalStorage) {
        // Ask for permission
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage permission needed',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission Granted (calling our exportDataToExcel function)
          exportDataToExcel();
          console.log('Permission granted');
        } else {
          // Permission denied
          console.log('Permission denied');
        }
      } else {
        // Already have Permission (calling our exportDataToExcel function)
        exportDataToExcel();
      }
    } catch (e) {
      console.log('Error while checking permission');
      console.log(e);
      return;
    }
  };

  const exportDataToExcel = () => {
    // Created Sample data
    // let sample_data_to_export = [
    //   { id: "1", name: "First User" },
    //   { id: "2", name: "Second User" },
    // ];
    let processingData = [];

    for (let i = 0; i < selectedOrderData.length; i++) {
      processingData.push({
        id: selectedOrderData[i].id,
        'Entry Number': selectedOrderData[i].entry_number,
        'Order Number': selectedOrderData[i].order_number,
        vendor: selectedOrderData[i].vendor.name,
        salesman: selectedOrderData[i].salesman.name,
        color: selectedOrderData[i].color,
        'Created Date': selectedOrderData[i].date,
        'Buffer Date': selectedOrderData[i].buffered_ready_date,
        'Ready Date': selectedOrderData[i].ready_date,
      });
    }
    let getDate = new Date().getDate();
    let getMonth = new Date().getMonth() + 1;
    let getFullYear = new Date().getFullYear();

    let sample_data_to_export = processingData;
    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(sample_data_to_export);
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    const wbout = XLSX.write(wb, {type: 'binary', bookType: 'xlsx'});
    console.log(' i am here');
    console.log(RNFS.DocumentDirectoryPath);
    // Write generated excel to Storage
    var path =
      RNFS.DownloadDirectoryPath +
      '/' +
      selectedOrderStatus +
      '_' +
      getDate +
      '_' +
      getMonth +
      '_' +
      getFullYear +
      '.xlsx';
    console.log(path);
    RNFS.writeFile(path, wbout, 'ascii')
      .then(success => {
        console.log('FILE WRITTEN!');

        Alert.alert('Success', 'File Downloaded...', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        // const options = {
        //   fromUrl: path,
        //   toFile: path,
        //   fileCache: true,
        // };

        // RNFS.exists(path)
        //   .then((exists) => {
        //     if (exists) {
        //       stat(path)
        //         .then((statResult) => {
        //           console.log(statResult.size);
        //         })
        //         .catch((err) => {
        //           console.log(err);
        //         });
        //       console.log("BLAH EXISTS");
        //     } else {
        //       console.log("BLAH DOES NOT EXIST");
        //     }
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });

        //   RNFS.downloadFile(options)
        //     .promise.then((res) => {
        //       // console.log('res', res)
        //       // FileViewer.open(path);
        //       console.log("open");
        //     })

        //     .then((res) => {
        //       // success
        //       // console.log("success", res);
        //       console.log("success");
        //     })
        //     .catch((error) => {
        //       // error
        //       console.log("Attachment open error: ", error);
        //     });
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  useEffect(() => {
    SetSelectedOrderStatus('pending');
    AsyncStorage.getItem('id')
      .then(async token => {
        setLoader(true);
        let postedData = {role: 'salesman', api_token: token};
        console.log(postedData);
        // get('/orders/list', postedData)
        await getOrderList('salesman', token)
          .then(res => {
            console.log(JSON.stringify(res));
            let pending = res.data.data['pending'];
            let ready = res.data.data['ready'];
            let delivered = res.data.data['delivered'];

            setPending(pending);
            setReady(ready);
            setDelivered(delivered);

            setPendingAll(pending);
            setReadyAll(ready);
            setDeliveredAll(delivered);

            let mergedArray1 = pending.concat(ready);
            let mergedArray2 = mergedArray1.concat(delivered);
            setAllOrdersList(mergedArray2);
            // console.log(mergedArray2);
            SetSelectedOrderData(res.data.data.data['pending']);
            // SetData(res.data.data.data);
            setLoader(false);
          })
          .catch(err => {
            setLoader(false);
            console.log(JSON.stringify(err));
          });
      })
      .catch(err => {
        setLoader(false);
      });
  }, []);

  const searchOrder = searchableText => {
    let searchFrom = pendingAll;

    if (searchableText.length > 0) {
      let newSearchableArray = [];
      let alreadyAvailableProductId = [];

      if (selectedOrderStatus == 'delivered') {
        searchFrom = deliveredAll;
      }

      if (selectedOrderStatus == 'ready') {
        searchFrom = readyAll;
      }

      if (searchFrom.length > 0) {
        searchFrom.filter(list => {
          let searchableLowercase = list.order_number.toLowerCase();
          if (searchableLowercase.includes(searchableText.toLowerCase())) {
            if (!alreadyAvailableProductId.includes(list.id)) {
              newSearchableArray.push(list);
              alreadyAvailableProductId.push(list.id);
            }
          }

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
        SetSelectedOrderData(newSearchableArray);
      }
    } else {
      SetSelectedOrderData(searchFrom);
    }
  };

  const Item = ({item}: any) => (
    <Pressable
      onPress={() => {
        navigation.push('orderEdit', {orderData: item});
      }}
      style={styles.item}>
      <View style={[{}, flexDirectionRow]}>
        <View style={[marginRight10, {width: '60%', overflow: 'hidden'}]}>
          <View style={[{}, flexDirectionRow]}>
            <Text
              style={[
                {fontWeight: 'bold', width: '50%'},
                h5,
                marginRight10,
                gulluFont,
              ]}>
              Order Number
            </Text>
            <Text style={[{marginTop: 0}, h5, gulluFont]}>
              {item?.order_number}
            </Text>
          </View>
          <View style={[{}, flexDirectionRow]}>
            <Text
              style={[
                {fontWeight: 'bold', width: '50%'},
                h5,
                marginRight10,
                gulluFont,
              ]}>
              Item{' '}
            </Text>
            <Text style={[{marginTop: 0}, h5, gulluFont]}>{item?.item} </Text>
          </View>
          <View style={[{}, flexDirectionRow]}>
            <Text
              style={[
                {fontWeight: 'bold', width: '50%'},
                h5,
                marginRight10,
                gulluFont,
              ]}>
              Color
            </Text>
            <Text style={[{marginTop: 0}, h5, gulluFont]}>{item?.color}</Text>
          </View>
          <View style={[{}, flexDirectionRow]}>
            <Text
              style={[
                {fontWeight: 'bold', width: '50%'},
                h5,
                marginRight10,
                gulluFont,
              ]}>
              Salesman
            </Text>
            <Text style={[{marginTop: 0}, h5, gulluFont]}>
              {item?.salesman?.name}
            </Text>
          </View>
          <View style={[{}, flexDirectionRow]}>
            <Text
              style={[
                {fontWeight: 'bold', width: '50%'},
                h5,
                marginRight10,
                gulluFont,
              ]}>
              Vendor
            </Text>
            <Text style={[{marginTop: 0}, h5, gulluFont]}>
              {item?.vendor?.name}
            </Text>
          </View>
        </View>
        <View style={{width: '40%'}}>
          {item?.attachments.length > 0 ? (
            <ImageBackground
              source={{uri: imagePath + '' + item?.attachments[0].attachment}}
              resizeMode="contain"
              style={{height: 100, width: '100%'}}
            />
          ) : (
            ''
          )}
        </View>
      </View>
    </Pressable>
  );
  const checkOrderStatus = changedOrderStatus => {
    setDefaultSearchValue('');
    SetSelectedOrderStatus(changedOrderStatus);
    if (changedOrderStatus == 'pending') {
      SetSelectedOrderData(pending);
    } else if (changedOrderStatus == 'ready') {
      SetSelectedOrderData(ready);
    } else if (changedOrderStatus == 'delivered') {
      SetSelectedOrderData(delivered);
    }
  };
  return (
    <SafeAreaView style={{backgroundColor: '#ededed'}}>
      <StatusBar backgroundColor={gulluColor} />
      <View style={[height100, primaryGulluLightBackgroundColor]}>
        <View style={[{}, height100]}>
          <View style={[{}, height6]}>
            <HeaderComponent navigation={navigation} title="List Orders" />
          </View>
          <View style={[{}, height85]}>
            {loader ? (
              <ActivityIndicator size={30} color={gulluColor} />
            ) : (
              <View>
                <View style={[{padding: 20}]}>
                  {/* pending
									ready
										delivered */}
                  {selectedOrderStatus == 'pending' ? (
                    <InputComponents
                      placeholder="search Order, Salesman , Vendor"
                      style={[{}, inputStyleBlack]}
                      inputValue={(value: any) => {
                        searchOrder(value);
                      }}
                    />
                  ) : selectedOrderStatus == 'ready' ? (
                    <InputComponents
                      placeholder="search Order, Salesman , Vendor"
                      style={[{}, inputStyleBlack]}
                      inputValue={(value: any) => {
                        searchOrder(value);
                      }}
                    />
                  ) : (
                    <InputComponents
                      placeholder="search Order, Salesman , Vendor"
                      style={[{}, inputStyleBlack]}
                      inputValue={(value: any) => {
                        searchOrder(value);
                      }}
                    />
                  )}
                </View>

                <View style={[{}, height85]}>
                  <Pressable
                    style={[
                      {backgroundColor: 'lightgreen'},
                      padding10,
                      marginBottom10,
                    ]}
                    onPress={() => {
                      handleClick();
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#fff',
                        fontWeight: 'bold',
                      }}>
                      Download {selectedOrderStatus} report{' '}
                    </Text>
                  </Pressable>
                  <View
                    style={{
                      justifyContent: 'space-around',
                      flexDirection: 'row',
                    }}>
                    <Pressable
                      onPress={() => {
                        checkOrderStatus('pending');
                      }}
                      style={[
                        {width: '30%', borderRadius: 10},
                        padding10,
                        justifyContentCenter,
                        selectedOrderStatus == 'pending'
                          ? {backgroundColor: goldenColor}
                          : {borderColor: goldenColor, borderWidth: 2},
                      ]}>
                      <Text
                        style={[
                          {textAlign: 'center', fontSize: 18},
                          selectedOrderStatus == 'pending'
                            ? {}
                            : {color: secondaryBackgroundColor},
                        ]}>
                        Pending
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        checkOrderStatus('ready');
                      }}
                      style={[
                        {width: '30%', borderRadius: 10},
                        padding10,
                        justifyContentCenter,
                        selectedOrderStatus == 'ready'
                          ? {backgroundColor: goldenColor}
                          : {borderColor: goldenColor, borderWidth: 2},
                      ]}>
                      <Text
                        style={[
                          {textAlign: 'center', fontSize: 18},
                          selectedOrderStatus == 'ready'
                            ? {}
                            : {color: secondaryBackgroundColor},
                        ]}>
                        Ready
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        checkOrderStatus('delivered');
                      }}
                      style={[
                        {width: '30%', borderRadius: 10},
                        padding10,
                        justifyContentCenter,
                        selectedOrderStatus == 'delivered'
                          ? {backgroundColor: goldenColor}
                          : {borderColor: goldenColor, borderWidth: 2},
                      ]}>
                      <Text
                        style={[
                          {textAlign: 'center', fontSize: 18},
                          selectedOrderStatus == 'delivered'
                            ? {}
                            : {color: secondaryBackgroundColor},
                        ]}>
                        Delivered
                      </Text>
                    </Pressable>
                  </View>
                  {selectedOrderData.length > 0 ? (
                    <FlatList
                      data={selectedOrderData}
                      renderItem={({item}) => <Item item={item} />}
                      keyExtractor={item => item?.id}
                      showsVerticalScrollIndicator={false}
                    />
                  ) : (
                    <View
                      style={[{justifyContent: 'center'}, paddingVertical4]}>
                      <Text style={{textAlign: 'center', fontSize: 16}}>
                        No Data Available
                      </Text>
                    </View>
                  )}
                </View>
                <Pressable
                  onPress={() => {
                    navigation.push('ordercreate');
                  }}
                  style={[
                    {
                      backgroundColor: gulluColor,
                      height: 70,
                      width: 70,
                      padding: 0,
                      margin: 0,
                      borderRadius: 100,
                      right: 10,
                      position: 'absolute',
                      bottom: 0,
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        fontSize: 50,
                        padding: 0,
                        margin: 0,
                        top: -3,
                        color: goldenColor,
                      },
                      textAlignCenter,
                    ]}>
                    +
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
          {/* <View style={[{}, height9]}>
            <FooterComponent navigation={navigation} />
          </View> */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
});

export default memo(OrderList);
