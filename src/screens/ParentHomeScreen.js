import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions, StatusBar
} from 'react-native';
import Svg, {
  Rect, Line, Path, Circle, Ellipse,
  G, Text as SvgText
} from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const MAP_HEIGHT = height * 0.48;

function FakeMap() {
  const W = width;
  const H = MAP_HEIGHT;

  return (
    <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>

      {/* MAP BACKGROUND */}
      <Rect x={0} y={0} width={W} height={H} fill="#E8E0D8" />

      {/* BLOCKS */}
      <Rect x={0}   y={0}   width={100} height={90}  fill="#D6CFC6" rx={2} />
      <Rect x={110} y={0}   width={90}  height={90}  fill="#D6CFC6" rx={2} />
      <Rect x={210} y={0}   width={80}  height={90}  fill="#CECABE" rx={2} />
      <Rect x={300} y={0}   width={W - 300} height={90} fill="#D6CFC6" rx={2} />
      <Rect x={0}   y={160} width={110} height={100} fill="#D6CFC6" rx={2} />
      <Rect x={0}   y={270} width={110} height={80}  fill="#CECABE" rx={2} />
      <Rect x={0}   y={360} width={110} height={H - 360} fill="#D6CFC6" rx={2} />
      <Rect x={180} y={160} width={100} height={80}  fill="#D6CFC6" rx={2} />
      <Rect x={290} y={160} width={W - 290} height={80} fill="#CECABE" rx={2} />
      <Rect x={180} y={250} width={100} height={90}  fill="#CECABE" rx={2} />
      <Rect x={290} y={250} width={W - 290} height={90} fill="#D6CFC6" rx={2} />
      <Rect x={120} y={340} width={140} height={H - 340} fill="#D6CFC6" rx={2} />
      <Rect x={270} y={360} width={W - 270} height={H - 360} fill="#CECABE" rx={2} />

      {/* MAIN ROADS horizontal */}
      <Rect x={0} y={95}  width={W} height={60} fill="#F5F0EB" />
      <Rect x={0} y={330} width={W} height={50} fill="#F5F0EB" />

      {/* MAIN ROADS vertical */}
      <Rect x={115} y={0} width={60} height={H} fill="#F5F0EB" />
      <Rect x={280} y={0} width={55} height={H} fill="#F5F0EB" />

      {/* Road center lines */}
      <Line x1={0} y1={125} x2={W} y2={125} stroke="#E0D8CE" strokeWidth={1.5} strokeDasharray="18,12" />
      <Line x1={0} y1={356} x2={W} y2={356} stroke="#E0D8CE" strokeWidth={1.5} strokeDasharray="18,12" />
      <Line x1={145} y1={0} x2={145} y2={H} stroke="#E0D8CE" strokeWidth={1.5} strokeDasharray="18,12" />
      <Line x1={307} y1={0} x2={307} y2={H} stroke="#E0D8CE" strokeWidth={1.5} strokeDasharray="18,12" />

      {/* GREEN PARK */}
      <Rect x={120} y={160} width={55} height={165} fill="#C8D9A8" rx={4} />
      <Circle cx={147} cy={200} r={18} fill="#A8C478" />
      <Circle cx={135} cy={220} r={12} fill="#98B868" />
      <Circle cx={158} cy={218} r={14} fill="#A8C478" />
      <Circle cx={147} cy={280} r={16} fill="#98B868" />
      <Circle cx={135} cy={295} r={11} fill="#A8C478" />
      <Circle cx={160} cy={292} r={13} fill="#98B868" />

      {/* DASHED ROUTE */}
      <Path
        d={`M 60 ${H - 20} L 60 355 L 145 355 L 145 125 L 307 125 L ${W - 30} 125`}
        fill="none"
        stroke="#1A1A1A"
        strokeWidth={2.5}
        strokeDasharray="10,7"
        strokeLinecap="round"
      />

      {/* BUS ICON */}
      <G transform="translate(48, 310)">
        <Ellipse cx={36} cy={52} rx={30} ry={5} fill="rgba(0,0,0,0.15)" />
        <Rect x={4}  y={8}  width={64} height={38} fill="#FFA500" rx={6} />
        <Rect x={8}  y={2}  width={56} height={12} fill="#FF8C00" rx={4} />
        <Rect x={10} y={13} width={14} height={10} fill="#87CEEB" rx={2} />
        <Rect x={28} y={13} width={14} height={10} fill="#87CEEB" rx={2} />
        <Rect x={46} y={13} width={14} height={10} fill="#87CEEB" rx={2} />
        <Rect x={52} y={26} width={10} height={16} fill="#CC6600" rx={2} />
        <Rect x={4}  y={42} width={64} height={6}  fill="#CC6600" rx={2} />
        <Circle cx={18} cy={50} r={8} fill="#333333" />
        <Circle cx={18} cy={50} r={4} fill="#777777" />
        <Circle cx={54} cy={50} r={8} fill="#333333" />
        <Circle cx={54} cy={50} r={4} fill="#777777" />
        <Rect x={60} y={20} width={6} height={8} fill="#FFFF99" rx={1} />
        <Rect x={65} y={30} width={4} height={10} fill="#CC6600" rx={1} />
      </G>

      {/* YOUR STOP PIN */}
      <G transform={`translate(${W - 85}, 60)`}>
        <Ellipse cx={18} cy={58} rx={10} ry={4} fill="rgba(0,0,0,0.2)" />
        <Path
          d="M18 0 C8 0 0 8 0 18 C0 30 18 56 18 56 C18 56 36 30 36 18 C36 8 28 0 18 0 Z"
          fill="#E53935"
        />
        <Circle cx={18} cy={18} r={9} fill="#FFFFFF" />
        <Circle cx={18} cy={18} r={4} fill="#E53935" />
      </G>

      {/* YOUR STOP LABEL */}
      <Rect x={W - 100} y={28} width={88} height={22} fill="#E53935" rx={11} />
      <SvgText x={W - 56} y={43} fill="#FFFFFF" fontSize={10} fontWeight="700" textAnchor="middle">
        Your Stop
      </SvgText>

      {/* COMPASS */}
      <G transform={`translate(${W - 42}, ${H - 42})`}>
        <Circle cx={16} cy={16} r={16} fill="white" opacity={0.9} />
        <SvgText x={16} y={12} fill="#E53935" fontSize={9} fontWeight="700" textAnchor="middle">N</SvgText>
        <SvgText x={16} y={26} fill="#888" fontSize={7} textAnchor="middle">S</SvgText>
        <SvgText x={6}  y={20} fill="#888" fontSize={7} textAnchor="middle">W</SvgText>
        <SvgText x={26} y={20} fill="#888" fontSize={7} textAnchor="middle">E</SvgText>
      </G>

    </Svg>
  );
}

export default function ParentHomeScreen({ navigation }) {
  const [notifyActive, setNotifyActive] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8A00" />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <Text style={styles.busName}>Aryan's Bus</Text>
          <Text style={styles.liveTracking}>Live Tracking</Text>
        </View>
        <View style={styles.busNumBadge}>
          <Text style={styles.busNumText}>Bus No. 12</Text>
        </View>
      </View>

      {/* MAP */}
      <View style={styles.mapContainer}>
        <FakeMap />
      </View>

      {/* SCROLLABLE BOTTOM SHEET */}
      <ScrollView
        style={styles.bottomSheet}
        contentContainerStyle={styles.bottomSheetContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <View style={styles.dragHandle} />

        {/* ETA Row */}
        <View style={styles.etaRow}>
          <View>
            <Text style={styles.etaLabel}>ETA to your Stop</Text>
            <Text style={styles.etaTime}>8 <Text style={styles.etaMin}>min</Text></Text>
          </View>
          <View style={styles.lateBadge}>
            <Text style={styles.lateText}>Running Late</Text>
          </View>
        </View>

        <Text style={styles.currentLocation}>Current: Sector 21, Chandigarh</Text>

        <View style={styles.divider} />

        {/* Info cards */}
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardLabel}>Speed</Text>
            <Text style={styles.infoCardValue}>42 km/h</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardLabel}>Distance</Text>
            <Text style={styles.infoCardValue}>3.2 km</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoCardLabel}>Stops Left</Text>
            <Text style={styles.infoCardValue}>2</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Route */}
        <View style={styles.routeInfo}>
          <Text style={styles.routeLabel}>Route</Text>
          <Text style={styles.routeValue}>Sector 15 → School → Sector 22</Text>
        </View>

        <View style={styles.divider} />

        {/* Driver */}
        <View style={styles.driverRow}>
          <View style={styles.driverAvatar}>
            <Text style={styles.driverAvatarText}>RK</Text>
          </View>
          <View>
            <Text style={styles.driverName}>Rajan Kumar</Text>
            <Text style={styles.driverLabel}>Driver · Bus No. 12</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Notify button */}
        <TouchableOpacity
          style={[styles.notifyBtn, notifyActive && styles.notifyBtnActive]}
          onPress={() => setNotifyActive(!notifyActive)}
          activeOpacity={0.85}
        >
          <Text style={styles.notifyBtnText}>
            {notifyActive ? '✓ You will be notified' : 'Notify me when bus is near'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  topBar: {
    backgroundColor: '#FF8A00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 48,
    paddingBottom: 14,
  },
  topLeft: {
    flexDirection: 'column',
  },
  busName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  liveTracking: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginTop: 2,
  },
  busNumBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  busNumText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  mapContainer: {
    width: '100%',
    height: MAP_HEIGHT,
    overflow: 'hidden',
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomSheetContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 40,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etaLabel: {
    fontSize: 14,
    color: '#888888',
    fontWeight: '500',
  },
  etaTime: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FF8A00',
    lineHeight: 48,
  },
  etaMin: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF8A00',
  },
  lateBadge: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#FFB74D',
  },
  lateText: {
    color: '#FF8A00',
    fontSize: 13,
    fontWeight: '700',
  },
  currentLocation: {
    fontSize: 13,
    color: '#888888',
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  infoCardLabel: {
    fontSize: 11,
    color: '#888888',
    fontWeight: '500',
  },
  infoCardValue: {
    fontSize: 16,
    color: '#FF8A00',
    fontWeight: '800',
    marginTop: 4,
  },
  routeInfo: {
    marginVertical: 4,
  },
  routeLabel: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  routeValue: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
    marginTop: 4,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FF8A00',
  },
  driverAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF8A00',
  },
  driverName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333333',
  },
  driverLabel: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  notifyBtn: {
    backgroundColor: '#FF8A00',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  notifyBtnActive: {
    backgroundColor: '#4CAF50',
  },
  notifyBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});