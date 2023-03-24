import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
	FlatList,
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
import { cardBackgroundColor, h1, h2, h3, height10, height100, padding10, height6, height80, height85, height9, height90, justifyContentCenter, padding15, padding20, primaryBackgroundColor, primaryColor, screenheight, secondaryBackgroundColor, textAlignCenter } from '../assets/styles';
import InputConponents from '../components/InputComponents';
import HeaderComponent from '../components/HeaderComponent';
import FooterComponent from '../components/FooterComponent';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


function OrderList({navigation}): JSX.Element {
  	const isDarkMode = useColorScheme() === 'dark';
  	useEffect(()=> {
		
	} , [])
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [ selectedOrderStatus , SetSelectedOrderStatus] = useState('');
  useEffect(() => {
	SetSelectedOrderStatus('pending');
  } , [])
  const DATA = [
	{
	  id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
	  title: 'First Item',
	},
	{
	  id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
	  title: 'Second Item',
	},
	{
	  id: '58694a0f-3da1-471f-bd96-145571e29d72',
	  title: 'Third Item',
	},
	{
		id: 'bd7acbea-c1b1-46c2-kjhaed5-3ad53abb28ba',
		title: 'First Item',
	  },
	  {
		id: 'kuh-c605-48d3-a4f8-fbd91aa97f63',
		title: 'Second Item',
	  },
	  {
		id: '58694iuia0f-3da1-471f-bd96-145571e29d72',
		title: 'Third Item',
	  },
	  {
		id: 'bd7jikacbea-c1b1-46c2-aed5-3ad53abb28ba',
		title: 'First Item',
	  },
	  {
		id: '3ac68iujiafc-c605-48d3-a4f8-fbd91aa97f63',
		title: 'Second Item',
	  },
	  {
		id: '58694a0f-3iuhjda1-471f-bd96-145571e29d72',
		title: 'Third Item',
	  },
	  {
		id: 'bd7acbea-c1b1-46c2iji-aed5-3ad53abb28ba',
		title: 'First Item',
	  },
	  {
		id: '3ac68afc-c605-48d3-a4fuyhj8-fbd91aa97f63',
		title: 'Second Item',
	  },
	  {
		id: '58694a0f-3da1-471f-buyuhikd96-145571e29d72',
		title: 'Third Item',
	  },
	  {
		id: 'bd7acbea-c1b1-46c2-aed5-3auhijkd53abb28ba',
		title: 'First Item',
	  },
	  {
		id: '3ac68afc-c605-48d3-auoyghnj4f8-fbd91aa97f63',
		title: 'Second Item',
	  },
	  {
		id: '58694a0f-3da1-471f-bd96-145uygh571e29d72',
		title: 'Third Item',
	  },
	  {
		id: 'bd7acbea-c1b1-46c2-aed5-3aduyghu53abb28ba',
		title: 'First Item',
	  },
	  {
		id: '3ac68afc-c605-48d3-a4f8-fbd9i8ujik1aa97f63',
		title: 'Second Item',
	  },
	  {
		id: '58694a0f-3da1-471f-bd96-145571euyghuj29d72',
		title: 'Third Item',
	  },
	  {
		id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb2u7yhui8ba',
		title: 'First Item',
	  },
	  {
		id: '3ac68afc-c605-48d3-a4f8-fbd91aauyuhuik97f63',
		title: 'Second Item',
	  },
	  {
		id: '58694a0f-3da1-471f-bd96-1455uhi71e29d72',
		title: 'Third Item',
	  },
	  {
		id: 'bd7acbea-c1b1-46c2-aed5-3ad53auihibb28ba',
		title: 'First Item',
	  },
	  {
		id: '3ac68afc-c605-48d3-a4f8-fbd91aa97iuhnif63',
		title: 'Second Item',
	  },
	  {
		id: '58694a0f-3da1-471f-bd96-145571e29iuhkd72',
		title: 'Third Items',
	  },
  ];
  const Item = ({title}:any) => (
	<View style={styles.item}>
	  <Text style={[{},h3]}>{title}</Text>
	</View>
  );
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
        <View style={[{},height100 ,primaryBackgroundColor,{}]}>
			<View style={[{} , height100]}>
				<View style={[{},height6]}>
                    <HeaderComponent navigation={navigation} title="title" />
                </View>
				<View style={[{},height85]} >

					<View style={[{},height10]}>
						<InputConponents placeholder="search order" />
					</View>
					<View style={[{} , height90]}>
						<View style={{justifyContent: 'space-around',flexDirection: 'row'}}>
							<Pressable onPress={() => { SetSelectedOrderStatus('pending') }} style={[{width: '30%',borderRadius: 10},padding10,justifyContentCenter, (selectedOrderStatus == "pending")? {backgroundColor: secondaryBackgroundColor} : {borderColor: secondaryBackgroundColor , borderWidth: 2}]}>
								<Text style={[{textAlign: 'center' , fontSize: 18} , (selectedOrderStatus == "pending")? { } : {color : secondaryBackgroundColor}]}>Pending</Text>
							</Pressable>
							<Pressable onPress={() => { SetSelectedOrderStatus('ready') }} style={[{width: '30%',borderRadius: 10},padding10,justifyContentCenter, (selectedOrderStatus == "ready")? {backgroundColor: secondaryBackgroundColor} : {borderColor: secondaryBackgroundColor , borderWidth: 2}]}>
								<Text style={[{textAlign: 'center' , fontSize: 18} , (selectedOrderStatus == "ready")? {} : {color: secondaryBackgroundColor}]}>Ready</Text>
							</Pressable>
							<Pressable onPress={() => { SetSelectedOrderStatus('delivered') }} style={[{width: '30%',borderRadius: 10},padding10,justifyContentCenter, (selectedOrderStatus == "delivered")? {backgroundColor: secondaryBackgroundColor} : {borderColor: secondaryBackgroundColor , borderWidth: 2}]}>
								<Text style={[{textAlign: 'center' , fontSize: 18} , (selectedOrderStatus == "delivered")? {} : {color: secondaryBackgroundColor}]}>Delivered</Text>
							</Pressable>
						</View>
						<FlatList
							data={DATA}
							renderItem={({item}) => <Item title={item.title} />}
							keyExtractor={item => item.id}
							showsVerticalScrollIndicator={false}
						/>
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

export default OrderList;
