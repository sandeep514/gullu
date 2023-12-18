import React, { memo, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	useColorScheme,
	View,
} from 'react-native';

import {
	Colors,
} from 'react-native/Libraries/NewAppScreen';

import InputConponents from '../components/InputComponents';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';

import {  h3, height100, height6, height85, height9, inputStyle, justifyContentCenter, padding15, primaryBackgroundColor, secondaryBackgroundColor, textAlignCenter,gulluColor,primaryGulluLightBackgroundColor, inputStyleBlack, height8, height83 } from '../assets/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, post, showToast } from '../services/services';

function VendorEdit({navigation , route}): JSX.Element {
	const [loader , setLoader ] = useState(false);
	const [getLoader , setGetLoader ] = useState(false);
	const [data , SetData ] = useState({});

	const [name , setName ] = useState();
	const [email , setEmail ] = useState();
	const [code , setCode ] = useState();
	const [password , setPassword ] = useState();
	const [phone , setPhone ] = useState();
	const [role , setRole ] = useState(2);

  	const isDarkMode = useColorScheme() === 'dark';
  	useEffect(()=> {
        var vendorId = route.params.vendorId;
        getVendorDetails(vendorId);
        // console.log("jik");
	} , []);

    const getVendorDetails = (vendorId) => {
		setGetLoader(true)
		AsyncStorage.getItem('id').then((token) => {
			let postedData = {role:'vendor', id: vendorId, api_token : token};
			get('users/get' , postedData).then((res) => {
				console.log(res.data.data.data);
				setGetLoader(false)
				SetData(res.data.data.data);

				setName(res.data.data.data.name);
				setEmail(res.data.data.data.email);
				setCode(res.data.data.data.code);
				setPassword(res.data.data.data.password);
				setPhone(res.data.data.data.phone);
			}).catch((err) => {
				setGetLoader(false)
				// console.log(err)
			});

		}).catch((err) => {
			setGetLoader(false)
		});
	}

	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};
	
	const submitVendor = () => {                                                                                                                 
		setLoader(true)
		console.log(name
			,email
			,code
			,phone)
		AsyncStorage.getItem('id').then((token) => {
			if( phone.length == 10){
				if( name != '' && email != '' && code != '' && phone != ''){
					let postedData = { name : name , email: email, code : code , password: password , phone: phone , role: role ,api_token : token , id: data.id};
					post('/users/edit' , postedData).then((res) => {
						showToast(res.message);
						getVendorDetails(data.id);
						setLoader(false);
					}).catch((err) => {
						// console.log(err);
						setLoader(false);
						showToast(err.message);
					});
				}else{
					showToast("Required field is missing.");
					setLoader(false);
				}
			}else{
				showToast("Mobile number should be 10 digit.");
				setLoader(false);
			}
		}).catch(() => {
			setLoader(false);
		});
	}


  return (
    <SafeAreaView style={{backgroundColor: '#ededed'}}>
			<StatusBar
				backgroundColor={gulluColor}
			/>
			<View style={[height100, primaryGulluLightBackgroundColor]}>
			<View style={[{} , height100]}>
				<View style={[{},height8]}>
                    <HeaderComponent navigation={navigation} title="Vendor edit" />
                </View>
				<View style={[{} , height83]} >
					{(getLoader)?
						<ActivityIndicator size={20} color={gulluColor} />
					:
						<View>
							<InputConponents value={data.name} placeholder="Name" inputValue={(value:any) => { setName(value) }} style={inputStyleBlack} />
							<InputConponents value={data.email} placeholder="Email" inputValue={(value:any) => { setEmail(value) }} style={inputStyleBlack} />
							<InputConponents value={data.code} placeholder="Code" inputValue={(value:any) => { setCode(value) }} style={inputStyleBlack} />
							<InputConponents value={data.password} placeholder="Password" inputValue={(value:any) => { setPassword(value) }} style={inputStyleBlack} />
							<InputConponents value={data.phone} placeholder="Phone" inputValue={(value:any) => { setPhone(value) }} style={inputStyleBlack} />

							{(!loader)?
							<View style={{alignItems: 'center'}}>
								<TouchableOpacity onPress={() => { submitVendor() }} style={[{width: 'auto',backgroundColor: gulluColor,borderRadius: 10},padding15,justifyContentCenter]} >
									<Text style={[{color: '#fff'} , h3,textAlignCenter]}>Update Vendor</Text>
								</TouchableOpacity>
							</View>
							:
								<View style={{alignItems: 'center'}}>
									<View style={[{width: 'auto',backgroundColor: gulluColor,borderRadius: 10},padding15,justifyContentCenter]} >
										<ActivityIndicator color={'white'} ></ActivityIndicator>
									</View>
								</View>
							}
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
	  backgroundColor: secondaryBackgroundColor,
	  padding: 15,
	  marginVertical: 8,
	  marginHorizontal: 16,
	  borderRadius: 10
	},
  });

export default memo(VendorEdit);
