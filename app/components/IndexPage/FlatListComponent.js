import React, { memo, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";

import {
  FontAwesome,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";
import { useRouter } from "expo-router";

const FlatListComponent = ({
  isList,
  acceptedBookingData,
  fetchAcceptedBookings,
  fetchBookings,
  flatListRef,
  auth,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const animatedWidth = withTiming(isList ? "100%" : 0, {
      duration: isList ? 100 : 50, // Use a consistent duration for both opening and closing
      easing: Easing.out(Easing.ease),
    });

    const animatedHeight = withTiming(isList ? 300 : 0, {
      duration: isList ? 100 : 50, // Use a consistent duration for both opening and closing
      easing: Easing.out(Easing.ease),
    });

    const animatedOpacity = withTiming(isList ? 1 : 0, {
      duration: isList ? 100 : 50, // Use a consistent duration for both opening and closing
      easing: Easing.out(Easing.ease),
    });

    return {
      height: animatedHeight,
      width: animatedWidth,
      opacity: animatedOpacity,
      position: "absolute",
      bottom: 100,
      zIndex: 10,
    };
  }, [isList]);

  const handleCancel = useCallback(
    async (item) => {
      try {
        const {
          driver: { _id: driverID },
        } = auth;
        const { _id: bookingID } = item;

        await axios.put("/booking/cancelbookings", { bookingID, driverID });
        Alert.alert(
          "Booking Canceled",
          `Booking ${bookingID} has been cancelled!`
        );
        fetchAcceptedBookings();
      } catch (error) {
        Alert.alert("Error", error.response.data.message);
      }
      flatListRef.current?.scrollToIndex({ animated: true, index: 0 });
    },
    [auth]
  );

  const getTimeDifference = (newDate) => {
    const targetDate = new Date(newDate);

    // Get the current date and time
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const difference = targetDate - currentDate;

    // Check if the date has passed
    if (difference > 0) {
      // Convert the difference into days, hours, minutes, and seconds
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      if (days >= 1) {
        // More than or equal to one day left
        return `${days} days ${hours} hours`;
      } else {
        // Less than one day left
        return `${hours} hours ${minutes} minutes`;
      }
    } else {
      return "Date passed.";
    }
  };

  const getTime = (dateString) => {
    const date = new Date(dateString);

    // Array of days and months for easy conversion
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Extract parts of the date
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    let day = date.getDate();
    day = day < 10 ? "0" + day : day;

    // Extract and format the hour
    let hour = date.getHours();
    const period = hour >= 12 ? "pm" : "am";
    hour = hour % 12 || 12; // Convert 24h to 12h format, handling 0 as 12

    return {
      dayName,
      monthName,
      day,
      hour,
      period,
    };
  };

  const router = useRouter();

  const goToDetails = (item) => {
    console.log("Itemmm", item);
    router.push({
      pathname: `/bookings`,
      params: { item: JSON.stringify(item) },
    });
  };

  const truncateString = (str) => {
    if (str.length > 30) {
      return str.substring(0, 30) + "...";
    }
    return str;
  };

  const renderItem = useCallback(
    ({ item }) => {
      return (
        <Pressable style={styles.card} onPress={() => goToDetails(item)}>
          <View
            style={{
              backgroundColor: "#f1f5f9",
              width: "100%",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Epilogue_700Bold",
                  color: "#475569",
                  fontSize: 30,
                  marginBottom: -10,
                }}
              >
                {getTime(item?.time).dayName}
              </Text>
              <Text
                style={{
                  fontFamily: "Epilogue_700Bold",
                  color: "#475569",
                  fontSize: 30,
                }}
              >
                {getTime(item?.time).day}
              </Text>
            </View>
            <Text
              style={{ fontFamily: "Epilogue_500Medium", color: "#94a3b8" }}
            >
              <MaterialCommunityIcons name="timer-outline" size={16} />{" "}
              {getTimeDifference(item?.time)}
            </Text>
          </View>
          <View style={styles.details}>
            <View style={styles.locationIconContainer}>
              <FontAwesome name="circle-o" size={16} color="black" />
              <FontAwesome name="stop-circle" size={16} color="black" />
            </View>
            <View style={styles.locationDetails}>
              <Text style={styles.locationLabel}>
                {truncateString(item.pickupLocation.label)}
              </Text>
              <Text style={styles.locationLabel}>
                {truncateString(item.dropoffLocation.label)}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 10,
            }}
          >
            <View style={{ flexDirection: "row", gap: 6 }}>
              <Text
                style={{
                  fontFamily: "Epilogue_700Bold",
                  color: "#475569",
                  fontSize: 12,
                }}
              >
                <FontAwesome name="clock-o" size={14} color="#cbd5e1" /> 51 mins
              </Text>
              <Text
                style={{
                  fontFamily: "Epilogue_700Bold",
                  color: "#475569",
                  fontSize: 12,
                }}
              >
                <Feather name="map-pin" size={14} color="#cbd5e1" /> 14 km
              </Text>
            </View>
            <Pressable
              style={styles.cancelButton}
              onPress={() => handleCancel(item)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      );
    },
    [handleCancel]
  );

  const listEmpty = () => (
    <View style={[styles.card]}>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "#f1f5f9",
            width: "100%",
            height: 120,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>
            <MaterialCommunityIcons
              name="timeline-alert-outline"
              size={64}
              color="black"
            />
          </Text>
        </View>
        <View style={{ padding: 20 }}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Epilogue_700Bold",
              fontSize: 18,
              paddingTop: 10,
              color: "#475569",
            }}
          >
            No Requests added to the timeline.
          </Text>
          <Text style={{ textAlign: "center", fontSize: 12, marginTop: 10 }}>
            Accept request to start driving.
          </Text>
        </View>
      </View>
    </View>
  );

  const keyExtractor = useCallback((item, index) => `${item._id}-${index}`, []);

  return (
    <Animated.View style={animatedStyle}>
      <FlatList
        ref={flatListRef}
        horizontal
        style={styles.flatList}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        snapToInterval={220}
        decelerationRate="fast"
        data={acceptedBookingData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={listEmpty}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    display: "flex",
    flexDirection: "column",
    width: 220,
    height: 240,
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  price: {
    fontSize: 40,
  },
  separator: {
    height: 1,
    width: "80%",
    backgroundColor: "#CED0CE",
    marginVertical: 10,
    alignSelf: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 16,
  },

  cancelButton: {
    backgroundColor: "#f1f5f9",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 24,
    justifyContent: "center",
  },

  cancelButtonText: {
    color: "#475569",
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Epilogue_700Bold",
  },
  flatList: {
    paddingVertical: 5,
  },
  flatListContent: {
    gap: 10,
    paddingHorizontal: 12,
  },

  locationDetails: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  locationLabel: {
    fontSize: 12,
    color: "black",
    height: 16,
    fontFamily: "Epilogue_500Medium",
  },
  details: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
    alignItems: "center",
    paddingHorizontal: 15,
  },
  locationIconContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
});

export default memo(FlatListComponent);
