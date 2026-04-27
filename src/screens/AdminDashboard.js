// ─────────────────────────────────────────────────────────────────────────────
// AdminDashboard.js
// Matches Figma design exactly:
//   - Orange header (#FF8A00) with school emoji + name + date
//   - 3 summary cards: light blue / light green / light orange
//   - Bus list rows with colored circles + status pills
//   - Bottom orange alert strip
// ─────────────────────────────────────────────────────────────────────────────

import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";

// ─── Colour palette — matches your Figma + Login screen orange ───────────────
const C = {
  orange: "#FF8A00", // primary — same as login screen
  orangeLight: "#FFA940", // lighter orange for alert strip
  white: "#FFFFFF",
  darkText: "#1A1A1A",
  greyText: "#888888",
  rowBg: "#F2F2F2", // bus row background

  // Summary card backgrounds (from Figma)
  blueCard: "#A8D4F0", // Total buses
  greenCard: "#A8E6C0", // Active running
  orangeCard: "#FFD08A", // Delayed buses

  // Status pill colours (from Figma)
  onTimeBg: "#A8E6C0",
  onTimeText: "#1B6B3A",
  lateBg: "#FFD08A",
  lateText: "#7B3F00",
  notStartedBg: "#CCCCCC",
  notStartedText: "#444444",

  // Bus circle colours (from Figma)
  circle12: "#6AAFE6", // blue
  circle07: "#FF8A00", // orange
  circle03: "#555555", // dark grey

  alertBg: "#FFA940",
  alertText: "#7B3F00",
  alertDot: "#CC4400",
};

// ─── Date helper ─────────────────────────────────────────────────────────────
const getTodayLabel = () => {
  const d = new Date();
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

// ─── Static prototype data (replace with API in production) ──────────────────
const SUMMARY = [
  { label: "Total", value: "12", sub: "buses", bg: C.blueCard },
  { label: "Active", value: "9", sub: "running", bg: C.greenCard },
  { label: "Delayed", value: "3", sub: "buses", bg: C.orangeCard },
];

const BUSES = [
  {
    id: "12",
    route: "Sector 15 --> Sector...",
    driver: "Rajan Kumar",
    status: "On Time",
    statusBg: C.onTimeBg,
    statusColor: C.onTimeText,
    circleBg: C.circle12,
  },
  {
    id: "07",
    route: "Sector 15 --> Sector...",
    driver: "Suresh Singh",
    status: "Late 8 min",
    statusBg: C.lateBg,
    statusColor: C.lateText,
    circleBg: C.circle07,
  },
  {
    id: "03",
    route: "Sector 15 --> Sector...",
    driver: "Amit Verma",
    status: "Not Started",
    statusBg: C.notStartedBg,
    statusColor: C.notStartedText,
    circleBg: C.circle03,
  },
];

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = ({ schoolName }) => (
  <View style={s.header}>
    <Text style={s.headerEmoji}>🏫</Text>
    <View style={s.headerText}>
      <Text style={s.headerTitle}>{schoolName.toUpperCase()}</Text>
      <Text style={s.headerSub}>Admin Dashboard {getTodayLabel()}</Text>
    </View>
  </View>
);

// ─── Summary card ─────────────────────────────────────────────────────────────
const SummaryCard = ({ label, value, sub, bg }) => (
  <View style={[s.summaryCard, { backgroundColor: bg }]}>
    <Text style={s.summaryLabel}>{label}</Text>
    <Text style={s.summaryValue}>{value}</Text>
    <Text style={s.summarySub}>{sub}</Text>
  </View>
);

// ─── Bus row ──────────────────────────────────────────────────────────────────
const BusRow = ({
  id,
  route,
  driver,
  status,
  statusBg,
  statusColor,
  circleBg,
}) => (
  <View style={s.busRow}>
    <View style={[s.busCircle, { backgroundColor: circleBg }]}>
      <Text style={s.busCircleText}>{id}</Text>
    </View>
    <View style={s.busInfo}>
      <Text style={s.busRoute} numberOfLines={1}>
        {route}
      </Text>
      <Text style={s.busDriver}>{driver}</Text>
    </View>
    <View style={[s.statusPill, { backgroundColor: statusBg }]}>
      <Text style={[s.statusText, { color: statusColor }]}>{status}</Text>
    </View>
  </View>
);

// ─── Bottom alert strip ───────────────────────────────────────────────────────
const AlertStrip = () => (
  <View style={s.alertStrip}>
    <View style={s.alertDot} />
    <Text style={s.alertText}>
      Bus 07 delayed - parents notified automatically
    </Text>
  </View>
);

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [schoolName] = useState("Delhi Public School");

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar backgroundColor={C.orange} barStyle="light-content" />

      {/* Fixed orange header */}
      <Header schoolName={schoolName} />

      {/* Scrollable content */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary cards row */}
        <View style={s.summaryRow}>
          {SUMMARY.map((item) => (
            <SummaryCard key={item.label} {...item} />
          ))}
        </View>

        {/* Live Buses heading */}
        <Text style={s.sectionTitle}>Live Buses</Text>

        {/* Bus rows */}
        <View style={s.busList}>
          {BUSES.map((bus) => (
            <BusRow key={bus.id} {...bus} />
          ))}
        </View>

        {/* Breathing space above alert strip */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Fixed bottom alert */}
      <AlertStrip />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.white,
  },

  // ── Header
  header: {
    backgroundColor: C.orange,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingTop: Platform.OS === "android" ? 16 : 14,
    gap: 12,
  },
  headerEmoji: { fontSize: 30 },
  headerText: { flex: 1 },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: C.white,
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 12,
    color: C.white,
    opacity: 0.9,
    marginTop: 2,
    fontWeight: "500",
  },

  // ── Scroll
  scroll: { flex: 1, backgroundColor: C.white },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // ── Summary cards
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: C.darkText,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 30,
    fontWeight: "900",
    color: C.darkText,
    lineHeight: 34,
  },
  summarySub: {
    fontSize: 12,
    color: C.darkText,
    opacity: 0.8,
    marginTop: 2,
    fontWeight: "500",
  },

  // ── Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: C.darkText,
    marginBottom: 14,
    letterSpacing: 0.3,
  },

  // ── Bus list
  busList: { gap: 10 },
  busRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.rowBg,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  busCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  busCircleText: {
    fontSize: 14,
    fontWeight: "800",
    color: C.white,
  },
  busInfo: { flex: 1 },
  busRoute: {
    fontSize: 13,
    fontWeight: "700",
    color: C.darkText,
    marginBottom: 3,
  },
  busDriver: {
    fontSize: 12,
    color: C.greyText,
    fontWeight: "500",
  },
  statusPill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  // ── Alert strip
  alertStrip: {
    backgroundColor: C.alertBg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 10,
  },
  alertDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: C.alertDot,
  },
  alertText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.alertText,
    flex: 1,
  },
});
