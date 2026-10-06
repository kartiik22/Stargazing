import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TouchGrassMission } from '../types/astronomy';
import { MissionCard } from '../components/MissionCard';

interface MissionScreenProps {
  onClose: () => void;
  activeMissionId?: string | null;
  onSelectMission: (mission: TouchGrassMission) => void;
  onCancelMission: () => void;
  angularDistance?: number;
}

const DEFAULT_MISSIONS: TouchGrassMission[] = [
  {
    id: 'mission-sirius',
    title: 'Find Sirius (The Dog Star)',
    targetObjectId: 'sirius',
    targetObjectName: 'Sirius',
    targetType: 'star',
    difficulty: 'easy',
    hint: 'Look for the most dazzling diamond in the southern sky.',
    instructions: 'Follow the haptic vibration guide until the phone locks onto Sirius. Then, immediately place your phone face down and witness the brilliant twinkling with your own eyes.',
    completed: false,
  },
  {
    id: 'mission-polaris',
    title: 'Locate Polaris (True North)',
    targetObjectId: 'polaris',
    targetObjectName: 'Polaris',
    targetType: 'star',
    difficulty: 'easy',
    hint: 'Stationary anchor of the northern heavens.',
    instructions: 'Turn northwards until the reticle vibrates. Notice how all other stars seem to slowly revolve around this single focal point.',
    completed: false,
  },
  {
    id: 'mission-betelgeuse',
    title: 'Spot the Red Giant Betelgeuse',
    targetObjectId: 'betelgeuse',
    targetObjectName: 'Betelgeuse',
    targetType: 'star',
    difficulty: 'moderate',
    hint: 'Upper left shoulder of Orion the Hunter.',
    instructions: 'Align your phone toward Orion. Observe Betelgeuse\'s warm orange-red luminescence compared to its blue companion Rigel. Put your screen away and contemplate its massive size.',
    completed: false,
  },
  {
    id: 'mission-orion-belt',
    title: 'Trace Orion\'s Iconic Belt',
    targetObjectId: 'alnilam',
    targetObjectName: 'Alnilam',
    targetType: 'star',
    difficulty: 'moderate',
    hint: 'Three perfectly aligned bright stars in a straight line.',
    instructions: 'Locate Alnilam, the central star of Orion\'s belt. Once locked, look up with naked eyes and see Alnitak and Mintaka flanking it.',
    completed: false,
  },
  {
    id: 'mission-vega',
    title: 'Anchor of the Summer Triangle: Vega',
    targetObjectId: 'vega',
    targetObjectName: 'Vega',
    targetType: 'star',
    difficulty: 'moderate',
    hint: 'Piercing blue-white jewel directly overhead.',
    instructions: 'Vega was the ancient north star 14,000 years ago. Use the haptic compass to align toward Lyra, then look directly overhead into the cosmos.',
    completed: false,
  },
];

export const MissionScreen: React.FC<MissionScreenProps> = ({
  onClose,
  activeMissionId,
  onSelectMission,
  onCancelMission,
  angularDistance,
}) => {
  const [missions] = useState<TouchGrassMission[]>(DEFAULT_MISSIONS);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>TOUCH GRASS CHALLENGES</Text>
          <Text style={styles.title}>Outdoor Missions</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.manifestoBox}>
        <Text style={styles.manifestoTitle}>🌱 The Touch Grass Principle</Text>
        <Text style={styles.manifestoText}>
          The phone is merely your navigator — not the destination. When your phone vibrates to indicate target lock, lower your device and look into the sky with your own eyes.
        </Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {missions.map((mission) => {
          const isActive = activeMissionId === mission.id;
          return (
            <MissionCard
              key={mission.id}
              mission={mission}
              isActive={isActive}
              angularDistance={isActive ? angularDistance : undefined}
              onStart={() => onSelectMission(mission)}
              onCancel={onCancelMission}
            />
          );
        })}
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
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  eyebrow: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
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
  manifestoBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: '#34D399',
    marginBottom: 16,
  },
  manifestoTitle: {
    color: '#6EE7B7',
    fontWeight: '800',
    fontSize: 13,
    marginBottom: 4,
  },
  manifestoText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
  },
  list: {
    flex: 1,
  },
});
