import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { DeviceOrientation, ObserverLocation } from '../types/astronomy';

interface DebugOverlayProps {
  visible: boolean;
  onClose: () => void;
  orientation: DeviceOrientation;
  location: ObserverLocation;
  visibleCount: number;
  isSimulatedTime?: boolean;
  onToggleSimulatedTime?: () => void;
  onSetManualOrientation?: (alt: number, az: number) => void;
  onResetManual?: () => void;
}

export const DebugOverlay: React.FC<DebugOverlayProps> = ({
  visible,
  onClose,
  orientation,
  location,
  visibleCount,
  isSimulatedTime,
  onToggleSimulatedTime,
  onSetManualOrientation,
  onResetManual,
}) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛰️ SENSOR & EPHEMERIS TELEMETRY</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* GPS Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OBSERVER (GPS)</Text>
          <Text style={styles.statLine}>
            Lat: <Text style={styles.value}>{location.latitude.toFixed(4)}°</Text>
            {'  '}
            Lon: <Text style={styles.value}>{location.longitude.toFixed(4)}°</Text>
          </Text>
          <Text style={styles.statLine}>
            Altitude: <Text style={styles.value}>{Math.round(location.altitude || 0)} m</Text>
            {'  '}
            Accuracy: <Text style={styles.value}>±{Math.round(location.accuracy || 10)} m</Text>
          </Text>
          <Text style={styles.statLine}>
            City: <Text style={styles.value}>{location.city || 'Unknown'}, {location.country || ''}</Text>
          </Text>
        </View>

        {/* Orientation Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DEVICE FUSED ORIENTATION</Text>
          <Text style={styles.statLine}>
            Azimuth (Compass): <Text style={styles.value}>{orientation.azimuth.toFixed(1)}°</Text>
          </Text>
          <Text style={styles.statLine}>
            Altitude (Elevation): <Text style={styles.value}>{orientation.altitude.toFixed(1)}°</Text>
          </Text>
          <Text style={styles.statLine}>
            Roll: <Text style={styles.value}>{orientation.roll.toFixed(1)}°</Text>
            {'  '}
            Pitch: <Text style={styles.value}>{orientation.pitch.toFixed(1)}°</Text>
          </Text>
          <Text style={styles.statLine}>
            Compass Quality: <Text style={[styles.value, { color: orientation.headingConfidence === 'low' ? '#EF4444' : '#10B981' }]}>
              {orientation.headingConfidence?.toUpperCase() || 'HIGH'}
            </Text>
          </Text>
        </View>

        {/* Camera Optical FOV */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OPTICAL CAMERA MATRIX</Text>
          <Text style={styles.statLine}>Horizontal FOV: <Text style={styles.value}>60°</Text></Text>
          <Text style={styles.statLine}>Vertical FOV: <Text style={styles.value}>75°</Text></Text>
          <Text style={styles.statLine}>Visible Catalog Luminaries: <Text style={styles.value}>{visibleCount}</Text></Text>
        </View>

        {/* Quick Testing Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MANUAL TEST BENCH (SIMULATION)</Text>
          <Text style={styles.infoNote}>
            Quickly test celestial projections without rotating phone outdoors:
          </Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#0284C7' }]}
              onPress={() => onSetManualOrientation?.(29.3, 0.4)}
            >
              <Text style={styles.btnText}>Polaris (0°, +29°)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#7C3AED' }]}
              onPress={() => onSetManualOrientation?.(76.7, 275.7)}
            >
              <Text style={styles.btnText}>Alpheratz (276°, +77°)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => onSetManualOrientation?.(63.3, 178.7)}
            >
              <Text style={styles.btnText}>🪐 Saturn (+63°)</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.btnRow, { marginTop: 6 }]}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#4338CA' }]}
              onPress={onToggleSimulatedTime}
            >
              <Text style={styles.btnText}>
                {isSimulatedTime ? 'Time: Midnight (Fixed)' : 'Time: Real-Time'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#DC2626' }]}
              onPress={onResetManual}
            >
              <Text style={styles.btnText}>Reset to Live Sensors</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 12,
    right: 12,
    maxHeight: '75%',
    backgroundColor: 'rgba(5, 7, 20, 0.94)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#38BDF8',
    zIndex: 999,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 8,
    marginBottom: 10,
  },
  headerTitle: {
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 0,
  },
  section: {
    marginBottom: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 8,
    padding: 8,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statLine: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 16,
  },
  value: {
    color: '#F8FAFC',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  infoNote: {
    color: '#94A3B8',
    fontSize: 10,
    marginBottom: 6,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  btnText: {
    color: '#F1F5F9',
    fontSize: 10,
    fontWeight: '700',
  },
});
