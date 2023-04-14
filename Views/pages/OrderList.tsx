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
  ImageBackground,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { cardBackgroundColor, h1, h2, h3, height10, height100, padding10, height6, height80, height85, height9, height90, justifyContentCenter, padding15, padding20, primaryBackgroundColor, primaryColor, screenheight, secondaryBackgroundColor, textAlignCenter, inputStyle, height15, flexDirectionRow, marginRight10, h5, h4 ,gulluColor,primaryGulluLightBackgroundColor} from '../assets/styles';
import InputConponents from '../components/InputComponents';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import { get } from '../services/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { imagePath } from '../services/Client';
import { ActivityIndicator } from 'react-native';
import { inputStyleBlack } from '../assets/styles';
import { goldenColor } from '../assets/styles';
import { gulluFont } from '../assets/styles';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


function OrderList({navigation}): JSX.Element {
  	const isDarkMode = useColorScheme() === 'dark';


	const [loader , setLoader] = useState(false);
	const [pending , setPending] = useState({});
	const [ready , setReady] = useState({});
	const [delivered , setDelivered] = useState({});
	const [ selectedOrderStatus , SetSelectedOrderStatus] = useState('');
	const [ allOrdersList , setAllOrdersList] = useState([]);
	const [ searchableData , setSearchableData] = useState([]);
	
	const [ selectedOrderData , SetSelectedOrderData] = useState('');

	useEffect(()=> {
		
	} , [])
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};
	useEffect(() => {
		SetSelectedOrderStatus('pending');
		AsyncStorage.getItem('api_token').then((token) => {
			setLoader(true)
			let postedData = { role: 'salesman',api_token : token};
			get('/orders/list' , postedData).then((res) => {
				let pending = res.data.data.data['pending'];
				let ready = res.data.data.data['ready'];
				let delivered = res.data.data.data['delivered'];
				
				setPending(pending);
				setReady(ready);
				setDelivered(delivered);

				let mergedArray1 = pending.concat(ready);
				let mergedArray2 = mergedArray1.concat(delivered);
				setAllOrdersList(mergedArray2);
				// console.log(mergedArray2);
				SetSelectedOrderData(res.data.data.data['pending']);
				// SetData(res.data.data.data);
				setLoader(false)
			}).catch((err) => {
				setLoader(false)
				// console.log(err)
			});

		}).catch((err) => {
			setLoader(false)
		});
	} , [])


	const searchOrder = (searchableText) => {
		let newSearchableArray = [];
		if( allOrdersList.length > 0 ){
			allOrdersList.filter((list) => {
				let searchableLowercase = (list.order_number).toLowerCase();
				if(searchableLowercase.includes((searchableText).toLowerCase())){ 
					newSearchableArray.push(list)

				}
			});
			setSearchableData(newSearchableArray);
			SetSelectedOrderData(newSearchableArray);
		}
		

	}
  
  const Item = ({item}:any) => (
		<Pressable onPress={() => { navigation.push('orderEdit' , { 'orderData' : item}) }} style={styles.item}>
			<View style={[{} , flexDirectionRow]}>
				<View style={[marginRight10,{width:'60%',overflow: 'hidden' }]}>
					<View style={[{} , flexDirectionRow]}> 
						<Text style={[{fontWeight: 'bold',width: '50%'},h5,marginRight10 ,gulluFont]}>Order Number</Text>
						<Text style={[{marginTop: 0},h5,gulluFont]}>{item.order_number}</Text>
					</View>
					<View style={[{} , flexDirectionRow]}> 
						<Text style={[{fontWeight: 'bold',width: '50%'},h5,marginRight10 ,gulluFont]}>Item </Text>
						<Text style={[{marginTop: 0},h5,gulluFont]}>{item.item} </Text>
					</View>
					<View style={[{} , flexDirectionRow]}> 
						<Text style={[{fontWeight: 'bold',width: '50%'},h5,marginRight10 ,gulluFont]}>Color</Text>
						<Text style={[{marginTop: 0},h5,gulluFont]}>{item.color}</Text>
					</View>
					<View style={[{} , flexDirectionRow]}> 
						<Text style={[{fontWeight: 'bold',width: '50%'},h5,marginRight10 ,gulluFont]}>Salesman</Text>
						<Text style={[{marginTop: 0},h5,gulluFont]}>{item.salesman.name}</Text>
					</View>
					<View style={[{} , flexDirectionRow]}> 
						<Text style={[{fontWeight: 'bold',width: '50%'},h5,marginRight10 ,gulluFont]}>Vendor</Text>
						<Text style={[{marginTop: 0},h5,gulluFont]}>{item.vendor.name}</Text>
					</View>
					

				</View>
				<View style={{width: '40%'}}>
					{( item.attachments.length > 0)? <ImageBackground source={{uri: imagePath+''+item.attachments[0].attachment }} resizeMode="contain" style={{height: 100 , width: '100%'}} /> : ''}
				</View>
			</View>
			
			
		</Pressable>
  );
	const checkOrderStatus = (changedOrderStatus) => {
		SetSelectedOrderStatus(changedOrderStatus)
		if( changedOrderStatus == 'pending' ) {
			SetSelectedOrderData(pending);
		}else if(changedOrderStatus == 'ready' ){
			SetSelectedOrderData(ready);
		}else if(changedOrderStatus == 'delivered' ){
			SetSelectedOrderData(delivered);

		}
	}
  return (
    <SafeAreaView style={{backgroundColor: '#ededed'}}>
			<StatusBar
				backgroundColor={gulluColor}
			/>
			<View style={[height100, primaryGulluLightBackgroundColor]}>
			<View style={[{} , height100]}>
				<View style={[{},height6]}>
                    <HeaderComponent navigation={navigation} title="List Orders"  />
                </View>
				<View style={[{},height85]} >

					{(loader)?
						<ActivityIndicator size={30} color={gulluColor}/>

					:
						<View>
							<View style={[{},height15]}>
								<InputConponents placeholder="search order" style={[{} , inputStyleBlack]} inputValue={(value:any) => { searchOrder(value) }}/>
							</View>
							<View style={[{} , height85]}>
								<View style={{justifyContent: 'space-around',flexDirection: 'row'}}>
									<Pressable onPress={() => { checkOrderStatus('pending') }} style={[{width: '30%',borderRadius: 10},padding10,justifyContentCenter, (selectedOrderStatus == "pending")? {backgroundColor: goldenColor} : {borderColor: goldenColor , borderWidth: 2}]}>
										<Text style={[{textAlign: 'center' , fontSize: 18} , (selectedOrderStatus == "pending")? { } : {color : secondaryBackgroundColor}]}>Pending</Text>
									</Pressable>
									<Pressable onPress={() => { checkOrderStatus('ready') }} style={[{width: '30%',borderRadius: 10},padding10,justifyContentCenter, (selectedOrderStatus == "ready")? {backgroundColor: goldenColor} : {borderColor: goldenColor , borderWidth: 2}]}>
										<Text style={[{textAlign: 'center' , fontSize: 18} , (selectedOrderStatus == "ready")? {} : {color: secondaryBackgroundColor}]}>Ready</Text>
									</Pressable>
									<Pressable onPress={() => { checkOrderStatus('delivered') }} style={[{width: '30%',borderRadius: 10},padding10,justifyContentCenter, (selectedOrderStatus == "delivered")? {backgroundColor: goldenColor} : {borderColor: goldenColor , borderWidth: 2}]}>
										<Text style={[{textAlign: 'center' , fontSize: 18} , (selectedOrderStatus == "delivered")? {} : {color: secondaryBackgroundColor}]}>Delivered</Text>
									</Pressable>
								</View>
								<FlatList
									data={selectedOrderData}
									renderItem={({item}) => <Item item={item} />}
									keyExtractor={item => item.id}
									showsVerticalScrollIndicator={false}
								/>
							</View>
							<Pressable onPress={() => { navigation.push('ordercreate') }} style={[{backgroundColor: gulluColor,height: 70 ,width: 70,padding: 0,margin:0 ,borderRadius: 100,right: 10,position: 'absolute',bottom: 0}]}>
								<Text style={[{fontSize: 50,padding: 0,margin: 0,top: -3,color: goldenColor}, textAlignCenter]}>+</Text>
							</Pressable>
						</View>
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
	  backgroundColor: '#fff',
	  padding: 15,
	  marginVertical: 8,
	  marginHorizontal: 16,
	  borderRadius: 10
	},
  });

export default OrderList;
