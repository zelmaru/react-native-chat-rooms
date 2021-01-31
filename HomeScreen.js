import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Avatar } from "react-native-elements";
import { auth, db } from "./firebase";
import Icon from "react-native-vector-icons/AntDesign";
import CustomListItem from "./components/CustomListItem";

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  const signOutUser = () => {
    auth.signOut().then(() => navigation.replace("Login"));
  };

  useEffect(() => {
    const unsubscribe = db.collection("chats").onSnapshot((snapshot) =>
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "ChatRooms",
      headerStyle: { backgroundColor: "#845EC2" },
      headerTitleStyle: { color: "#fff" },
      headerTintColor: "#845EC2",
      headerLeft: () => (
        <View style={{ marginLeft: 20 }}>
          {/*TODO: onPress={goToSettings} */}
          <TouchableOpacity activeOpacity={0.7}>
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("AddChat")}
            activeOpacity={0.7}
          >
            <Icon name="addfolder" type="antdesign" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} onPress={signOutUser}>
            <Icon name="logout" type="antdesign" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const enterChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id,
      chatName,
    });
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {chats.map(({ id, data: { chatName } }) => (
          <CustomListItem
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { height: "100%" },
});
