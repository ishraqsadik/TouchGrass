import { Redirect, Stack } from "expo-router";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import customDrawerContent from "../../components/CustomDrawerContent";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

function AppLayout() {
  const { auth } = useContext(AuthContext);

  console.log("This is auth (2)", auth);

  const handleLogout = async () => {
    // Clear the auth data and redirect to the login screen
    await SecureStore.deleteItemAsync("auth");
    setAuth({ driver: null, token: "" });
    router.replace("/home");
  };

  if (!auth.token) {
    return <Redirect href="/home" />;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <Drawer
        drawerContent={customDrawerContent}
        screenOptions={{
          drawerType: "slide",
          drawerActiveBackgroundColor: "#f9fafb",
          drawerActiveTintColor: "#030712",
          drawerLabelStyle: {
            fontFamily: "Epilogue_700Bold",
            fontSize: 24,
            color: "black",
          },
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            headerShown: false,
            drawerLabel: "Events",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

export default AppLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
