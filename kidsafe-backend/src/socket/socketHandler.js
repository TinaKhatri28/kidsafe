// Yahan har bus ki latest location store hogi
// Jaise Redis karta, abhi memory mein kar rahe hain prototype ke liye
const busLocations = {};

function initSocket(io) {
  io.on("connection", (socket) => {
    console.log(`connected id: ${socket.id}`);

    // ── DRIVER apna bus room join karta hai ──
    // Driver ke phone se yeh event aayega jab trip start ho
    socket.on("driver_join", ({ busId, driverName }) => {
      socket.join(`bus_${busId}`);
      console.log(`Driver ${driverName} of bus_${busId} joined the room`);
    });

    // ── DRIVER location bhejta hai har 3 second mein ──
    socket.on("location_update", ({ busId, lat, lng, speed }) => {
      // Memory mein save karo latest location
      busLocations[busId] = { lat, lng, speed, updatedAt: Date.now() };

      // Saare parents jo is bus ko track kar rahe hain unhe bhej do
      socket.to(`bus_${busId}`).emit("bus_location", {
        busId,
        lat,
        lng,
        speed,
      });

      console.log(`Bus ${busId} location: ${lat}, ${lng}`);
    });

    // ── PARENT apna bus track karna shuru karta hai ──
    socket.on("parent_join", ({ busId, parentName }) => {
      socket.join(`bus_${busId}`);
      console.log(`Parent ${parentName} joined bus_${busId}`); // already there?

      // Send last known location immediately if available
      if (busLocations[busId]) {
        socket.emit("bus_location", {
          busId,
          ...busLocations[busId],
        });
        console.log(`Sent last known location to ${parentName}`);
      }
    });

    // ── CONDUCTOR checkpoint submit karta hai ──
    socket.on("checkpoint_done", ({ busId, cpNumber, studentCount }) => {
      // Saare parents ko notify karo
      io.to(`bus_${busId}`).emit("checkpoint_update", {
        busId,
        cpNumber,
        studentCount,
        time: new Date().toLocaleTimeString("en-IN"),
      });

      console.log(
        `Bus ${busId}: CP${cpNumber} complete, ${studentCount} students`,
      );
    });

    // ── Disconnect ──
    socket.on("disconnect", () => {
      console.log(`Disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSocket;
