// import { Stack } from "expo-router";

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" />
//       <Stack.Screen name="login" />
//       <Stack.Screen name="ParentHome" />
//       <Stack.Screen name="Notifications" />
//       <Stack.Screen name="DriverHome" />
//       <Stack.Screen name="AdminDashboard" />
//       <Stack.Screen name="ConductorHome" />
//       <Stack.Screen name="StudentList" />
//       <Stack.Screen name="FaceScan" />
//       <Stack.Screen name="FaceScanMatch" />
//       <Stack.Screen name="CPSubmitted" />
//       <Stack.Screen name="Emergency" />
//       <Stack.Screen name="modal" />
//     </Stack>
//   );
// }

import { Stack } from "expo-router";
import { UserProvider } from "../src/context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </UserProvider>
  );
}
