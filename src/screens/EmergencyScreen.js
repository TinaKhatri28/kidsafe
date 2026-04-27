import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const EMERGENCY_TYPES = [
  {
    id: "1",
    label: "Student medical emergency",
    color: "#E53935",
    dotColor: "#E53935",
    bg: "#FFE0D0",
    textColor: "#C62828",
  },
  {
    id: "2",
    label: "Bus breakdown / accident",
    color: "#E53935",
    dotColor: "#E53935",
    bg: "#FFE0D0",
    textColor: "#C62828",
  },
  {
    id: "3",
    label: "Student missing/ wrong stop",
    color: "#E53935",
    dotColor: "#E53935",
    bg: "#FFE0D0",
    textColor: "#C62828",
  },
  {
    id: "4",
    label: "Other - send location",
    color: "#7C3AED",
    dotColor: "#7C3AED",
    bg: "#EDE0F5",
    textColor: "#5B21B6",
  },
];

export default function EmergencyScreen() {
  const router = useRouter();
  const { busNumber = "12", role = "conductor" } = useLocalSearchParams();
  const [selected, setSelected] = useState(null);

  const handleSend = () => {
    if (!selected) {
      Alert.alert("Select type", "Please select an emergency type first.");
      return;
    }
    const type = EMERGENCY_TYPES.find((t) => t.id === selected);
    // TODO: POST { type: type.label, busNumber, role, gpsLocation } to backend
    // GPS: use expo-location to get current coords and include in the POST
    console.log("Emergency sent:", { type: type.label, busNumber, role });

    Alert.alert(
      "Alert Sent",
      `Emergency alert sent to admin and all parents.\nType: ${type.label}`,
      [{ text: "OK", onPress: () => router.back() }],
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar backgroundColor="#FF8A00" barStyle="light-content" />

      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Emergency Alert</Text>
        <Text style={s.headerSub}>Bus {busNumber} Active Trip</Text>
      </View>

      <ScrollView contentContainerStyle={s.body}>
        <View style={s.card}>
          <Text style={s.cardTitle}>Select emergency type</Text>

          {EMERGENCY_TYPES.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                s.option,
                { backgroundColor: type.bg },
                selected === type.id && s.optionSelected,
              ]}
              onPress={() => setSelected(type.id)}
              activeOpacity={0.8}
            >
              <View style={[s.dot, { backgroundColor: type.dotColor }]} />
              <Text style={[s.optionText, { color: type.textColor }]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Send button */}
        <TouchableOpacity
          style={s.sendBtn}
          onPress={handleSend}
          activeOpacity={0.85}
        >
          <Text style={s.sendIcon}>⚠</Text>
          <Text style={s.sendText}>Send Emergency Alert</Text>
        </TouchableOpacity>

        <Text style={s.disclaimer}>
          Alerts school admin + all parents instantly{"\n"}
          with your current GPS location
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F5F5F5" },

  header: {
    backgroundColor: "#FF8A00",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 4,
  },
  headerSub: { fontSize: 12, color: "#fff", opacity: 0.9, fontWeight: "500" },

  body: { padding: 16 },

  card: {
    backgroundColor: "#FFF0E0",
    borderRadius: 16,
    padding: 18,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 14,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionSelected: {
    borderColor: "#E53935",
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    flexShrink: 0,
  },
  optionText: {
    fontSize: 13,
    fontWeight: "700",
    flex: 1,
  },

  sendBtn: {
    backgroundColor: "#C62828",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    marginTop: 14,
  },
  sendIcon: { fontSize: 18, color: "#fff" },
  sendText: { fontSize: 16, fontWeight: "900", color: "#fff" },

  disclaimer: {
    textAlign: "center",
    fontSize: 11,
    color: "#888",
    marginTop: 12,
    lineHeight: 18,
  },
});
