import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
	Button,
	Image,
	ImageBackground,
	SafeAreaView,
	ScrollView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	useColorScheme,
	View,
	ActivityIndicator
} from 'react-native';

import {
	Colors,
} from 'react-native/Libraries/NewAppScreen';
import {fontWeightBold, goldenColor, gulluColor, h2, h3, height100, height40, height60, inputLoginStyle, inputStyle, inputStyleBlack, justifyContentCenter, marginBottom10, padding15, paddingHorizontal20, paddingVertical30,primaryColor, textAlignCenter } from '../assets/styles';
import InputConponents from '../components/InputComponents';
import { get, post, showToast } from '../services/services';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function Login({navigation}): JSX.Element {
	const [ email , setEmail ] = useState();
	const [ password , setPassword ] = useState();

	const [ validationError , setValidationError ] = useState('');
	const [ activityIndicator , setActivityIndicator ] = useState(false);

  	const isDarkMode = useColorScheme() === 'dark';
  	useEffect(()=> {
		
	} , [])
	function ValidateEmail(input) {
		var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (input.match(validRegex)) {
		  return true;
		} else {
		  return false;
		}
	}
	const tryLogin = () => {
		setActivityIndicator(true)
		setValidationError('');
		// if( ValidateEmail(email) ){

			if( email != '' && email != undefined && password != '' && password != undefined ){
				console.log("jhb");
				let params = {email : email , password: password};

				post('/login' ,params ).then((res:any) => {
					console.log(res);
					AsyncStorage.setItem('api_token' , res.data.api_token);
					AsyncStorage.setItem('email' , res.data.email);
					AsyncStorage.setItem('id' , (res.data.id).toString());
					AsyncStorage.setItem('name' , res.data.name);
					AsyncStorage.setItem('phone' , res.data.phone);
					AsyncStorage.setItem('role' , res.data.role);
	
					setActivityIndicator(false)
					navigation.push('Home')
	
				}).catch((error) => {
					setActivityIndicator(false)
					setActivityIndicator(false)
					
					// console.log(error);
				})
			}else{
				console.log("kuhn");
				setValidationError('Required fields are missing.');
				setActivityIndicator(false)

			}
			
		// }else{
		// 	setValidationError('Email is not valid.');
		// 	setActivityIndicator(false)

		// }
	}
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        backgroundColor={gulluColor}
      />
        <View style={[height100 ,{backgroundColor:gulluColor}]}>
			<View style={[{} , height100]}>
				<View style={[{}]} >
					<View style={[{ width: '100%'},paddingVertical30,height40,justifyContentCenter]}>
						<ImageBackground source={require('../assets/images/309862855_480614804112971_3833940785598410888_n.jpeg')} resizeMode="contain"  style={{flex: 1,justifyContent: 'center',width: '100%',borderColor:gulluColor , borderWidth: 2}}>
						</ImageBackground>
					</View>
					<View style={[{},height60]}>
						<View>
							<InputConponents placeholder="Email or Mobile" inputValue={(value:any) => { setEmail(value) }} style={inputLoginStyle}/>
							<InputConponents placeholder="Password" inputValue={(value:any) => { setPassword(value) }} style={inputLoginStyle}/>
						</View>
						<View style={[{textAlign: 'center'},paddingHorizontal20]}>
							<Text style={{ color: 'red',fontSize: 16 }}>{ (validationError != '')? validationError : '' }</Text>
						</View>
						{/* <View style={[{alignItems: 'flex-end'},paddingHorizontal20]}>
							<Text style={[{color: primaryColor},fontWeightBold,marginBottom10]}>Forgot Password</Text>
						</View> */}
						<View style={{alignItems: 'center'}}>
							{(activityIndicator)?
								<TouchableOpacity onPress={() => { tryLogin() }} style={[{width: 150,backgroundColor: primaryColor,borderRadius: 10},padding15,justifyContentCenter]} >
									<ActivityIndicator color="white"></ActivityIndicator>
								</TouchableOpacity>
							:
								<TouchableOpacity onPress={() => { tryLogin() }} style={[{width: 150,backgroundColor: goldenColor,borderRadius: 10},padding15,justifyContentCenter]} >
									<Text style={[h3,{color: gulluColor} , textAlignCenter]}>Login</Text>
								</TouchableOpacity>
							}
						</View>
							
					</View>
				</View>
			</View>
		</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default Login;