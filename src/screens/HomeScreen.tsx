import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar
} from 'react-native';
import { useLocation } from '../hooks/useLocation';

interface HomeScreenProps {
  onStartStargazing: () => void;
  onOpenHowItWorks: () => void;
  onOpenSettings: () => void;
  onOpenMissions: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartStargazing,
  onOpenHowItWorks,
  onOpenSettings,
  onOpenMissions,
}) => {
  const { location, hasPermission, requestPermission } = useLocation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#050714" />

      {/* Decorative Star Background Highlights */}
      <View style={[styles.starGlow, { top: 90, left: 40 }]} />
      <View style={[styles.starGlow, { top: 220, right: 30, opacity: 0.3 }]} />
      <View style={[styles.starGlow, { bottom: 180, left: 70, opacity: 0.25 }]} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Top Branding */}
        <View style={styles.brandContainer}>
          <View style={styles.constellationIcon}>
            <Text style={styles.celestialEmoji}>✨</Text>
          </View>
          <Text style={styles.appTitle}>SkyScout</Text>
          <Text style={styles.subtitle}>Look up. Discover what's above you.</Text>
        </View>

        {/* Current Location Badge */}
        <View style={styles.locationContainer}>
          <View style={styles.locBadge}>
            <Text style={styles.locPin}>📍</Text>
            <Text style={styles.locText}>
              {location.city ? `${location.city}, ${location.country}` : 'Delhi, India'}
            </Text>
          </View>
          {hasPermission === false && (
            <TouchableOpacity onPress={requestPermission} style={styles.permNoticeBtn}>
              <Text style={styles.permNoticeText}>Enable GPS for exact celestial alignment</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Touch Grass Hackathon Hero Banner */}
        <View style={styles.touchGrassBanner}>
          <View style={styles.touchGrassHeader}>
            <Text style={styles.touchGrassTag}>TOUCH GRASS AI HACKATHON</Text>
          </View>
          <Text style={styles.touchGrassText}>
            Step outdoors into the night. SkyScout utilizes on-device sensor fusion and open-weight AI to guide your eyes away from your phone and toward the real night sky.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.btnStack}>
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.8}
            onPress={onStartStargazing}
          >
            <Text style={styles.primaryBtnText}>Start Stargazing</Text>
            <Text style={styles.primaryBtnSub}>Open live AR camera & sensor overlay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            activeOpacity={0.8}
            onPress={onOpenMissions}
          >
            <View style={styles.missionBtnRow}>
              <Text style={styles.missionEmoji}>🌱</Text>
              <Text style={styles.secondaryBtnText}>Outdoor Missions</Text>
            </View>
            <Text style={styles.secondaryBtnSub}>Tactile challenges to find stars with your eyes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tertiaryBtn}
            activeOpacity={0.8}
            onPress={onOpenHowItWorks}
          >
            <Text style={styles.tertiaryBtnText}>How It Works</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tertiaryBtn}
            activeOpacity={0.8}
            onPress={onOpenSettings}
          >
            <Text style={styles.tertiaryBtnText}>Settings & Sensors</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer Info */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Offline-First • Real 9-Axis Sensor Fusion • Open-Weight AI
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050714',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },
  starGlow: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
    shadowColor: '#38BDF8',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 5,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  constellationIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderWidth: 1,
    borderColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  celestialEmoji: {
    fontSize: 28,
  },
  appTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#94A3B8',
    marginTop: 6,
    textAlign: 'center',
  },
  locationContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  locBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  locPin: {
    fontSize: 14,
    marginRight: 6,
  },
  locText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  permNoticeBtn: {
    marginTop: 8,
  },
  permNoticeText: {
    color: '#38BDF8',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  touchGrassBanner: {
    backgroundColor: 'rgba(6, 44, 30, 0.7)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    marginBottom: 28,
  },
  touchGrassHeader: {
    marginBottom: 6,
  },
  touchGrassTag: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  touchGrassText: {
    color: '#D1FAE5',
    fontSize: 13,
    lineHeight: 19,
  },
  btnStack: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#0284C7',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#38BDF8',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  primaryBtnSub: {
    color: '#BAE6FD',
    fontSize: 12,
    marginTop: 3,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  missionBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  secondaryBtnText: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtnSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  tertiaryBtn: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    alignItems: 'center',
  },
  tertiaryBtnText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
  },
});
