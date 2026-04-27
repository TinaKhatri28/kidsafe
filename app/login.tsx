import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUser } from "../src/context/UserContext";
import { AuthService } from "../src/services/AuthService";

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useUser();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSendOTP() {
    setError("");
    setLoading(true);
    try {
      const res = await AuthService.sendOTP(phone);
      if (res.success) setStep("otp");
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    setError("");
    setLoading(true);
    try {
      const res = await AuthService.verifyOTP(Number(phone), otp);
      if (res.success) {
        // Save user globally — all screens can read this now
        setUser(res.user);
        router.replace(`/${res.role}` as any);
      } else {
        setError("Incorrect OTP. Try again.");
      }
    } catch (e: any) {
      setError(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8A00" />
      <View style={styles.header}>
        <Text style={styles.title}>KidSafe</Text>
        <Text style={styles.subtitle}>School Bus Safety Platform</Text>
      </View>
      <View style={styles.card}>
        {step === "phone" ? (
          <>
            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputRow}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="9999999991"
                placeholderTextColor="#aaa"
                keyboardType="phone-pad"
                maxLength={10}
                autoFocus
              />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.btn, phone.length < 10 && styles.btnDisabled]}
              onPress={handleSendOTP}
              disabled={phone.length < 10 || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Send OTP</Text>
              )}
            </TouchableOpacity>
            <View style={styles.hint}>
              <Text style={styles.hintTitle}>Demo Numbers</Text>
              <Text style={styles.hintRow}>9999999991 → Parent</Text>
              <Text style={styles.hintRow}>9999999992 → Driver</Text>
              <Text style={styles.hintRow}>9999999993 → Conductor</Text>
              <Text style={styles.hintRow}>9999999994 → Admin</Text>
              <Text style={styles.hintOtp}>OTP: check terminal</Text>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => {
                setStep("phone");
                setOtp("");
                setError("");
              }}
            >
              <Text style={styles.back}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Enter OTP</Text>
            <Text style={styles.phoneSent}>Sent to +91 {phone}</Text>
            <TextInput
              style={[styles.input, styles.otpInput]}
              value={otp}
              onChangeText={setOtp}
              placeholder="----"
              placeholderTextColor="#aaa"
              keyboardType="number-pad"
              maxLength={4}
              autoFocus
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.btn, otp.length < 4 && styles.btnDisabled]}
              onPress={handleVerifyOTP}
              disabled={otp.length < 4 || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Verify & Continue</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0A0A0A" },
  header: { paddingTop: 100, paddingBottom: 40, alignItems: "center" },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FF8A00",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  card: {
    marginHorizontal: 24,
    backgroundColor: "#141414",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#222",
  },
  label: { fontSize: 14, color: "#999", marginBottom: 10, fontWeight: "600" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1C1C1C",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#2A2A2A",
    marginBottom: 14,
    overflow: "hidden",
  },
  countryCode: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#aaa",
    fontWeight: "700",
    fontSize: 15,
    borderRightWidth: 1,
    borderRightColor: "#2A2A2A",
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
  otpInput: {
    borderWidth: 1.5,
    borderColor: "#2A2A2A",
    borderRadius: 10,
    backgroundColor: "#1C1C1C",
    marginBottom: 14,
    fontSize: 28,
    textAlign: "center",
    letterSpacing: 8,
    flex: 0,
  },
  btn: {
    backgroundColor: "#FF8A00",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  error: { color: "#EF4444", fontSize: 13, marginBottom: 10 },
  back: { color: "#999", fontSize: 14, fontWeight: "600", marginBottom: 14 },
  phoneSent: {
    color: "#FF8A00",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 14,
  },
  hint: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  hintTitle: {
    color: "#555",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  hintRow: { color: "#777", fontSize: 13, marginBottom: 3 },
  hintOtp: { color: "#FF8A00", fontSize: 13, fontWeight: "700", marginTop: 6 },
});
