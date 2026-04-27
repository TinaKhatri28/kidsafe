// src/context/UserContext.js
import { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  // user shape after login:
  // {
  //   phone, role, name, screen,
  //   childName (parent),
  //   busNumber (driver/conductor),
  //   school (admin)
  // }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
