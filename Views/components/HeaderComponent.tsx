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

function HeaderComponent({title, navigation}: any): JSX.Element {
  const [currentUploadingSpeed, setCurrentUploadingSpeed] = useState();
  const [networkConnection, setNetworkConnection] =
    useState<NetInfoStateType>();
  const [role, setRole] = useState<String | null>('');
  useEffect(() => {
    AsyncStorage.getItem('role')
      .then(roleId => {
        setRole(roleId);
      })
      .catch(err => {
        // console.log(err);
      });
  }, []);
  // const [currentUploadingSpeed , setCurrentUploadingSpeed] = useState();
  useEffect(() => {
    NetInfo.addEventListener(change => {
      setNetworkConnection(change.type);
    });
  }, []);
  return (
    <View style={styles.headerBaseContainer}>
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
      <View style={styles.headerContentBaseContainers}></View>
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
    position: 'relative',
    height: 80,
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
  headerContentBaseContainers: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
