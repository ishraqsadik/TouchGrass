import React, { useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const BookingModal = ({
  select,
  setBookingModalVisible,
  setSelect,
  mapRef,
  region,
  bottomSheetRef,
  auth,
  fetchAcceptedBookings,
  fetchBookings,
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    if (select) {
      // Animate modal in
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [select]);

  const onClosePress = () => {
    // Animate modal out
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setBookingModalVisible(false);
      setSelect(null);
    });
    Animated.timing(translateYAnim, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      mapRef.current.animateToRegion(region, 500);
      bottomSheetRef.current?.snapToIndex(0);
    });
  };

  const handleAccept = useCallback(async () => {
    try {
      const bookingID = select._id;
      const driverID = auth.driver?._id;
      await axios.put("/booking/acceptbookings", { driverID, bookingID });
      Alert.alert("Booking Accepted", "Booking has been accepted!");
      fetchBookings();
      fetchAcceptedBookings();
      onClosePress();
    } catch (error) {
      console.log(error);
    }
  }, [auth, fetchBookings, fetchAcceptedBookings, onClosePress]);

  if (!select) return null;

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
        <Text style={styles.headerText}>Confirmation</Text>
        <Pressable style={styles.closeButton} onPress={onClosePress}>
          <Text>
            <Ionicons name="close" size={16} color="black" />
          </Text>
        </Pressable>
      </View>
      <View style={styles.separator} />
      <Text style={styles.details}>
        Are you sure you want to accept this request?
      </Text>
      <View style={styles.buttonContainer}>
        <Pressable onPress={handleAccept} style={styles.button}>
          <Text>Confirm</Text>
        </Pressable>
        <Pressable onPress={onClosePress} style={styles.button}>
          <Text>Cancel</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    top: "40%",
    width: "70%",
    height: 110,
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    paddingBottom: 4,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "800",
  },
  separator: {
    backgroundColor: "#e2e8f0",
    height: 1,
    width: "90%",
    alignSelf: "center",
  },
  details: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  closeButton: {
    height: 20,
    width: 20,
    backgroundColor: "#e2e8f0",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    paddingHorizontal: 8,
    height: 25,
    backgroundColor: "#e2e8f0",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 4,
    position: "absolute",
    right: 10,
    bottom: 10,
  },
});

export default BookingModal;
