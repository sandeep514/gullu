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
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { cardBackgroundColor, h1, h2, h3, height10, height100, height20, height50, height6, height80, height85, height9, height90, height95, padding20, primaryBackgroundColor, screenheight, secondaryBackgroundColor, textAlignCenter } from '../assets/styles';
import HeaderComponent from '../components/HeaderComponent';
import InputConponents from '../components/InputComponents';
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

				console.log(err)
			});

		}).catch((err) => {

		});
	}
	
	const Item = ({item}:any) => (
		<View style={styles.item}>
			<Text style={[{},h3]}>{item.name}</Text>
			<Text style={[{},h3]}>{item.phone}</Text>
		</View>
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
                    <HeaderComponent navigation={navigation} title="Salesman List" />
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

export default SalesmanList;