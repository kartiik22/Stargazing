import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CalibrationModalProps {
  visible: boolean;
  onClose: () => void;
  confidence?: 'high' | 'medium' | 'low';
}

export const CalibrationModal: React.FC<CalibrationModalProps> = ({
  visible,
  onClose,
  confidence = 'medium',
}) => {
  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalCard}>
        <Text style={styles.figureEightEmoji}>♾️</Text>
        <Text style={styles.modalTitle}>Calibrate Compass</Text>
        <Text style={styles.modalDescription}>
          Move your phone smoothly in a <Text style={styles.highlight}>figure-eight motion</Text> in the air.
        </Text>
        <Text style={styles.subtext}>
          This recalibrates the internal 3-axis magnetometer and eliminates electromagnetic interference from nearby metal structures.
        </Text>

        <View style={styles.statusBox}>
          <Text style={styles.statusLabel}>Sensor Confidence:</Text>
          <Text
            style={[
              styles.statusValue,
              { color: confidence === 'high' ? '#10B981' : confidence === 'medium' ? '#F59E0B' : '#EF4444' },
            ]}
          >
            {confidence.toUpperCase()}
          </Text>
        </View>

        <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
          <Text style={styles.doneText}>Done & Return</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5, 7, 20, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    zIndex: 1000,
  },
  modalCard: {
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    width: '100%',
    maxWidth: 360,
  },
  figureEightEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  modalDescription: {
    color: '#E2E8F0',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  highlight: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  subtext: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 20,
  },
  statusLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginRight: 8,
  },
  statusValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  doneBtn: {
    backgroundColor: '#0284C7',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  doneText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
