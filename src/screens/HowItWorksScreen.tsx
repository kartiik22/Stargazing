import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface HowItWorksScreenProps {
  onClose: () => void;
}

export const HowItWorksScreen: React.FC<HowItWorksScreenProps> = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>How SkyScout Works</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Step 1 */}
        <View style={styles.stepCard}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepNum}>1</Text>
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>9-Axis Sensor Fusion</Text>
            <Text style={styles.stepDesc}>
              The phone merges accelerometer gravity vectors with the 3-axis magnetometer and gyroscope to compute real-time optical boresight altitude and azimuth.
            </Text>
          </View>
        </View>

        {/* Step 2 */}
        <View style={styles.stepCard}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepNum}>2</Text>
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>IAU Astrometry & Ephemeris</Text>
            <Text style={styles.stepDesc}>
              Your GPS latitude/longitude and exact timestamp determine Local Sidereal Time (LST). SkyScout converts celestial Right Ascension & Declination coordinates into current Altitude and Azimuth.
            </Text>
          </View>
        </View>

        {/* Step 3 */}
        <View style={styles.stepCard}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepNum}>3</Text>
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>Camera Optical Projection</Text>
            <Text style={styles.stepDesc}>
              Angular differences between your phone's lens and visible stars are mapped through the camera field of view (FOV) directly onto the live video feed.
            </Text>
          </View>
        </View>

        {/* Step 4 */}
        <View style={styles.stepCard}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepNum}>4</Text>
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>Tactile Touch Grass Missions</Text>
            <Text style={styles.stepDesc}>
              Haptic pulses guide you toward targets like Sirius or Polaris. Once locked, lower your device and observe the night sky with your own naked eyes!
            </Text>
          </View>
        </View>

        {/* Step 5 */}
        <View style={styles.stepCard}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepNum}>5</Text>
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>Open-Weight Edge AI</Text>
            <Text style={styles.stepDesc}>
              On-device reasoning analyzes visible celestial bodies in your frame, cross-referencing magnitude, optical contrast, and ancient lore.
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050714',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
  },
  closeText: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  stepNum: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepDesc: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
  },
});
