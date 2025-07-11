import React, {memo, useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  ActivityIndicator,
  useColorScheme,
  Pressable,
  View,
  Touchable,
  TouchableOpacity,
  RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';

import HeaderComponent from '../components/HeaderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getSalesmanList} from '../services/services';
import InputComponents from '../components/InputComponents';
import COLOR from '../config/color';
import CustomButton from '../components/CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ROUTES from '../config/routes';
import DIMENSIONS from '../config/dimensions';
import LOCALSTORAGE from '../config/localStorage';
import Toast from 'react-native-toast-message';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function SalesmanList({navigation}: any): JSX.Element {
  const [isLoading, setIsLoading] = useState(true);
  const [searchableData, setSearchableData] = useState([]);
  const [search, setSearch] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const IoniconsIcon = Ionicons as unknown as React.ComponentType<any>;

  useEffect(() => {
    getSalesmanListData();
  }, []);

  useEffect(() => {
    searchOrder(search);
  }, [search]);
  const getSalesmanListData = () => {
    setIsLoading(true);
    try {
      AsyncStorage.getItem(LOCALSTORAGE.ID)
        .then(async id => {
          await getSalesmanList('salesman', id)
            .then(res => {
              if (res.data.status) {
                setIsLoading(false);
                setData(res.data.data);
                setSearchableData(res.data.data);
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: res.data.message,
                });
                setIsLoading(false);
                setData([]);
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
  };

  const searchOrder = (search: any) => {
    let newSearchableArray: any = [];
    data.filter(list => {
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

  const onRefresh = () => {
    setIsRefreshing(true);
    getSalesmanListData();
    setIsRefreshing(false);
  };

  const Item = ({item}: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        navigation.push(ROUTES.salesmanEditScreen, {salesmanId: item.id});
      }}
      style={styles.salesmanListItemBaseContainer}>
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
    <SafeAreaView style={styles.salesmanListBaseContainer}>
      <View style={styles.salesmanListHeaderBaseContainer}>
        <HeaderComponent />
      </View>
      <View style={styles.salesmanListContentBaseContainer}>
        <View style={styles.salesmanListContentSearchContainer}>
          <InputComponents
            placeholder={'Search Salesman'}
            backgroundColor={COLOR.whiteColor}
            borderInclude={false}
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
        <View style={styles.salesmanListContentButtonContainer}>
          <CustomButton
            IconComponent={IoniconsIcon}
            iconName="add-outline"
            iconColor={COLOR.baseColor}
            radius={60}
            backgroundColor={`${COLOR.whiteColor}`}
            iconSize={30}
            elevation={true}
            onClick={() => {
              navigation.push(ROUTES.salesmanCreateScreen);
            }}
          />
        </View>
        <View style={styles.salesmanListContentContainer}>
          {isLoading ? (
            <View style={styles.salesmanListLoaderContainer}>
              <ActivityIndicator color={COLOR.baseColor} size={30} />
            </View>
          ) : (
            <View style={styles.salesmanListContentContainer}>
              <FlatList<{id: any}>
                contentContainerStyle={styles.salesmanListContainer}
                data={search ? searchableData : data}
                renderItem={({item}) => <Item item={item} />}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    onRefresh={onRefresh}
                    refreshing={isRefreshing}
                    colors={[COLOR.baseColor]}
                    tintColor={COLOR.baseColor}
                  />
                }
              />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  salesmanListBaseContainer: {
    flex: 1,
  },
  salesmanListHeaderBaseContainer: {
    flex: 0.15,
  },
  salesmanListContentBaseContainer: {
    flex: 1,
  },
  salesmanListContentSearchContainer: {
    position: 'absolute',
    padding: 20,
    left: 0,
    right: 0,
    top: -50,
    zIndex: 10,
  },
  salesmanListContentButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: DIMENSIONS.height / 9,
    zIndex: 10,
  },
  salesmanListContentContainer: {
    flex: 1,
  },
  salesmanListContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 80,
    gap: 10,
  },
  salesmanListLoaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  salesmanListItemBaseContainer: {
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

export default memo(SalesmanList);
