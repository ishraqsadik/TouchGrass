import React, { useContext, useState } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  Image,
  Pressable,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesomeIcon from "@expo/vector-icons/FontAwesome";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../../contexts/AuthContext";
import { router } from "expo-router";

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { auth, setAuth } = useContext(AuthContext);

  const handleSignIn = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Please enter all the fields.");
        return;
      }
      const { data } = await axios.post("/auth/login", { email, password });

      if (data) {
        setAuth(data);
      }

      console.log("This is data 1 ::::", data);
      await SecureStore.setItemAsync("auth", JSON.stringify(data));
      alert(data && data.message);
      console.log("Login Data==> ", { email, password });
      router.navigate("/");
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Logo (replace with your logo image path) */}
        <View style={styles.logo}></View>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          style={styles.input}
        />

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
        />

        <Pressable onPress={handleSignIn} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>

        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>

        <View style={styles.orContainer}>
          <View style={styles.separator} />
          <Text style={styles.orText}>OR CONTINUE WITH</Text>
          <View style={styles.separator} />
        </View>
        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={[styles.socialButton, styles.socialButtonLeft]}
          >
            <Text style={styles.socialButtonText}>
              <FontAwesomeIcon name="apple" size={15} /> Apple
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.socialButton, styles.socialButtonRight]}
          >
            <Text style={styles.socialButtonText}>
              <FontAwesomeIcon name="google" size={15} /> Google
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    padding: 16,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  logo: {
    backgroundColor: "#cbd5e1",
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "black",
    borderRadius: 8,
    padding: 16,
    width: "100%",
  },
  loginButtonText: {
    color: "#f8fafc",
    textAlign: "center",
    fontSize: 16,
  },
  forgotPasswordText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 16,
  },
  orContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
    width: "100%",
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: "#d1d5db",
  },
  orText: {
    marginHorizontal: 8,
    color: "#9ca3af",
  },
  socialContainer: {
    flexDirection: "row",
    marginBottom: 24,
    width: "100%",
  },
  socialButton: {
    backgroundColor: "#f8fafc",
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  socialButtonLeft: {
    marginRight: 8,
  },
  socialButtonRight: {
    marginLeft: 8,
  },
  socialButtonText: {
    textAlign: "center",
    color: "black",
  },
});
