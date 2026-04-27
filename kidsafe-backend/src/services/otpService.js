const NodeCache = require("node-cache");
const twilio = require("twilio");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// OTP expires after 5 minutes automatically
const otpCache = new NodeCache({ stdTTL: 300 });

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function sendSMS(phone, otp) {
  if (process.env.USE_REAL_SMS !== "true") {
    console.log(`[PROTOTYPE] +91${phone} OTP: ${otp}`);
    return true;
  }

  try {
    await client.messages.create({
      body: `Your KidSafe OTP is ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE,
      to: `+91${phone}`,
    });
    return true;
  } catch (e) {
    console.error("SMS not sent:", e.message);
    return false;
  }
}

async function createOTP(phone) {
  const otp = generateOTP();
  otpCache.set(phone, otp);
  await sendSMS(phone, otp);
  return otp;
}

function verifyOTP(phone, otp) {
  const savedOTP = otpCache.get(phone);
  if (!savedOTP)
    return { valid: false, reason: "OTP expired. Request a new one." };
  if (savedOTP !== otp) return { valid: false, reason: "Incorrect OTP." };
  otpCache.del(phone);
  return { valid: true };
}

module.exports = { createOTP, verifyOTP };
