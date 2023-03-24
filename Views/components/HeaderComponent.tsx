import React, { useEffect } from 'react';

import {
    Image,
  Pressable,
  Text,
  TextInput, View,
} from 'react-native';
import { height10, height4, padding10, padding20 } from '../assets/styles';


function HeaderComponent( {title , navigation} ): JSX.Element {
    return (
        <View style={[{},padding20,]}>
            <View style={[{flexDirection: 'row',justifyContent: 'space-between'}]}>
                <Pressable style={{}} onPress={() => { navigation.goBack() }}>
                    <Image source={require('../assets/images/NicePng_hamburger-menu-icon-png_2660273.png')} style={{ height: 20,width: 20 }} />
                </Pressable>
                <Text style={{ color: 'white' , fontSize: 20 , textTransform: 'capitalize' }}>{title}</Text>
                <Pressable style={{}} onPress={() => {}}>
                    <Image source={require('../assets/images/NicePng_logo-instagram-blanco-png_3953291.png')} style={{ height: 20,width: 20 }} />
                </Pressable>
            </View>
        </View>
    );
}

export default HeaderComponent;
