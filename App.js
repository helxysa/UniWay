import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import SlideBar from "./componentes/SlideBar";
import Register from "./componentes/InitialMenu";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AppNavigation from "./AppNavigation";

export default function App() {
  return <AppNavigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
