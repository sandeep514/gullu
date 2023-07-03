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
import { cardBackgroundColor, gulluColor, h1, h2, h3, height10, height100, height15, height20, height50, height6, height8, height80, height83, height85, height9, height90, inputStyleBlack, padding20, primaryBackgroundColor, primaryColor, primaryGulluLightBackgroundColor, screenheight, secondaryBackgroundColor, textAlignCenter } from '../assets/styles';
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
	const [ origianlData , SetOrigianlData ] = useState([]);
	const [searchableData, setSearchableData] = useState([]);

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

		AsyncStorage.getItem('id').then((token) => {
			let postedData = { role: 'vendor',api_token : token};
			get('users/get' , postedData).then((res) => {
				setActivityIndicator(false)

				SetData(res.data.data.data);
				SetOrigianlData(res.data.data.data);
				
			}).catch((err) => {
				console.log(err)
				setActivityIndicator(false)

			});

		}).catch((err) => {

		});
	}
	
	const Item = ({item}:any) => (
		<Pressable onPress={() => {navigation.push('vendorEdit' , {vendorId : item.id})}} style={styles.item}>
			<Text style={[{},h3, {color: gulluColor}]}>{item.name}</Text>
			<Text style={[{},h3, {color: gulluColor}]}>{item.phone}</Text>
		</Pressable>
	);

	const searchOrder = (searchableText) => {
		let newSearchableArray = [];
		if (origianlData.length > 0) {
			origianlData.filter((list) => {
				let searchableLowercase: any;

				//search salesman
				let salesman = list?.name;
				if(salesman != undefined){
					searchableLowercase = (salesman).toLowerCase();
					if (searchableLowercase.includes((searchableText).toLowerCase())) {
					newSearchableArray.push(list)
					}
				}
			});
		  setSearchableData(newSearchableArray);
		  SetData(newSearchableArray);
		}
	}
  return (
    <SafeAreaView style={{backgroundColor: '#ededed'}}>
			<StatusBar
				backgroundColor={gulluColor}
			/>
			<View style={[height100, primaryGulluLightBackgroundColor]}>
			<View style={[{} , height100]}>
				<View style={[{},height8]}>
                    <HeaderComponent navigation={navigation} title="Vendor List" />
                </View>
				<View style={[{} , height83]} >
					<View style={[{}, height15]}>
						<InputConponents placeholder="Search Vendor" style={[{}, inputStyleBlack]} inputValue={(value: any) => { searchOrder(value) }} />
					</View>
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
					<Pressable onPress={() => { navigation.push('vendorcreate') }} style={[{backgroundColor: secondaryBackgroundColor,height: 70 ,width: 70,padding: 0,margin:0 ,borderRadius: 100,right: 10,position: 'absolute',bottom: 0,borderColor: primaryColor ,borderWidth: 5}]}>
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
	  backgroundColor: '#fff',
	  padding: 15,
	  marginVertical: 8,
	  marginHorizontal: 16,
	  borderRadius: 10
	},
  });

export default VendorList;