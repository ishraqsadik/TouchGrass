import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { AuthContext } from "../contexts/AuthContext";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { View, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootLayout = () => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // Initial local storage data
  useEffect(() => {
    const loadLocalStorageData = async () => {
      const data = await SecureStore.getItemAsync("auth");
      if (data) {
        const loginData = JSON.parse(data);
        console.log("This is Login Data ==> ", loginData);
        setAuth({
          user: loginData?.user || null,
          token: loginData?.token || "",
        });
      }
      setLoading(false);
    };
    loadLocalStorageData();
  }, []);

  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    }
  }, [auth.token]);

  axios.defaults.baseURL = "http://10.226.201.152:8080/api/v1";

  if (loading) {
    return (
      <View style={styles.container}>
        {/* Add your loading spinner here if desired */}
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <AuthContext.Provider value={{ auth, setAuth }}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: styles.stackContent,
            }}
          >
            {auth.token ? (
              <Stack.Screen
                name="(app)"
                options={{
                  headerShown: false,
                }}
              />
            ) : (
              <Stack.Screen
                name="(auth)"
                options={{
                  headerShown: false,
                }}
              />
            )}
          </Stack>
        </AuthContext.Provider>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // or any color you prefer
  },
  stackContent: {
    flex: 1,
  },
});

export default RootLayout;
