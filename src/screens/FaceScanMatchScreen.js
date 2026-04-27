import { useNavigation, useRoute } from "@react-navigation/native";
import {
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const GREEN = "#22C55E";
const BLUE = "#3B8BEB";

const OVAL_W = width * 0.55;
const OVAL_H = OVAL_W * 1.22;

export default function FaceScanMatchScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  // These come from your face-recognition result
  const {
    studentId = "1",
    studentName = "Aryan Sharma",
    initials = "AR",
    classInfo = "Class 8B · Sector 21 stop",
    confidence = "97.4",
    checkpointId = "CP1",
  } = route.params || {};

  const handleMarkPresent = () => {
    // TODO: POST { studentId, checkpointId, status: 'present' } to backend
    navigation.navigate("CPSubmitted", {
      studentName,
      status: "present",
      checkpointId,
    });
  };

  const handleAbsent = () => {
    // TODO: POST { studentId, checkpointId, status: 'absent' } to backend
    navigation.navigate("CPSubmitted", {
      studentName,
      status: "absent",
      checkpointId,
    });
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      {/* Blue border around whole screen — matches Figma */}
      <View style={{ flex: 1 }}>
        {/* Camera area */}
        <View style={s.cameraArea}>
          {/* Corner brackets — GREEN on match */}
          <View style={[s.bracket, s.tl]} />
          <View style={[s.bracket, s.tr]} />
          <View style={[s.bracket, s.bl]} />
          <View style={[s.bracket, s.br]} />

          {/* Face oval */}
          <View style={s.faceWrap}>
            <View style={s.oval} />
            <View style={s.hLine} />
            <View style={s.eyeLeft} />
            <View style={s.eyeRight} />
            <View style={s.mouth} />
          </View>

          {/* Match Found text */}
          <View style={s.matchTextBlock}>
            <Text style={s.matchTitle}>Match Found</Text>
            <Text style={s.matchSub}>Confidence: {confidence}%</Text>
          </View>
        </View>

        {/* Student card */}
        <View style={s.card}>
          <View style={s.cardTop}>
            <View style={s.avatar}>
              <Text style={s.avatarText}>{initials}</Text>
            </View>
            <View>
              <Text style={s.studentName}>{studentName}</Text>
              <Text style={s.studentClass}>{classInfo}</Text>
            </View>
          </View>

          <View style={s.btnRow}>
            <TouchableOpacity
              style={[s.btn, s.presentBtn]}
              onPress={handleMarkPresent}
              activeOpacity={0.8}
            >
              <Text style={s.presentText}>Mark Present</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.btn, s.absentBtn]}
              onPress={handleAbsent}
              activeOpacity={0.8}
            >
              <Text style={s.absentText}>Absent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const BRACKET_SIZE = 32;
const BRACKET_THICK = 4;
const BRACKET_OFFSET = width * 0.1;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#000" },

  // Blue outer border — matches Figma frame

  // Top camera area — black bg
  cameraArea: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Brackets — GREEN on match ──
  bracket: {
    position: "absolute",
    width: BRACKET_SIZE,
    height: BRACKET_SIZE,
    borderColor: GREEN,
    borderStyle: "solid",
  },
  tl: {
    top: 70,
    left: BRACKET_OFFSET,
    borderTopWidth: BRACKET_THICK,
    borderLeftWidth: BRACKET_THICK,
  },
  tr: {
    top: 70,
    right: BRACKET_OFFSET,
    borderTopWidth: BRACKET_THICK,
    borderRightWidth: BRACKET_THICK,
  },
  bl: {
    bottom: 90,
    left: BRACKET_OFFSET,
    borderBottomWidth: BRACKET_THICK,
    borderLeftWidth: BRACKET_THICK,
  },
  br: {
    bottom: 90,
    right: BRACKET_OFFSET,
    borderBottomWidth: BRACKET_THICK,
    borderRightWidth: BRACKET_THICK,
  },

  // ── Face oval ──
  faceWrap: {
    width: OVAL_W,
    height: OVAL_H,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  oval: {
    position: "absolute",
    width: OVAL_W,
    height: OVAL_H,
    borderRadius: OVAL_W / 2,
    borderWidth: 3.5,
    borderColor: GREEN, // GREEN on match
    backgroundColor: "transparent",
  },
  hLine: {
    position: "absolute",
    top: OVAL_H * 0.3,
    left: -20,
    right: -20,
    height: 1.5,
    backgroundColor: GREEN,
    opacity: 0.5,
  },
  eyeLeft: {
    position: "absolute",
    top: OVAL_H * 0.38,
    left: OVAL_W * 0.08,
    width: OVAL_W * 0.26,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#666",
  },
  eyeRight: {
    position: "absolute",
    top: OVAL_H * 0.38,
    right: OVAL_W * 0.08,
    width: OVAL_W * 0.26,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#666",
  },
  mouth: {
    position: "absolute",
    top: OVAL_H * 0.6,
    width: OVAL_W * 0.28,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#666",
  },

  // ── Match Found text ──
  matchTextBlock: {
    marginTop: 20,
    alignItems: "center",
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: GREEN,
    marginBottom: 4,
  },
  matchSub: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },

  // ── Student card ──
  card: {
    backgroundColor: "#fff",
    padding: 16,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#A5C8A0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },
  studentName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  studentClass: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },

  // Buttons
  btnRow: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  presentBtn: { backgroundColor: "#D1FAE5" },
  presentText: { fontSize: 14, fontWeight: "700", color: "#166534" },
  absentBtn: { backgroundColor: "#FEE2E2" },
  absentText: { fontSize: 14, fontWeight: "700", color: "#991B1B" },
});
