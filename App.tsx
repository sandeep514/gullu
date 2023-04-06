Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from './Views/pages/Dashboard';
import VendorCreate from './Views/pages/VendorCreate';
import OrderList from './Views/pages/OrderList';
import SalesmanList from './Views/pages/SalesmanList';
import Login from './Views/pages/Login';
import VendorList from './Views/pages/VendorList';
import OrderCreate from './Views/pages/OrderCreate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SalesmanCreate from './Views/pages/SalesmanCreate';
import VendorEdit from './Views/pages/VendorEdit';
import OrderEdit from './Views/pages/OrderEdit';
import SalesmanEdit from './Views/pages/SalesmanEdit';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
	const [defaultRoute, setDefaultRoute] = useState();

	useEffect(() => {

		if (Text.defaultProps == null) Text.defaultProps = {};
		Text.defaultProps.allowFontScaling = false;
		AsyncStorage.getItem('id').then((res: any) => {
			if (res != null) {
				setDefaultRoute('Home');
			} else {
				setDefaultRoute('login');
			}
		}).catch(() => {
			setDefaultRoute('login');
		})

	}, []);
	return (
		<NavigationContainer>
			<Stack.Navigator  >
				<Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
				<Stack.Screen name="Home" component={Dashboard} options={{ headerShown: false }} />
				<Stack.Screen name="ordercreate" component={OrderCreate} options={{ headerShown: false }} />
				<Stack.Screen name="orderlist" component={OrderList} options={{ headerShown: false }} />
				<Stack.Screen name="salesmanlist" component={SalesmanList} options={{ headerShown: false }} />
				<Stack.Screen name="salesmanEdit" component={SalesmanEdit} options={{ headerShown: false }} />
				<Stack.Screen name="vendorcreate" component={VendorCreate} options={{ headerShown: false }} />
				<Stack.Screen name="vendorlist" component={VendorList} options={{ headerShown: false }} />
				<Stack.Screen name="SalesmanCreate" component={SalesmanCreate} options={{ headerShown: false }} />
				<Stack.Screen name="vendorEdit" component={VendorEdit} options={{ headerShown: false }} />
				<Stack.Screen name="orderEdit" component={OrderEdit} options={{ headerShown: false }} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}
export default App;