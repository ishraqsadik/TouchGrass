import React, { useMemo, memo } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import BookingListComponent from "./BookingListComponent";
import { Text, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const BottomSheetComponent = ({
  bottomSheetRef,
  bookingData,
  fetchBookings,
  fetchAcceptedBookings,
  auth,
  setSelect,
  setBookingModalVisible,
}) => {
  const snapPoints = useMemo(() => ["3%", "43%", "88%"], []);

  return (
    <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints}>
      <BottomSheetView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Find Events</Text>
          <Text style={styles.reloadIcon} onPress={fetchBookings}>
            <Ionicons name="reload-circle" size={28} color="black" />
          </Text>
        </View>
        <BookingListComponent
          bookingData={bookingData}
          fetchBookings={fetchBookings}
          fetchAcceptedBookings={fetchAcceptedBookings}
          auth={auth}
          setSelect={setSelect}
          setBookingModalVisible={setBookingModalVisible}
          bottomSheetRef={bottomSheetRef}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  header: {
    width: "85%",
    alignSelf: "center",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Epilogue_700Bold",
    fontSize: 20,
  },
  reloadIcon: {
    fontSize: 20,
  },
});

export default memo(BottomSheetComponent);
