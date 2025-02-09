import React, { memo, useState, useRef } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import { FontAwesome, FontAwesome6, Ionicons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";

const BookingListComponent = ({
  bookingData,
  setSelect,
  setBookingModalVisible,
  bottomSheetRef,
}) => {
  const bookingListRef = useRef(null);

  // State to track the expanded card
  const [expandedCard, setExpandedCard] = useState(null);

  // Animation value
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Toggle paragraph visibility with animation
  const toggleParagraph = (itemId) => {
    if (expandedCard === itemId) {
      // Collapse the paragraph
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpandedCard(null));
    } else {
      // Expand the paragraph
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpandedCard(itemId));
    }
  };

  function formatTime(timeStr) {
    const seconds = parseInt(timeStr);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours} hrs ${minutes} mins` : `${minutes} mins`;
  }

  const renderItem = ({ item, index }) => {
    const isExpanded = expandedCard === item._id;

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.price}>$ {item.price.toFixed(2)}</Text>
          <Pressable style={styles.acceptButton}>
            <Text>
              {item.stopoverLocation.length != 0
                ? item.stopoverLocation.length + " stopover"
                : "No stopover"}
            </Text>
          </Pressable>
        </View>
        <View style={styles.separator} />
        <View style={styles.details}>
          <View style={styles.locationIconContainer}>
            <FontAwesome name="circle-o" size={16} color="black" />
            <View style={styles.verticalLine} />
            <FontAwesome name="stop-circle" size={16} color="black" />
          </View>
          <View style={styles.locationDetails}>
            <Text style={styles.locationLabel}>
              {item.pickupLocation.label}
            </Text>
            <Text style={styles.locationLabel}>
              {item.dropoffLocation.label}
            </Text>
          </View>
        </View>
        {isExpanded && (
          <Animated.View
            style={[
              styles.paragraphContainer,
              {
                opacity: animatedValue,
                height: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 90],
                }),
              },
            ]}
          >
            <Text style={styles.locationLabel}>
              Duration: {formatTime(item.duration)} drive
            </Text>
            <Text style={styles.locationLabel}>
              Distance: {parseFloat(item.distance).toFixed(2)} kms away
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <Pressable
                style={{
                  backgroundColor: "#e2e8f0",

                  width: 130,
                  height: 30,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
                onPress={() => {
                  setSelect(item);
                  bookingListRef.current?.scrollToIndex({
                    animated: true,
                    index,
                  });
                  bottomSheetRef.current?.snapToIndex(1);
                  setBookingModalVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Show on Map </Text>
                <Ionicons name="navigate-circle" size={18} color="#94a3b8" />
              </Pressable>
              <Pressable
                style={{
                  backgroundColor: "#e2e8f0",
                  width: 80,
                  height: 30,
                  borderRadius: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                }}
                onPress={() => {
                  setSelect(item);
                  setBookingModalVisible(true);
                  bookingListRef.current?.scrollToIndex({
                    animated: true,
                    index,
                  });
                  bottomSheetRef.current?.snapToIndex(1);
                }}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
        <Pressable
          onPress={() => toggleParagraph(item._id)}
          style={styles.toggleButton}
        >
          <Text>
            {isExpanded ? (
              <FontAwesome6 name="chevron-up" size={14} color="black" />
            ) : (
              <FontAwesome6 name="chevron-down" size={14} color="black" />
            )}
          </Text>
        </Pressable>
      </View>
    );
  };

  const ListFooter = () => (
    <View style={styles.footer}>
      <Image
        source={require("./../../assets/endofsearch.png")}
        style={styles.image}
      />
      {/* <Text style={styles.footerText}>End of the list</Text> */}
    </View>
  );

  const listEmpty = () => (
    <View style={[styles.card, { padding: 16 }]}>
      <Text style={{ fontFamily: "Epilogue_700Bold" }}>No events found.</Text>
      <Text style={{ fontFamily: "Epilogue_500Medium" }}>
        Please check back soon.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={bookingListRef}
        data={bookingData}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.flatListContent}
        renderItem={renderItem}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={listEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  flatListContent: {
    paddingBottom: "20%",
  },
  card: {
    width: "90%",
    backgroundColor: "#f1f5f9",
    alignSelf: "center",
    borderRadius: 15,
    marginTop: 20,
    justifyContent: "center",
    overflow: "hidden", // To clip any overflow content
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  price: {
    fontSize: 22,
    fontWeight: "800",
  },
  acceptButton: {
    backgroundColor: "#e2e8f0",
    padding: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  separator: {
    backgroundColor: "#e2e8f0",
    height: 1,
    width: "90%",
    alignSelf: "center",
  },
  details: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 15,
  },
  locationIconContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  verticalLine: {
    width: 2,
    height: 10,
    backgroundColor: "black",
  },
  locationDetails: {
    flexDirection: "column",
    alignItems: "stretch",
  },
  locationLabel: {
    fontSize: 14,
    color: "black",
    fontFamily: "Epilogue_500Medium",
  },
  paragraphContainer: {
    overflow: "hidden",
    paddingHorizontal: 15,
  },
  paragraph: {
    fontSize: 14,
    color: "black",
    fontFamily: "Epilogue_500Medium",
  },
  toggleButton: {
    position: "absolute",
    bottom: 10,
    right: 15,
    backgroundColor: "#e2e8f0",
    padding: 5,
    borderRadius: 15,
  },
  footer: {
    alignSelf: "center",
    width: "90%",
    borderRadius: 15,
    backgroundColor: "#f1f5f9",
    marginTop: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    height: 450,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  buttonText: {
    fontFamily: "Epilogue_500Medium",
  },
});

export default memo(BookingListComponent);
