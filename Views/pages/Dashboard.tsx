/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
	Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
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
import { cardBackgroundColor, h1, h2, h3, height100, height50, height6, height85, height9, padding20, primaryBackgroundColor, screenheight, textAlignCenter } from '../assets/styles';
import FooterComponent from '../components/FooterComponent';
import HeaderComponent from '../components/HeaderComponent';

function Dashboard({navigation}): JSX.Element {
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
        <View style={[height100 ,primaryBackgroundColor,{}]}>
			<View style={[{} , height100]}>
				<View style={[{},height6]}>
                    <HeaderComponent navigation={navigation} title="title" />
                </View>

				<View style={[{} , height85]} >
					<View>
						<Pressable onPress={() => { navigation.navigate('vendorcreate') }} style={[{} , padding20,cardBackgroundColor]}>
							<Text style={[{}, h3,textAlignCenter]}>Add Vendor</Text>
						</Pressable>
						<Pressable onPress={() => { navigation.navigate('SalesmanCreate') }} style={[{} , padding20,cardBackgroundColor]}>
							<Text style={[{}, h3,textAlignCenter]}>Add Salesman</Text>
						</Pressable>
						<Pressable onPress={() => { navigation.navigate('ordercreate') }} style={[{} , padding20,cardBackgroundColor]}>
							<Text style={[{}, h3,textAlignCenter]}>Add Orders</Text>
						</Pressable>
					</View>
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

export default Dashboard;
