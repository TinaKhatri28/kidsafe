import { useNavigation, useRoute } from "@react-navigation/native";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const ORANGE = "#FF8A00";

// Prototype static data — replace with real API response later
const SUMMARY = {
  total: 34,
  present: 32,
  absent: 2,
  notified: 34,
};

const ABSENT_STUDENTS = [
  { id: "1", initials: "AM", name: "Ananya Mehta", avatarBg: "#9333EA" },
  { id: "2", initials: "SK", name: "Simran Kaur", avatarBg: "#22C55E" },
];

export default function CPSubmittedScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { checkpointId = "CP2" } = route.params || {};

  // Map checkpoint to label
  const CP_LABELS = {
    CP1: "Boarded at home",
    CP2: "Exit at school",
    CP3: "Boarded return bus",
    CP4: "Reached home safely",
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar backgroundColor={ORANGE} barStyle="light-content" />

      {/* Orange header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>{checkpointId} Submitted</Text>
        <Text style={s.headerSub}>
          {CP_LABELS[checkpointId]} – {timeStr}
        </Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.body}>
        {/* Green checkmark */}
        <View style={s.checkWrap}>
          <View style={s.checkCircle}>
            <Text style={s.checkIcon}>✓</Text>
          </View>
        </View>

        <Text style={s.savedTitle}>Attendance Saved</Text>
        <Text style={s.savedSub}>
          Notifications sent to all parents{"\n"}automatically
        </Text>

        {/* Summary card */}
        <View style={s.summaryCard}>
          <Text style={s.summaryTitle}>{checkpointId} Summary</Text>

          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Total Students</Text>
            <Text style={s.summaryVal}>{SUMMARY.total}</Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Arrived at school</Text>
            <Text style={[s.summaryVal, { color: "#22C55E" }]}>
              {SUMMARY.present}
            </Text>
          </View>
          <View style={s.summaryRow}>
            <Text style={s.summaryLabel}>Absent today</Text>
            <Text style={[s.summaryVal, { color: "#EF4444" }]}>
              {SUMMARY.absent}
            </Text>
          </View>
          <View style={[s.summaryRow, { borderBottomWidth: 0 }]}>
            <Text style={s.summaryLabel}>Notifications sent</Text>
            <Text style={[s.summaryVal, { color: "#3B8BEB" }]}>
              {SUMMARY.notified}
            </Text>
          </View>
        </View>

        {/* Absent students card */}
        <View style={s.absentCard}>
          <Text style={s.absentTitle}>Absent students – Parents Notified</Text>
          {ABSENT_STUDENTS.map((student) => (
            <View key={student.id} style={s.absentRow}>
              <View style={[s.avatar, { backgroundColor: student.avatarBg }]}>
                <Text style={s.avatarText}>{student.initials}</Text>
              </View>
              <Text style={s.absentName}>{student.name}</Text>
            </View>
          ))}
        </View>

        {/* Back to Home */}
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation.navigate("ConductorHome")}
          activeOpacity={0.85}
        >
          <Text style={s.backBtnText}>Back To Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f5" },

  // Header
  header: {
    backgroundColor: ORANGE,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 3,
  },
  headerSub: { fontSize: 12, color: "#fff", opacity: 0.9, fontWeight: "500" },

  scroll: { flex: 1 },
  body: { backgroundColor: "#fff", padding: 16, paddingBottom: 32 },

  // Checkmark
  checkWrap: { alignItems: "center", paddingVertical: 24 },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#22C55E",
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: { fontSize: 38, color: "#22C55E", fontWeight: "900" },

  savedTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 6,
  },
  savedSub: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },

  // Summary card
  summaryCard: {
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#FFE0B2",
  },
  summaryLabel: { fontSize: 12, color: "#555", fontWeight: "500" },
  summaryVal: { fontSize: 12, fontWeight: "800", color: "#1a1a1a" },

  // Absent card
  absentCard: {
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  absentTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#991B1B",
    marginBottom: 10,
  },
  absentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 11, fontWeight: "800", color: "#fff" },
  absentName: { fontSize: 13, fontWeight: "700", color: "#1a1a1a" },

  // Back button
  backBtn: {
    backgroundColor: ORANGE,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
  },
  backBtnText: { fontSize: 16, fontWeight: "800", color: "#fff" },
});
