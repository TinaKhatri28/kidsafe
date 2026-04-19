import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { AuthService } from '../services/AuthService';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      Alert.alert('Invalid', 'Enter a valid 10-digit number');
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
      navigation.replace(result.role);
    } else {
      Alert.alert('Wrong OTP', 'Try again. Use 1234 in prototype.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Orange parallelogram top-left splash */}
      <View style={styles.splashWrapper} pointerEvents="none">
        <View style={styles.orangeParallelogram} />
      </View>

      {/* All main content */}
      <View style={styles.content}>

        {/* Spacer to push content below splash area */}
        <View style={{ height: 190 }} />

        {/* Brand */}
        <Text style={styles.brandName}>KidSafe</Text>
        <View style={styles.brandUnderline} />
        <Text style={styles.tagline}>Track your child's bus, live</Text>

        {/* Card */}
        <View style={styles.card}>

          {/* Phone input — pill border */}
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

          {/* OTP input — pill border */}
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

          {/* Not Received */}
          <TouchableOpacity onPress={otpSent ? handleSendOTP : undefined}>
            <Text style={styles.notReceived}>Not Received?</Text>
          </TouchableOpacity>

          {/* Send OTP button */}
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={otpSent ? handleVerifyOTP : handleSendOTP}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.sendBtnText}>
              {loading ? 'Please wait...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>

        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          {'By continuing , you agree to our\n'}
          <Text style={styles.link}>Terms of Services</Text>
          <Text style={styles.termsGray}> & </Text>
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* Orange parallelogram — absolutely positioned top-left */
  splashWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 220,
    overflow: 'hidden',
    zIndex: 0,
  },
  orangeParallelogram: {
    position: 'absolute',
    top: -30,
    left: -20,
    width: 260,
    height: 250,
    backgroundColor: '#FF8A00',
    transform: [{ skewY: '-10deg' }, { skewX: '5deg' }],
    borderBottomRightRadius: 20,
  },

  /* Main scroll/layout column */
  content: {
    flex: 1,
    paddingHorizontal: 26,
    zIndex: 1,
  },

  /* Brand */
  brandName: {
    fontSize: 38,
    fontWeight: '900',
    color: '#111111',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  brandUnderline: {
    width: 110,
    height: 3,
    backgroundColor: '#FF8A00',
    alignSelf: 'center',
    borderRadius: 2,
    marginTop: 6,
  },
  tagline: {
    textAlign: 'center',
    fontSize: 15,
    color: '#888484',
    fontWeight: '400',
    marginTop: 10,
    marginBottom: 24,
  },

  /* Peach card */
  card: {
    backgroundColor: '#F6C790',
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 26,
  },

  /* Pill-bordered input rows */
  inputPill: {
    borderWidth: 1.5,
    borderColor: '#C49060',
    borderRadius: 30,
    backgroundColor: '#F6C790',
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === 'ios' ? 13 : 2,
    justifyContent: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#5A3E2B',
  },

  /* Not Received */
  notReceived: {
    fontSize: 13,
    color: '#FF8A00',
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 18,
  },

  /* Orange pill button */
  sendBtn: {
    backgroundColor: '#FF8A00',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  /* Terms */
  terms: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888484',
    marginTop: 20,
    lineHeight: 22,
  },
  termsGray: {
    color: '#888484',
  },
  link: {
    color: '#FF8A00',
    fontWeight: '600',
  },
});