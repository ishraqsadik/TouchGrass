import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesomeIcon from "@expo/vector-icons/FontAwesome";
import axios from "axios";

export default function SignInScreen({ navigation }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confpassword, setConfPassword] = useState("");

  const handleSignUp = async () => {
    try {
      if (!name || !email || !password || !phone || !confpassword) {
        Alert.alert("Please fill all the fields");
        return;
      }

      const { data } = await axios.post("/auth/register", {
        name,
        email,
        phone,
        password,
      });
      alert(data && data.message);
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          {/* Logo (replace with your logo image path) */}
          <View style={styles.logo}></View>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            keyboardType="default"
            style={styles.input}
          />
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone"
            keyboardType="phone-pad"
            style={styles.input}
          />
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
          <TextInput
            value={confpassword}
            onChangeText={setConfPassword}
            placeholder="Confirm Password"
            secureTextEntry
            style={styles.input}
          />

          <Pressable onPress={handleSignUp} style={styles.signupButton}>
            <Text style={styles.signupButtonText}>Signup</Text>
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
      </ScrollView>
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
  signupButton: {
    backgroundColor: "black",
    borderRadius: 8,
    padding: 16,
    width: "100%",
  },
  signupButtonText: {
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
