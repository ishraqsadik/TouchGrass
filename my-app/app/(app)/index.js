import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Pressable, Text } from "react-native";
import * as Location from "expo-location";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import axios from "axios";

export default function App() {
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const navigation = useNavigation();
  const [events, setEvents] = useState([]);
  const [locationObtained, setLocationObtained] = useState(false);

  // Add mapRef to store reference to MapView
  const mapRef = React.useRef(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
    });

    const newRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    setMapRegion(newRegion);
    // Animate to the new region
    mapRef.current?.animateToRegion(newRegion, 2000); // 1000ms animation duration
    setLocationObtained(true); // Set to true after location is obtained
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.post("/event/events/nearby", {
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude,
        radius: 10000,
      });

      if (response?.data) {
        setEvents(response?.data?.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    fetchEvents();
    console.log("Events updated:::::::::::", events);
  }, [locationObtained]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showUserLocation
        region={mapRegion}
      >
        <Marker
          coordinate={{
            latitude: mapRegion.latitude,
            longitude: mapRegion.longitude,
          }}
          title="You are here"
          description="Your current location"
        />
        {events.length > 0 &&
          events.map((event, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: event?.location?.coordinates[1],
                longitude: event?.location?.coordinates[0],
              }}
              title={event?.name || "Event"}
              description={event?.description || "Event details"}
              pinColor="blue"
            />
          ))}
      </MapView>
      <Pressable
        style={styles.actionButton}
        onPress={() => {
          navigation.toggleDrawer();
        }}
      >
        <Text style={styles.actionButtonText}>
          <Ionicons name="menu" size={24} color="black" />
        </Text>
      </Pressable>

      {/* Add Create Event Button */}
      <Pressable
        style={styles.createEventButton}
        onPress={() => {
          navigation.navigate("CreateEvent"); // You'll need to set up this route
        }}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.createEventButtonText}>Create Event</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  actionButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  createEventButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createEventButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
