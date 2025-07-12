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
  RefreshControl,
  TouchableOpacity,
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
import COLOR from '../config/color';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomTab from '../components/CustomTab';
import Toast from 'react-native-toast-message';
import CustomButton from '../components/CustomButton';
import SmallButton from '../components/SmallButton';
import DIMENSIONS from '../config/dimensions';
import ROUTES from '../config/routes';

function Dashboard({navigation}: any) {
  const [loader, setLoader] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<String | null>();
  const [selectedOrderData, SetSelectedOrderData] = useState('');
  const [OriginalPending, setOriginalPending] = useState<any[]>([]);
  const [pending, setPending] = useState<any[]>([]);
  const [filterPendingOrders, setFilterPendingOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [ready, setReady] = useState({});
  const [delivered, setDelivered] = useState({});
  const [allOrdersList, setAllOrdersList] = useState([]);
  const [searchableData, setSearchableData] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState(1);
  const [contentCount, setContentCount] = useState(0);
  const IoniconsIcon = Ionicons as unknown as React.ComponentType<any>;
  const MaterialCommunityIconsIcon =
    MaterialCommunityIcons as unknown as React.ComponentType<any>;

  const tabData = [
    {
      title: 'All',
      value: 1,
      color: COLOR.blackColor,
    },
    {
      title: 'Crucial',
      value: 2,
      color: COLOR.redColor,
    },
    {
      title: 'Standard',
      value: 3,
      color: COLOR.yellowColor,
    },
    {
      title: 'Relaxed',
      value: 4,
      color: COLOR.greenColor,
    },
  ];

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

  const wait = (timeout: any) => {
    return new Promise<void>(resolve => setTimeout(resolve, timeout));
  };

  const shareOnWhatsapp = (item: any) => {
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

  const getImageData = (imagePath: any) => {
    return new Promise((resolve, reject) => {
      get(imagePath)
        .then(data => {
          // resolve{ uri : 'data:image/jpeg;base64,'+data.data };
        })
        .catch(error => {
          console.log(error);
        });
    });
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    getData();
    wait(2000).then(() => setIsRefreshing(false));
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(LOCALSTORAGE.ROLE)
      .then(roleId => {
        setRole(roleId);
      })
      .catch(err => {});
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [isFocused]);

  useEffect(() => {
    if (selectedTab == 1) {
      setFilterPendingOrders(pending);
    } else if (selectedTab == 2) {
      setFilterPendingOrders(pending.filter(item => item.pending_days < 10));
    } else if (selectedTab == 3) {
      setFilterPendingOrders(
        pending.filter(
          item => item?.pending_days <= 15 && item.pending_days >= 10,
        ),
      );
    } else if (selectedTab == 4) {
      setFilterPendingOrders(pending.filter(item => item?.pending_days > 15));
    }
  }, [selectedTab]);

  useEffect(() => {
    searchOrder(search);
  }, [search]);

  const getData = async () => {
    setIsLoading(true);
    try {
      AsyncStorage.getItem(LOCALSTORAGE.ID).then(async id => {
        await pendingOrders(id)
          .then(res => {
            if (res.data.status) {
              setPending(res.data.data);
              setOriginalPending(res.data.data);
              setFilterPendingOrders(res.data.data);
              setIsLoading(false);
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
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Something went wrong',
            });
            setIsLoading(false);
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
  };

  const searchOrder = (searchableText: any) => {
    if (searchableText.length > 0) {
      let newSearchableArray: any[] = [];
      let alreadyAvailableProductId: any[] = [];
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

  const shortnerURL = async (url: any) => {
    return url;

    const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
    const data = await response.json();
    console.log(data);
    return data.result.full_short_link;
  };

  const sliceString = (value: string) => {
    return value.length > 15 ? `${value.slice(0, 16)}...` : value;
  };

  const Item = ({item}: any) => {
    return (
      <TouchableOpacity
        style={styles.dashboardListItemBaseContainer}
        onPress={() => {
          navigation.push(ROUTES.orderEditScreen, {orderData: item});
        }}
        activeOpacity={0.9}>
        <View style={styles.dashboardListItemContentBaseContainer}>
          <View style={styles.dashboardListItemContentImageBaseContainer}>
            <View style={[styles.dashboardListItemContentImageContainer]}>
              <Image
                source={{
                  uri: imagePath + '' + item?.attachments[0]?.attachment,
                }}
                style={{
                  flex: 1,
                  backgroundColor: COLOR.lightGreyColor,
                }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.dashboardListItemContentImageDetailsContainer}>
              <View
                style={
                  styles.dashboardListItemContentImageDetailContentContainer
                }>
                <Text
                  style={[
                    styles.dashboardListItemContentImageDetailContentText,
                    {
                      fontWeight: 'bold',
                      color: COLOR.blackColor,
                    },
                  ]}>
                  {item.item.name ?? 'NA'}
                </Text>
                <Text
                  style={[
                    styles.dashboardListItemContentImageDetailContentText,
                    {
                      color: COLOR.redColor,
                    },
                  ]}>
                  {`${item.pending_days ?? '0'} Days Left!`}
                </Text>
              </View>
              <View
                style={
                  styles.dashboardListItemContentImageDetailContentContainer
                }>
                <Text
                  style={[
                    styles.dashboardListItemContentImageDetailContentText,
                  ]}>
                  Order ID #{`${item.order_number ?? 'NA'}`}
                </Text>
              </View>
              <View style={{height: 10}} />
              <View
                style={
                  styles.dashboardListItemContentImageDetailContentContainer
                }>
                <Text
                  style={[
                    styles.dashboardListItemContentImageDetailContentText,
                  ]}>
                  Color
                </Text>
                <Text
                  style={[
                    styles.dashboardListItemContentImageDetailContentText,
                    {color: COLOR.blackColor},
                  ]}>
                  {item.color ?? 'NA'}
                </Text>
              </View>
              <View
                style={
                  styles.dashboardListItemContentImageDetailContentContainer
                }>
                <Text
                  style={[
                    styles.dashboardListItemContentImageDetailContentText,
                  ]}>
                  Consultant
                </Text>
                <Text
                  style={[
                    styles.dashboardListItemContentImageDetailContentText,
                    {color: COLOR.blackColor},
                  ]}>
                  {item.salesman.name ?? 'NA'}
                </Text>
              </View>
              <View
                style={
                  styles.dashboardListItemContentImageDetailContentContainer
                }>
                <Text
                  style={[
                    styles.dashboardListItemContentImageDetailContentText,
                  ]}>
                  Vendor
                </Text>
                <Text
                  style={[
                    styles.dashboardListItemContentImageDetailContentText,
                    {color: COLOR.blackColor},
                  ]}>
                  {sliceString(item.vendor.name) ?? 'NA'}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.dashboardListItemContentDateBaseContainer}>
            <View style={styles.dashboardListItemContentDateContainer}>
              <Text style={styles.dashboardListItemContentDateHeaderText}>
                Ready Date
              </Text>
              <Text style={styles.dashboardListItemContentDateText}>
                {item.ready_date ?? 'NA'}
              </Text>
            </View>
            <View style={[styles.dashboardListItemContentDateContainer]}>
              <Text style={styles.dashboardListItemContentDateHeaderText}>
                Buffer Date
              </Text>
              <Text style={styles.dashboardListItemContentDateText}>
                {item.buffered_ready_date ?? 'NA'}
              </Text>
            </View>
            <View
              style={[
                styles.dashboardListItemContentDateContainer,
                {alignItems: 'flex-end'},
              ]}>
              <Text style={styles.dashboardListItemContentDateHeaderText}>
                Delivery Date
              </Text>
              <Text style={styles.dashboardListItemContentDateText}>
                {item.delivery_date ?? 'NA'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.dashboardListItemButtonBaseContainer}>
          <SmallButton
            title="Call Vendor"
            backgroundColor={COLOR.blackColor}
            color={COLOR.whiteColor}
            Icon={
              <IoniconsIcon
                name="call-outline"
                color={COLOR.whiteColor}
                size={15}
              />
            }
            onPress={() => {
              Linking.openURL('tel:' + item?.salesman.phone);
            }}
          />
          <SmallButton
            title="Whatsapp"
            backgroundColor={COLOR.greenColor}
            color={COLOR.whiteColor}
            Icon={
              <MaterialCommunityIconsIcon
                name="whatsapp"
                color={COLOR.whiteColor}
                size={15}
              />
            }
            onPress={() => {
              shareOnWhatsapp(item);
            }}
          />
        </View>
        <View
          style={[
            styles.dashboardListItemDot,
            {
              backgroundColor:
                selectedTab == 2
                  ? COLOR.redColor
                  : selectedTab == 3
                  ? COLOR.yellowColor
                  : selectedTab == 4
                  ? COLOR.greenColor
                  : COLOR.placeholderColor,
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.dashboardBaseContainer}>
      <View style={styles.dashboardHeaderBaseContainer}>
        <HeaderComponent navigation={navigation} isHomeScreen={true} />
      </View>
      <View style={styles.dashboardContentBaseContainer}>
        <View style={styles.dashboardContentSearchBaseContainer}>
          <InputComponents
            placeholder="Search Order"
            borderInclude={false}
            backgroundColor={COLOR.whiteColor}
            Icon={
              <IoniconsIcon
                name={'search'}
                size={20}
                color={COLOR.placeholderColor}
              />
            }
            value={search}
            onChangeText={(text: string) => {
              setSearch(text);
            }}
          />
        </View>
        {search == '' && (
          <>
            <View style={styles.dashboardContentSelectTabBaseContainer}>
              <CustomTab
                data={tabData}
                selected={selectedTab}
                onPress={(index: number) => {
                  setSelectedTab(index);
                }}
              />
            </View>
            <View style={styles.dashboardContentTitleHeaderBaseContainer}>
              <View style={styles.dashboardContentTitleHeaderContainer}>
                <Text style={styles.dashboardContentTitleText}>{`${
                  tabData.filter(item => item.value === selectedTab)[0].title
                } Pending Orders`}</Text>
              </View>
              <View style={styles.dashboardContentTitleCountContainer}>
                <Text style={styles.dashboardContentTitleCountText}>{`(${
                  search ? searchableData.length : filterPendingOrders.length
                })`}</Text>
              </View>
            </View>
          </>
        )}
        <View style={styles.dashboardContentListContainer}>
          {isLoading ? (
            <View style={styles.dashboardContentLoaderContainer}>
              <ActivityIndicator color={COLOR.baseColor} size={30} />
            </View>
          ) : (
            <FlatList<{id: any}>
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  tintColor={COLOR.baseColor}
                  colors={[COLOR.baseColor]}
                />
              }
              data={search ? searchableData : filterPendingOrders}
              renderItem={({item}) => <Item item={item} />}
              keyExtractor={item => item?.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.dashboardContentFlatlistContainer}
            />
          )}
        </View>
      </View>
      <View style={styles.dashboardListContentButtonContainer}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dashboardBaseContainer: {
    flex: 1,
    backgroundColor: COLOR.whiteColor,
  },
  dashboardHeaderBaseContainer: {
    flex: 0.25,
  },
  dashboardContentBaseContainer: {
    flex: 1,
    gap: 20,
  },
  dashboardListContentButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: DIMENSIONS.height / 9,
    zIndex: 10,
  },
  dashboardContentSearchBaseContainer: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  dashboardContentSelectTabBaseContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  dashboardContentTitleHeaderBaseContainer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dashboardContentTitleHeaderContainer: {},
  dashboardContentTitleText: {
    fontSize: 24,
    color: COLOR.blackColor,
  },
  dashboardContentTitleCountContainer: {},
  dashboardContentTitleCountText: {
    fontSize: 24,
    color: COLOR.redColor,
    fontWeight: 'bold',
  },
  dashboardContentListContainer: {
    flex: 1,
  },
  dashboardContentLoaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dashboardContentFlatlistContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    gap: 10,
  },
  dashboardListItemBaseContainer: {
    position: 'relative',
    backgroundColor: COLOR.whiteColor,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLOR.lightGreyColor,
    elevation: 15,
    gap: 10,
  },
  dashboardListItemContentBaseContainer: {
    gap: 10,
  },
  dashboardListItemContentImageBaseContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dashboardListItemContentImageContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  dashboardListItemContentImageDetailsContainer: {
    flex: 2,
  },
  dashboardListItemContentImageDetailContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dashboardListItemContentImageDetailContentText: {
    color: COLOR.placeholderColor,
  },
  dashboardListItemContentDateBaseContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dashboardListItemContentDateContainer: {
    flex: 1,
    gap: 4,
  },
  dashboardListItemContentDateHeaderText: {
    fontSize: 12,
    color: COLOR.placeholderColor,
  },
  dashboardListItemContentDateText: {
    fontSize: 14,
    color: COLOR.blackColor,
    fontWeight: 'bold',
  },
  dashboardListItemButtonBaseContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  dashboardListItemDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 100,
    backgroundColor: COLOR.placeholderColor,
    left: 10,
    top: 10,
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
