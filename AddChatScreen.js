import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { db } from "./firebase";

const AddChatScreen = ({ navigation }) => {
  const [input, setInput] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new chat",
      headerBackTitle: "Chats",
    });
  }, [navigation]);

  const createChat = async () => {
    await db
      .collection("chats")
      .add({
        chatName: input,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => alert(error));
  };

  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        placeholder="Chat name"
        value={input}
        onChangeText={(text) => setInput(text)}
        leftIcon={
          <Icon name="paperclip" type="antdesign" size={24} color="#845EC2" />
        }
      />
      <Button
        buttonStyle={styles.buttonPrimary}
        disabled={!input}
        onPress={createChat}
        title="Create chat"
      />
    </View>
  );
};

export default AddChatScreen;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    height: "100%",
    backgroundColor: "#fff",
  },
  input: {
    paddingLeft: 10,
  },
  buttonPrimary: {
    backgroundColor: "#845EC2",
  },
});
