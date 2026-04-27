import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const BLUE = "#3B8BEB";

// Face oval dimensions
const OVAL_W = width * 0.58;
const OVAL_H = OVAL_W * 1.24; // taller than wide = proper face oval

export default function FaceScanScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { checkpointId } = route.params || {};
  const scanY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanY, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanY, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("FaceScanMatch", {
        studentId: "1",
        studentName: "Aryan Sharma",
        initials: "AR",
        classInfo: "Class 8B · Sector 21 stop",
        confidence: "97.4",
        checkpointId,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const scanTranslateY = scanY.interpolate({
    inputRange: [0, 1],
    outputRange: [-(OVAL_H / 2) + 10, OVAL_H / 2 - 10],
  });

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />

      {/* Camera placeholder — swap with expo-camera later */}
      <View style={s.camera} />

      <View style={s.overlay}>
        {/* Corner brackets */}
        <View style={[s.bracket, s.tl]} />
        <View style={[s.bracket, s.tr]} />
        <View style={[s.bracket, s.bl]} />
        <View style={[s.bracket, s.br]} />

        {/* Face oval + features */}
        <View style={s.faceWrap}>
          {/* Oval border */}
          <View style={s.oval} />

          {/* Left eye */}
          <View style={s.eyeLeft} />

          {/* Right eye */}
          <View style={s.eyeRight} />

          {/* Mouth/nose */}
          <View style={s.mouth} />

          {/* Animated scan line — clipped inside faceWrap */}
          <Animated.View
            style={[
              s.scanLine,
              { transform: [{ translateY: scanTranslateY }] },
            ]}
          />
        </View>

        {/* Bottom section */}
        <View style={s.bottom}>
          <Text style={s.title}>Position face in frame</Text>
          <Text style={s.subtitle}>Scanning automatically...</Text>
          <TouchableOpacity
            style={s.fallbackBtn}
            onPress={() =>
              navigation.navigate("StudentList", {
                checkpointId,
                mode: "manual",
              })
            }
            activeOpacity={0.8}
          >
            <Text style={s.fallbackText}>Manual Fallback</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const BRACKET = 36;
const BRACKET_THICK = 4;
const BRACKET_OFFSET = width * 0.14;

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Corner brackets ──
  bracket: {
    position: "absolute",
    width: BRACKET,
    height: BRACKET,
    borderColor: BLUE,
    borderStyle: "solid",
  },
  tl: {
    top: "22%",
    left: BRACKET_OFFSET,
    borderTopWidth: BRACKET_THICK,
    borderLeftWidth: BRACKET_THICK,
  },
  tr: {
    top: "22%",
    right: BRACKET_OFFSET,
    borderTopWidth: BRACKET_THICK,
    borderRightWidth: BRACKET_THICK,
  },
  bl: {
    top: "68%",
    left: BRACKET_OFFSET,
    borderBottomWidth: BRACKET_THICK,
    borderLeftWidth: BRACKET_THICK,
  },
  br: {
    top: "68%",
    right: BRACKET_OFFSET,
    borderBottomWidth: BRACKET_THICK,
    borderRightWidth: BRACKET_THICK,
  },

  // ── Face oval container ──
  faceWrap: {
    width: OVAL_W,
    height: OVAL_H,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden", // clips scan line to oval bounds
  },

  // Oval — borderRadius trick for ellipse
  oval: {
    position: "absolute",
    width: OVAL_W,
    height: OVAL_H,
    borderRadius: OVAL_W / 2, // half width = true ellipse
    borderWidth: 3.5,
    borderColor: BLUE,
    backgroundColor: "transparent",
  },

  // Eyes — inside oval, horizontally spaced
  eyeLeft: {
    position: "absolute",
    top: OVAL_H * 0.38,
    left: OVAL_W * 0.1,
    width: OVAL_W * 0.25,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#666",
  },
  eyeRight: {
    position: "absolute",
    top: OVAL_H * 0.38,
    right: OVAL_W * 0.1,
    width: OVAL_W * 0.25,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#666",
  },

  // Mouth
  mouth: {
    position: "absolute",
    top: OVAL_H * 0.6,
    width: OVAL_W * 0.3,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#666",
  },

  // Scan line — full width of oval, animated vertically
  scanLine: {
    position: "absolute",
    width: OVAL_W,
    height: 2,
    backgroundColor: BLUE,
    opacity: 0.8,
  },

  // ── Bottom ──
  bottom: {
    position: "absolute",
    bottom: 48,
    left: 24,
    right: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: "#777",
    textAlign: "center",
    marginBottom: 24,
  },
  fallbackBtn: {
    width: "100%",
    backgroundColor: "#2A2A2A",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
