import React, { useEffect, useState } from 'react';
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

import {  h3, height100, height6, height85, height9, inputStyle, justifyContentCenter, padding15, primaryBackgroundColor, secondaryBackgroundColor, textAlignCenter } from '../assets/styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get, post, showToast } from '../services/services';

function SalesmanEdit({navigation , route}): JSX.Element {
	const [loader , setLoader ] = useState(false);
	const [getLoader , setGetLoader ] = useState(false);
	const [data , SetData ] = useState({});

	const [name , setName ] = useState('');
	const [email , setEmail ] = useState('');
	const [code , setCode ] = useState('');
	const [password , setPassword ] = useState('');
	const [phone , setPhone ] = useState('');
	const [role , setRole ] = useState(2);

  	const isDarkMode = useColorScheme() === 'dark';
  	useEffect(()=> {
        var salesmanId = route.params.salesmanId;
        getSalesmanDetails(salesmanId);
        // console.log("jik");
	} , []);
    const getSalesmanDetails = (salesmanId) => {
		setGetLoader(true)
		AsyncStorage.getItem('api_token').then((token) => {
			let postedData = {role:'salesman', id: salesmanId, api_token : token};
			get('users/get' , postedData).then((res) => {
				setGetLoader(false)
				SetData(res.data.data.data);
				
				setName(data.name);
				setEmail(data.email);
				setCode(data.code);
				setPassword(data.password);
				setPhone(data.phone);
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
	const submitSalesman = () => {                                                                                                                 
		setLoader(true)
		AsyncStorage.getItem('api_token').then((token) => {
			if(phone.length == 10){
				if( name != '' && email != '' && code != '' && phone != ''){
					let postedData = { name : name , email: email, code : code , password: password , phone: phone , role: role ,api_token : token , id: data.id};
					post('/users/edit' , postedData).then((res) => {
						showToast(res.message);
						getSalesmanDetails(data.id);
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
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
        <View style={[{},height100 ,primaryBackgroundColor,{}]}>
			<View style={[{} , height100]}>
				<View style={[{},height6]}>
                    <HeaderComponent navigation={navigation} title="Salesman edit" />
                </View>
				<View style={[{} , height85]} >
					{(getLoader)?
						<ActivityIndicator size={20} color="white" />
					:
						<View>
							<InputConponents value={data.name} placeholder="Name" inputValue={(value:any) => { setName(value) }} style={inputStyle} />
							<InputConponents value={data.email} placeholder="Email" inputValue={(value:any) => { setEmail(value) }} style={inputStyle} />
							<InputConponents value={data.code} placeholder="Code" inputValue={(value:any) => { setCode(value) }} style={inputStyle} />
							<InputConponents value={data.password} placeholder="Password" inputValue={(value:any) => { setPassword(value) }} style={inputStyle} />
							<InputConponents value={data.phone} placeholder="Phone" inputValue={(value:any) => { setPhone(value) }} style={inputStyle} />

							{(!loader)?
							<View style={{alignItems: 'center'}}>
								<TouchableOpacity onPress={() => { submitSalesman() }} style={[{width: 'auto',backgroundColor: secondaryBackgroundColor,borderRadius: 10},padding15,justifyContentCenter]} >
									<Text style={[{color: '#fff'} , h3,textAlignCenter]}>Update Salesman</Text>
								</TouchableOpacity>
							</View>
							:
								<View style={{alignItems: 'center'}}>
									<View style={[{width: 'auto',backgroundColor: secondaryBackgroundColor,borderRadius: 10},padding15,justifyContentCenter]} >
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

export default SalesmanEdit;
