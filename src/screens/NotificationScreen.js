import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

const notifications = {
  today: [
    {
      id: 1,
      color: "#4CAF50",
      icon: "✓",
      iconBg: "#4CAF50",
      iconType: "check",
      title: "Bus arriving in 5 mins",
      subtitle: "Bus No. 12 is near your stop",
      time: "8:22 AM",
    },
    {
      id: 2,
      color: "#FF8A00",
      icon: "🕐",
      iconBg: "#FF8A00",
      iconType: "clock",
      title: "Bus delayed  by 8 mins",
      subtitle: "Traffic near sector 17",
      time: "8:05 AM",
    },
    {
      id: 3,
      color: "#2196F3",
      icon: "🚌",
      iconBg: "#2196F3",
      iconType: "bus",
      title: "Trip Started",
      subtitle: "Bus No. 12 left school at 7:45AM",
      time: "7:45 AM",
    },
  ],
  earlier: [
    {
      id: 4,
      color: "#4CAF50",
      icon: "✓",
      iconBg: "#4CAF50",
      iconType: "check",
      title: "Trip Completed",
      subtitle: "Aryan reached home safely",
      time: "4:30 PM",
    },
  ],
};

function NotifIcon({ type, bg }) {
  return (
    <View style={[styles.iconCircle, { backgroundColor: bg }]}>
      {type === "check" && <Text style={styles.iconText}>✓</Text>}
      {type === "clock" && <Text style={styles.iconText}>◷</Text>}
      {type === "bus" && <Text style={styles.iconText}>🚌</Text>}
    </View>
  );
}

function NotifCard({ item }) {
  return (
    <View style={styles.card}>
      {/* Left color bar */}
      <View style={[styles.leftBar, { backgroundColor: item.color }]} />

      {/* Icon */}
      <NotifIcon type={item.iconType} bg={item.iconBg} />

      {/* Text content */}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      </View>

      {/* Time */}
      <Text style={styles.cardTime}>{item.time}</Text>
    </View>
  );
}

export default function NotificationScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8A00" />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Notifications</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TODAY */}
        <Text style={styles.sectionLabel}>TODAY</Text>
        {notifications.today.map((item) => (
          <NotifCard key={item.id} item={item} />
        ))}

        {/* EARLIER */}
        <Text style={styles.sectionLabel}>EARLIER</Text>
        {notifications.earlier.map((item) => (
          <NotifCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },

  /* Top bar */
  topBar: {
    backgroundColor: "#FF8A00",
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },

  /* Scroll */
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },

  /* Section label */
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#AAAAAA",
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 6,
    marginLeft: 4,
  },

  /* Card */
  card: {
    backgroundColor: "#EBEBEB",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    overflow: "hidden",
    minHeight: 80,
  },

  /* Left color bar */
  leftBar: {
    width: 5,
    alignSelf: "stretch",
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },

  /* Icon circle */
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "800",
  },

  /* Card body */
  cardBody: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 4,
    lineHeight: 20,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#666666",
    fontWeight: "400",
    lineHeight: 18,
  },

  /* Time */
  cardTime: {
    fontSize: 12,
    color: "#999999",
    fontWeight: "500",
    marginRight: 14,
    alignSelf: "flex-start",
    marginTop: 14,
  },
});
