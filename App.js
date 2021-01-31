import "react-native-gesture-handler";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";
import HomeScreen from "./HomeScreen";
import AddChatScreen from "./AddChatScreen";
import ChatScreen from "./ChatScreen";

const Stack = createStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#845EC2" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen
          options={{ title: "Login" }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{ title: "Register" }}
          name="Register"
          component={RegisterScreen}
        />
        <Stack.Screen
          options={{ title: "Home" }}
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          options={{ title: "AddChat" }}
          name="AddChat"
          component={AddChatScreen}
        />
        <Stack.Screen
          options={{ title: "Chat" }}
          name="Chat"
          component={ChatScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
