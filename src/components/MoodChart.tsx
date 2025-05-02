import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { format, subDays } from 'date-fns';
import { MOOD_OPTIONS } from './MoodTracker';
import { THEME_COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../constants/theme';

// TypeScript interface for the mood entry data
interface MoodEntry {
  id: string;
  mood: string;
  date: Date;
  notes: string;
}

interface MoodChartProps {
  moodEntries: MoodEntry[];
  days?: number; // Number of days to display
}

// Map mood types to numerical values for visualization
const MOOD_VALUES: Record<string, number> = {
  'happy': 5,
  'calm': 4,
  'neutral': 3,
  'sad': 2,
  'anxious': 1,
  'angry': 1,
};

const MoodChart: React.FC<MoodChartProps> = ({ 
  moodEntries,
  days = 7 
}) => {
  const screenWidth = Dimensions.get('window').width - 40; // Adjust for padding
  const chartHeight = 160;
  
  // Generate dates for the last n days
  const generateDates = (numDays: number) => {
    const dates = [];
    for (let i = numDays - 1; i >= 0; i--) {
      dates.push(subDays(new Date(), i));
    }
    return dates;
  };
  
  const dates = generateDates(days);
  
  // Group entries by date (using date string as key)
  const entriesByDate: Record<string, MoodEntry[]> = {};
  
  dates.forEach(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    entriesByDate[dateStr] = [];
  });
  
  moodEntries.forEach(entry => {
    const dateStr = format(new Date(entry.date), 'yyyy-MM-dd');
    if (entriesByDate[dateStr]) {
      entriesByDate[dateStr].push(entry);
    }
  });
  
  // Calculate average mood value for each day
  const moodData = dates.map(date => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const entries = entriesByDate[dateStr];
    
    if (entries.length === 0) {
      return {
        date,
        value: null,
        hasData: false
      };
    }
    
    // Calculate average mood value for the day
    const totalValue = entries.reduce((sum, entry) => {
      return sum + (MOOD_VALUES[entry.mood] || 3); // Default to neutral (3) if mood not found
    }, 0);
    
    return {
      date,
      value: totalValue / entries.length,
      hasData: true
    };
  });
  
  const columnWidth = screenWidth / days;
  
  // Get label for x-axis (day of week or date)
  const getDateLabel = (date: Date) => {
    return format(date, 'EEE'); // Mon, Tue, etc.
  };
  
  // Get the appropriate emoji for the mood value
  const getMoodEmojiForValue = (value: number | null) => {
    if (value === null) return '';
    
    if (value >= 4.5) return '😊'; // Happy
    if (value >= 3.5) return '😌'; // Calm
    if (value >= 2.5) return '😐'; // Neutral
    if (value >= 1.5) return '😔'; // Sad
    return '😰'; // Anxious/Angry
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Mood Trend</Text>
      
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={styles.yAxisLabel}>😊</Text>
          <Text style={styles.yAxisLabel}>😌</Text>
          <Text style={styles.yAxisLabel}>😐</Text>
          <Text style={styles.yAxisLabel}>😔</Text>
          <Text style={styles.yAxisLabel}>😰</Text>
        </View>
        
        {/* Chart area */}
        <View style={styles.chart}>
          {/* Horizontal grid lines */}
          {[...Array(5)].map((_, i) => (
            <View 
              key={`line-${i}`} 
              style={[
                styles.gridLine, 
                { top: (i * chartHeight) / 4 }
              ]}
            />
          ))}
          
          {/* Data points and lines */}
          <View style={styles.dataContainer}>
            {moodData.map((data, index) => {
              // Calculate position based on mood value
              const pointY = data.value !== null 
                ? chartHeight - ((data.value - 1) * (chartHeight / 4)) 
                : null;
              
              // Only draw lines between consecutive data points
              const prevData = index > 0 ? moodData[index - 1] : null;
              const nextData = index < moodData.length - 1 ? moodData[index + 1] : null;
              
              return (
                <View 
                  key={`col-${index}`} 
                  style={[styles.dataColumn, { width: columnWidth }]}
                >
                  {/* Data point */}
                  {data.hasData && pointY !== null && (
                    <View 
                      style={[
                        styles.dataPoint, 
                        { top: pointY - 8 } // Adjust for point size
                      ]}
                    >
                      <Text style={styles.moodEmoji}>
                        {getMoodEmojiForValue(data.value)}
                      </Text>
                    </View>
                  )}
                  
                  {/* Connect line to previous point */}
                  {data.hasData && prevData && prevData.hasData && pointY !== null && (
                    <View 
                      style={[
                        styles.connectorLine,
                        {
                          left: -columnWidth / 2,
                          top: pointY,
                          width: columnWidth,
                          transform: [{ 
                            rotate: `${Math.atan2(
                              (prevData.value !== null ? chartHeight - ((prevData.value - 1) * (chartHeight / 4)) : chartHeight / 2) - pointY, 
                              -columnWidth
                            )}rad` 
                          }]
                        }
                      ]}
                    />
                  )}
                  
                  {/* Day label */}
                  <Text style={styles.dateLabel}>
                    {getDateLabel(data.date)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: THEME_COLORS.primary }]} />
          <Text style={styles.legendText}>Mood trend</Text>
        </View>
      </View>

      {/* No data message if needed */}
      {moodEntries.length === 0 && (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No mood data available yet</Text>
          <Text style={styles.noDataSubtext}>Track your mood to see your trends here</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME_COLORS.background,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    marginVertical: SPACING.md,
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: THEME_COLORS.secondary,
  },
  title: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.heading3,
    color: THEME_COLORS.text,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 200,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  yAxis: {
    width: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
  },
  yAxisLabel: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: THEME_COLORS.textSecondary,
    height: 32,
    textAlign: 'center',
  },
  chart: {
    flex: 1,
    position: 'relative',
    height: 160,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: THEME_COLORS.secondary,
  },
  dataContainer: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  dataColumn: {
    height: '100%',
    position: 'relative',
    alignItems: 'center',
  },
  dataPoint: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: THEME_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  moodEmoji: {
    fontSize: TYPOGRAPHY.fontSize.small,
    textAlign: 'center',
  },
  connectorLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: THEME_COLORS.primary,
    borderRadius: BORDER_RADIUS.small,
    zIndex: 5,
    opacity: 0.7,
  },
  dateLabel: {
    position: 'absolute',
    bottom: -24,
    fontSize: TYPOGRAPHY.fontSize.small,
    color: THEME_COLORS.textSecondary,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontSize: TYPOGRAPHY.fontSize.small,
    color: THEME_COLORS.textSecondary,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  noDataText: {
    fontFamily: TYPOGRAPHY.fontFamily.medium,
    fontSize: TYPOGRAPHY.fontSize.body,
    color: THEME_COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  noDataSubtext: {
    fontSize: TYPOGRAPHY.fontSize.caption,
    color: THEME_COLORS.inactive,
  },
});

export default MoodChart;