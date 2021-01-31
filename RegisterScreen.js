import React, { useState, useLayoutEffect, useEffect } from "react";
import { View, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Button, Input, Text, Avatar } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { auth } from "./firebase";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedImage, setSelectedImage] = React.useState(null);

  // before the screen paints, do sth
  // headerBackTitle works only on iOS
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Back to Login",
    });
  }, [navigation]);

  let openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      ediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: false,
      quality: 0,
    });
    console.log(pickerResult);
    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage(`data:image/jpeg;base64,${pickerResult.base64}`);
  };
  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: name,
          photoURL: selectedImage || "https://i.ibb.co/GvmG8S1/Group-1-1.png",
        });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
      <StatusBar style="light" />
      <Text h3 style={{ marginBottom: 50, color: "#845EC2" }}>
        Sign up to start
      </Text>
      <Avatar
        rounded
        size="large"
        source={{
          uri: selectedImage || "https://i.ibb.co/GvmG8S1/Group-1-1.png",
        }}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="Username"
          autofocus
          type="text"
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="E-mail"
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
          onSubmitEditing={register}
        />

        <Button
          type="outline"
          buttonStyle={styles.buttonOutline}
          titleStyle={styles.buttonTitle}
          title="Select your profile image*"
          onPress={openImagePickerAsync}
        />

        {/* <Input
          placeholder="Profile Picture URL (optional)"
          type="text"
          value={imageUrl}
          onChangeText={(text) => setImageUrl(text)}
          onSubmitEditing={register}
        /> */}
      </View>
      <Button
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.buttonPrimary}
        onPress={register}
        title="Register"
      />
      <Text style={{ marginTop: 20, color: "#845EC2" }}>
        * You can proceed without image
      </Text>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputContainer: {
    width: 300,
    marginTop: 20,
  },
  buttonContainer: {
    width: 200,
    marginTop: 20,
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
