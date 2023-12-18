import React, { memo, useEffect, useState } from 'react';

import {
    Image,
  Pressable,
  Text,
  TextInput, View,
} from 'react-native';
import { height10, height4, padding10, padding20,gulluColor, primaryGulluLightBackgroundColor, justifyContentCenter, flexDirectionRow, paddingVertical1, paddingVertical5, fontWeightBold, paddingHorizontal20, paddingVertical10 } from '../assets/styles';
import { Icon } from '@rneui/themed';
import NetworkSpeed from 'react-native-network-speed';
import NetInfo from "@react-native-community/netinfo";

function HeaderComponent( {title , navigation} ): JSX.Element {
    const [currentUploadingSpeed , setCurrentUploadingSpeed] = useState();
    const [networkConnection , setNetworkConnection] = useState();
    // const [currentUploadingSpeed , setCurrentUploadingSpeed] = useState();
    useEffect(() => {
        // NetInfo.fetch().then(state => {
		// 	console.log(state);
		// 	// setNetworkType(state.type);
        // });
        NetInfo.addEventListener((change) => {
            setNetworkConnection(change.type);
            // console.log('change');
            // console.log(change);
        });
        //  start
		//  NetworkSpeed.startListenNetworkSpeed(({downLoadSpeed,downLoadSpeedCurrent,upLoadSpeed,upLoadSpeedCurrent}) => {
		// 	console.log(downLoadSpeed + 'kb/s') 
		// 	console.log(downLoadSpeedCurrent + 'kb/s') 
		// 	console.log(upLoadSpeed + 'kb/s') 
		// 	console.log(upLoadSpeedCurrent + 'kb/s') 
		// 	// setCurrentUploadingSpeed(upLoadSpeedCurrent + 'kb/s') 
		// 	// console.log(upLoadSpeed);
		// 	// console.log(upLoadSpeedCurrent);
		// })
    } , []);
    return (
        <View style={{}}>
                <View style={[{backgroundColor: (networkConnection == 'cellular')? 'red' : 'lightgreen',width: '100%'},justifyContentCenter,flexDirectionRow]}>
                    {/* <Text style={[{color: '#fff'},paddingVertical1]}>{(networkConnection == 'cellular')? "Mobile Data: " : 'Wifi: '} </Text> */}
                    <Text style={[{color: (networkConnection == 'cellular')? '#fff' : gulluColor},paddingVertical1,fontWeightBold]}>{(networkConnection == 'cellular')? "Low internet quality" : 'Good internet quality'} - {(networkConnection == 'cellular')? "Mobile Data" : 'Wifi'}</Text>
                </View>
           
            <View style={[{},paddingHorizontal20,paddingVertical10]}>
                <View style={[{flexDirection: 'row',justifyContent: 'space-between'}]}>
                    <Pressable style={{ paddingHorizontal: 10}} onPress={() => { navigation.goBack() }}>
                        <Image source={require('../assets/images/back-arrow-1767523-1502427.png')} style={{ height: 20,width: 15 }} />
                    </Pressable>
                    <Text style={{ color: gulluColor , fontSize: 17 , textTransform: 'capitalize' }}>{title}</Text>
                    <Pressable style={{}} onPress={() => {navigation.push('Gallery')}}>
                        <Image source={require('../assets/images/gallery.png')} style={{ height: 35,width: 35 }} />
                    </Pressable>
                   
                </View>
            </View>
        </View>
        
    );
}

export default memo(HeaderComponent);