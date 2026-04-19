// PROTOTYPE: hardcoded OTP. Later: swap sendOTP() to call your Node.js backend.
// Role routing: in prototype, map phone numbers to roles manually.

const PROTOTYPE_ROLES = {
  9999999991: "ParentHome",
  9999999992: "DriverHome",
  9999999993: "ConductorHome",
  9999999994: "AdminDashboard",
};

export const AuthService = {
  sendOTP: async (phone) => {
    // TODO: replace with → await fetch('https://your-api/send-otp', { method: 'POST', body: JSON.stringify({ phone }) })
    console.log(`[PROTOTYPE] OTP sent to +91${phone}: 1234`);
    return { success: true };
  },

  verifyOTP: async (phone, otp) => {
    // TODO: replace with → await fetch('https://your-api/verify-otp', ...)
    if (otp === "1234") {
      const role = PROTOTYPE_ROLES[phone] || "ParentHome"; // default to parent
      return { success: true, role };
    }
    return { success: false };
  },
};
