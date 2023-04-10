import React, { useEffect } from 'react';

import {
    Image,
  Pressable,
  Text,
  TextInput, View,
} from 'react-native';
import { height10, height4, padding10, padding20,gulluColor } from '../assets/styles';
import { Icon } from '@rneui/themed';

function HeaderComponent( {title , navigation} ): JSX.Element {
    return (
        <View style={[{},padding20]}>
            <View style={[{flexDirection: 'row',justifyContent: 'space-between'}]}>
                <Pressable style={{ paddingHorizontal: 10}} onPress={() => { navigation.goBack() }}>
                    <Image source={require('../assets/images/back-arrow-1767523-1502427.png')} style={{ height: 20,width: 15 }} />
                </Pressable>
                <Text style={{ color: gulluColor , fontSize: 17 , textTransform: 'capitalize' }}>{title}</Text>
                <Pressable style={{paddingHorizontal: 10}} onPress={() => {navigation.push('Home')}}>
                    <Image source={require('../assets/images/home-2456658-2036112.png')} style={{ height: 25,width: 25 }} />
                </Pressable>
            </View>
        </View>
    );
}

export default HeaderComponent;
