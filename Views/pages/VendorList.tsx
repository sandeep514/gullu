import React, { useEffect, useState } from 'react';
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
  ActivityIndicator
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { cardBackgroundColor, h1, h2, h3, height10, height100, height20, height50, height6, height80, height85, height9, height90, padding20, primaryBackgroundColor, screenheight, secondaryBackgroundColor, textAlignCenter } from '../assets/styles';
import InputConponents from '../components/InputComponents';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from '../services/services';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


function VendorList({navigation}): JSX.Element {
	const isDarkMode = useColorScheme() === 'dark';
	const [ DATA , SetData ] = useState();
	const [ activityIndicator , setActivityIndicator ] = useState(false);
  	useEffect(()=> {
		
	} , [])
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};
	useEffect(() => {
		getVendorList();
	} , []);
	const getVendorList = () => {
		setActivityIndicator(true)

		AsyncStorage.getItem('api_token').then((token) => {
			let postedData = { role: 'vendor',api_token : token};
			get('users/get' , postedData).then((res) => {
				setActivityIndicator(false)

				SetData(res.data.data.data);
				
			}).catch((err) => {
				console.log(err)
				setActivityIndicator(false)

			});

		}).catch((err) => {

		});
	}
	
	const Item = ({item}:any) => (
		<Pressable onPress={() => {navigation.navigate('vendorEdit' , {vendorId : item.id})}} style={styles.item}>
			<Text style={[{},h3]}>{item.name}</Text>
			<Text style={[{},h3]}>{item.phone}</Text>
		</Pressable>
	);
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
        <View style={[{},height100 ,primaryBackgroundColor,{}]}>
			<View style={[{} , height100]}>
				<View style={[{},height6]}>
                    <HeaderComponent navigation={navigation} title="Vendor List" />
                </View>
				<View style={[{} , height85]} >
					{(activityIndicator)? 
						<ActivityIndicator color="white" size={20}></ActivityIndicator>
					:
						<FlatList
							data={DATA}
							renderItem={({item}) => <Item item={item} />}
							keyExtractor={item => item.id}
							showsVerticalScrollIndicator={false}
						/>
					}
					
				</View>
				<View style={[{},height9]}>
					<FooterComponent navigation={navigation} />
				</View>
			</View>
		</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  marginTop: StatusBar.currentHeight || 0,
	},
	item: {
	  backgroundColor: secondaryBackgroundColor,
	  padding: 15,
	  marginVertical: 8,
	  marginHorizontal: 16,
	  borderRadius: 10
	},
  });

export default VendorList;