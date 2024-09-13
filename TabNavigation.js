import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Profile from "./src/screens/Profile";
import HomeScreen from "./src/screens/HomeScreen";

export default function TabNavigation() {
  const TabNav = createBottomTabNavigator();
  return (
    <TabNav.Navigator
      screenOptions={{
        tabBarActiveTintColor: "purple",
      }}
    >
      <TabNav.Screen
        name="Home"
        component={HomeScreen}
      />
      <TabNav.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </TabNav.Navigator>
  );
}
