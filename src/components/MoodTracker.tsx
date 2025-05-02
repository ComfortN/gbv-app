import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform 
} from 'react-native';
import { THEME_COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../constants/theme';

export interface MoodOption {
  id: string;
  name: string;
  emoji: string;
}

interface MoodTrackerProps {
  onMoodSelect: (mood: MoodOption) => void;
  selectedMood?: string;
  title?: string;
  containerStyle?: object;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { id: 'happy', name: 'Happy', emoji: '😊' },
  { id: 'calm', name: 'Calm', emoji: '😌' },
  { id: 'neutral', name: 'Neutral', emoji: '😐' },
  { id: 'sad', name: 'Sad', emoji: '😔' },
  { id: 'anxious', name: 'Anxious', emoji: '😰' },
  { id: 'angry', name: 'Angry', emoji: '😡' },
];

const MoodTracker: React.FC<MoodTrackerProps> = ({ 
  onMoodSelect, 
  selectedMood,
  title = "How are you feeling today?",
  containerStyle
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.moodSelector}>
        {MOOD_OPTIONS.map((mood) => (
          <TouchableOpacity
            key={mood.id}
            style={[
              styles.moodOption,
              selectedMood === mood.id && styles.selectedMoodOption
            ]}
            onPress={() => onMoodSelect(mood)}
            activeOpacity={0.7}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
            <Text style={[
              styles.moodText,
              selectedMood === mood.id && styles.selectedMoodText
            ]}>
              {mood.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME_COLORS.background,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: THEME_COLORS.secondary,
    ...SHADOWS.small,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.heading3,
    color: THEME_COLORS.text,
    marginBottom: SPACING.md,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  moodOption: {
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.medium,
    minWidth: 48,
  },
  selectedMoodOption: {
    backgroundColor: `${THEME_COLORS.primary}20`, // 20 is hex for 12% opacity
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  moodText: {
    fontFamily: TYPOGRAPHY.fontFamily.regular,
    fontSize: TYPOGRAPHY.fontSize.small,
    color: THEME_COLORS.textSecondary,
  },
  selectedMoodText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    color: THEME_COLORS.primary,
  },
});

export default MoodTracker;