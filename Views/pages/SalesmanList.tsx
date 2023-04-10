import React, { useEffect, useState } from 'react';
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
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { h3, height100, height6, height85, height9, primaryBackgroundColor, primaryColor, secondaryBackgroundColor, textAlignCenter,gulluColor,primaryGulluLightBackgroundColor} from '../assets/styles';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from '../services/services';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


function SalesmanList({navigation}): JSX.Element {
	const [ activityIndicator , setActivityIndicator ] = useState(false);

  	const isDarkMode = useColorScheme() === 'dark';
	const [ DATA , SetData ] = useState();
  	useEffect(()=> {
		
	} , [])
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};
	useEffect(() => {
		getSalesmanList();
		console.log("ujk");
	} , []);
	const getSalesmanList = () => {
		setActivityIndicator(true)

		AsyncStorage.getItem('api_token').then((token) => {
			let postedData = { role: 'salesman',api_token : token};
			get('users/get' , postedData).then((res) => {
				setActivityIndicator(false)

				SetData(res.data.data.data);
			}).catch((err) => {
				setActivityIndicator(false)

				// console.log(err)
			});

		}).catch((err) => {

		});
	}
	
	const Item = ({item}:any) => (
		<Pressable onPress={() => {navigation.push('salesmanEdit' , {salesmanId : item.id})}}  style={styles.item}>
			<Text style={[{},h3]}>{item.name}</Text>
			<Text style={[{},h3]}>{item.phone}</Text>
		</Pressable>
	);
  return (
    <SafeAreaView style={{backgroundColor: '#ededed'}}>
			<StatusBar
				backgroundColor={gulluColor}
			/>
			<View style={[height100, primaryGulluLightBackgroundColor]}>
			<View style={[{} , height100]}>
				<View style={[{},height6]}>
                    <HeaderComponent navigation={navigation} title="Salesman List" />
                </View>
				<View style={[{} , height85]} >
				{(activityIndicator)? 
					<ActivityIndicator color={gulluColor} size={20}></ActivityIndicator>
				:
					<FlatList
						data={DATA}
						renderItem={({item}) => <Item item={item} />}
						keyExtractor={item => item.id}
						showsVerticalScrollIndicator={false}
					/>
				}
				<Pressable onPress={() => { navigation.push('SalesmanCreate') }} style={[{backgroundColor: secondaryBackgroundColor,height: 70 ,width: 70,padding: 0,margin:0 ,borderRadius: 100,right: 10,position: 'absolute',bottom: 0,borderColor: primaryColor ,borderWidth: 5}]}>
					<Text style={[{fontSize: 50,padding: 0,margin: 0,top: -5}, textAlignCenter]}>+</Text>
				</Pressable>
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

export default SalesmanList;