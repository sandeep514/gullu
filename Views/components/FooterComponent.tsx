import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

import {
    Image,
  Pressable,
  Text,
  TextInput, View,
} from 'react-native';
import { gulluColor, h4, h5, height10, height4, justifyContentCenter, margin10, padding10, primaryGulluBackgroundColor, secondaryBackgroundColor, textAlignCenter } from '../assets/styles';


function FooterComponent( {navigation}): JSX.Element {
    const [role , setRole] = useState();
    useEffect(() => {
        AsyncStorage.getItem('role').then((roleId) => {
			setRole(roleId);
		}).catch((err) =>{
			// console.log(err);
		})
    } , []);
    return (
        <View style={[{ backgroundColor: gulluColor,borderRadius: 10},padding10,margin10]}>
            <View style={[{flexDirection: 'row',justifyContent: 'space-between'}]}>
                <Pressable style={[{alignItems:'center'}]} onPress={() => {navigation.push('Home')}}>
                    <Image source={require('../assets/images/NicePng_logo-instagram-blanco-png_3953291.png')} style={{ height: 20,width: 20 }} />
                    <Text style={[{color: 'white'},h5,textAlignCenter]}>Home</Text>
                </Pressable>

                {(role != undefined && role == 1)?
                    <Pressable style={[{alignItems:'center'}]} onPress={() => { navigation.push('orderlist') }}>
                        <Image source={require('../assets/images/list.png')} style={{ height: 20,width: 20 }} />
                        <Text style={[{color: 'white'},h5,textAlignCenter]}>Order</Text>
                    </Pressable>
                     :
                     null
                 }
                {(role != undefined && role == 1)?  
                    <Pressable style={[{alignItems:'center'}]} onPress={() => { navigation.push('vendorlist') }}>
                        <Image source={require('../assets/images/list.png')} style={{ height: 20,width: 20 }} />
                        <Text style={[{color: 'white'},h5,textAlignCenter]}>Vendor</Text>
                    </Pressable>
                    :
                    null
                }
                {(role != undefined && role == 1)?
                    <Pressable style={[{alignItems:'center'}]} onPress={() => { navigation.push('salesmanlist') }}>
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

export default FooterComponent;
