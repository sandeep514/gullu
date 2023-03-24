/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

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
  View,
} from 'react-native';
import DocumentPicker, {
	DirectoryPickerResponse,
	DocumentPickerResponse,
	isInProgress,
	types,
  } from 'react-native-document-picker'
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { cardBackgroundColor, h1, h2, h3, height10, height100, height14, height15, height20, height4, height5, height50, height6, height80, height82, height84, height85, height87, height9, height90, height92, inputStyleBlack, justifyContentCenter, padding15, padding20, primaryBackgroundColor, primaryColor, screenheight, secondaryBackgroundColor, textAlignCenter } from '../assets/styles';
import InputConponents from '../components/InputComponents';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import {decode as atob, encode as btoa} from 'base-64'
import { readFile } from "react-native-fs";
import  Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';



function OrderCreate({navigation}): JSX.Element {
	const [order_number , setOrderNumber] = useState("10024");
	const [vendor , setVendor] = useState('1');
	const [salesman , setSalesman] = useState('1');
	const [color , setColor] = useState('red');
	const [item , setItem] = useState('test item');


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
	
	async function getUriToBase64(uri) {
		const base64String = await readFile(uri, "base64");
		return base64String
	}
	useEffect(() => {
		// console.log({order_number : order_number,
		// 	vendor : vendor,
		// 	salesman : salesman,
		// 	color : color,
		// 	item : item,
		// 	product_photo : product_photo,
		// 	product_photo_type : product_photo_type,
		// 	product_measurement : product_measurement,
		// 	product_measure_type : product_measure_type,
		// 	product_video : product_video,
		// 	product_video_type : product_video_type});
	})
	let saveOrder = async () => {

			var formData = new FormData();
			formData.append('order_number', '999999');
			formData.append('vendor', 'general');
			formData.append('salesman', 'previewImg');
			formData.append('api_token', '9n5VdBylMqd2VLenUsGNaShQJMA6Er8bd1YCzeVBd0sgLHqvrJcgHzRfeR1B');
			formData.append('color', 'previewImg');
			formData.append('item', 'previewImg');
			// Attach file
			formData.append('product_photo', productPhotoData[0].fileCopyUri); 
			formData.append('product_measurement', productMeasurementData[0].fileCopyUri); 
			formData.append('product_video', productVideoData[0].fileCopyUri); 

			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'http://gullu.suryacontractors.com/public/api/orders/create');
			xhr.send(formData);
			console.log("jnk");
			return false;
			// console.log(productPhotoData[0].fileCopyUri);
			// console.log(productMeasurementData[0].fileCopyUri);
			// console.log(productVideoData[0].fileCopyUri);
			
			let res = await fetch('http://gullu.suryacontractors.com/public/api/orders/create', {
				method: 'POST',
				body: formData,
				headers: {
					'Content-Type': 'multipart/form-data; ',
				  },
			});
			// .then((res) => {
			// 	console.log("here");
			// 	// console.log(res.json());
			// }).catch((err) => {
			// 	console.log('hnjknk');
			// 	console.log(err)
			// });
			console.log(await res.json());
			// console.log();
			
		

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


  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
        <View style={[{},height100 ,primaryBackgroundColor,{}]}>
			<View style={[{} , height100]}>
				<View style={[{},height6]}>
                    <HeaderComponent navigation={navigation} title="order create" />
                </View>
				<ScrollView>
					<View style={[{} , height85]} >
						
						<InputConponents placeholder="order_number" inputValue={(value:any) => { setOrderNumber(value) }} style={inputStyleBlack} />
						<InputConponents placeholder="vendor_id" inputValue={(value:any) => { setVendor(value) }} style={inputStyleBlack} />
						<InputConponents placeholder="salesman_id" inputValue={(value:any) => { setSalesman(value) }} style={inputStyleBlack} />
						<InputConponents placeholder="color" inputValue={(value:any) => { setColor(value) }} style={inputStyleBlack} />
						<InputConponents placeholder="item" inputValue={(value:any) => { setItem(value) }} style={inputStyleBlack} />
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

							{(prductPhotoResult != undefined && prductPhotoResult.length > 0)?
								<Image source={{uri:'data:image/png;base64,'+prductPhotoResult}} style={{ height: 200,width: 200 }}/>
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

							{(productMeasurementResult != undefined && productMeasurementResult.length > 0)?
								<Image source={{uri:'data:image/png;base64,'+productMeasurementResult}} style={{ height: 200,width: 200 }}/>
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
							{(productVideoResult != undefined && productVideoResult.length > 0)?
								<Text>{productVideoResult}here</Text>
								:
								null
							}
						</View>

						{/* product_photo */}
						{/* product_video */}
						{/* product_measurement */}
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
	  position: 'absolute',
	  top: 0,
	  left: 0,
	  bottom: 0,
	  right: 0,
	  height: 200,
	  width: 200
	},
  });
export default OrderCreate;
