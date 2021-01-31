import React, { useState, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Text } from "react-native";
import { Button, Input } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { auth } from "./firebase";
// import Form from "./components/Form";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error));
  };

  return (
    <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
      <StatusBar style="light" />
      <Icon name="emoticon-poop" type="antdesign" size={100} color="#845EC2" />
      <View style={styles.inputContainer}>
        <Input
          placeholder="E-mail"
          autofocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
        />
      </View>
      <Button
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.buttonPrimary}
        onPress={signIn}
        title="Login"
      />
      <Button
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.buttonOutline}
        titleStyle={styles.buttonTitle}
        onPress={() => navigation.navigate("Register")}
        type="outline"
        title="Register"
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  inputContainer: {
    width: 300,
    marginTop: 20,
  },
  buttonContainer: {
    width: 200,
    marginTop: 10,
  },
  buttonPrimary: {
    backgroundColor: "#845EC2",
  },
  buttonOutline: {
    borderColor: "#845EC2",
  },
  buttonTitle: {
    color: "#845EC2",
  },
});
