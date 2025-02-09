import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import axios from "axios";
import {
  SafeAreaView,
  View,
  Pressable,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerActions } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";

import { useNavigation, useRouter } from "expo-router";
import * as Location from "expo-location";
import MapComponent from "../../components/IndexPage/MapComponent";
import FlatListComponent from "../../components/IndexPage/FlatListComponent";
import BottomSheetComponent from "../../components/IndexPage/BottomSheetComponent";
import FontAwesomeIcon from "@expo/vector-icons/FontAwesome";
import { FontAwesome6, Entypo, Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BookingModal from "../../components/Modals/BookingModalComponent";

import * as SecureStore from "expo-secure-store";
import EventModal from "../../components/Modals/EventModalComponent";

const Home = () => {
  const bottomSheetRef = useRef();
  const mapRef = useRef(null);
  const flatListRef = useRef();

  const { auth } = useContext(AuthContext);
  const { bookingData, setBookingData } = useState([]);
  const { acceptedBookingData, setAcceptedBookingData } = useState([]);
  const { activeBookingData, setActiveBookingData } = useState(null);

  const [location, setLocation] = useState(null);
  const [eventLocation, setEventLocation] = useState(null);
  const [region, setRegion] = useState(null); // New state variable for region
  const [errorMsg, setErrorMsg] = useState(null);
  const [isDraggable, setIsDraggable] = useState(false);
  const [isList, setIsList] = useState(false);
  const [select, setSelect] = useState();
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isEventModalVisible, setEventModalVisible] = useState(false);

  const navigation = useNavigation();
  const { top, bottom } = useSafeAreaInsets();

  // Load the activeBookingData when the component mounts
  useEffect(() => {
    const restoreProgress = async () => {
      try {
        const progress = await SecureStore.getItemAsync("ride");
        if (progress) {
          const parsedProgress = JSON.parse(progress);
          setActiveBookingData(parsedProgress);
        }
      } catch (error) {
        console.error("Failed to load ride progress:", error);
      }
    };
    restoreProgress();
  }, []);

  useEffect(() => {
    if (activeBookingData?.start && acceptedBookingData) {
      const item = acceptedBookingData.filter(
        (booking) => booking._id === activeBookingData._id
      );

      router.push({
        pathname: `/bookings`,
        params: { item: JSON.stringify(item[0]) },
      });
    }
  }, [activeBookingData, acceptedBookingData]);

  const fetchBookings = useCallback(async () => {
    if (!location) return;
    setLoading(true);
    try {
      const { longitude, latitude } = location;
      const { data } = await axios.post("/booking/getbookings", {
        longitude,
        latitude,
      });
      setBookingData(data?.bookings);
    } catch (error) {
      Alert.alert("Error", error.response.data.message);
    } finally {
      setLoading(false);
    }
  }, [location, setBookingData]);

  const fetchAcceptedBookings = useCallback(async () => {
    setLoading(true);
    try {
      const driverId = auth.driver?._id;
      const { data } = await axios.post("/booking/getacceptedbookings", {
        _id: driverId,
      });

      if (data?.bookings) {
        setAcceptedBookingData(data.bookings);
      } else {
        setAcceptedBookingData([]); // or set a state indicating no bookings
        //Alert.alert("Info", "No accepted bookings found.");
      }
    } catch (error) {
      //Alert.alert("Error", error.response.data.message);
      setAcceptedBookingData([]);
    } finally {
      setLoading(false);
    }
  }, [auth, setAcceptedBookingData]);

  // My Location Button Functuionality

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      return location.coords;
    } catch (error) {
      throw new Error("Failed to get current location");
    }
  };

  const animateMapToRegion = (mapRef, region, duration) => {
    return new Promise((resolve, reject) => {
      if (mapRef.current) {
        mapRef.current.animateToRegion(region, duration);
        setTimeout(resolve, duration);
      } else {
        reject(new Error("Map reference is not available"));
      }
    });
  };

  const onMyLocationPress = useCallback(async () => {
    try {
      console.log("My Location Pressed");
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const coords = await getCurrentLocation();
      const newRegion = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.1322,
        longitudeDelta: 0.1321,
      };
      await animateMapToRegion(mapRef, newRegion, 500); // Wait for the animation to complete
      setRegion(newRegion);
      setLocation(coords);
    } catch (error) {
      setErrorMsg(error.message);
    }
  }, []);

  // Action Button Functionality

  const toggleDraggable = useCallback(() => {
    mapRef.current.animateToRegion(region, 500);
    setIsDraggable((prev) => {
      if (prev) {
        setEventLocation(region);
        setEventModalVisible(true);
      }

      return !prev;
    });
  }, [region]);

  // Timeline Button Functionality

  const toggleList = useCallback(() => {
    setIsList((prev) => {
      if (!prev) fetchAcceptedBookings();
      return !prev;
    });
  }, [fetchAcceptedBookings]);

  // Find Button

  const toggleBottomSheet = useCallback(() => {
    fetchBookings();
    setIsList(false);
    bottomSheetRef.current?.snapToIndex(1);
  }, [fetchBookings]);

  const onMenuPress = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  // Get User Location

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.1322,
        longitudeDelta: 0.1321,
      }); // Set initial region
    })();
  }, []);

  // Fetch Accepted Requests

  useEffect(() => {
    fetchAcceptedBookings();
  }, [fetchAcceptedBookings]);

  // Fetch all Requests sorted by location

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <MapComponent
        region={region} // Pass the region state
        setRegion={setRegion} // Pass the setRegion function
        isDraggable={isDraggable}
        select={select}
        mapRef={mapRef}
      />
      <FlatListComponent
        isList={isList}
        acceptedBookingData={acceptedBookingData}
        flatListRef={flatListRef}
        auth={auth}
        fetchAcceptedBookings={fetchAcceptedBookings}
      />
      {!bookingModalVisible && (
        <View style={styles.actionButtonsContainer}>
          <Pressable style={styles.actionButton} onPress={onMyLocationPress}>
            <Text style={styles.actionButtonText}>
              <FontAwesome6
                name="location-crosshairs"
                size={18}
                color="#020617"
              />
            </Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={toggleDraggable}>
            <Text style={styles.actionButtonText}>
              {isDraggable ? (
                <FontAwesomeIcon name="check" size={18} />
              ) : (
                <Entypo name="location" size={18} color="#020617" />
              )}
            </Text>
          </Pressable>
        </View>
      )}
      <View style={styles.findButtonContainer}>
        <TouchableOpacity style={styles.findButton} onPress={toggleBottomSheet}>
          <Text style={styles.findButtonText}>
            <FontAwesomeIcon name="search" size={18} /> Find
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.menuButtonContainer, { top }]}>
        <Pressable style={styles.menuButton} onPress={onMenuPress}>
          <Text style={styles.menuButtonText}>
            <FontAwesomeIcon name="navicon" size={18} />
          </Text>
        </Pressable>
      </View>
      {!bookingModalVisible && (
        <View style={styles.timelineButtonContainer}>
          <Pressable style={styles.timelineButton} onPress={toggleList}>
            <Text style={styles.timelineButtonText}>
              {isList ? (
                <Ionicons name="close" size={20} color="#020617" />
              ) : (
                <MaterialCommunityIcons
                  name="timeline-text-outline"
                  size={20}
                  color="#020617"
                />
              )}
            </Text>
          </Pressable>
          <View style={styles.timelineCount}>
            <Text style={styles.timelineCountText}>
              {acceptedBookingData?.length}
            </Text>
          </View>
        </View>
      )}
      {isEventModalVisible && (
        <EventModal
          setEventModalVisible={setEventModalVisible}
          mapRef={mapRef}
          region={region}
          bottomSheetRef={bottomSheetRef}
          eventLocation={eventLocation}
          onSubmit={(eventData) => {
            // Handle event creation here
            console.log(eventData);
            // Make API call to create event
          }}
        />
      )}
      {bookingModalVisible && (
        <BookingModal
          setBookingModalVisible={setBookingModalVisible}
          select={select}
          setSelect={setSelect}
          mapRef={mapRef}
          region={region}
          bottomSheetRef={bottomSheetRef}
          auth={auth}
          top={top}
          fetchAcceptedBookings={fetchAcceptedBookings}
          fetchBookings={fetchBookings}
        />
      )}

      <BottomSheetComponent
        bottomSheetRef={bottomSheetRef}
        bookingData={bookingData}
        fetchBookings={fetchBookings}
        fetchAcceptedBookings={fetchAcceptedBookings}
        auth={auth}
        setSelect={setSelect}
        setBookingModalVisible={setBookingModalVisible}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionButtonsContainer: {
    position: "absolute",
    bottom: "4%",
    right: "2%",
    flexDirection: "column",
    gap: 8,
  },
  actionButton: {
    backgroundColor: "white",
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonText: {
    color: "#020617",
    fontSize: 18,
    fontWeight: "bold",
  },
  findButtonContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  findButton: {
    backgroundColor: "#020617",
    width: 144,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  findButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Epilogue_500Medium",
  },
  menuButtonContainer: {
    position: "absolute",
    left: "4%",
  },
  menuButton: {
    backgroundColor: "white",
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuButtonText: {
    color: "#020617",
    fontSize: 18,
    fontWeight: "bold",
  },
  timelineButtonContainer: {
    position: "absolute",
    left: "2%",
    bottom: "4%",
  },
  timelineButton: {
    backgroundColor: "white",
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timelineButtonText: {
    color: "#020617",
    fontSize: 20,
    fontWeight: "bold",
  },
  timelineCount: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "red",
    borderRadius: 100,
    width: 15,
    height: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineCountText: {
    color: "white",
    textAlign: "center",
    fontSize: 10,
  },
});

export default Home;
