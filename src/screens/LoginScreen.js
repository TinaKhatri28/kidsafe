import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthService } from "../services/AuthService";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      Alert.alert("Invalid", "Enter a valid 10-digit number");
      return;
    }
    setLoading(true);
    await AuthService.sendOTP(phone);
    setOtpSent(true);
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    const result = await AuthService.verifyOTP(phone, otp);
    setLoading(false);
    if (result.success) {
      console.log("Navigating to:", result.role);
      if (result.role === "DriverHome") {
        router.replace("/DriverHome");
      } else if (result.role === "ParentHome") {
        router.replace("/ParentHome");
      } else if (result.role === "ConductorHome") {
        router.replace("/ConductorHome");
      } else if (result.role === "AdminDashboard") {
        router.replace("/AdminDashboard");
      } else {
        router.replace("/ParentHome");
      }
    } else {
      Alert.alert("Wrong OTP", "Try again. Use 1234 in prototype.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.splashWrapper} pointerEvents="none">
        <View style={styles.orangeParallelogram} />
      </View>

      <View style={styles.content}>
        <View style={{ height: 190 }} />
        <Text style={styles.brandName}>KidSafe</Text>
        <View style={styles.brandUnderline} />
        <Text style={styles.tagline}>Track your child's bus, live</Text>

        <View style={styles.card}>
          <View style={styles.inputPill}>
            <TextInput
              style={styles.inputText}
              placeholder="+91-Phone no."
              placeholderTextColor="#9C7D5A"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={[styles.inputPill, { marginTop: 16 }]}>
            <TextInput
              style={styles.inputText}
              placeholder="OTP"
              placeholderTextColor="#9C7D5A"
              keyboardType="number-pad"
              maxLength={4}
              value={otp}
              onChangeText={setOtp}
            />
          </View>

          <TouchableOpacity onPress={otpSent ? handleSendOTP : undefined}>
            <Text style={styles.notReceived}>Not Received?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={otpSent ? handleVerifyOTP : handleSendOTP}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.sendBtnText}>
              {loading ? "Please wait..." : otpSent ? "Verify OTP" : "Send OTP"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.terms}>
          {"By continuing , you agree to our\n"}
          <Text style={styles.link}>Terms of Services</Text>
          <Text style={styles.termsGray}> & </Text>
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  splashWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 220,
    overflow: "hidden",
    zIndex: 0,
  },
  orangeParallelogram: {
    position: "absolute",
    top: -30,
    left: -20,
    width: 260,
    height: 250,
    backgroundColor: "#FF8A00",
    transform: [{ skewY: "-10deg" }, { skewX: "5deg" }],
    borderBottomRightRadius: 20,
  },
  content: { flex: 1, paddingHorizontal: 26, zIndex: 1 },
  brandName: {
    fontSize: 38,
    fontWeight: "900",
    color: "#111111",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  brandUnderline: {
    width: 110,
    height: 3,
    backgroundColor: "#FF8A00",
    alignSelf: "center",
    borderRadius: 2,
    marginTop: 6,
  },
  tagline: {
    textAlign: "center",
    fontSize: 15,
    color: "#888484",
    fontWeight: "400",
    marginTop: 10,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#F6C790",
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 26,
  },
  inputPill: {
    borderWidth: 1.5,
    borderColor: "#C49060",
    borderRadius: 30,
    backgroundColor: "#F6C790",
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === "ios" ? 13 : 2,
    justifyContent: "center",
  },
  inputText: { fontSize: 16, color: "#5A3E2B" },
  notReceived: {
    fontSize: 13,
    color: "#FF8A00",
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 18,
  },
  sendBtn: {
    backgroundColor: "#FF8A00",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
  },
  sendBtnText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  terms: {
    textAlign: "center",
    fontSize: 12,
    color: "#888484",
    marginTop: 20,
    lineHeight: 22,
  },
  termsGray: { color: "#888484" },
  link: { color: "#FF8A00", fontWeight: "600" },
});
