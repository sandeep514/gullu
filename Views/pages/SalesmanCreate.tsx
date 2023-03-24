import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
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
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import InputConponents from '../components/InputComponents';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';

import { cardBackgroundColor, h1, h2, h3, height10, height100, height14, height15, height20, height4, height5, height50, height6, height80, height82, height84, height85, height87, height9, height90, height92, inputStyleBlack, justifyContentCenter, padding15, padding20, primaryBackgroundColor, primaryColor, screenheight, secondaryBackgroundColor, textAlignCenter,inputStyle } from '../assets/styles';
import { post, showToast } from '../services/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


function SalesmanCreate({navigation}): JSX.Element {
	const [loader , setLoader ] = useState(false);
	
	const [name , setName ] = useState('sandeep22');
	const [email , setEmail ] = useState('sandeep1101@gmal.com');
	const [code , setCode ] = useState('123');
	const [password , setPassword ] = useState('123456');
	const [phone , setPhone ] = useState('1234567880');
	const [role , setRole ] = useState(3);

  	const isDarkMode = useColorScheme() === 'dark';
  	useEffect(()=> {
		
	} , [])
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};
	const submitSalesman = () => {
		setLoader(true);
		AsyncStorage.getItem('api_token').then((token) => {
			if( name != '' && code != '' && password != '' && phone != ''){
				let postedData = { name: name , code: code , password: password , phone: phone , role: role ,api_token: token};
				post('/users/create' , postedData).then((res) => {
					if(res.status == true){
						showToast(res.message);
					}else{
						showToast(res.message)
					}
					setLoader(false);
				}).catch((err) => {
					showToast(err.message);
					setLoader(false);
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
                    <HeaderComponent navigation={navigation} title="Create Salesman" />
                </View>
				<View style={[{} , height85]} >

					<InputConponents placeholder="Name" inputValue={(value:any) => { setName(value) }} style={inputStyle} />
					{/* <InputConponents placeholder="Email" inputValue={(value:any) => { setEmail(value) }} style={inputStyle} /> */}
					<InputConponents placeholder="Code" inputValue={(value:any) => { setCode(value) }} style={inputStyle} />
					<InputConponents placeholder="Password" inputValue={(value:any) => { setPassword(value) }} style={inputStyle} />
					<InputConponents placeholder="Phone" inputValue={(value:any) => { setPhone(value) }} style={inputStyle} />
					{(!loader)?
						<View style={{alignItems: 'center'}}>
							<TouchableOpacity onPress={() => { submitSalesman() }} style={[{width: 'auto',backgroundColor: secondaryBackgroundColor,borderRadius: 10},padding15,justifyContentCenter]} >
								<Text style={[{color: '#fff'} , h3,textAlignCenter]}>Create New Salesman</Text>
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

export default SalesmanCreate;
