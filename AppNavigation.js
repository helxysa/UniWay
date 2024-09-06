// Navigation.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SlideBar from "./componentes/SlideBar";
import InitialMenu from "./componentes/InitialMenu";
import Register from "./componentes/Register";
import Login from "./componentes/LogIn";
import HomeScreen from "./componentes/HomeScreen";
import TabNavigation from "./TabNavigation";

const Stack = createStackNavigator();

function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SlideBar">
        <Stack.Screen
          name="Bem-Vindo"
          component={SlideBar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InitialMenu"
          component={InitialMenu}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TabNavigation"
          component={TabNavigation}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigation;
