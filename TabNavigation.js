import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./src/screens/Profile";
import HomeScreen from "./src/screens/HomeScreen";
import Saved from "./src/screens/Saved";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function TabNavigation() {
  const TabNav = createBottomTabNavigator();

  return (
    <TabNav.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "purple",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <TabNav.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: true }}
      />
      <TabNav.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </TabNav.Navigator>
  );
}