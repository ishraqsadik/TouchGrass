import React, { useEffect, useRef } from "react";
import { View, Image } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_API_KEY } from "@env";

// console.log(GOOGLE_API_KEY);

const MapComponent = ({ region, mapRef }) => {
  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
        initialRegion={region}
        zoomEnabled={true}
        minZoomLevel={8}
        maxZoomLevel={20}
        provider={PROVIDER_GOOGLE} // Use Google Maps
      >
        <Marker
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
        >
          <Image
            source={require("./../../assets/placeholder.png")}
            style={{ width: 32, height: 32 }}
          />
        </Marker>
      </MapView>

      {/* Fake Marker */}
      {/* {isDraggable ? (
        <View style={{ position: "absolute", bottom: "50%", right: "46%" }}>
          <Image
            source={require("./../../assets/placeholder_drag.png")}
            style={{ width: 32, height: 48 }}
          />
        </View>
      ) : null} */}
    </View>
  );
};

export default MapComponent;
