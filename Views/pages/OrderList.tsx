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
  TouchableOpacity,
  RefreshControl,
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
import Ionicons from 'react-native-vector-icons/Ionicons';

var RNFS = require('react-native-fs');
import XLSX from 'xlsx';
import NavBarComponent from '../components/NavBarComponent';
import COLOR from '../config/color';
import CustomButton from '../components/CustomButton';
import CustomTab from '../components/CustomTab';
import ROUTES from '../config/routes';
import {sliceString} from './Dashboard';
import DIMENSIONS from '../config/dimensions';
import LOCALSTORAGE from '../config/localStorage';
import {refresh} from '@react-native-community/netinfo';
import {useIsFocused} from '@react-navigation/native';
type SectionProps = PropsWithChildren<{
  title: string;
}>;

function OrderList({navigation}: any): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [search, setSearch] = useState('');
  const [selectedTab, setSelectedTab] = useState<any>(1);
  const tabData = [
    {
      title: 'Pending',
      value: 1,
      color: COLOR.blackColor,
    },
    {
      title: 'Ready',
      value: 2,
      color: COLOR.blackColor,
    },
    {
      title: 'Delivered',
      value: 3,
      color: COLOR.blackColor,
    },
  ];

  const [loader, setLoader] = useState(false);
  const [pending, setPending] = useState();
  const [ready, setReady] = useState();
  const [delivered, setDelivered] = useState();
  const [pendingAll, setPendingAll] = useState({});
  const [readyAll, setReadyAll] = useState({});
  const [deliveredAll, setDeliveredAll] = useState({});
  const [selectedOrderStatus, SetSelectedOrderStatus] = useState(1);

  const [allOrdersList, setAllOrdersList] = useState([]);

  const [searchableData, setSearchableData] = useState<any>([]);
  const [defaultSearchValue, setDefaultSearchValue] = useState<any>();

  const isFocused = useIsFocused();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState<any>();
  const IoniconsIcon = Ionicons as unknown as React.ComponentType<any>;
  const [role, setRole] = useState<String | null>('');

  useEffect(() => {
    AsyncStorage.getItem(LOCALSTORAGE.ROLE).then(userRole => {
      setRole(userRole);
    });
  }, []);

  useEffect(() => {
    checkOrderStatus(selectedTab);
  }, [selectedTab]);

  useEffect(() => {
    searchOrder(search);
  }, [search]);

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
    if (selectedOrderData) {
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
      .then((success: any) => {
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
      .catch((err: any) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    if (isFocused) {
      getData();
    }
  }, [isFocused]);

  const getData = async () => {
    SetSelectedOrderStatus(1);
    AsyncStorage.getItem(LOCALSTORAGE.ID)
      .then(async token => {
        setLoader(true);
        await getOrderList('salesman', token)
          .then(res => {
            // console.log(JSON.stringify(res));
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
            if (selectedTab == 1) {
              setSelectedOrderData(res.data.data['pending']);
            } else if (selectedTab == 2) {
              setSelectedOrderData(res.data.data['ready']);
            } else if (selectedTab == 3) {
              setSelectedOrderData(res.data.data['delivered']);
            }
            setLoader(false);
          })
          .catch(err => {
            setLoader(false);
            // console.log(JSON.stringify(err));
          });
      })
      .catch(err => {
        setLoader(false);
      });
  };

  const searchOrder = (searchableText: any) => {
    let searchFrom = pendingAll;

    if (searchableText.length > 0) {
      let newSearchableArray: any[] = [];
      let alreadyAvailableProductId: any[] = [];

      if (selectedOrderStatus == 3) {
        searchFrom = deliveredAll;
      }

      if (selectedOrderStatus == 2) {
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
        setSelectedOrderData(newSearchableArray);
      }
    } else {
      setSelectedOrderData(searchFrom);
    }
  };

  const Item = ({item}: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        navigation.push(ROUTES.orderEditScreen, {orderData: item});
      }}
      style={styles.orderListItemBaseContainer}>
      <View style={styles.orderListItemDetailsBaseContainer}>
        <View style={styles.orderListItemDetailsContainer}>
          <Text style={styles.orderListItemHeaderText}>Order Number</Text>
          <Text style={styles.orderListItemContentText}>
            {`#${item?.order_number}`}
          </Text>
        </View>
        <View style={styles.orderListItemDetailsContainer}>
          <Text style={styles.orderListItemHeaderText}>Item</Text>
          <Text style={styles.orderListItemContentText}>{`${item?.item}`}</Text>
        </View>
        <View style={styles.orderListItemDetailsContainer}>
          <Text style={styles.orderListItemHeaderText}>Color</Text>
          <Text style={styles.orderListItemContentText}>
            {sliceString(item?.color)}
          </Text>
        </View>
        <View style={styles.orderListItemDetailsContainer}>
          <Text style={styles.orderListItemHeaderText}>Consultant</Text>
          <Text style={styles.orderListItemContentText}>
            {sliceString(item?.salesman?.name)}
          </Text>
        </View>
        <View style={styles.orderListItemDetailsContainer}>
          <Text style={styles.orderListItemHeaderText}>Vendor</Text>
          <Text style={styles.orderListItemContentText}>
            {sliceString(item?.vendor?.name)}
          </Text>
        </View>
      </View>
      <View style={styles.orderListItemImageBaseContainer}>
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
    </TouchableOpacity>
  );
  const checkOrderStatus = (changedOrderStatus: any) => {
    setDefaultSearchValue('');
    SetSelectedOrderStatus(changedOrderStatus);
    if (changedOrderStatus == 1) {
      setSelectedOrderData(pending);
    } else if (changedOrderStatus == 2) {
      setSelectedOrderData(ready);
    } else if (changedOrderStatus == 3) {
      setSelectedOrderData(delivered);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    getData();
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.orderListBaseContainer}>
      <View style={styles.orderListHeaderBaseContainer}>
        <HeaderComponent />
      </View>
      <View style={styles.orderListContentBaseContainer}>
        <View style={styles.orderListContentSearchBaseContainer}>
          <InputComponents
            backgroundColor={COLOR.whiteColor}
            borderInclude={false}
            placeholder="Search Orders"
            value={search}
            onChangeText={(text: any) => {
              setSearch(text);
            }}
            Icon={
              <IoniconsIcon
                name={'search'}
                size={20}
                color={COLOR.placeholderColor}
              />
            }
          />
        </View>
        <View style={styles.orderListAddOrderButtonBaseContainer}>
          <CustomButton
            IconComponent={IoniconsIcon}
            iconName="add-outline"
            iconColor={COLOR.baseColor}
            radius={60}
            backgroundColor={`${COLOR.whiteColor}`}
            iconSize={30}
            elevation={true}
            onClick={() => {
              navigation.push(ROUTES.orderCreateScreen);
            }}
          />
        </View>
        {/* <View style={styles.orderListContentReportButtonBaseContainer}>
          <CustomButton
            title={`Download ${tabData[selectedTab - 1].title} Report`}
            backgroundColor={COLOR.baseColor}
            color={COLOR.whiteColor}
            onClick={() => {
              handleClick();
            }}
          />
        </View> */}
        <View style={styles.orderListContentTabBaseContainer}>
          <CustomTab
            data={tabData}
            selected={selectedTab}
            onPress={(value: any) => setSelectedTab(value)}
          />
        </View>
        <View style={styles.orderListContentListBaseContainer}>
          {loader ? (
            <View style={styles.orderListContentListLoaderBaseContainer}>
              <ActivityIndicator color={COLOR.baseColor} size={30} />
            </View>
          ) : (
            <View style={styles.orderListContentListContainer}>
              {selectedOrderData && selectedOrderData.length > 0 ? (
                <FlatList
                  data={selectedOrderData}
                  renderItem={({item}) => <Item item={item} />}
                  keyExtractor={item => item?.id}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={
                    styles.orderListContentFlatlistContainer
                  }
                  refreshControl={
                    <RefreshControl
                      refreshing={isRefreshing}
                      onRefresh={onRefresh}
                      colors={[COLOR.baseColor]}
                      tintColor={COLOR.baseColor}
                    />
                  }
                />
              ) : (
                <View style={[{justifyContent: 'center'}, paddingVertical4]}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 16,
                      color: COLOR.placeholderColor,
                    }}>
                    No Data Available
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  orderListBaseContainer: {
    flex: 1,
  },
  orderListHeaderBaseContainer: {
    flex: 0.15,
  },
  orderListContentBaseContainer: {
    position: 'relative',
    flex: 1,
    paddingTop: 50,
    backgroundColor: COLOR.whiteColor,
    gap: 20,
  },
  orderListContentSearchBaseContainer: {
    zIndex: 10,
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    padding: 20,
  },
  orderListAddOrderButtonBaseContainer: {
    position: 'absolute',
    right: 20,
    bottom: DIMENSIONS.height / 9,
    zIndex: 10,
  },
  orderListContentReportButtonBaseContainer: {
    paddingHorizontal: 20,
  },
  orderListContentTabBaseContainer: {
    paddingHorizontal: 20,
  },
  orderListContentListLoaderBaseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderListContentListContainer: {
    flex: 1,
  },
  orderListContentListBaseContainer: {
    flex: 1,
  },
  orderListContentFlatlistContainer: {
    paddingHorizontal: 20,
    gap: 20,
    paddingBottom: 60,
  },
  orderListItemBaseContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: COLOR.whiteColor,
    borderWidth: 1,
    borderColor: `${COLOR.placeholderColor}44`,
    borderRadius: 15,
    gap: 20,
    elevation: 10,
    shadowColor: COLOR.placeholderColor,
  },
  orderListItemDetailsBaseContainer: {
    flex: 2,
  },
  orderListItemDetailsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderListItemHeaderText: {
    color: COLOR.placeholderColor,
  },
  orderListItemContentText: {
    color: COLOR.blackColor,
    fontWeight: 'bold',
  },
  orderListItemImageBaseContainer: {
    flex: 1,
    backgroundColor: COLOR.lightGreyColor,
    borderRadius: 10,
  },
});

export default memo(OrderList);
