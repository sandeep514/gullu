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
import { flexDirectionRow, h3, h4, h5, height100, height6, height85, height9, inputStyle, inputStyleBlack, justifyContentCenter, marginLeft10, marginRight10, padding15, primaryBackgroundColor, screenheight, secondaryBackgroundColor, textAlignCenter } from '../assets/styles';
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

function OrderCreate({navigation}): JSX.Element {
	let salesmanData = {};
	const [ activityIndicator , setActivityIndicator ] = useState(false);
	const [order_number , setOrderNumber] = useState("order12");
	const [vendor , setVendor] = useState('1');
	const [salesman , setSalesman] = useState('1');
	const [color , setColor] = useState('red');
	const [item , setItem] = useState('test item');
    const [value, setValue] = useState(null);
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

	const [vendorList , SetVendorList] = useState();
	const [salesmanList , SetSalesmanList] = useState();
	const [date, setDate] = useState(new Date())
  	const [open, setOpen] = useState(false)
  	const [showReadyDate, setshowReadyDate] = useState(false)
  	const [showDeliveryDate, setShowDeliveryDate] = useState(false)
  	const [generatingMessage, setGeneratingMessage] = useState('Generating new order')



	const [selectedVendorId , SetSelectedVendorId] = useState();
	const [selectedSalesmanId , SetSelectedSalesmanId] = useState();
	const [selectedVendorName , SetSelectedVendorName] = useState();
	const [selectedSalesmanName , SetSelectedSalesmanName] = useState();

	const [readyDate , SetReadyDate] = useState();
	const [deliveryDate , SetDeliveryDate] = useState();

	const [percentage, setPercentage] = useState(0);

	const videoPlayer = React.useRef();

	async function getUriToBase64(uri) {
		const base64String = await readFile(uri, "base64");
		return base64String
	}
	useEffect(() => {
		getVendorList();
		getSalesmanList();
		setshowReadyDate(false);
		setShowDeliveryDate(false);

		AsyncStorage.getItem('api_token').then((token) => {
			setApiToken(token);
		}).catch((err) => {
			
		});
		return () => {
			setshowReadyDate(false);
			setShowDeliveryDate(false);
		}
		
	} , []);

	let saveOrder = async () => {
		
			setActivityIndicator(true)
			// console.log(order_number)
			if( order_number != '' || order_number != undefined || vendor != '' || vendor != undefined || salesman != '' || salesman != undefined || color != '' || color != undefined || item != '' || item != undefined ){
				// var formData = new FormData();
				// formData.append('order_number', order_number);
				// formData.append('vendor', selectedVendorId);
				// formData.append('salesman', selectedSalesmanId);
				// formData.append('api_token', apitoken);
				// formData.append('color', color);
				// formData.append('item', item);
				// // Attach file
				// formData.append('product_photo', productPhotoData[0]); 
				// formData.append('product_measurement', productMeasurementData[0]); 
				// formData.append('product_video', productVideoData[0]); 

				let data = new FormData();
				data.append('order_number', order_number);
				data.append('vendor', selectedVendorId);
				data.append('salesman', selectedSalesmanId);
				data.append('api_token', apitoken);
				data.append('color', color);
				data.append('item', item);
				// Attach file
				data.append('product_photo', productPhotoData[0]); 
				data.append('product_measurement', productMeasurementData[0]); 
				data.append('product_video', productVideoData[0]); 


				let xhr = new XMLHttpRequest();
				xhr.upload.addEventListener('progress', (event) => {
					if (event.lengthComputable) {
						let percent = Math.round((event.loaded / event.total) * 100);
						setInterval(() => {
							let newPercentage = ((percentage)+3);
							console.log(newPercentage);
							if(((percentage)+3) <= 100 ){
								setPercentage(((percentage)+3));
								console.log(`Upload progress: ${((percentage)+3)}%`);
							}

						} , 3000)

						if( percent == 100 ){
							setActivityIndicator(false)
						}
						// Update progress bar here
					}
				});

				xhr.open('POST', 'https://gullu.suryacontractors.com/public/api/orders/create');
				xhr.send(data);


				// console.log(formData)
				// var xhr = new XMLHttpRequest();
				// xhr.open('POST', 'https://gullu.suryacontractors.com/public/api/orders/create');
				// xhr.send(formData);
				// console.log('xhr');
				// console.log(xhr);
				setTimeout(() => {
					setGeneratingMessage('Uploading Attachments');
				} , 5000)
				// let ress = await fetch('https://gullu.suryacontractors.com/public/api/orders/create', {
				// 	method: 'POST',
				// 	body: formData,
				// 	headers: {
				// 		'Content-Type': 'multipart/form-data; ',
				// 	  },
				// });
				// let response = await ress.json();
				// if(response.data.status == true || response.data.status == 'true'){
				// 	showToast('Order generated');
				// 	navigation.push('orderlist');
				// 	setActivityIndicator(false)
				// }else{
				// 	showToast('error');
				// 	setActivityIndicator(false)
				// }
			}else{
				showToast('Required fields are missing');
			}
			
			return false;


	}
	
	
	const getVendorList = () => {
		AsyncStorage.getItem('api_token').then((token) => {
			let postedData = { role: 'vendor',api_token : token};
			get('users/get' , postedData).then((res) => {
				SetVendorList(res.data.data.data);
				// console.log(res.data.data.data);
			}).catch((err) => {
				// console.log(err)
			});
		}).catch((err) => {

		});
	}
	const getSalesmanList = () => {
		AsyncStorage.getItem('api_token').then((token) => {
			let postedData = { role: 'vendor',api_token : token};
			get('users/get' , postedData).then((res) => {
				SetSalesmanList(res.data.data.data);
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

	}
	const openDeliveryDate = () => {
		setshowReadyDate(false)
		setShowDeliveryDate(true)
	}
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
        <View style={[{},height100 ,primaryBackgroundColor,{}]}>
			<View style={[{} , height100]}>

			{(activityIndicator)? 
				<View style={{zIndex: 99999}}>
					<View style={[{position: 'absolute',top: 0,backgroundColor: secondaryBackgroundColor,left: 0,width: '100%',zIndex: 9999999,opacity: 0.8},screenheight,justifyContentCenter ]}>
						<ActivityIndicator color="white" size={40}></ActivityIndicator>
						<Text style={[{textAlign: 'center',color: '#fff'},h4]}>{generatingMessage}...</Text>
					</View>
				</View>
			:
				null
			}	
				

				
				<View style={[{},height6]}>
                    <HeaderComponent navigation={navigation} title="order create" />
                </View>
				<ScrollView horizontal={false} style={{flex: 1}}>
					<ScrollView>
						
						<View style={[{} , height85]} >
								
							<InputConponents placeholder="Order Number" inputValue={(value:any) => { setOrderNumber(value) }} style={inputStyle} />
							{/* <InputConponents placeholder="Select Vendor" inputValue={(value:any) => { setVendor(value) }} style={inputStyle} />
							<InputConponents placeholder="Select Salesman" inputValue={(value:any) => { setSalesman(value) }} style={inputStyle} /> */}
							<InputConponents placeholder="Color" inputValue={(value:any) => { setColor(value) }} style={inputStyle} />
							<InputConponents placeholder="Item" inputValue={(value:any) => { setItem(value) }} style={inputStyle} />
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
											<FlatList
												data={vendorList}
												renderItem={({item}) => <Item item={item} />}
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
										style={{ backgroundColor: secondaryBackgroundColor,padding:20,borderRadius: 10,width: '50%',marginBottom: 10}}
										onPress={() => setModalVisibleVendor(true)}>
										<Text style={{color: 'white',textAlign: 'center'}}>Select Vendor</Text>
									</Pressable>

									<Text style={[{ paddingVertical: 16 ,textTransform: 'capitalize'} , h4,marginLeft10]}>{selectedVendorName}</Text>
								</View>
								
								<View style={{ flexDirection: 'row' }}>
									<Pressable
										style={{ backgroundColor: secondaryBackgroundColor,padding:20,borderRadius: 10,width: '50%'}}
										onPress={() => setModalVisibleSalesman(true)}>
										<Text style={{color: 'white',textAlign: 'center'}}>Select Salesman</Text>
									</Pressable>
									<Text style={[{ paddingVertical: 16 ,textTransform: 'capitalize'} , h4,marginLeft10]}>{selectedSalesmanName}</Text>
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
									<Pressable onPress={() => openReadyDate()} style={{ backgroundColor: secondaryBackgroundColor,padding:20,borderRadius: 10,width: '50%',marginBottom: 10}}>
										<Text style={{color: 'white',textAlign: 'center'}}>Select Ready Date </Text>
									</Pressable>
									{(readyDate != undefined)?
									
										<View>
											<Text style={[{ paddingVertical: 16 ,textTransform: 'capitalize'} , h4,marginLeft10]}>{readyDate.toString().substring(4, 15)}</Text>
										</View>
										:
										null
									}
								</View>
							
								
								<View style={{ flexDirection: 'row' }}>
									<Pressable onPress={() => openDeliveryDate()} style={{ backgroundColor: secondaryBackgroundColor,padding:20,borderRadius: 10,width: '50%'}}>
										<Text style={{color: 'white',textAlign: 'center'}}>Select Delivery Date</Text>
									</Pressable>
									{(deliveryDate != undefined)?
									
										<View>
											<Text style={[{ paddingVertical: 16 ,textTransform: 'capitalize'} , h4,marginLeft10]}>{deliveryDate.toString().substring(4, 15)}</Text>
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
									} catch (e) {
										handleError(e)
									}
									}}
									style={[{width: 'auto',backgroundColor: secondaryBackgroundColor,borderRadius: 10,marginBottom: 10},padding15,justifyContentCenter]}
								>
									<Text style={{color: '#fff',textAlign: 'center'}}>Upload Product Image</Text>
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
									} catch (e) {
										handleError(e)
									}
									}}
									style={[{width: 'auto',backgroundColor: secondaryBackgroundColor,borderRadius: 10,marginBottom: 10},padding15,justifyContentCenter]}
								>
									<Text style={{color: '#fff',textAlign: 'center'}}>Upload Product Measurement</Text>
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
											type: [types.video]
										});
										setPrductVideoType(pickerResult[0].type);
										setProductVideoData(pickerResult);
									} catch (e) {
										handleError(e)
									}
									}}
									style={[{width: 'auto',backgroundColor: secondaryBackgroundColor,borderRadius: 10,marginBottom: 10},padding15,justifyContentCenter]}
								>
									<Text style={{color: '#fff',textAlign: 'center'}}>Upload Product Video</Text>
								</TouchableOpacity>
								{(productVideoData != undefined && productVideoData.length > 0)?
									<View style={{width: '100%' , height: 400}}>
										<Video source={{uri: productVideoData[0].fileCopyUri }}
											
											style={styles.backgroundVideo}
											controls={true}
											ref={ref => (videoPlayer.current = ref)}
											resizeMode="contain"
											paused={true}
										/>
									</View>
									
								:
									null
								}
							</View>

							
							<View style={{alignItems: 'center'}}>
								<TouchableOpacity onPress={() => {saveOrder()}} style={[{width: 'auto',backgroundColor: secondaryBackgroundColor,borderRadius: 10},padding15,justifyContentCenter]} >
									<Text style={[{color: '#fff'} , h3,textAlignCenter]}>Generate New Order</Text>
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
	  marginTop: StatusBar.currentHeight || 0,
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
		marginTop: 22,
	  },
	  modalView: {
		borderColor: '#ededed',
		borderWidth: 2,
		margin: 20,
		width: '80%',
		height: 400,
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
