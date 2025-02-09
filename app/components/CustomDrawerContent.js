import React, { useContext } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../contexts/AuthContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image, Pressable, Text, View } from "react-native";

export default function customDrawerContent(props) {
  const { auth, setAuth } = useContext(AuthContext);
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();

  const handleLogout = async () => {
    // Clear the auth data and redirect to the login screen
    await SecureStore.deleteItemAsync("auth");
    setAuth({ driver: null, token: "" });
    router.replace("/home");
  };

  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          gap: 16,
          marginLeft: 12,
          marginTop: 20,
          marginBottom: 40,
          flexDirection: "row",
        }}
      >
        <View
          style={{
            alignSelf: "center",
          }}
        >
          <Image
            source={require("../assets/female.png")}
            style={{
              width: 60,
              height: 60,
              borderRadius: 24,
              resizeMode: "contain",
            }}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            alignSelf: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              textTransform: "capitalize",
              fontFamily: "Epilogue_700Bold",
            }}
          >
            {auth?.driver?.name}
          </Text>
          <Text
            style={{
              color: "#cbd5e1",
              fontSize: 12,
              textTransform: "lowercase",
              fontFamily: "Epilogue_300Light",
            }}
          >
            {auth?.driver?.email}
          </Text>
        </View>
      </View>
      <DrawerItemList {...props} />
      <Pressable
        style={{ marginLeft: 20, marginTop: 40 }}
        onPress={handleLogout}
      >
        <Text style={{ fontFamily: "Epilogue_700Bold", fontSize: 20 }}>
          Logout
        </Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}
