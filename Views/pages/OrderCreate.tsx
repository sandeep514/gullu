import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
	Button,
	FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  View,
  Modal,
  ImageBackground,
  Dimensions,
  Pressable
} from 'react-native';
import DocumentPicker, {
	DirectoryPickerResponse,
	DocumentPickerResponse,
	isInProgress,
	types,
  } from 'react-native-document-picker'
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { flexDirectionRow, h3, h4, h5, height100, height6, height85, height9, inputStyle, inputStyleBlack, justifyContentCenter, marginLeft10, marginRight10, padding15, primaryBackgroundColor, screenheight, secondaryBackgroundColor, textAlignCenter,gulluColor,primaryGulluLightBackgroundColor,goldenColor, inputLoginStyle, height8, height83 } from '../assets/styles';
import InputConponents from '../components/InputComponents';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import {decode as atob, encode as btoa} from 'base-64'
import { readFile } from "react-native-fs";
import  Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, showToast } from '../services/services';
import { Dropdown } from 'react-native-element-dropdown';
// import AntDesign from '@expo/vector-icons/AntDesign';
// import DatePicker from 'react-native-date-picker'
// import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import DatePicker from '@react-native-community/datetimepicker'
import SearchableDropdown from "react-native-searchable-dropdown";
import Camera from '../components/Camera';
import NetInfo from "@react-native-community/netinfo";
import networkSpeed from 'react-native-network-speed';

function OrderCreate({navigation}): JSX.Element {
	let salesmanData = {};
	const [ activityIndicator , setActivityIndicator ] = useState(false);
	const [order_number , setOrderNumber] = useState("");
	const [vendor , setVendor] = useState('');
	const [salesman , setSalesman] = useState('');
	const [color , setColor] = useState('');
	const [item , setItem] = useState('');
    const [value, setValue] = useState(null);
	const [modalVisibleItem, setModalVisibleItem] = useState(false);
	const [modalVisibleVendor, setModalVisibleVendor] = useState(false);
	const [modalVisibleSalesman, setModalVisibleSalesman] = useState(false);


	const [product_photo , setPrductPhoto] = useState('');
	const [product_photo_type , setPrductPhotoType] = useState('');
	const [product_measurement , setProductMeasurement] = useState('');
	const [product_measure_type , setPrductMeasureType] = useState('');
	const [product_video , setProductVideo] = useState('');
	const [product_video_type , setPrductVideoType] = useState('');

	const [productPhotoData, setPrductPhotoData] = useState({});
	const [productMeasurementData, setPrductMeasurementData] = useState({});
	const [productVideoData, setProductVideoData] = useState({});

	const [prductPhotoResult, setPrductPhotoResult] = useState();
	const [productMeasurementResult, setProductMeasurementResult] = useState();
	const [productVideoResult, setProductVideoResult] = useState();
	const [apitoken, setApiToken] = useState();

	const [ItemList , SetItemList] = useState();
	const [ItemListAll , SetItemListAll] = useState();

	const [vendorList , SetVendorList] = useState();
	const [vendorListAll , SetVendorListAll] = useState();
	const [salesmanList , SetSalesmanList] = useState();
	const [salesmanListAll , SetSalesmanListAll] = useState();
	const [date, setDate] = useState(new Date())
  	const [open, setOpen] = useState(false)
  	const [showReadyDate, setshowReadyDate] = useState(false)
  	const [showBufferReadyDate, setShowBufferReadyDate] = useState(false)
  	const [showDeliveryDate, setShowDeliveryDate] = useState(false)
  	const [generatingMessage, setGeneratingMessage] = useState('Generating new order')



	const [selectedItemId , SetSelectedItemId] = useState();
	const [selectedVendorId , SetSelectedVendorId] = useState();
	const [selectedSalesmanId , SetSelectedSalesmanId] = useState();
	const [selectedItemName , SetSelectedItemName] = useState();
	const [selectedVendorName , SetSelectedVendorName] = useState();
	const [selectedSalesmanName , SetSelectedSalesmanName] = useState();

	const [readyDate , SetReadyDate] = useState();
	const [deliveryDate , SetDeliveryDate] = useState();
	const [bufferReadyDate , SetBufferReadyDate] = useState();

	const [percentage, setPercentage] = useState(0);
	const [networkType, setNetworkType] = useState();
	const [totalAttachmentSize, setTotalAttachmentSize] = useState();
	const [currentUploadingSpeed, setCurrentUploadingSpeed] = useState(0);

	const videoPlayer = React.useRef();

	async function getUriToBase64(uri) {
		const base64String = await readFile(uri, "base64");
		return base64String
	}
	useEffect(() => {
		getItemList();
		getVendorList();
		getSalesmanList();
		setshowReadyDate(false);
		setShowDeliveryDate(false);

		AsyncStorage.getItem('id').then((token) => {
			setApiToken(token);
		}).catch((err) => {
			
		});
		
		return () => {
			setshowReadyDate(false);
			setShowDeliveryDate(false);
		}
		
	} , []);

	useEffect(() => {
		NetInfo.fetch().then(state => {
			console.log(state);
			setNetworkType(state.type);
		  });
		
	} , [])

	var current = 0;
	var interval:any;

	let saveOrder = async () => {
		let size1 = 0;
		let size2 = 0;
		let size3 = 0;
		if(productPhotoData.length > 0){
			size1 = productPhotoData[0].size;
		}
		if(productMeasurementData.length > 0){
			size2 = productMeasurementData[0].size;
		}
		if(productVideoData.length > 0){
			size3 = productVideoData[0].size;
		}
		let totalAttachmentSize = ((size1+size2+size3)/1000000);
		setTotalAttachmentSize(totalAttachmentSize);
		let mobileDataSize = 1;
		let wifiDataSize = 6;
		let defaultTimeInterval = 1000;

		if( networkType == 'cellular' ){
			if(mobileDataSize <= 0){
				mobileDataSize = 1;
			}
			defaultTimeInterval = (Math.round(((totalAttachmentSize)/mobileDataSize)) * 1000);
		}else{
			if(wifiDataSize <= 0){
				wifiDataSize = 1;
			}
			defaultTimeInterval = (Math.round(((totalAttachmentSize)/wifiDataSize)) * 1000);
		}
		console.log(order_number);
		console.log(selectedVendorId);
		console.log(selectedSalesmanId);
		console.log(color);
		console.log(item);
		console.log(new Date(readyDate).getFullYear()+'-'+(new Date(readyDate).getMonth() + 1)+'-'+new Date(readyDate).getDate());
		console.log(new Date(bufferReadyDate).getFullYear()+'-'+(new Date(bufferReadyDate).getMonth() + 1)+'-'+new Date(bufferReadyDate).getDate());
		console.log(new Date(deliveryDate).getFullYear()+'-'+(new Date(deliveryDate).getMonth() + 1)+'-'+new Date(deliveryDate).getDate());


		if( order_number != '' && order_number != undefined && selectedVendorId != '' && selectedVendorId != undefined && selectedSalesmanId != '' && selectedSalesmanId != undefined && color != '' && color != undefined && item != '' && item != undefined && readyDate != '' && readyDate != undefined && deliveryDate != '' && deliveryDate != undefined ){
			if(productPhotoData.length > 0 && productMeasurementData.length > 0){
				// networkSpeed.startListenNetworkSpeed(({downLoadSpeed,downLoadSpeedCurrent,upLoadSpeed,upLoadSpeedCurrent}) => {
				// 	// console.log(downLoadSpeed + 'kb/s') 
				// 	// console.log(downLoadSpeedCurrent + 'kb/s') 
				// 	// console.log(upLoadSpeed + 'kb/s') 
				// 	setCurrentUploadingSpeed(upLoadSpeedCurrent + 'kb/s') 
				// })
				// networkSpeed.stopListenNetworkSpeed();
				setActivityIndicator(true)
				let data = new FormData();
				data.append('order_number', order_number);
				data.append('vendor', selectedVendorId);
				data.append('salesman', selectedSalesmanId);
				data.append('api_token', apitoken);
				data.append('color', color);
				data.append('item', item);
				data.append('item', item);
				data.append('item', item);
				// Attach file
				data.append('product_photo', productPhotoData[0]); 
				data.append('product_measurement', productMeasurementData[0]); 
				data.append('product_video', productVideoData[0]);

				interval = setInterval(function(){
					if( current < 98 ){
						let ndInt = Math.floor(Math.random() * 1) + 1;
						current+=ndInt;
						setGeneratingMessage('Generating Order');
						if( current > 2){
							setGeneratingMessage('Uploading Attachments...'+current+'%' );
						}
						if( current > 97 ){
							setGeneratingMessage('Almost done...');
						}
					}else{
						clearInterval(interval);
						setGeneratingMessage('Almost done...');
					}

				}, defaultTimeInterval);

				let ress = await fetch('https://gullu.suryacontractors.com/public/api/orders/create', {
					method: 'POST',
					body: data,
					headers: {
						'Content-Type': 'multipart/form-data; ',
					  },
				});

				let response = await ress.json();
				console.log('response here');
				console.log(response);
				if(response.data.status == true || response.data.status == 'true'){		

					interval = setInterval(function(){
						if( current < 98 ){
							let ndInt = Math.floor(Math.random() * 10) + 1;
							current+=ndInt;
							if( current > 20){
								setGeneratingMessage('Uploading Attachments...'+current+'%' );
							}
							
						}
						if( current > 97 ){
							setGeneratingMessage('Almost done...');
							clearInterval(interval);
							showToast('Order generated');
							navigation.push('orderlist');
							setActivityIndicator(false)
						}
						// else{
						// 	clearInterval(interval);
						// 	setGeneratingMessage('Almost complete...');
						// }
	
					}, defaultTimeInterval);
			
					
					
				}else{
					clearInterval(interval);

					showToast('error');
					setActivityIndicator(false)
				}
			}else{
				showToast('Required fields are missing');
			}
			
		}else{
			showToast('Required fields are missing');
		}
			
		return false;


	}
	
	const getItemList = () => {
		AsyncStorage.getItem('id').then((token) => {
			let postedData = { role: 'vendor',api_token : token};
			get('item/get' , postedData).then((res) => {
				SetItemList(res.data.data.data);
				SetItemListAll(res.data.data.data);

			}).catch((err) => {

			});
		}).catch((err) => {

		});
	}
	const getVendorList = () => {
		AsyncStorage.getItem('id').then((token) => {
			let postedData = { role: 'vendor',api_token : token};
			get('users/get' , postedData).then((res) => {
				SetVendorList(res.data.data.data);
				SetVendorListAll(res.data.data.data);
				// console.log(res.data.data.data);
			}).catch((err) => {
				// console.log(err)
			});
		}).catch((err) => {

		});
	}
	const getSalesmanList = () => {
		AsyncStorage.getItem('id').then((token) => {
			let postedData = { role: 'salesman',api_token : token};
			get('users/get' , postedData).then((res) => {
				SetSalesmanList(res.data.data.data);
				SetSalesmanListAll(res.data.data.data);
			}).catch((err) => {
				// console.log(err)
			});
		}).catch((err) => {
		
		});
	}
	

	const handleError = (err: unknown) => {
		if (DocumentPicker.isCancel(err)) {
			console.warn('cancelled')
			// User cancelled the picker, exit any dialogs or menus and move on
		} else if (isInProgress(err)) {
			console.warn('multiple pickers were opened, only the last will be considered')
		} else {
			throw err
		}
	}
  	const isDarkMode = useColorScheme() === 'dark';
  	useEffect(()=> {
		
	} , [])
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};
	const Item = ({item}:any) => (
		<Pressable onPress={() => { setItem(item.id) ,SetSelectedItemId(item.id) ,SetSelectedItemName(item.name) ,setModalVisibleItem(false) }} style={styles.item}>
			<View style={[{} , flexDirectionRow]}>
				<View style={[marginRight10,{width:'100%',overflow: 'hidden' }]}>
					<View style={[{} , flexDirectionRow]}> 
						<Text style={[{fontWeight: 'bold'},h5,marginRight10]}>{item.name}</Text>
						<Text style={[{marginTop: 0},h5]}>{item.order_number}</Text>
					</View>
				</View>
			</View>
		</Pressable>
  	);
	const VendorItem = ({item}:any) => (
		<Pressable onPress={() => { SetSelectedVendorId(item.id) ,SetSelectedVendorName(item.name) ,setModalVisibleVendor(false) }} style={styles.item}>
			<View style={[{} , flexDirectionRow]}>
				<View style={[marginRight10,{width:'100%',overflow: 'hidden' }]}>
					<View style={[{} , flexDirectionRow]}> 
						<Text style={[{fontWeight: 'bold'},h5,marginRight10]}>{item.name}</Text>
						<Text style={[{marginTop: 0},h5]}>{item.order_number}</Text>
					</View>
				</View>
			</View>
		</Pressable>
  	);
	const SalesmanListItem = ({item}:any) => (
		<Pressable onPress={() => {console.log(item), SetSelectedSalesmanId(item.id), SetSelectedSalesmanName(item.name) , setModalVisibleSalesman(false) }} style={styles.item}>
			<View style={[{} , flexDirectionRow]}>
				<View style={[marginRight10,{width:'100%',overflow: 'hidden' }]}>
					<View style={[{} , flexDirectionRow]}> 
						<Text style={[{fontWeight: 'bold'},h5,marginRight10]}>{item.name}</Text>
						<Text style={[{marginTop: 0},h5]}>{item.order_number}</Text>
					</View>
				</View>
			</View>
		</Pressable>
	);

	const getAddedDate = (numberOfDaysToAdd) => {
		var someDate = new Date();
		var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);
		// console.log(new Date(result))
		return new Date(result);
	}
	const openReadyDate = () => {
		setshowReadyDate(true)
		setShowDeliveryDate(false)
		setShowBufferReadyDate(false);

	}
	const openBufferReadyDate = () => {
		setshowReadyDate(false)
		setShowDeliveryDate(false)
		setShowBufferReadyDate(true);
	}
	const openDeliveryDate = () => {
		setshowReadyDate(false)
		setShowDeliveryDate(true)
		setShowBufferReadyDate(false);

	}
	const searchItem = (searchedValue) => {
		console.log();
		if(searchedValue.length > 0 ){
			let newSearchableArray = [];
			if( ItemList.length > 0 ){
				ItemList.filter((list) => {
					let searchableLowercase = (list.name).toLowerCase();
					if(searchableLowercase.includes((searchedValue).toLowerCase())){ 
						newSearchableArray.push(list)
					}
				});
				SetItemList(newSearchableArray);
			}
		}else{
			SetItemList(ItemListAll);
		}
		
		// vendorList.filter
		// console.log(searchedValue);
	}
	const searchVendor = (searchedValue) => {
		console.log();
		if(searchedValue.length > 0 ){
			let newSearchableArray = [];
			if( vendorList.length > 0 ){
				vendorList.filter((list) => {
					let searchableLowercase = (list.name).toLowerCase();
					if(searchableLowercase.includes((searchedValue).toLowerCase())){ 
						newSearchableArray.push(list)
					}
				});
				SetVendorList(newSearchableArray);
			}
		}else{
			SetVendorList(vendorListAll);
		}
		
		// vendorList.filter
		// console.log(searchedValue);
	}
	const searchSalesman = (searchedValue) => {
		console.log();
		if(searchedValue.length > 0 ){
			let newSearchableArray = [];
			if( salesmanList.length > 0 ){
				salesmanList.filter((list) => {
					let searchableLowercase = (list.name).toLowerCase();
					if(searchableLowercase.includes((searchedValue).toLowerCase())){ 
						newSearchableArray.push(list)
					}
				});
				SetSalesmanList(newSearchableArray);
			}
		}else{
			SetSalesmanList(salesmanListAll);
		}
		
		// vendorList.filter
		// console.log(searchedValue);
	}
	

  return (
    <SafeAreaView style={{backgroundColor: '#ededed'}}>
			<StatusBar
				backgroundColor={gulluColor}
			/>
			<View style={[height100, primaryGulluLightBackgroundColor]}>
			<View style={[{} , height100]}>

			{(activityIndicator)? 
				<View style={{zIndex: 99999}}>
					<View style={[{position: 'absolute',top: 0,backgroundColor: gulluColor,left: 0,width: '100%',zIndex: 9999999,opacity: 0.8},screenheight,justifyContentCenter ]}>
						<Text style={[h4,{textAlign: 'center',color: '#fff'}]}>You are on {networkType}</Text>
						<Text style={[h4,{textAlign: 'center',color: '#fff'}]}>Order attachment size is {totalAttachmentSize.toFixed(2)} MB</Text>
						{/* <Text>Uploading speed {currentUploadingSpeed}</Text> */}
						<View style={{paddingVertical: 10}}></View>
						<ActivityIndicator color="#fff" size={40}></ActivityIndicator>
						<Text style={[h4,{textAlign: 'center',color: '#fff'}]}>{generatingMessage}...</Text>
					</View>
				</View>
			:
				null
			}	
				

				
				<View style={[{},height8]}>
                    <HeaderComponent navigation={navigation} title="order create" />
                </View>
				<ScrollView horizontal={false} style={{flex: 1}}>
					<ScrollView>
						
						<View style={[{} , height83]} >
								
							<InputConponents placeholder="Order Number" inputValue={(value:any) => { setOrderNumber(value) }} style={inputStyleBlack} />
							{/* <InputConponents placeholder="Select Vendor" inputValue={(value:any) => { setVendor(value) }} style={inputStyleBlack} />
							<InputConponents placeholder="Select Salesman" inputValue={(value:any) => { setSalesman(value) }} style={inputStyleBlack} /> */}
							<InputConponents placeholder="Color" inputValue={(value:any) => { setColor(value) }} style={inputStyleBlack} />
							{/* <InputConponents placeholder="Item" inputValue={(value:any) => { setItem(value) }} style={inputStyleBlack} /> */}

							<Modal
								animationType="slide"
								transparent={true}
								visible={modalVisibleItem}
								onRequestClose={() => {
									// Alert.alert('Modal has been closed.');
									setModalVisibleItem(!modalVisibleItem);
								}}>
									<View style={styles.centeredView}>
										<View style={styles.modalView}>
											<View style={{paddingBottom: 10}}>
												<Text>Select Item</Text>
											</View>
											<View style={{width: '100%' }}>
												<InputConponents placeholder="Search Item" inputValue={(value:any) => { searchItem(value) }} style={inputStyleBlack}/>
											</View>
											<FlatList
												data={ItemList}
												renderItem={({item}) => {return <View><Item item={item} /></View>}}
												keyExtractor={item => item.id}
												showsVerticalScrollIndicator={false}
											/>
											<Pressable
												style={[styles.button, styles.buttonClose]}
												onPress={() => setModalVisibleItem(!modalVisibleItem)}>
												<Text style={styles.textStyle}>Close</Text>
											</Pressable>
										</View>
									</View>
							</Modal>

							<Modal
								animationType="slide"
								transparent={true}
								visible={modalVisibleVendor}
								onRequestClose={() => {
									// Alert.alert('Modal has been closed.');
									setModalVisibleVendor(!modalVisibleVendor);
								}}>
									<View style={styles.centeredView}>
										<View style={styles.modalView}>
											<View style={{paddingBottom: 10}}>
												<Text>Select Vendor</Text>
											</View>
											<View style={{width: '100%' }}>
												<InputConponents placeholder="Search Vendor" inputValue={(value:any) => { searchVendor(value) }} style={inputStyleBlack}/>
											</View>
											<FlatList
												data={vendorList}
												renderItem={({item}) => {return <View><VendorItem item={item} /></View>}}
												keyExtractor={item => item.id}
												showsVerticalScrollIndicator={false}
											/>
											<Pressable
												style={[styles.button, styles.buttonClose]}
												onPress={() => setModalVisibleVendor(!modalVisibleVendor)}>
												<Text style={styles.textStyle}>Close</Text>
											</Pressable>
										</View>
									</View>
							</Modal>
							
							<Modal
								animationType="slide"
								transparent={true}
								visible={modalVisibleSalesman}
								onRequestClose={() => {
									// Alert.alert('Modal has been closed.');
									setModalVisibleSalesman(!modalVisibleSalesman);
								}}>
									<View style={styles.centeredView}>
										<View style={styles.modalView}>
											<View style={{paddingBottom: 10}}>
												<Text>Select Salesman</Text>
											</View>
											<View style={{width: '100%' }}>
												<InputConponents placeholder="Search Vendor" inputValue={(value:any) => { searchSalesman(value) }} style={inputStyleBlack}/>
											</View>
											<FlatList
												data={salesmanList}
												renderItem={({item}) => <SalesmanListItem item={item} />}
												keyExtractor={item => item.id}
												showsVerticalScrollIndicator={false}
											/>
											<Pressable
												style={[styles.button, styles.buttonClose]}
												onPress={() => setModalVisibleSalesman(!modalVisibleSalesman)}>
												<Text style={styles.textStyle}>Close</Text>
											</Pressable>
										</View>
									</View>
							</Modal>
							<View style={{paddingHorizontal: 20,paddingVertical: 10}}>
								<View style={{ flexDirection: 'row' }}>
									<Pressable 
										style={{ backgroundColor: gulluColor,padding:20,borderRadius: 10,width: '50%',marginBottom: 10}}
										onPress={() => setModalVisibleItem(true)}>
										<Text style={{color: goldenColor,textAlign: 'center'}}>Select Item</Text>
									</Pressable>

									<Text style={[{ paddingVertical: 16 ,textTransform: 'capitalize'} , h4,marginLeft10,{color: gulluColor}]}>{selectedItemName}</Text>
								</View>
								<View style={{ flexDirection: 'row' }}>
									<Pressable 
										style={{ backgroundColor: gulluColor,padding:20,borderRadius: 10,width: '50%',marginBottom: 10}}
										onPress={() => setModalVisibleVendor(true)}>
										<Text style={{color: goldenColor,textAlign: 'center'}}>Select Vendor</Text>
									</Pressable>

									<Text style={[{ paddingVertical: 16 ,textTransform: 'capitalize'} , h4,marginLeft10,{color: gulluColor}]}>{selectedVendorName}</Text>
								</View>
								
								<View style={{ flexDirection: 'row' }}>
									<Pressable
										style={{ backgroundColor: gulluColor,padding:20,borderRadius: 10,width: '50%'}}
										onPress={() => setModalVisibleSalesman(true)}>
										<Text style={{color: goldenColor,textAlign: 'center'}}>Select Salesman</Text>
									</Pressable>
									<Text style={[{ paddingVertical: 16 ,textTransform: 'capitalize'} , h4,marginLeft10,{color: gulluColor}]}>{selectedSalesmanName}</Text>
								</View>
							</View>
							
							

							
							{( showReadyDate )?
								<View>
									<DatePicker
										style={{width: 200}}
										date={getAddedDate(3)}
										value={getAddedDate(3)}
										mode="date"
										placeholder="select date"
										format="YYYY-MM-DD"
										minDate={new Date()}
										maxDate="2050-06-01"
										confirmBtnText="Confirm"
										cancelBtnText="Cancel"
										customStyles={{
											dateIcon: {
												position: 'absolute',
												left: 0,
												top: 4,
												marginLeft: 0
											},
											dateInput: {
												marginLeft: 36
											}
										}}
										onChange={(date) => {setshowReadyDate(false), SetReadyDate(new Date(date.nativeEvent.timestamp))}}
										onDateChange={(date) => {console.log(date)}}
									/>
									
								</View>
							:
								null
							}
							<View style={{paddingHorizontal: 20,paddingVertical: 10}}>
								<View style={{ flexDirection: 'row' }}>
									<Pressable onPress={() => openReadyDate()} style={{ backgroundColor: gulluColor,padding:20,borderRadius: 10,width: '50%',marginBottom: 10}}>
										<Text style={{color: goldenColor,textAlign: 'center'}}>Select Ready Date </Text>
									</Pressable>
									{(readyDate != undefined)?
									
										<View>
											<Text style={[{ paddingVertical: 16 ,textTransform: 'capitalize'} , h4,marginLeft10,{color: gulluColor}]}>{readyDate.toString().substring(4, 15)}</Text>
										</View>
										:
										null
									}
								</View>

							
								<View style={{ flexDirection: 'row' }}>
									<Pressable onPress={() => openBufferReadyDate()} style={{ backgroundColor: gulluColor,padding:20,borderRadius: 10,width: '50%',marginBottom: 10}}>
										<Text style={{color: goldenColor,textAlign: 'center'}}>Buffer Ready Date </Text>
									</Pressable>
									{(bufferReadyDate != undefined)?
									
										<View>
											<Text style={[{ paddingVertical: 16 ,textTransform: 'capitalize'} , h4,marginLeft10,{color: gulluColor}]}>{bufferReadyDate.toString().substring(4, 15)}</Text>
										</View>
										:
										null
									}
								</View>
							
								
								<View style={{ flexDirection: 'row' }}>
									<Pressable onPress={() => openDeliveryDate()} style={{ backgroundColor: gulluColor,padding:20,borderRadius: 10,width: '50%'}}>
										<Text style={{color: goldenColor,textAlign: 'center'}}>Select Delivery Date</Text>
									</Pressable>
									{(deliveryDate != undefined)?
									
										<View>
											<Text style={[{ paddingVertical: 16 ,textTransform: 'capitalize'} , h4,marginLeft10,{color: gulluColor}]}>{deliveryDate.toString().substring(4, 15)}</Text>
										</View>
										:
										null
									}
								</View>
								
							</View>
							{( showDeliveryDate )?
								<DatePicker
									style={{width: 200}}
									date={getAddedDate(6)}
									value={getAddedDate(6)}
									mode="date"
									placeholder="select date"
									format="YYYY-MM-DD"
									minDate={new Date()}
									maxDate="2050-06-01"
									confirmBtnText="Confirm"
									cancelBtnText="Cancel"
									customStyles={{
										dateIcon: {
											position: 'absolute',
											left: 0,
											top: 4,
											marginLeft: 0
										},
										dateInput: {
											marginLeft: 36
										}
									}}
									onChange={(date) => {setShowDeliveryDate(false), SetDeliveryDate(new Date(date.nativeEvent.timestamp))}}
									onDateChange={(date) => { console.log(date) }}
								/>
							:
								null
							}
							{( showBufferReadyDate )?
								<DatePicker
									style={{width: 200}}
									date={getAddedDate(6)}
									value={getAddedDate(6)}
									mode="date"
									placeholder="select date"
									format="YYYY-MM-DD"
									minDate={new Date()}
									maxDate="2050-06-01"
									confirmBtnText="Confirm"
									cancelBtnText="Cancel"
									customStyles={{
										dateIcon: {
											position: 'absolute',
											left: 0,
											top: 4,
											marginLeft: 0
										},
										dateInput: {
											marginLeft: 36
										}
									}}
									onChange={(date) => {setShowBufferReadyDate(false), SetBufferReadyDate(new Date(date.nativeEvent.timestamp))}}
									onDateChange={(date) => { console.log(date) }}
								/>
							:
								null
							}
							

							<View style={{paddingHorizontal: 20}}>
								<TouchableOpacity
									onPress={async () => {
									try {
										const pickerResult = await DocumentPicker.pick({
											presentationStyle: 'fullScreen',
											copyTo: 'cachesDirectory',
											type: [types.images],
										});
										setPrductPhotoType(pickerResult[0].type);
										setPrductPhotoData(pickerResult)
										// if(pickerResult[0].size <= 2000000){
										// 	setPrductPhotoType(pickerResult[0].type);
										// 	setPrductPhotoData(pickerResult)
										// }else{
										// 	showToast('Image should be less than 2MB');
										// }
										
									} catch (e) {
										handleError(e)
									}
									}}
									style={[{width: 'auto',backgroundColor: gulluColor,borderRadius: 10,marginBottom: 10},padding15,justifyContentCenter]}
								>
									<Text style={{color: goldenColor,textAlign: 'center'}}>Upload Product Image</Text>
								</TouchableOpacity>

								{(productPhotoData != undefined && productPhotoData.length > 0)?
									<View style={{ height: 200,width: 200 }}>
										<ImageBackground source={{uri:productPhotoData[0].fileCopyUri}} style={{ height: '100%',width: '100%' }} resizeMode="center">

										</ImageBackground>
									</View>
									// <Image source={{uri:productPhotoData[0].fileCopyUri}} style={{ height: 200,width: 200 }}/>
								:
									null
								}
								<TouchableOpacity
									onPress={async () => {
									try {
										const pickerResult = await DocumentPicker.pick({
											presentationStyle: 'fullScreen',
											copyTo: 'cachesDirectory',
											type: [types.images]
										});
										setPrductMeasureType(pickerResult[0].type);
										setPrductMeasurementData(pickerResult)
										// if(pickerResult[0].size <= 2000000){
										// 	setPrductMeasureType(pickerResult[0].type);
										// 	setPrductMeasurementData(pickerResult)
										// }else{
										// 	showToast('Image should be less than 2MB');
										// }
										
									} catch (e) {
										handleError(e)
									}
									}}
									style={[{width: 'auto',backgroundColor: gulluColor,borderRadius: 10,marginBottom: 10},padding15,justifyContentCenter]}
								>
									<Text style={{color: goldenColor,textAlign: 'center'}}>Upload Product Measurement</Text>
								</TouchableOpacity>

								{(productMeasurementData != undefined && productMeasurementData.length > 0)?
									<View style={{ height: 200,width: 200 }}>
										<ImageBackground source={{uri:productMeasurementData[0].fileCopyUri}} style={{ height: '100%',width: '100%' }} resizeMode="center">

										</ImageBackground>
									</View>
								:
									null
								}
								
								<TouchableOpacity
									onPress={async () => {
									try {
										const pickerResult = await DocumentPicker.pick({
											presentationStyle: 'fullScreen',
											copyTo: 'cachesDirectory',
											type: [types.video],

										});

										console.log(pickerResult[0]);
										let sourceUri = pickerResult[0].fileCopyUri;
										setPrductVideoType(pickerResult[0].type);
										setProductVideoData(pickerResult);

										// if( pickerResult[0].size <= 5000000 ){
										// 	setPrductVideoType(pickerResult[0].type);
										// 	setProductVideoData(pickerResult);
										// }else{
										// 	showToast('Max file upload size is 5MB');
										// }
									} catch (e) {
										handleError(e)
									}
									}}
									style={[{width: 'auto',backgroundColor: gulluColor,borderRadius: 10,marginBottom: 10},padding15,justifyContentCenter]}
								>
									<Text style={{color: goldenColor,textAlign: 'center'}}>Upload Product Video</Text>
								</TouchableOpacity>
								<View style={styles.container}>
									
									<View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
										{/* <Camera /> */}
										{/* <TouchableOpacity onPress={} style={styles.capture}>
											<Text style={{ fontSize: 14 }}> SNAP </Text>
										</TouchableOpacity> */}
									</View>
								</View>
								
								


								{(productVideoData != undefined && productVideoData.length > 0)?
									<View style={{width: '100%' , height: 400}}>
										<Video source={{uri: productVideoData[0].fileCopyUri }}
											style={styles.backgroundVideo}
											controls={true}
											ref={ref => (videoPlayer.current = ref)}
											resizeMode={"contain"}
											paused={false}
											muted={true}
										/>
									</View>
									
								:
									null
								}
							</View>

							
							<View style={{alignItems: 'center'}}>
								<TouchableOpacity onPress={() => {saveOrder()}} style={[{width: 'auto',backgroundColor: gulluColor,borderRadius: 10},padding15,justifyContentCenter]} >
									<Text style={[h3,{color: goldenColor},textAlignCenter]}>Generate New Order</Text>
								</TouchableOpacity>
								
							</View>
						</View>
					</ScrollView>
				</ScrollView>
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
		flexDirection: 'column',
		backgroundColor: 'black',
	  },
	  preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
	  },
	  capture: {
		flex: 0,
		backgroundColor: '#fff',
		borderRadius: 5,
		padding: 15,
		paddingHorizontal: 20,
		alignSelf: 'center',
		margin: 20,
	  },
	
	item: {
	  backgroundColor: secondaryBackgroundColor,
	  padding: 15,
	  marginVertical: 8,
	  marginHorizontal: 16,
	  borderRadius: 10
	},
 
	backgroundVideo: {
	//   position: 'absolute',
	  top: 0,
	  left: 0,
	  bottom: 0,
	  right: 0,
	  height: '100%',
	  width: '100%'
	},
	dropdown: {
		margin: 16,
		height: 50,
		borderColor: secondaryBackgroundColor,
		borderWidth: 1,
	  },
	  icon: {
		marginRight: 5,
	  },
	  placeholderStyle: {
		fontSize: 16,
		color: secondaryBackgroundColor
	  },
	  selectedTextStyle: {
		fontSize: 16,
	  },
	  iconStyle: {
		width: 20,
		height: 20,
	  },
	  inputSearchStyle: {
		height: 40,
		fontSize: 16,
	  },
	  centeredView: {
		flex: 100,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10,
	  },
	  modalView: {
		borderColor: '#ededed',
		borderWidth: 2,
		margin: 20,
		width: '80%',
		height: '70%',
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 10,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
		  width: 0,
		  height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	  },
	  button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	  },
	  buttonOpen: {
		backgroundColor: '#F194FF',
	  },
	  buttonClose: {
		backgroundColor: '#2196F3',
	  },
	  textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	  },
	  modalText: {
		marginBottom: 15,
		textAlign: 'center',
	  },
  });
export default OrderCreate;
