import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TouchGrassMission } from '../types/astronomy';

interface MissionCardProps {
  mission: TouchGrassMission;
  isActive: boolean;
  angularDistance?: number;
  onStart: () => void;
  onCancel: () => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  isActive,
  angularDistance,
  onStart,
  onCancel,
}) => {
  const getProximityText = () => {
    if (angularDistance === undefined) return null;
    if (angularDistance < 2.0) return '⭐ Target Locked! Put phone down & look up!';
    if (angularDistance < 6.0) return '🔥 Very close! Keep steady';
    if (angularDistance < 15.0) return '📡 In target zone — follow vibrations';
    return `Turn phone toward target (${Math.round(angularDistance)}° away)`;
  };

  return (
    <View style={[styles.card, isActive && styles.activeCard]}>
      <View style={styles.headerRow}>
        <View style={styles.badgeRow}>
          <Text style={styles.missionEmoji}>🌱</Text>
          <Text style={styles.missionType}>OUTDOOR MISSION</Text>
        </View>
        <Text style={[styles.difficultyBadge, styles[mission.difficulty]]}>
          {mission.difficulty.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.title}>{mission.title}</Text>
      <Text style={styles.instructions}>{mission.instructions}</Text>

      {isActive && angularDistance !== undefined && (
        <View style={styles.proximityBox}>
          <Text style={styles.proximityStatus}>{getProximityText()}</Text>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${Math.max(5, Math.min(100, (1 - Math.min(angularDistance, 45) / 45) * 100))}%`,
                  backgroundColor: angularDistance < 3 ? '#10B981' : '#F59E0B',
                },
              ]}
            />
          </View>
        </View>
      )}

      <View style={styles.actionRow}>
        {isActive ? (
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelBtnText}>Exit Mission</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.startBtn} onPress={onStart}>
            <Text style={styles.startBtnText}>Start Outdoor Mission</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 12,
  },
  activeCard: {
    borderColor: '#34D399',
    backgroundColor: 'rgba(6, 44, 30, 0.90)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  missionType: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  difficultyBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  easy: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: '#6EE7B7',
  },
  moderate: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    color: '#FCD34D',
  },
  expert: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    color: '#FCA5A5',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  instructions: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  proximityBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  proximityStatus: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  actionRow: {
    flexDirection: 'row',
  },
  startBtn: {
    flex: 1,
    backgroundColor: '#0284C7',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#FCA5A5',
    fontWeight: '700',
    fontSize: 13,
  },
});
