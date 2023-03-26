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
  Alert, Modal, 
  TouchableOpacity,
  useColorScheme,
  View,
  Pressable,
  ImageBackground
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
import { flexDirectionRow, h3, h5, height100, height6, height85, height9, inputStyleBlack, justifyContentCenter, marginRight10, marginTop10, padding10, padding15, primaryBackgroundColor, secondaryBackgroundColor, textAlignCenter } from '../assets/styles';
import InputConponents from '../components/InputComponents';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';
import {decode as atob, encode as btoa} from 'base-64'
import { readFile } from "react-native-fs";
import  Video from 'react-native-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { imagePath } from '../services/Client';



function OrderEdit({navigation , route}): JSX.Element {
	const [item , setItem] = useState();
    const [modalVisible, setModalVisible] = useState(false);

	const videoPlayer = React.useRef();

	async function getUriToBase64(uri) {
		const base64String = await readFile(uri, "base64");
		return base64String
	}
	useEffect(() => {
       setItem(route.params);
       console.log(route.params.orderData.attachments[1]);
		AsyncStorage.getItem('api_token').then((token) => {
			console.log(token);
		}).catch((err) => {
			
		});
		
	}, [])
	
	


  	const isDarkMode = useColorScheme() === 'dark';
  
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
                        {( item != undefined)?
                        
                        <View style={[{} , flexDirectionRow,padding10]}>
                            <View style={[marginRight10,{width:'100%',overflow: 'hidden' }]}>
                                <View style={[{} , flexDirectionRow]}> 
                                    <Text style={[{fontWeight: 'bold'},h5,marginRight10]}>Order Number</Text>
                                    <Text style={[{marginTop: 0},h5]}>{item?.orderData?.order_number}</Text>
                                </View>
                                <View style={[{} , flexDirectionRow]}> 
                                    <Text style={[{fontWeight: 'bold'},h5,marginRight10]}>Item </Text>
                                    <Text style={[{marginTop: 0},h5]}>{item?.orderData?.item} </Text>
                                </View>
                                <View style={[{} , flexDirectionRow]}> 
                                    <Text style={[{fontWeight: 'bold'},h5,marginRight10]}>Color</Text>
                                    <Text style={[{marginTop: 0},h5]}>{item?.orderData?.color}</Text>
                                </View>
                                <View style={[{} , flexDirectionRow]}> 
                                    <Text style={[{fontWeight: 'bold'},h5,marginRight10]}>Salesman</Text>
                                    <Text style={[{marginTop: 0},h5]}>{item?.orderData?.salesman.name}</Text>
                                </View>
                                <View style={[{} , flexDirectionRow]}> 
                                    <Text style={[{fontWeight: 'bold'},h5,marginRight10]}>Vendor</Text>
                                    <Text style={[{marginTop: 0},h5]}>{item?.orderData?.vendor.name}</Text>
                                </View>
                                {/* <View style={[{width: '100%'}, marginTop10]}>
                                    {( item?.orderData?.attachments.length > 0)? <ImageBackground source={{uri: imagePath+''+item?.orderData?.attachments[0].attachment }} resizeMode="contain" style={{height: 400 , width: '100%'}} /> : ''}
                                </View> */}
                                <View style={[{width: '100%'}, marginTop10]}>
                                {item?.orderData?.attachments.map((attachment) =>{
                                    return(
                                        <View key={attachment.id}>
                                            
                                            {( attachment.attachment_type.includes('video') )?
                                               <View>
                                                    <Modal
                                                        animationType="slide"
                                                        transparent={true}
                                                        visible={modalVisible}
                                                        onRequestClose={() => {
                                                        Alert.alert('Modal has been closed.');
                                                        setModalVisible(!modalVisible);
                                                    }}>
                                                    <View style={styles.centeredView}>
                                                    <View style={styles.modalView}>
                                                        <View style={{width: '100%' , height: 400,paddingVertical: 20}}>
                                                            <Video source={{uri: imagePath+''+attachment.attachment }}
                                                                
                                                                style={styles.backgroundVideo}
                                                                controls={true}
                                                                ref={ref => (videoPlayer.current = ref)}
                                                                resizeMode="stretch"
                                                                paused={false}
                                                                onBuffer={() => {console.log("jere")}} 
                                                            />
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
                                            
                                                ( attachment.attachment_type.includes('image') )?
                                                    <View style={[{width: '100%'}, marginTop10]}>
                                                        <ImageBackground source={{uri: imagePath+''+attachment.attachment }} resizeMode="contain" style={{height: 400 , width: '100%'}} />
                                                    </View>
                                                :
                                                    null
                                            }
                                        </View>
                                    )
                                    
                                })}
                                
                               
                                </View>
                            </View>
						</View>
                        :
                            null
                        }
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
export default OrderEdit;
