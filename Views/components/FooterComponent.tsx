import AsyncStorage from '@react-native-async-storage/async-storage';
import React,{ useEffect, useState,memo } from 'react';

import { Image, Pressable, Text, View } from 'react-native';
import { gulluColor, h5, margin10, padding10, textAlignCenter } from '../assets/styles';


function FooterComponent( {navigation}): JSX.Element {
    const [role , setRole] = useState();
    useEffect(() => {
        AsyncStorage.getItem('role').then((roleId) => {
			setRole(roleId);
		}).catch((err) =>{
			// console.log(err);
		})
    } , []);

    const goTo = (redirectedURL) => {
        // console.log(redirectedURL);
        navigation.navigate(redirectedURL)
    }
    return (
        <View style={[{ backgroundColor: gulluColor,borderRadius: 10},padding10,margin10]}>
            <View style={[{flexDirection: 'row',justifyContent: 'space-between'}]}>
                <Pressable style={[{alignItems:'center'}]} onPress={() => { goTo('Home')}}>
                    <Image source={require('../assets/images/NicePng_logo-instagram-blanco-png_3953291.png')} style={{ height: 20,width: 20 }} />
                    <Text style={[{color: 'white'},h5,textAlignCenter]}>Home</Text>
                </Pressable>

                {(role != undefined && role == 1)?
                    <Pressable style={[{alignItems:'center'}]} onPress={() => { goTo('orderlist') }}>
                        <Image source={require('../assets/images/list.png')} style={{ height: 20,width: 20 }} />
                        <Text style={[{color: 'white'},h5,textAlignCenter]}>Order</Text>
                    </Pressable>
                     :
                     null
                 }
                {(role != undefined && role == 1)?  
                    <Pressable style={[{alignItems:'center'}]} onPress={() => { goTo('vendorlist') }}>
                        <Image source={require('../assets/images/list.png')} style={{ height: 20,width: 20 }} />
                        <Text style={[{color: 'white'},h5,textAlignCenter]}>Vendor</Text>
                    </Pressable>
                    :
                    null
                }
                {(role != undefined && role == 1)?
                    <Pressable style={[{alignItems:'center'}]} onPress={() => { goTo('salesmanlist') }}>
                        <Image source={require('../assets/images/list.png')} style={{ height: 20,width: 20 }} />
                        <Text style={[{color: 'white'},h5,textAlignCenter]}>Salesman</Text>
                    </Pressable>
                    :
                    null
                }


                <Pressable style={[{alignItems:'center'}]} onPress={() => { AsyncStorage.clear(), navigation.push('login') }}>
                    <Image source={require('../assets/images/logout.png')} style={{ height: 20,width: 20 }} />
                    <Text style={[h5,{color: 'red'},textAlignCenter]}>Logout</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default memo(FooterComponent);
