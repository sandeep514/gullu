import React, {memo, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  cardBackgroundColor,
  gulluColor,
  h1,
  h2,
  h3,
  height10,
  height100,
  height15,
  height20,
  height50,
  height6,
  height8,
  height80,
  height83,
  height85,
  height9,
  height90,
  inputStyleBlack,
  padding20,
  primaryBackgroundColor,
  primaryColor,
  primaryGulluLightBackgroundColor,
  screenheight,
  secondaryBackgroundColor,
  textAlignCenter,
} from '../assets/styles';
import InputComponents from '../components/InputComponents';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {get, getVendorList} from '../services/services';
import COLOR from '../config/color';
import Toast from 'react-native-toast-message';
import LOCALSTORAGE from '../config/localStorage';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function VendorList({navigation}: any): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  // const [DATA, SetData] = useState();
  const [search, setSearch] = useState('');
  const [vendorData, setVendorData] = useState([]);
  const [searchableData, setSearchableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getVendorListData();
  }, []);

  useEffect(() => {
    searchOrder(search);
  }, [search]);

  const getVendorListData = () => {
    setIsLoading(true);
    try {
      AsyncStorage.getItem(LOCALSTORAGE.ID).then(async id => {
        await getVendorList('vendor', id)
          .then(res => {
            if (res.data.status) {
              setIsLoading(false);
              setVendorData(res.data.data);
              setSearchableData(res.data.data);
            } else {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: res.data.message,
              });
              setIsLoading(false);
              setVendorData([]);
              setSearchableData([]);
            }
          })
          .catch(err => {
            setIsLoading(false);
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Something went wrong',
            });
            setVendorData([]);
            setSearchableData([]);
          });
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong',
      });
      setIsLoading(false);
      setVendorData([]);
      setSearchableData([]);
    }
  };

  const searchOrder = (search: string) => {
    let newSearchableArray: any = [];
    vendorData.filter(list => {
      let searchableLowercase: any;
      let salesman: any = list?.name;
      if (salesman != undefined) {
        searchableLowercase = salesman.toLowerCase();
        if (searchableLowercase.includes(search.toLowerCase())) {
          newSearchableArray.push(list);
        }
      }
    });

    setSearchableData(newSearchableArray);
  };

  const Item = ({item}: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        navigation.push('vendorEdit', {vendorId: item.id});
      }}
      style={styles.vendorListItemBaseContainer}>
      <View style={styles.vendorListItemHeaderBaseContainer}>
        <Text style={styles.vendorListItemHeaderText}>Name</Text>
        <Text style={styles.vendorListItemContentText}>
          {item.name || 'NA'}
        </Text>
      </View>
      <View style={styles.vendorListItemContentBaseContainer}>
        <Text style={styles.vendorListItemHeaderText}>Mobile</Text>
        <Text style={styles.vendorListItemContentText}>
          {item.phone || 'NA'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.vendorBaseContainer}>
      <View style={styles.vendorHeaderBaseContainer}>
        <HeaderComponent />
      </View>
      <View style={styles.vendorContentBaseContainer}>
        <View style={styles.vendorContentSearchBaseContainer}>
          <InputComponents
            backgroundColor={COLOR.whiteColor}
            borderInclude={false}
            placeholder="Search Vendors"
            value={search}
            onChangeText={(text: any) => {
              setSearch(text);
            }}
          />
        </View>
        <View style={styles.vendorContentListBaseContainer}>
          {isLoading ? (
            <View style={styles.vendorContentLoaderBaseContainer}>
              <ActivityIndicator size={30} color={COLOR.baseColor} />
            </View>
          ) : (
            <View style={styles.vendorContentListBaseContainer}>
              {vendorData && vendorData.length > 0 ? (
                <FlatList<{id: any}>
                  data={search ? searchableData : vendorData}
                  renderItem={Item}
                  keyExtractor={item => item.id}
                  contentContainerStyle={styles.vendorContentList}
                />
              ) : (
                <View style={styles.vendorContentLoaderBaseContainer}>
                  <Text style={styles.vendorContentNoDataText}>
                    No Vendors Found
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
    // <SafeAreaView style={{backgroundColor: '#ededed'}}>
    //   <StatusBar backgroundColor={gulluColor} />
    //   <View style={[height100, primaryGulluLightBackgroundColor]}>
    //     <View style={[{}, height100]}>
    //       <View style={[{}, height8]}>
    //         <HeaderComponent navigation={navigation} title="Vendor List" />
    //       </View>
    //       <View style={[{}, height83]}>
    //         <View style={[{}, height15]}>
    //           <InputComponents
    //             placeholder="Search Vendor"
    //             style={[{}, inputStyleBlack]}
    //             inputValue={(value: any) => {
    //               searchOrder(value);
    //             }}
    //           />
    //         </View>
    //         {activityIndicator ? (
    //           <ActivityIndicator
    //             color={gulluColor}
    //             size={20}></ActivityIndicator>
    //         ) : (
    //           <FlatList
    //             data={DATA}
    //             renderItem={({item}) => <Item item={item} />}
    //             keyExtractor={item => item.id}
    //             showsVerticalScrollIndicator={false}
    //           />
    //         )}
    //         <Pressable
    //           onPress={() => {
    //             navigation.push('vendorcreate');
    //           }}
    //           style={[
    //             {
    //               backgroundColor: secondaryBackgroundColor,
    //               height: 70,
    //               width: 70,
    //               padding: 0,
    //               margin: 0,
    //               borderRadius: 100,
    //               right: 10,
    //               position: 'absolute',
    //               bottom: 0,
    //               borderColor: primaryColor,
    //               borderWidth: 5,
    //             },
    //           ]}>
    //           <Text
    //             style={[
    //               {fontSize: 50, padding: 0, margin: 0, top: -5},
    //               textAlignCenter,
    //             ]}>
    //             +
    //           </Text>
    //         </Pressable>
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
  vendorBaseContainer: {
    flex: 1,
  },
  vendorHeaderBaseContainer: {
    flex: 0.15,
  },
  vendorContentBaseContainer: {
    flex: 1,
  },
  vendorContentSearchBaseContainer: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    padding: 20,
    zIndex: 10,
  },
  vendorContentListBaseContainer: {
    flex: 1,
  },
  vendorContentList: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 50,
    gap: 10,
  },
  vendorContentLoaderBaseContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vendorContentNoDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLOR.placeholderColor,
    textTransform: 'capitalize',
  },
  vendorListItemBaseContainer: {
    backgroundColor: COLOR.whiteColor,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: `${COLOR.placeholderColor}44`,
    elevation: 10,
    shadowColor: COLOR.placeholderColor,
    gap: 8,
  },
  vendorListItemHeaderBaseContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  vendorListItemHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLOR.placeholderColor,
    textTransform: 'capitalize',
  },
  vendorListItemContentBaseContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  vendorListItemContentText: {
    fontSize: 12,
    color: COLOR.blackColor,
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: StatusBar.currentHeight || 0,
//   },
//   item: {
//     backgroundColor: '#fff',
//     padding: 10,
//     marginVertical: 4,
//     marginHorizontal: 16,
//     borderRadius: 10,
//   },
// });

export default memo(VendorList);
