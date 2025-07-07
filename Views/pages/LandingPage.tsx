import {Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ROUTES from '../config/routes';
import Dashboard from './Dashboard';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLOR from '../config/color';
import OrderList from './OrderList';
import VendorList from './VendorList';
import SalesmanList from './SalesmanList';

const Tab = createBottomTabNavigator();

const LandingPage = () => {
  const FeatherIcon = Feather as unknown as React.ComponentType<any>;
  const OcticonsIcon = Octicons as unknown as React.ComponentType<any>;
  const IoniconsIcon = Ionicons as unknown as React.ComponentType<any>;

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({color, size, focused}) => {
          let iconName;

          if (route.name === ROUTES.homeScreen) {
            iconName = focused ? 'home' : 'home';
            return (
              <OcticonsIcon name={iconName} size={size / 1.2} color={color} />
            );
          } else if (route.name === ROUTES.orderListScreen) {
            iconName = focused ? 'truck' : 'truck';
            return (
              <FeatherIcon name={iconName} size={size / 1.2} color={color} />
            );
          } else if (route.name === ROUTES.vendorlistScreen) {
            iconName = focused ? 'briefcase-outline' : 'briefcase-outline';
            return (
              <IoniconsIcon name={iconName} size={size / 1.2} color={color} />
            );
          } else if (route.name === ROUTES.salesmanlistScreen) {
            iconName = focused ? 'user' : 'user';
            return (
              <FeatherIcon name={iconName} size={size / 1.2} color={color} />
            );
          }
        },
        tabBarActiveTintColor: COLOR.baseColor,
        tabBarInactiveTintColor: COLOR.placeholderColor,
        tabBarLabelStyle: {fontSize: 12, padding: 4},
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: COLOR.whiteColor,
          borderRadius: 20,
          height: 60,
          elevation: 10,
          padding: 10,
          margin: 5,
          borderWidth: 0.4,
          borderColor: `${COLOR.baseColor}22`,
        },
      })}>
      <Tab.Screen
        name={ROUTES.homeScreen}
        component={Dashboard}
        options={{
          tabBarLabel: 'Home',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ROUTES.orderListScreen}
        component={OrderList}
        options={{
          tabBarLabel: 'Orders',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ROUTES.vendorlistScreen}
        component={VendorList}
        options={{
          tabBarLabel: 'Vendor',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ROUTES.salesmanlistScreen}
        component={SalesmanList}
        options={{
          tabBarLabel: 'Salesman',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default LandingPage;
