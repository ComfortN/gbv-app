import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { THEME_COLORS } from '../constants/theme';

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>GBV</Text>
        <ActivityIndicator size="large" color={THEME_COLORS.white} style={styles.spinner} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME_COLORS.white,
    marginBottom: 24,
  },
  spinner: {
    marginTop: 20,
  },
});

export default LoadingScreen;