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
  ImageBackground,
  Dimensions
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
import { h3, h4, height100, height6, height85, height9, inputStyleBlack, justifyContentCenter, padding15, primaryBackgroundColor, screenheight, secondaryBackgroundColor, textAlignCenter } from '../assets/styles';
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

function OrderCreate({navigation}): JSX.Element {
	const [ activityIndicator , setActivityIndicator ] = useState(false);
	const [order_number , setOrderNumber] = useState();
	const [vendor , setVendor] = useState('1');
	const [salesman , setSalesman] = useState('1');
	const [color , setColor] = useState('red');
	const [item , setItem] = useState('test item');
    const [value, setValue] = useState(null);


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

	const videoPlayer = React.useRef();

	async function getUriToBase64(uri) {
		const base64String = await readFile(uri, "base64");
		return base64String
	}
	useEffect(() => {
		AsyncStorage.getItem('api_token').then((token) => {
			setApiToken(token);
		}).catch((err) => {
			
		});
		
	} , []);

	let saveOrder = async () => {
		
			setActivityIndicator(true)
			console.log(order_number)
			if( order_number != '' && order_number != undefined && vendor != '' && vendor != undefined && salesman != '' && salesman != undefined && color != '' && color != undefined && item != '' && item != undefined ){
				var formData = new FormData();
				formData.append('order_number', '999999');
				formData.append('vendor', 1);
				formData.append('salesman', 1);
				formData.append('api_token', apitoken);
				formData.append('color', 'red');
				formData.append('item', 'previewImg');
				// Attach file
				formData.append('product_photo', productPhotoData[0]); 
				formData.append('product_measurement', productMeasurementData[0]); 
				formData.append('product_video', productVideoData[0]); 
				console.log(formData)
				// var xhr = new XMLHttpRequest();
				// xhr.open('POST', 'https://gullu.suryacontractors.com/public/api/orders/create');
				// xhr.send(formData);
				// console.log('xhr');
				// console.log(xhr);
				let ress = await fetch('https://gullu.suryacontractors.com/public/api/orders/create', {
					method: 'POST',
					body: formData,
					headers: {
						'Content-Type': 'multipart/form-data; ',
					  },
				});
				let response = await ress.json();
				if(response.data.status == true || response.data.status == 'true'){
					showToast('Order generated');
					setActivityIndicator(false)
				}else{
					showToast('error');
					setActivityIndicator(false)
				}
			}else{
				showToast('Required fields are missing');
			}
			
			return false;


	}
	
	
	useEffect(() => {
		getVendorList();
		getSalesmanList();
	} , []);
	const getVendorList = () => {
		AsyncStorage.getItem('api_token').then((token) => {
			let postedData = { role: 'vendor',api_token : token};
			get('users/get' , postedData).then((res) => {
				SetVendorList(res.data.data.data);
				console.log(res.data.data.data);
			}).catch((err) => {
				console.log(err)
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
				console.log(err)
			});
		}).catch((err) => {
		
		});
	}
	useEffect(() => {
		// if( productPhotoData.length > 0){
		// 	getUriToBase64(productPhotoData[0].fileCopyUri).then((ees) => {
		// 		setPrductPhotoResult(ees);
		// 	});
		// }
	}, [productPhotoData]);

	useEffect(() => {
		// if( productMeasurementData.length > 0){
		// 	getUriToBase64(productMeasurementData[0].fileCopyUri).then((ees) => {
		// 		setProductMeasurementResult(ees);
		// 	});
		// }
	}, [productMeasurementData]);

	useEffect(() => {
		// if( productVideoData.length > 0){
		// 	getUriToBase64(productVideoData[0].fileCopyUri).then((ees) => {
		// 		setProductVideoResult(ees);
		// 	});
		// }
	}, [productVideoData]);

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

const openReadyDate = () => {
	setshowReadyDate(true)
}
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
        <View style={[{},height100 ,primaryBackgroundColor,{}]}>
			<View style={[{} , height100]}>

			{/* {(activityIndicator)? 
				<View style={{zIndex: 99999}}>
					<View style={[{position: 'absolute',top: 0,backgroundColor: secondaryBackgroundColor,left: 0,width: '100%',zIndex: 9999999,opacity: 0.8},screenheight,justifyContentCenter ]}>
						<ActivityIndicator color="white" size={40}></ActivityIndicator>
						<Text style={[{textAlign: 'center',color: '#fff'},h4]}>Generatig new order...</Text>
					</View>
				</View>
			:
				null
			}	 */}
				

				
				<View style={[{},height6]}>
                    <HeaderComponent navigation={navigation} title="order create" />
                </View>
				<ScrollView>
					<View style={[{} , height85]} >
							
						<InputConponents placeholder="order number" inputValue={(value:any) => { setOrderNumber(value) }} style={inputStyleBlack} />
						<InputConponents placeholder="vendor id" inputValue={(value:any) => { setVendor(value) }} style={inputStyleBlack} />
						<InputConponents placeholder="salesman id" inputValue={(value:any) => { setSalesman(value) }} style={inputStyleBlack} />
						<InputConponents placeholder="color" inputValue={(value:any) => { setColor(value) }} style={inputStyleBlack} />
						<InputConponents placeholder="item" inputValue={(value:any) => { setItem(value) }} style={inputStyleBlack} />
						{/* <Dropdown
							style={inputStyleBlack}
							placeholderStyle={styles.placeholderStyle}
							selectedTextStyle={styles.selectedTextStyle}
							inputSearchStyle={styles.inputSearchStyle}
							iconStyle={styles.iconStyle}
							data={vendorList}
							search
							maxHeight={300}
							labelField="name"
							valueField="id"
							placeholder="Select Vendor"
							searchPlaceholder="Search..."
							// value={value}
							// onChange={item => {
							// 	setValue(item.value);
							// }}
							// renderLeftIcon={() => (
							// 	// <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
							// )}
						/> */}
						{/* <Dropdown
							style={inputStyleBlack}
							placeholderStyle={styles.placeholderStyle}
							selectedTextStyle={styles.selectedTextStyle}
							inputSearchStyle={styles.inputSearchStyle}
							iconStyle={styles.iconStyle}
							data={salesmanList}
							search
							maxHeight={300}
							labelField="name"
							valueField="id"
							placeholder="Select salesman"
							searchPlaceholder="Search..."
							// value={value}
							// onChange={item => {
							// 	setValue(item.value);
							// }}
							// renderLeftIcon={() => (
							// 	// <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
							// )}
						/> */}
						<Button title="Open" onPress={() => openReadyDate()} />
						{( showReadyDate )?
							<DatePicker
								style={{width: 200}}
								date={new Date()}
								value={new Date()}
								mode="date"
								placeholder="select date"
								format="YYYY-MM-DD"
								minDate="2016-05-01"
								maxDate="2016-06-01"
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
								// ... You can check the source to find the other keys.
								}}
								onDateChange={(date) => {this.setState({date: date})}}
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
  });
export default OrderCreate;
