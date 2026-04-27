import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";

import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { io } from "socket.io-client";
import CONFIG from "../constants/config";

// ── Same IP as your AuthService.js ──────────────────────────

export default function DriverScreen() {
  const router = useRouter();
  const { user } = useUser();

  // Now comes from login — not hardcoded
  const SERVER_URL = CONFIG.SERVER_URL;
  const BUS_ID = user?.busNumber ?? "12";
  const DRIVER_NAME = user?.name ?? "Driver";
  const [tripStarted, setTripStarted] = useState(false);
  const [locationStatus, setLocationStatus] = useState("idle");
  // "idle" | "connecting" | "live" | "error"

  const socketRef = useRef(null);
  const locationWatchRef = useRef(null);

  // ── Cleanup on unmount ───────────────────────────────────
  useEffect(() => {
    return () => {
      stopEverything();
    };
  }, []);

  // ── Start GPS + Socket ───────────────────────────────────
  const startTrip = async () => {
    setLocationStatus("connecting");

    // 1. Ask for location permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to start the trip.",
      );
      setLocationStatus("error");
      return;
    }
    console.log("[Driver] Attempting connection to:", SERVER_URL);
    // 2. Connect to backend via Socket.io
    const socket = io(SERVER_URL, {
      transports: ["polling"],
      reconnection: true,
      forceNew: true,
      path: "/socket.io",
      timeout: 20000,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Driver] Connected to server:", socket.id);
      socket.io.on("error", (error) => {
        console.log("[Driver] Transport error:", error);
      });

      socket.io.on("reconnect_attempt", (attempt) => {
        console.log("[Driver] Reconnect attempt:", attempt);
      });
      // Tell server this is bus 12's driver
      socket.emit("driver_join", {
        busId: BUS_ID,
        driverName: DRIVER_NAME,
      });

      setLocationStatus("live");
    });

    socket.on("disconnect", () => {
      console.log("[Driver] Disconnected from server");
      setLocationStatus("error");
    });

    socket.on("connect_error", (err) => {
      console.log("[Driver] Connection error:", err.message);
      setLocationStatus("error");
    });

    // 3. Start watching GPS — sends every 3 seconds
    locationWatchRef.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 3000, // every 3 seconds
        distanceInterval: 5, // or if moved 5 meters
      },
      (location) => {
        const { latitude, longitude, speed } = location.coords;

        // Send to backend — backend forwards to all parents
        if (socketRef.current?.connected) {
          socketRef.current.emit("location_update", {
            busId: BUS_ID,
            lat: latitude,
            lng: longitude,
            speed: speed ?? 0,
          });
          console.log(
            `[Driver] Sent: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
          );
        }
      },
    );

    setTripStarted(true);
  };

  // ── Stop GPS + Socket ────────────────────────────────────
  const stopEverything = () => {
    // Stop GPS watch
    if (locationWatchRef.current) {
      locationWatchRef.current.remove();
      locationWatchRef.current = null;
    }

    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.emit("trip_ended", { busId: BUS_ID });
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setTripStarted(false);
    setLocationStatus("idle");
  };

  // ── Button handler ───────────────────────────────────────
  const handleStartTrip = () => {
    if (tripStarted) {
      if (Platform.OS === "web") {
        if (window.confirm("Are you sure you want to end the trip?"))
          stopEverything();
      } else {
        Alert.alert("End Trip", "Are you sure you want to end the trip?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "End Trip",
            style: "destructive",
            onPress: () => stopEverything(),
          },
        ]);
      }
    } else {
      if (Platform.OS === "web") {
        if (window.confirm("Are you sure you want to start the trip?"))
          startTrip();
      } else {
        Alert.alert("Start Trip", "Are you sure you want to start the trip?", [
          { text: "Cancel", style: "cancel" },
          { text: "Start", onPress: () => startTrip() },
        ]);
      }
    }
  };

  const handleEmergency = () => {
    Alert.alert(
      "🚨 EMERGENCY",
      "This will alert the school admin and all parents immediately with your GPS location.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Alert",
          style: "destructive",
          onPress: () =>
            router.push({
              pathname: "/Emergency",
              params: { busNumber: BUS_ID, role: "driver" },
            }),
        },
      ],
    );
  };

  // ── Status indicator label ───────────────────────────────
  const statusLabel = {
    idle: "",
    connecting: "Connecting...",
    live: "● LIVE — GPS broadcasting",
    error: "⚠ Connection lost — retrying",
  }[locationStatus];

  const statusColor = {
    idle: "transparent",
    connecting: "rgba(255,255,255,0.7)",
    live: "#A5D6A7",
    error: "#EF9A9A",
  }[locationStatus];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8A00" />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Text style={styles.greeting}>Good Morning, {DRIVER_NAME}</Text>
        <Text style={styles.subGreeting}>Bus No. {BUS_ID} Driver</Text>
        {/* Live status indicator */}
        {locationStatus !== "idle" && (
          <Text style={[styles.liveStatus, { color: statusColor }]}>
            {statusLabel}
          </Text>
        )}
      </View>

      {/* ROUTE INFO CARD */}
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>ROUTE</Text>
          <View style={styles.routeValue}>
            <Text style={styles.routeText}>Sector 15</Text>
            <Text style={styles.routeArrow}> → </Text>
            <Text style={styles.routeText}>School</Text>
            <Text style={styles.routeArrow}> → </Text>
            <Text style={styles.routeText}>Sector 21</Text>
          </View>
        </View>
        <View style={styles.cardDivider} />
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>STUDENTS</Text>
          <Text style={styles.cardValue}>34 Students</Text>
        </View>
        <View style={styles.cardDivider} />
        <View style={styles.cardRow}>
          <Text style={styles.cardLabel}>DEPARTURE</Text>
          <Text style={styles.departureValue}>7:30 AM</Text>
        </View>
      </View>

      {/* START TRIP BUTTON */}
      <View style={styles.startBtnWrapper}>
        <TouchableOpacity
          style={[styles.startBtn, tripStarted && styles.startBtnActive]}
          onPress={handleStartTrip}
          activeOpacity={0.85}
        >
          <View style={styles.playIcon}>
            {tripStarted ? (
              <View style={styles.stopSquare} />
            ) : (
              <View style={styles.playTriangle} />
            )}
          </View>
          <Text style={styles.startBtnText}>
            {tripStarted ? "END\nTRIP" : "START\nTRIP"}
          </Text>
          <Text style={styles.startBtnSub}>
            {tripStarted ? "Tap to end" : "Tap to begin"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* EMERGENCY BUTTON */}
      <TouchableOpacity
        style={styles.emergencyBtn}
        onPress={handleEmergency}
        activeOpacity={0.85}
      >
        <View style={styles.emergencyIcon}>
          <Text style={styles.emergencyIconText}>!</Text>
        </View>
        <Text style={styles.emergencyText}>EMERGENCY</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  topBar: {
    backgroundColor: "#FF8A00",
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  subGreeting: {
    fontSize: 14,
    color: "rgba(255,255,255,0.88)",
    fontWeight: "600",
    marginTop: 4,
  },
  liveStatus: { fontSize: 12, fontWeight: "700", marginTop: 6 },
  card: {
    backgroundColor: "#FFF3E0",
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#AAAAAA",
    letterSpacing: 1,
  },
  cardValue: { fontSize: 15, fontWeight: "800", color: "#1A1A1A" },
  routeValue: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  routeText: { fontSize: 13, fontWeight: "700", color: "#1A1A1A" },
  routeArrow: { fontSize: 13, fontWeight: "700", color: "#FF8A00" },
  departureValue: { fontSize: 18, fontWeight: "900", color: "#FF8A00" },
  cardDivider: { height: 1, backgroundColor: "#FFD9A0" },
  startBtnWrapper: { alignItems: "center", marginTop: 44, marginBottom: 36 },
  startBtn: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  startBtnActive: { backgroundColor: "#E53935", shadowColor: "#E53935" },
  playIcon: { marginBottom: 6 },
  playTriangle: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 18,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "#FFFFFF",
    marginLeft: 4,
  },
  stopSquare: {
    width: 20,
    height: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 3,
  },
  startBtnText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 1,
    lineHeight: 28,
  },
  startBtnSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
    marginTop: 6,
  },
  emergencyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E53935",
    borderRadius: 14,
    marginHorizontal: 20,
    paddingVertical: 18,
    gap: 10,
    shadowColor: "#E53935",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  emergencyIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyIconText: {
    fontSize: 16,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 20,
  },
  emergencyText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
});
