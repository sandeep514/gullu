import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
	Button,
	FlatList,
	Image,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	Alert, Modal,
	TouchableOpacity,
	useColorScheme,
	View,
	Pressable,
	ImageBackground,
	ActivityIndicator
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
import { flexDirectionRow, h3, h4, h5, height100, height6, height85, height9, inputStyleBlack, justifyContentCenter, marginRight10, marginTop10, padding10, padding15, primaryBackgroundColor, secondaryBackgroundColor, textAlignCenter,gulluColor,primaryGulluLightBackgroundColor, height8, height83 } from '../assets/styles';
import InputConponents from '../components/InputComponents';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import { decode as atob, encode as btoa } from 'base-64'
import { readFile } from "react-native-fs";
import Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { imagePath } from '../services/Client';
import { get } from '../services/services';



function OrderEdit({ navigation, route }): JSX.Element {
	const [item, setItem] = useState();
	const [role, setRole] = useState();
	const [modalVisible, setModalVisible] = useState(false);
	const [modalVisibleImage, setModalVisibleImage] = useState(false);
	const [selectedImage, setSelectedImage] = useState();
	const [loader, setLoader] = useState(false);
	const [dataUpdated, setDataUpdated] = useState(false);
	const [loadStart, setLoadStart] = useState(false);

	const videoPlayer = React.useRef();

	async function getUriToBase64(uri) {
		const base64String = await readFile(uri, "base64");
		return base64String
	}
	useEffect(() => {
		if( !dataUpdated ){
			setItem(route.params.orderData);
		}

		AsyncStorage.getItem('id').then((token) => {
			// console.log(token);
		}).catch((err) => {

		});
		AsyncStorage.getItem('role').then((role) => {
			setRole(role);
		}).catch((err) => {

		});

	}, [])
	const updateOrder = (status) => {
		setLoader(true);
		AsyncStorage.getItem('id').then((token) => {
			let postedData = { 'status': status,'api_token' : token ,'applicationId' : item?.id };
			get('/update/order/status' , postedData).then((res) => {
				// console.log(res.data.data.data);			
				setItem(res.data.data.data);
				setLoader(false);
				setDataUpdated(true);
			}).catch((err) => {
				setLoader(false);
				// console.log(err)
			});

		}).catch((err) => {
			setLoader(false);
		});
		
	}



	const isDarkMode = useColorScheme() === 'dark';

	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};


	return (
		<SafeAreaView style={{backgroundColor: '#ededed'}}>
			<StatusBar
				backgroundColor={gulluColor}
			/>
			<View style={[height100, primaryGulluLightBackgroundColor]}>
				<View style={[{}, height100]}>
					<View style={[{}, height8]}>
						<HeaderComponent navigation={navigation} title="order edit" />
					</View>
					<ScrollView>
						<View style={[{}, height83]} >
							{(item != undefined) ?
								<View style={[{}, flexDirectionRow, padding10]}>
									<View style={[marginRight10, { width: '100%', overflow: 'hidden' }]}>
										<View style={{flexDirection: 'row'}}>
											<View style={{width: '100%'}}>
												<View style={[{}, flexDirectionRow]}>
													<Text style={[{ fontWeight: 'bold' }, h4, marginRight10 ,{color: gulluColor}]}>Order Number</Text>
													<Text style={[{ marginTop: 0 }, h4 , {color: gulluColor}]}>{item?.order_number}</Text>
												</View>
												<View style={[{}, flexDirectionRow]}>
													<Text style={[{ fontWeight: 'bold' }, h4, marginRight10 ,{color: gulluColor}]}>Item </Text>
													<Text style={[{ marginTop: 0 }, h4 , {color: gulluColor}]}>{item?.item} </Text>
												</View>
												<View style={[{}, flexDirectionRow]}>
													<Text style={[{ fontWeight: 'bold' }, h4, marginRight10 ,{color: gulluColor}]}>Color</Text>
													<Text style={[{ marginTop: 0 }, h4 , {color: gulluColor}]}>{item?.color}</Text>
												</View>
												<View style={[{}, flexDirectionRow]}>
													<Text style={[{ fontWeight: 'bold' }, h4, marginRight10 ,{color: gulluColor}]}>Salesman</Text>
													<Text style={[{ marginTop: 0 }, h4 , {color: gulluColor}]}>{item?.salesman.name}</Text>
												</View>
												<View style={[{}, flexDirectionRow]}>
													<Text style={[{ fontWeight: 'bold' }, h4, marginRight10 ,{color: gulluColor}]}>Vendor</Text>
													<Text style={[{ marginTop: 0 }, h4 , {color: gulluColor}]}>{item?.vendor.name}</Text>
												</View>
											</View>
											
										</View>
										
										{/* <View style={[{width: '100%'}, marginTop10]}>
											{( item?.attachments.length > 0)? <ImageBackground source={{uri: imagePath+''+item?.attachments[0].attachment }} resizeMode="contain" style={{height: 400 , width: '100%'}} /> : ''}
										</View> */}

										<Text style={{fontWeight: 'bold' , fontSize: 30 , color: secondaryBackgroundColor}}>Order Attachments</Text>
										<View style={[{ width: '100%',flexDirection: 'row',flexWrap: 'wrap' }, marginTop10]}>
											
											{item?.attachments.map((attachment) => {
												return (
													(attachment.attachment_type.includes('video')) ?
														<View style={{marginVertical: 20,width: '100%'}}>
															<Modal
																animationType="slide"
																transparent={true}
																visible={modalVisible}
																onRequestClose={() => {
																	// Alert.alert('Modal has been closed.');
																	setModalVisible(!modalVisible);
																}}>
																<View style={styles.centeredView}>
																	<View style={styles.modalView}>
																		<View style={{ width: '100%', height: 400, paddingVertical: 20 }}>
																			<Video source={{ uri: imagePath + '' + attachment.attachment }}
																				style={styles.backgroundVideo}
																				controls={true}
																				ref={ref => (videoPlayer.current = ref)}
																				resizeMode={"contain"}
																				paused={false}
																				onLoad={() => { console.log("jnk"); }}
																				onLoadStart={() => { setLoadStart(true); }}
																				onBuffer={() => { console.log("onBuffer"); }}
																			/>
																			{(loadStart)?
																				<View style={[{},justifyContentCenter]}>
																					<Text style={{textAlign: 'center'}}>Loading Video...</Text>
																				</View>
																			:
																				null
																			}

																		</View>
																		<Pressable
																			style={[styles.button, styles.buttonClose]}
																			onPress={() => setModalVisible(!modalVisible)}>
																			<Text style={styles.textStyle}>Hide</Text>
																		</Pressable>
																	</View>
																</View>
															</Modal>
															<Pressable
																style={[styles.button, styles.buttonOpen]}
																onPress={() => setModalVisible(true)}>
																<Text style={styles.textStyle}>Show video attachment</Text>
															</Pressable>
														</View>
													:
														(attachment.attachment_type.includes('image')) ?
															<View style={[{height: 200, width: '47%' }, marginTop10,marginRight10]} >
																<Pressable onPress={() => { setSelectedImage(imagePath + '' + attachment.attachment),setModalVisibleImage(true) }}>
																	<ImageBackground source={{ uri: imagePath + '' + attachment.attachment }} resizeMode="contain" style={{ height: '100%', width: '100%' }} />
																</Pressable>
															</View>
														:
														null
												)
											})}
										</View>
										<Modal
											animationType="slide"
											transparent={true}
											visible={modalVisibleImage}
											onRequestClose={() => {
												// Alert.alert('Modal has been closed.');
												setModalVisibleImage(!modalVisibleImage);
											}}>
											<View style={styles.centeredView}>
												<View style={styles.modalView}>
													<View style={{ width: '100%', height: 400, paddingVertical: 20}}>
														<Image source={{uri : selectedImage}}  resizeMode="contain" style={{ height: '100%', width: '100%' }} />
													</View>
													<Pressable
														style={[styles.button, styles.buttonClose]}
														onPress={() => setModalVisibleImage(!modalVisibleImage)}>
														<Text style={styles.textStyle}>Hide</Text>
													</Pressable>
												</View>
											</View>
										</Modal>
										<View>
											<Text style={{fontWeight: 'bold' , fontSize: 30 , color: secondaryBackgroundColor}}>Order Status: {(item?.status == 1)? 'Pending' : (item?.status == 2)? 'Ready' : 'Delivered'}</Text>

											<View style={{width: '100%'}}>
												<Text style={{color: gulluColor , fontWeight: 'bold'}}>Order Placed on {item?.date} </Text>
											</View>

											<View style={{padding: 10}}>
												<View style={{borderLeftColor: secondaryBackgroundColor, borderLeftWidth: 2,borderStyle: 'dashed', height: 100}} >
												</View>
											</View>

											{( item?.status == 2 || item?.status == 3 )?
												<View style={{width: '100%'}}>
													<Text style={{color: gulluColor , fontWeight: 'bold'}}>Order Ready </Text>
												</View>
											:
												null
											}
											


											{( role == 1 && item?.status == 1)?
												<View style={{width: '100%'}}>
													<Text style={{color: secondaryBackgroundColor}}>Order not Ready yet.</Text>
												</View>
											:
												null
											}
											{( role == 2 && item?.status == 1)?
													<View>
														<View style={{width: '100%'}}>
															<Text style={{color: secondaryBackgroundColor}}>Order not Ready yet.</Text>
														</View>
														<View style={{width: '70%'}}>
															<Pressable
																style={{backgroundColor: secondaryBackgroundColor,paddingVertical: 10,borderRadius: 10}}
																onPress={() => updateOrder(2)}>
																<Text style={styles.textStyle}>Update order status to READY</Text>
																{(loader)?
																	<ActivityIndicator size={20} color={gulluColor} />
																: 
																	null
																}
															</Pressable>
														</View>
													</View>
												:
												null
											}
											<View style={{padding: 10}}>
												<View style={{borderLeftColor: secondaryBackgroundColor, borderLeftWidth: 2,borderStyle: 'dashed', height: 100}} >
												</View>
											</View>
										{( item?.status == 3)?
											<View style={{width: '100%'}}>
												<Text style={{color: gulluColor, fontWeight: 'bold'}}>Order Delivered </Text>
											</View>
										:
											null
										}
										
											{( item?.status != 3)?
												<View style={{width: '100%'}}>
													<Text style={{color: secondaryBackgroundColor}}>Order not delivered yet.</Text>
												</View>
											:
											null
											}
												{( item?.status != 3 && role == 3 || item?.status != 3 && role == 1)?
													<View>
														<View style={{width: '70%'}}>
															<Pressable
																style={{backgroundColor: secondaryBackgroundColor,paddingVertical: 10,borderRadius: 10}}
																onPress={() => updateOrder(3)}>
																<Text style={styles.textStyle}>Update order status to DELIVERED</Text>
																{(loader)?
																	<ActivityIndicator size={20} color={gulluColor} />
																: 
																	null
																}
															</Pressable>
														</View>
													</View>
												:
												null
											}


										</View>
									</View>
								</View>
							:
								null
							}
						</View>
					</ScrollView>
					<View style={[{}, height9]}>
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
		height: '100%',
		width: '100%'
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		width: '100%',
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
		width: '100%'
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
		width: '100%'
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
export default OrderEdit;
