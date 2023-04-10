/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback, useEffect ,useState} from 'react';
import type { PropsWithChildren } from 'react';
import {
	Pressable,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	useColorScheme,
	ImageBackground,
	View,
	FlatList,
	ActivityIndicator,
	RefreshControl
} from 'react-native';

import {
	Colors,
	DebugInstructions,
	Header,
	LearnMoreLinks,
	ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { cardBackgroundColor, flexDirectionRow, goldenColor, gulluColor, gulluFont, h1, h2, h3, h4, h5, height100, height50, height6, height85, height9, marginRight10, marginTop30, padding20, primaryBackgroundColor, primaryColor, primaryGulluBackgroundColor, primaryGulluLightBackgroundColor, screenheight, secondaryBackgroundColor, textAlignCenter } from '../assets/styles';
import FooterComponent from '../components/FooterComponent';
import HeaderComponent from '../components/HeaderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from '../services/services';
import { imagePath } from '../services/Client';
import { useIsFocused } from '@react-navigation/native'

function Dashboard({ navigation }): JSX.Element {
	const [ loader , setLoader] = useState(false);
	const [ role , setRole] = useState();
	const [ selectedOrderData , SetSelectedOrderData] = useState('');
	const [pending , setPending] = useState({});
	const [ready , setReady] = useState({});
	const [delivered , setDelivered] = useState({});
	const [ allOrdersList , setAllOrdersList] = useState([]);


	const wait = (timeout) => { // Defined the timeout function for testing purpose
		return new Promise(resolve => setTimeout(resolve, timeout));
	}
	
	const [isRefreshing, setIsRefreshing] = useState(false);
	const isFocused = useIsFocused()

	const onRefresh = useCallback(() => {
			setIsRefreshing(true);
			getData();
			wait(2000).then(() => setIsRefreshing(false));
	}, []);

	const isDarkMode = useColorScheme() === 'dark';
	useEffect(() => {
		AsyncStorage.getItem('role').then((roleId) => {
			setRole(roleId);
		}).catch((err) =>{
			// console.log(err);
		})
		getData();
		
	} , [])
	useEffect(() => {
		
		getData();
		
	} , [isFocused])

	const getData = () => {
		setLoader(true)
		AsyncStorage.getItem('api_token').then((token) => {
			let postedData = { role: 'salesman',api_token : token};
			get('/orders/list/pending' , postedData).then((res) => {
				let pending = res.data.data.data;
			
				setPending(pending);
				setLoader(false)
			}).catch((err) => {
				setLoader(false)
			});

		}).catch((err) => {
			setLoader(false)
		});
	}
	
	const Item = ({item}:any) => (
		<Pressable onPress={() => { navigation.push('orderEdit' , { 'orderData' : item}) }} style={styles.item}>
			<View style={[{} , flexDirectionRow]}>
				<View style={[marginRight10,{width:'60%',overflow: 'hidden' }]}>
					<View style={[{} , flexDirectionRow]}> 
						<Text style={[{fontWeight: 'bold'},h5,gulluFont,marginRight10]}>Order Number</Text>
						<Text style={[{marginTop: 0},h5,gulluFont]}>{item.order_number}</Text>
					</View>
					<View style={[{} , flexDirectionRow]}> 
						<Text style={[{fontWeight: 'bold'},h5,gulluFont,marginRight10]}>Item </Text>
						<Text style={[{marginTop: 0},h5,gulluFont]}>{item.item} </Text>
					</View>
					<View style={[{} , flexDirectionRow]}> 
						<Text style={[{fontWeight: 'bold'},h5,gulluFont,marginRight10]}>Color</Text>
						<Text style={[{marginTop: 0},h5,gulluFont]}>{item.color}</Text>
					</View>
					<View style={[{} , flexDirectionRow]}> 
						<Text style={[{fontWeight: 'bold'},h5,gulluFont,marginRight10]}>Salesman</Text>
						<Text style={[{marginTop: 0},h5,gulluFont]}>{item.salesman.name}</Text>
					</View>
					<View style={[{} , flexDirectionRow]}> 
						<Text style={[{fontWeight: 'bold'},h5,gulluFont,marginRight10]}>Vendor</Text>
						<Text style={[{marginTop: 0},h5,gulluFont]}>{item.vendor.name}</Text>
					</View>
					

				</View>
				<View style={{width: '40%'}}>
					{( item.attachments?.length > 0)? <ImageBackground source={{uri: imagePath+''+item.attachments[0].attachment }} resizeMode="contain" style={{height: 100 , width: '100%'}} /> : ''}
				</View>
			</View>
			
			
		</Pressable>
  );
	return (
		<SafeAreaView style={{backgroundColor: '#ededed'}}>
			<StatusBar
				backgroundColor={gulluColor}
			/>
			<View style={[height100, primaryGulluLightBackgroundColor]}>
				<View style={[{}, height100]}>
					<View style={[{}, height6]}>
						<HeaderComponent navigation={navigation} title="Pending Orders" />
					</View>

					<View style={[{}, height85]} >
						<View>
							{(loader)? 
								<ActivityIndicator  size={20} color={gulluColor} />
							:
							(pending?.length > 0)?
								<FlatList
									refreshing={isRefreshing} // Added pull to refesh state
									onRefresh={onRefresh} // Added pull to refresh control
									data={pending}
									renderItem={({item}) => <Item item={item} />}
									keyExtractor={item => item.id}
									showsVerticalScrollIndicator={false}
								/>
								:
								<View style={{justifyContent: 'center'}}>
									<Text style={[{color: gulluColor,textAlign: 'center'},h4,marginTop30]}>No pending orders available</Text>
								</View>
							}
							
							
						</View>
						{(role != undefined && role == 1)?
							<Pressable onPress={() => { navigation.push('ordercreate') }} style={[{backgroundColor: gulluColor,height: 70 ,width: 70,padding: 0,margin:0 ,borderRadius: 100,right: 10,position: 'absolute',bottom: 0}]}>
								<Text style={[{fontSize: 50,padding: 0,margin: 0,top: -5,color: goldenColor}, textAlignCenter]}>+</Text>
							</Pressable>
						:
							null
						}
					</View>
					<View style={[{}, height9]}>
						<FooterComponent navigation={navigation} />
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	sectionContainer: {
		marginTop: 32,
		paddingHorizontal: 24,
	},
	sectionTitle: {
		fontSize: 24,
		fontWeight: '600',
	},
	sectionDescription: {
		marginTop: 8,
		fontSize: 18,
		fontWeight: '400',
	},
	highlight: {
		fontWeight: '700',
	},
	item: {
		backgroundColor: '#fff',
		elevation:2,
		padding: 15,
		marginVertical: 8,
		marginHorizontal: 16,
		borderRadius: 10
	  },
});

export default Dashboard;
