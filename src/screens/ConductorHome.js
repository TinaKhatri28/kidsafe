// src/screens/ConductorHome.js
// Fix: handleEmergency moved inside the component so router is in scope

// src/screens/ConductorHome.js
// Fix: handleEmergency moved inside the component so router is in scope
import { useRouter } from "expo-router";
import { useUser } from "../context/UserContext";

import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const C = {
  orange: "#FF8A00",
  white: "#FFFFFF",
  darkText: "#1A1A1A",
  greyText: "#888888",
  cardBg: "#FDF3E7",
  pageBg: "#F5F5F5",
  doneBg: "#E8F5E9",
  doneText: "#2E7D32",
  doneBorder: "#A5D6A7",
  activeBg: "#E3F2FD",
  activeText: "#1565C0",
  activeBorder: "#90CAF9",
  activeCircle: "#1565C0",
  pendingBg: "#F5F5F5",
  pendingText: "#888888",
  pendingCircle: "#BDBDBD",
  totalColor: "#1565C0",
  presentColor: "#2E7D32",
  absentColor: "#C62828",
};

const CHECKPOINTS = [
  {
    id: "cp1",
    label: "CP1-Boarded at home stop",
    sub: "7:42 AM  32/34 students",
    state: "done",
  },
  {
    id: "cp2",
    label: "CP2-Exist at school",
    sub: "Active Now",
    state: "active",
  },
  { id: "cp3", label: "CP3-Board from school", sub: "", state: "pending" },
  { id: "cp4", label: "CP4-Exist at home stop", sub: "", state: "pending" },
];

const CPIcon = ({ state }) => {
  if (state === "done")
    return (
      <View style={s.iconDone}>
        <Text style={s.iconCheck}>✓</Text>
      </View>
    );
  if (state === "active")
    return (
      <View style={s.iconActive}>
        <View style={s.iconActiveDot} />
      </View>
    );
  return <View style={s.iconPending} />;
};

const CPBadge = ({ state }) => {
  const map = {
    done: { label: "DONE", bg: C.doneBg, color: C.doneText },
    active: { label: "Active", bg: C.activeBg, color: C.activeText },
    pending: { label: "Pending", bg: C.pendingBg, color: C.pendingText },
  };
  const { label, bg, color } = map[state];
  return (
    <View style={[s.badge, { backgroundColor: bg }]}>
      <Text style={[s.badgeText, { color }]}>{label}</Text>
    </View>
  );
};

const CPRow = ({ label, sub, state }) => (
  <View style={s.cpRow}>
    <CPIcon state={state} />
    <View style={s.cpInfo}>
      <Text
        style={[
          s.cpLabel,
          state === "active" && { color: C.activeText, fontWeight: "700" },
          state === "pending" && { color: C.greyText },
        ]}
      >
        {label}
      </Text>
      {sub ? (
        <Text style={[s.cpSub, state === "active" && { color: C.activeText }]}>
          {sub}
        </Text>
      ) : null}
    </View>
    <CPBadge state={state} />
  </View>
);

const StatBox = ({ value, label, color }) => (
  <View style={s.statBox}>
    <Text style={[s.statValue, { color }]}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </View>
);

export default function ConductorHome() {
  const router = useRouter();
  const { user } = useUser();

  // ✅ FIXED: now inside the component — router is in scope
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
              params: { busNumber: "12", role: "conductor" },
            }),
        },
      ],
    );
  };

  const handleStartCP2 = () => {
    router.push("/StudentList");
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar backgroundColor={C.orange} barStyle="light-content" />

      <View style={s.header}>
        <Text style={s.headerGreeting}>Good Morning,</Text>
        <Text style={s.headerName}>{user?.name ?? "Conductor"}</Text>
        <Text style={s.headerSub}>
          Conductor Bus No. {user?.busNumber ?? "--"}
        </Text>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.card}>
          <Text style={s.cardTitle}>Today's Checkpoints</Text>
          {CHECKPOINTS.map((cp, index) => (
            <View key={cp.id}>
              <CPRow label={cp.label} sub={cp.sub} state={cp.state} />
              {index < CHECKPOINTS.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>

        <View style={s.statsRow}>
          <StatBox value="34" label="Total" color={C.totalColor} />
          <StatBox value="34" label="Present" color={C.presentColor} />
          <StatBox value="2" label="Absent" color={C.absentColor} />
        </View>

        <TouchableOpacity
          style={s.ctaBtn}
          onPress={handleStartCP2}
          activeOpacity={0.85}
        >
          <Text style={s.ctaBtnText}>Start CP2 - Mark Attendance</Text>
        </TouchableOpacity>

        {/* ── Emergency button ── */}
        <TouchableOpacity
          style={s.emergencyBtn}
          onPress={handleEmergency}
          activeOpacity={0.85}
        >
          <View style={s.emergencyIcon}>
            <Text style={s.emergencyIconText}>!</Text>
          </View>
          <Text style={s.emergencyText}>EMERGENCY</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.pageBg },
  header: {
    backgroundColor: C.orange,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 16 : 14,
    paddingBottom: 20,
  },
  headerGreeting: { fontSize: 18, fontWeight: "600", color: C.white },
  headerName: {
    fontSize: 28,
    fontWeight: "900",
    color: C.white,
    letterSpacing: 0.3,
    marginTop: 2,
  },
  emergencyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E53935",
    borderRadius: 14,
    marginTop: 16,
    paddingVertical: 18,
    gap: 10,
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
  headerSub: {
    fontSize: 13,
    color: C.white,
    opacity: 0.9,
    marginTop: 4,
    fontWeight: "500",
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },
  card: {
    backgroundColor: C.cardBg,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.darkText,
    marginBottom: 16,
  },
  cpRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
  },
  cpInfo: { flex: 1 },
  cpLabel: { fontSize: 13, fontWeight: "600", color: C.darkText },
  cpSub: { fontSize: 11, color: C.greyText, marginTop: 2, fontWeight: "500" },
  iconDone: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.orange,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconCheck: { color: C.white, fontSize: 14, fontWeight: "700" },
  iconActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.activeCircle,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconActiveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.white,
  },
  iconPending: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.pendingCircle,
    flexShrink: 0,
  },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  divider: { height: 0.5, backgroundColor: "#E0D5C8", marginHorizontal: 2 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 24 },
  statBox: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 30, fontWeight: "900", lineHeight: 34 },
  statLabel: {
    fontSize: 13,
    color: C.greyText,
    fontWeight: "500",
    marginTop: 4,
  },
  ctaBtn: {
    backgroundColor: C.orange,
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: C.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  ctaBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  emergencyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E53935",
    borderRadius: 14,
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
    borderColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  emergencyIconText: {
    fontSize: 16,
    fontWeight: "900",
    color: C.white,
    lineHeight: 20,
  },
  emergencyText: {
    fontSize: 18,
    fontWeight: "900",
    color: C.white,
    letterSpacing: 1.5,
  },
});
