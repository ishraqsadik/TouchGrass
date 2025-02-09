import React, { useEffect, useRef } from "react";
import { View, Image } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_API_KEY } from "@env";

console.log(GOOGLE_API_KEY);

const MapComponent = ({ region, setRegion, isDraggable, select, mapRef }) => {
  useEffect(() => {
    if (select && mapRef.current) {
      const source = {
        latitude: select?.pickupLocation?.lat,
        longitude: select?.pickupLocation?.lng,
      };
      const destination = {
        latitude: select?.dropoffLocation?.lat,
        longitude: select?.dropoffLocation?.lng,
      };

      const latitudeDelta =
        Math.abs(source.latitude - destination.latitude) * 2;
      const longitudeDelta =
        Math.abs(source.longitude - destination.longitude) * 2;

      const selectRegion = {
        latitude: (source.latitude + destination.latitude) / 2,
        longitude: (source.longitude + destination.longitude) / 2,
        latitudeDelta: latitudeDelta < 0.1 ? 0.1 : latitudeDelta, // Ensure a minimum delta for better view
        longitudeDelta: longitudeDelta < 0.1 ? 0.1 : longitudeDelta,
      };

      mapRef.current.animateToRegion(selectRegion, 1000); // Move the map with animation
    }
  }, [select]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: "100%" }}
        region={region}
        showsUserLocation
        showsMyLocationButton={false}
        scrollEnabled={isDraggable}
        zoomEnabled={true}
        minZoomLevel={8}
        maxZoomLevel={20}
        provider={PROVIDER_GOOGLE} // Use Google Maps
        onRegionChangeComplete={(e) => {
          if (isDraggable) {
            setRegion(e);
          }
        }}
      >
        {region && !isDraggable ? (
          <Marker
            coordinate={{
              latitude: region?.latitude,
              longitude: region?.longitude,
            }}
          >
            <Image
              source={require("./../../assets/placeholder.png")}
              style={{ width: 32, height: 32 }}
            />
          </Marker>
        ) : null}

        {select && (
          <>
            <MapViewDirections
              origin={{
                latitude: select?.pickupLocation?.lat,
                longitude: select?.pickupLocation?.lng,
              }}
              destination={{
                latitude: select?.dropoffLocation?.lat,
                longitude: select?.dropoffLocation?.lng,
              }}
              waypoints={select?.stopoverLocation?.map((stopover) => ({
                latitude: stopover.lat,
                longitude: stopover.lng,
              }))}
              apikey={GOOGLE_API_KEY}
              strokeColor="black"
              strokeWidth={3}
            />

            <Marker
              coordinate={{
                latitude: select?.pickupLocation?.lat,
                longitude: select?.pickupLocation?.lng,
              }}
              title="Pickup Location"
            />

            <Marker
              coordinate={{
                latitude: select?.dropoffLocation?.lat,
                longitude: select?.dropoffLocation?.lng,
              }}
              title="Dropoff Location"
            />

            {select?.stopoverLocation?.map((stopover, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: stopover.lat,
                  longitude: stopover.lng,
                }}
                title={`Waypoint: ${stopover.label}`}
              />
            ))}
          </>
        )}
      </MapView>

      {/* Fake Marker */}
      {isDraggable ? (
        <View style={{ position: "absolute", bottom: "50%", right: "46%" }}>
          <Image
            source={require("./../../assets/placeholder_drag.png")}
            style={{ width: 32, height: 48 }}
          />
        </View>
      ) : null}
    </View>
  );
};

export default MapComponent;
