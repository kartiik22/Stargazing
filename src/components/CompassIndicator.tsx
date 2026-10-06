import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface CompassIndicatorProps {
  heading: number; // 0..360
  confidence?: 'high' | 'medium' | 'low';
  altitude: number; // -90..+90
}

export const CompassIndicator: React.FC<CompassIndicatorProps> = ({
  heading,
  confidence = 'high',
  altitude
}) => {
  const getCardinal = (deg: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((deg % 360) / 45)) % 8;
    return directions[index];
  };

  const confidenceColors = {
    high: '#10B981',
    medium: '#F59E0B',
    low: '#EF4444'
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardinalBadge}>
        <Text style={styles.cardinalText}>{getCardinal(heading)}</Text>
        <Text style={styles.headingDegrees}>{Math.round(heading)}°</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.altitudeBadge}>
        <Text style={styles.altLabel}>ALT</Text>
        <Text style={styles.altDegrees}>{altitude > 0 ? `+${Math.round(altitude)}` : Math.round(altitude)}°</Text>
      </View>
      <View
        style={[
          styles.confidenceDot,
          { backgroundColor: confidenceColors[confidence] }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  cardinalBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardinalText: {
    color: '#38BDF8',
    fontWeight: '800',
    fontSize: 14,
    marginRight: 4,
  },
  headingDegrees: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 8,
  },
  altitudeBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  altLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    marginRight: 4,
  },
  altDegrees: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  confidenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginLeft: 8,
  },
});
