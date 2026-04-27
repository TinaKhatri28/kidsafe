import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const C = {
  orange: "#FF8A00",
  orangeLight: "#FFF3E0",
  white: "#FFFFFF",
  darkText: "#1A1A1A",
  greyText: "#888888",
  pageBg: "#F5F5F5",
  rowBg: "#EFEFEF",
  searchBg: "#E8E8E8",
  avatarAR: "#A5C8A0",
  avatarPK: "#A0B8C8",
  avatarRS: "#C8A0A0",
  avatarVK: "#B0B0B0",
  presentBg: "#4CAF50",
  absentBg: "#F44336",
  unmarkedBg: "#BDBDBD",
  bottomBg: "#FFF3E0",
  bottomText: "#FF8A00",
};

const INITIAL_STUDENTS = [
  {
    id: "1",
    initials: "AR",
    name: "Aryan Sharma",
    area: "Sector 21",
    avatarBg: "#A5C8A0",
    status: "unmarked",
  },
  {
    id: "2",
    initials: "PK",
    name: "Priya Kaur",
    area: "Sector 21",
    avatarBg: "#A0B8C8",
    status: "unmarked",
  },
  {
    id: "3",
    initials: "RS",
    name: "Rahul Singh",
    area: "Sector 21",
    avatarBg: "#C8A0A0",
    status: "unmarked",
  },
  {
    id: "4",
    initials: "VK",
    name: "Vikram Gupta",
    area: "Sector 22",
    avatarBg: "#B0B0B0",
    status: "unmarked",
  },
];

const StatusIcon = ({ status, onPress }) => {
  if (status === "present") {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[s.statusIcon, { backgroundColor: C.presentBg }]}
      >
        <Text style={s.statusIconText}>✓</Text>
      </TouchableOpacity>
    );
  }
  if (status === "absent") {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[s.statusIcon, { backgroundColor: C.absentBg }]}
      >
        <Text style={s.statusIconText}>✕</Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.statusIcon, { backgroundColor: C.unmarkedBg }]}
    >
      <View style={s.unmarkedDot} />
    </TouchableOpacity>
  );
};

const StudentRow = ({ item, onToggle }) => (
  <View style={s.row}>
    <View style={[s.avatar, { backgroundColor: item.avatarBg }]}>
      <Text style={s.avatarText}>{item.initials}</Text>
    </View>
    <View style={s.rowInfo}>
      <Text style={s.rowName}>{item.name}</Text>
      <Text
        style={[s.rowArea, item.status === "absent" && { color: C.absentBg }]}
      >
        {item.area}
      </Text>
    </View>
    <StatusIcon status={item.status} onPress={() => onToggle(item.id)} />
  </View>
);

export default function StudentList() {
  const router = useRouter();
  const { checkpointId = "CP2" } = useLocalSearchParams(); // ✅ correct — no useRoute
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [mode, setMode] = useState("manual");

  const handleToggle = (id) => {
    setStudents((prev) =>
      prev.map((student) => {
        if (student.id !== id) return student;
        const nextStatus = {
          unmarked: "present",
          present: "absent",
          absent: "unmarked",
        };
        const newStatus = nextStatus[student.status];
        return {
          ...student,
          status: newStatus,
          area:
            newStatus === "absent"
              ? "Marked Absent"
              : INITIAL_STUDENTS.find((x) => x.id === id)?.area || student.area,
        };
      }),
    );
  };

  // Auto-navigate when all students are marked
  useEffect(() => {
    const allMarked = students.every((s) => s.status !== "unmarked");
    if (allMarked && students.length > 0) {
      const timer = setTimeout(() => {
        router.push({ pathname: "/CPSubmitted", params: { checkpointId } });
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [students]);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const markedCount = students.filter((s) => s.status !== "unmarked").length;
  const totalCount = students.length;

  const handleSubmit = () => {
    console.log("Attendance submitted:", students);
    router.push({ pathname: "/CPSubmitted", params: { checkpointId } });
  };

  const handleFaceScan = () => {
    setMode("facescan");
    router.push({ pathname: "/FaceScan", params: { checkpointId } });
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar backgroundColor={C.orange} barStyle="light-content" />

      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backArrow}>‹</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.headerTitle}>CP2 – Exit at School</Text>
          <Text style={s.headerSub}>Tap icon to mark present / absent</Text>
        </View>
      </View>

      <View style={s.searchContainer}>
        <View style={s.searchBar}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Search Student name..."
            placeholderTextColor={C.greyText}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View style={s.toggleContainer}>
        <TouchableOpacity
          style={[s.toggleBtn, mode === "manual" && s.toggleActive]}
          onPress={() => setMode("manual")}
        >
          <Text style={[s.toggleText, mode === "manual" && s.toggleTextActive]}>
            Manual Tap
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.toggleBtn, mode === "facescan" && s.toggleActive]}
          onPress={handleFaceScan}
        >
          <Text
            style={[s.toggleText, mode === "facescan" && s.toggleTextActive]}
          >
            Face Scan
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <StudentRow item={item} onToggle={handleToggle} />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      <View style={s.bottomBar}>
        <Text style={s.markedText}>
          {markedCount}/{totalCount} marked
        </Text>
        <View style={s.progressBarBg}>
          <View
            style={[
              s.progressBarFill,
              { width: `${(markedCount / totalCount) * 100}%` },
            ]}
          />
        </View>
        <TouchableOpacity
          style={s.submitBtn}
          onPress={handleSubmit}
          activeOpacity={0.85}
        >
          <Text style={s.submitText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.pageBg },
  header: {
    backgroundColor: C.orange,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 16 : 14,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: { paddingRight: 4 },
  backArrow: {
    fontSize: 32,
    color: C.white,
    fontWeight: "300",
    lineHeight: 36,
    marginTop: -4,
  },
  headerTitle: { fontSize: 17, fontWeight: "800", color: C.white },
  headerSub: {
    fontSize: 12,
    color: C.white,
    opacity: 0.9,
    marginTop: 2,
    fontWeight: "500",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: C.white,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.searchBg,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 10 : 6,
    gap: 8,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, fontSize: 14, color: C.darkText },
  toggleContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: C.white,
    gap: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: "center",
    backgroundColor: C.searchBg,
  },
  toggleActive: { backgroundColor: C.orange },
  toggleText: { fontSize: 13, fontWeight: "700", color: C.greyText },
  toggleTextActive: { color: C.white },
  listContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.rowBg,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarText: { fontSize: 13, fontWeight: "800", color: C.white },
  rowInfo: { flex: 1 },
  rowName: {
    fontSize: 14,
    fontWeight: "700",
    color: C.darkText,
    marginBottom: 2,
  },
  rowArea: { fontSize: 12, color: C.greyText, fontWeight: "500" },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statusIconText: { fontSize: 16, color: C.white, fontWeight: "700" },
  unmarkedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.white,
  },
  bottomBar: {
    backgroundColor: C.bottomBg,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  markedText: { fontSize: 14, fontWeight: "700", color: C.bottomText },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#FFE0B2",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: { height: 8, backgroundColor: C.orange, borderRadius: 4 },
  submitBtn: {
    backgroundColor: C.orange,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  submitText: { fontSize: 14, fontWeight: "800", color: C.white },
});
