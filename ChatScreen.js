import React, { useLayoutEffect, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native-gesture-handler";
import * as firebase from "firebase";
import { db, auth } from "./firebase";

const ChatScreen = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar
            rounded
            source={{
              // show last messagge sender's profile picture as main chat picture
              uri:
                messages[0]?.data.photoURL ||
                "https://i.ibb.co/GvmG8S1/Group-1-1.png",
            }}
          />
          <Text style={{ color: "#fff", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={navigation.goBack}
        >
          <Icon name="arrowleft" type="antdesign" size={24} color="#fff" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        ></View>
      ),
    });
  }, [navigation, messages]);

  const sendMessage = () => {
    Keyboard.dismiss();
    db.collection("chats").doc(route.params.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(), // server timestamp makes it work for all time zones
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });
    setInput("");
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        {/* keep the input field stick to the top of the keyboard */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View key={id} style={[styles.message, styles.reciever]}>
                    <Avatar rounded size={30} source={{ uri: data.photoURL }} />
                    {/* <Text style={styles.senderName}>You</Text> */}
                    <Text style={styles.recieverText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={[styles.message, styles.sender]}>
                    <Avatar rounded size={30} source={{ uri: data.photoURL }} />
                    <Text style={styles.senderText}>{data.message}</Text>
                    <Text style={styles.senderName}>{data.displayName}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                placeholder="Your Message"
                style={styles.textInput}
                value={input}
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.7}>
                <Icon
                  name="pluscircleo"
                  type="antdesign"
                  size={24}
                  color="#845EC2"
                />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "#845EC2",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    color: "grey",
  },
  message: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    maxWidth: "80%",
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  reciever: {
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    marginRight: 15,
  },
  sender: {
    backgroundColor: "#845EC2",
    alignSelf: "flex-start",
    marginLeft: 15,
  },
  senderName: {
    position: "absolute",
    right: 10,
    bottom: 5,
    fontWeight: "bold",
    fontSize: 10,
    color: "#fff",
  },
  senderText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 10,
  },
  recieverText: {
    color: "#000",
    fontWeight: "500",
    marginLeft: 10,
  },
});
