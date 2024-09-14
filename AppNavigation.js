import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import InitialMenu from "./src/screens/InitialMenu";
import RegisterScreen from "./src/screens/RegisterScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import Login from "./src/screens/LogIn";
import HomeScreen from "./src/screens/HomeScreen";
import TabNavigation from "./TabNavigation";

const Stack = createStackNavigator();

function AppNavigation() {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState(null);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const status = await AsyncStorage.getItem('@onboarding_completed');
        setIsOnboardingCompleted(status === 'true');
      } catch (error) {
        console.error('Erro ao verificar o status do onboarding:', error);
      }
    };
    
    checkOnboardingStatus();
  }, []);

  if (isOnboardingCompleted === null) {
    return null; // Pode ser substituído por uma tela de carregamento
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isOnboardingCompleted ? "InitialMenu" : "Bem-Vindo"}
      >
        <Stack.Screen
          name="Bem-Vindo"
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InitialMenu"
          component={InitialMenu}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
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
