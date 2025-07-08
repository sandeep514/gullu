import React, {memo, useEffect, useState} from 'react';

import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  height10,
  height4,
  padding10,
  padding20,
  gulluColor,
  primaryGulluLightBackgroundColor,
  justifyContentCenter,
  flexDirectionRow,
  paddingVertical1,
  paddingVertical5,
  fontWeightBold,
  paddingHorizontal20,
  paddingVertical10,
} from '../assets/styles';
import {Icon} from '@rneui/themed';
import NetworkSpeed from 'react-native-network-speed';
import NetInfo, {NetInfoStateType} from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLOR from '../config/color';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import CustomButton from './CustomButton';
import ROUTES from '../config/routes';
import LOCALSTORAGE from '../config/localStorage';
import DIMENSIONS from '../config/dimensions';

function HeaderComponent({navigation, isHomeScreen}: any): JSX.Element {
  const [currentUploadingSpeed, setCurrentUploadingSpeed] = useState();
  const [networkConnection, setNetworkConnection] =
    useState<NetInfoStateType>();
  const [role, setRole] = useState<String | null>('');
  const [userName, setUserName] = useState<String | null>('');
  useEffect(() => {
    AsyncStorage.multiGet([LOCALSTORAGE.NAME, LOCALSTORAGE.ROLE])
      .then(results => {
        const name = results[0][1];
        const role = results[1][1];
        setUserName(name);
        setRole(role);
      })
      .catch(error => {
        console.error('Error getting data from AsyncStorage', error);
      });
    NetInfo.addEventListener(change => {
      setNetworkConnection(change.type);
    });
  }, []);

  const IoniconsIcon = Ionicons as unknown as React.ComponentType<any>;
  const MaterialIconsIcon =
    MaterialIcons as unknown as React.ComponentType<any>;
  const FeatherIcon = Feather as unknown as React.ComponentType<any>;

  const handleLogout = () => {
    AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{name: ROUTES.loginScreen as never}],
    });
  };

  const handleGalleryOpen = () => {
    navigation.navigate(ROUTES.galleryScreen as never);
  };

  return (
    <View style={[styles.headerBaseContainer]}>
      <View style={styles.headerUpperBaseContainer}>
        <LinearGradient
          colors={[`${COLOR.whiteColor}22`, COLOR.transparentColor]}
          style={styles.headerUpperContainer}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
        />
        <LinearGradient
          colors={[COLOR.transparentColor, `${COLOR.whiteColor}22`]}
          style={styles.headerUpperContainer}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
        />
      </View>
      <View style={[styles.headerContentBaseContainer]}>
        <View
          style={[
            styles.headerContentNetworkBaseContainer,
            {
              alignItems: isHomeScreen ? 'center' : 'flex-start',
            },
          ]}>
          <Text style={styles.headerContentNetworkText}>
            {networkConnection === 'cellular' ? 'Mobile Data: ' : 'Wifi: '}
            <Text style={{fontWeight: 'bold', textTransform: 'capitalize'}}>
              {networkConnection === 'cellular'
                ? 'Low internet quality'
                : 'Good internet quality'}
            </Text>
          </Text>
          <View style={styles.headerContentNetworkIconContainer}>
            {networkConnection === 'cellular' ? (
              <MaterialIconsIcon
                name="signal-cellular-connected-no-internet-4-bar"
                size={20}
                color={COLOR.whiteColor}
              />
            ) : (
              <IoniconsIcon
                name="wifi"
                size={DIMENSIONS.width / 25}
                color={COLOR.whiteColor}
              />
            )}
          </View>
        </View>
        {isHomeScreen && (
          <View style={styles.headerContentUserBaseContainer}>
            <View style={styles.headerContentUserDetailsBaseContainer}>
              <Text style={styles.headerContentUserDetailsText}>
                Hello there,{' '}
                <Text style={{fontWeight: 'bold', textTransform: 'capitalize'}}>
                  {userName}
                </Text>
              </Text>
            </View>
            <View style={styles.headerContentUserButtonBaseContainer}>
              <CustomButton
                iconName="image"
                iconPadding={5}
                IconComponent={FeatherIcon}
                iconSize={20}
                iconColor={COLOR.whiteColor}
                backgroundColor={COLOR.transparentColor}
                onClick={handleGalleryOpen}
              />
              <CustomButton
                iconName="logout"
                iconColor={COLOR.redColor}
                IconComponent={MaterialIconsIcon}
                backgroundColor={COLOR.whiteColor}
                color={COLOR.baseColor}
                onClick={handleLogout}
              />
            </View>
          </View>
        )}
      </View>
    </View>
    // <View style={{}}>
    //   <View
    //     style={[
    //       {
    //         backgroundColor:
    //           networkConnection == 'cellular' ? 'red' : 'lightgreen',
    //         width: '100%',
    //       },
    //       justifyContentCenter,
    //       flexDirectionRow,
    //     ]}>
    //     {/* <Text style={[{color: '#fff'},paddingVertical1]}>{(networkConnection == 'cellular')? "Mobile Data: " : 'Wifi: '} </Text> */}
    //     <Text
    //       style={[
    //         {color: networkConnection == 'cellular' ? '#fff' : gulluColor},
    //         paddingVertical1,
    //         fontWeightBold,
    //       ]}>
    //       {networkConnection == 'cellular'
    //         ? 'Low internet quality'
    //         : 'Good internet quality'}{' '}
    //       - {networkConnection == 'cellular' ? 'Mobile Data' : 'Wifi'}
    //     </Text>
    //   </View>

    //   <View style={[{}, paddingHorizontal20, paddingVertical10]}>
    //     <View style={[{flexDirection: 'row', justifyContent: 'space-between'}]}>
    //       <Pressable
    //         style={{paddingHorizontal: 10}}
    //         onPress={() => {
    //           navigation.goBack();
    //         }}>
    //         <Image
    //           source={require('../assets/images/back-arrow-1767523-1502427.png')}
    //           style={{height: 20, width: 15}}
    //         />
    //       </Pressable>
    //       <Text
    //         style={{
    //           color: gulluColor,
    //           fontSize: 17,
    //           textTransform: 'capitalize',
    //         }}>
    //         {title}
    //       </Text>
    //       {role != undefined && role == '1' ? (
    //         <Pressable
    //           style={{}}
    //           onPress={() => {
    //             navigation.push('Gallery');
    //           }}>
    //           <Image
    //             source={require('../assets/images/gallery.png')}
    //             style={{height: 35, width: 35}}
    //           />
    //         </Pressable>
    //       ) : (
    //         <View></View>
    //       )}
    //     </View>
    //   </View>
    // </View>
  );
}

export default memo(HeaderComponent);

const styles = StyleSheet.create({
  headerBaseContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
    backgroundColor: COLOR.baseColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerUpperBaseContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  headerUpperContainer: {
    flex: 1,
  },
  headerContentBaseContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContentNetworkBaseContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  headerContentNetworkText: {
    color: COLOR.whiteColor,
    fontSize: DIMENSIONS.width / 35,
  },
  headerContentNetworkIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContentUserBaseContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  headerContentUserDetailsBaseContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContentUserDetailsText: {
    fontSize: 20,
    color: COLOR.whiteColor,
  },
  headerContentUserButtonBaseContainer: {
    flex: 1,
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
