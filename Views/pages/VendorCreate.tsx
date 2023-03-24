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
import { post, showToast } from '../services/services';

function VendorCreate({navigation}): JSX.Element {
	const [loader , setLoader ] = useState(false);

	const [name , setName ] = useState('sandeep22');
	const [email , setEmail ] = useState('sandeep20@gmal.com');
	const [code , setCode ] = useState('123');
	const [password , setPassword ] = useState('123456');
	const [phone , setPhone ] = useState('1234537890');
	const [role , setRole ] = useState(2);

  	const isDarkMode = useColorScheme() === 'dark';
  	useEffect(()=> {
		
	} , [])
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};
	const submitVendor = () => {
		setLoader(true)
		AsyncStorage.getItem('api_token').then((token) => {
			if( name != '' && code != '' && password != '' && phone != ''){
				let postedData = { name : name , email: email, code : code , password: password , phone: phone , role: role ,api_token : token};
				post('/users/create' , postedData).then((res) => {
					showToast(res.message);
					setLoader(false);
				}).catch((err) => {
					console.log(err);
					setLoader(false);
					showToast(err.message);
				});
			}else{
				showToast("Required field is missing.");
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
                    <HeaderComponent navigation={navigation} title="Create Vendor" />
                </View>
				<View style={[{} , height85]} >

					<InputConponents placeholder="Name" inputValue={(value:any) => { setName(value) }} style={inputStyle} />
					{/* <InputConponents placeholder="Email" inputValue={(value:any) => { setEmail(value) }} style={inputStyle} /> */}
					<InputConponents placeholder="Code" inputValue={(value:any) => { setCode(value) }} style={inputStyle} />
					<InputConponents placeholder="Password" inputValue={(value:any) => { setPassword(value) }} style={inputStyle} />
					<InputConponents placeholder="Phone" inputValue={(value:any) => { setPhone(value) }} style={inputStyle} />

					{(!loader)?
					<View style={{alignItems: 'center'}}>
						<TouchableOpacity onPress={() => { submitVendor() }} style={[{width: 'auto',backgroundColor: secondaryBackgroundColor,borderRadius: 10},padding15,justifyContentCenter]} >
							<Text style={[{color: '#fff'} , h3,textAlignCenter]}>Create New Vendor</Text>
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

export default VendorCreate;
