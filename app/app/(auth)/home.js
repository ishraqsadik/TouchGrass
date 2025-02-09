import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { router } from "expo-router";

function HomePage() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/image2.jpg")} // Replace with your actual image path
          style={[styles.image, styles.imageOne]}
        />
        <Image
          source={require("../../assets/image1.jpg")} // Replace with your actual image path
          style={[styles.image, styles.imageTwo]}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Welcome to TouchGrass</Text>
        <Text style={styles.subtitle}>
          Join the community of people who love to touch grass
        </Text>
        <TouchableOpacity
          onPress={() => {
            router.navigate("/signin"); // Navigates to the login screen
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Get started</Text>
        </TouchableOpacity>
        <Pressable onPress={() => router.navigate("/signup")}>
          <Text>Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
    backgroundColor: "#FAF4EE", // Match the background color from the image
  },
  imageContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 40,
    marginTop: 120,
  },
  image: {
    width: 400, // Adjust size as needed
    height: 280,
    borderRadius: 16,
    position: "absolute",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageOne: {
    transform: [{ rotate: "-15deg" }],
    top: 40,
    left: -30,
  },
  imageTwo: {
    transform: [{ rotate: "10deg" }],
    top: -40,
    right: -40,
  },
  textContainer: {
    marginBottom: 40,
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontFamily: "Epilogue_700Bold",
    marginBottom: 0,
    color: "#020617", // Darker text color
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 40,
    fontFamily: "Epilogue_500Medium",
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Epilogue_500Medium",
  },
});

export default HomePage;
