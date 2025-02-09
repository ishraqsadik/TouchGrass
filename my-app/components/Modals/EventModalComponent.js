import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

const EventModal = ({
  setEventModalVisible,
  mapRef,
  region,
  bottomSheetRef,
  eventLocation,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    time: "",
    duration: "",
    details: "",
    phoneNumber: "",
    tags: "",
  });
  const { auth } = useContext(AuthContext);

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onClosePress = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setEventModalVisible(false);
      if (mapRef.current) {
        mapRef.current.animateToRegion(region, 500);
      }
      if (bottomSheetRef.current) {
        bottomSheetRef.current.snapToIndex(0);
      }
    });
  };

  const handleSubmit = async () => {
    try {
      const eventData = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        location: {
          type: "Point",
          coordinates: [eventLocation.longitude, eventLocation.latitude],
        },
        user: auth.user._id,
      };

      const response = await axios.post("/event/create-event", eventData);

      if (response.status === 201) {
        console.log(
          "Full response data:",
          JSON.stringify(response.data, null, 2)
        );
        onSubmit(response.data);
        onClosePress();
      }
    } catch (error) {
      console.error(
        "Error creating event:",
        JSON.stringify(error.response?.data || error, null, 2)
      );
      // Here you might want to add some error handling UI feedback
    }
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: opacityAnim,
          transform: [{ translateY: translateYAnim }],
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Create Event</Text>
        <Pressable style={styles.closeButton} onPress={onClosePress}>
          <Ionicons name="close" size={16} color="black" />
        </Pressable>
      </View>
      <View style={styles.separator} />

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Event Name</Text>
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, name: text }))
            }
            placeholder="Enter event name"
            blurOnSubmit={false}
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Event Type</Text>
          <TextInput
            style={styles.input}
            value={formData.type}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, type: text }))
            }
            placeholder="Enter event type"
            blurOnSubmit={false}
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tags</Text>
          <TextInput
            style={styles.input}
            value={formData.tags}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, tags: text }))
            }
            placeholder="Enter tags (comma-separated)"
            blurOnSubmit={false}
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Time</Text>
          <TextInput
            style={styles.input}
            value={formData.time}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, time: text }))
            }
            placeholder="Enter time"
            blurOnSubmit={false}
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Duration</Text>
          <TextInput
            style={styles.input}
            value={formData.duration}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, duration: text }))
            }
            placeholder="Enter duration"
            blurOnSubmit={false}
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={formData.phoneNumber}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, phoneNumber: text }))
            }
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            blurOnSubmit={false}
            autoCorrect={false}
            spellCheck={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Details</Text>
          <TextInput
            style={styles.input}
            value={formData.details}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, details: text }))
            }
            placeholder="Enter details"
            blurOnSubmit={false}
            autoCorrect={false}
            spellCheck={false}
          />
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Pressable onPress={onClosePress} style={styles.button}>
          <Text>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          style={[styles.button, styles.submitButton]}
        >
          <Text style={styles.submitButtonText}>Create</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    position: "absolute",
    top: "20%",
    width: "90%",
    height: "50%",
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 15,
    alignSelf: "center",
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingBottom: 4,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "800",
  },
  separator: {
    backgroundColor: "#e2e8f0",
    height: 1,
    width: "90%",
    alignSelf: "center",
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#475569",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  closeButton: {
    height: 20,
    width: 20,
    backgroundColor: "#e2e8f0",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    padding: 10,
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  button: {
    paddingHorizontal: 16,
    height: 36,
    backgroundColor: "#e2e8f0",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#020617",
  },
  submitButtonText: {
    color: "white",
  },
});

export default EventModal;
