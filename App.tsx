import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
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
import Gallery from './Views/pages/Gallery';
import ROUTES from './Views/config/routes';
import SplashScreen from './Views/pages/SplashScreen';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={ROUTES.splashScreen}>
        <Stack.Screen
          name={ROUTES.splashScreen}
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.loginScreen}
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.homeScreen}
          component={Dashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.orderCreateScreen}
          component={OrderCreate}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.orderListScreen}
          component={OrderList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.salesmanlistScreen}
          component={SalesmanList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.salesmanEditScreen}
          component={SalesmanEdit}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.vendorcreateScreen}
          component={VendorCreate}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.vendorlistScreen}
          component={VendorList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.salesmanCreateScreen}
          component={SalesmanCreate}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.vendorEditScreen}
          component={VendorEdit}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.orderEditScreen}
          component={OrderEdit}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={ROUTES.galleryScreen}
          component={Gallery}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
