// src/constants/config.js
// ONE place to change IP — updates everywhere automatically

const CONFIG = {
  SERVER_URL: "http://172.21.112.139:3000", // change only this when IP changes
  BUS_ID: "12", // temporary — will come from DB later
  SOCKET_OPTIONS: {
    transports: ["polling"],
    reconnection: true,
    forceNew: true,
    path: "/socket.io",
    timeout: 20000,
  },
};

export default CONFIG;
