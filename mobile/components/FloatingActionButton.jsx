import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FloatingActionButton = ({ onPress, iconName = 'add', style }) => (
  <TouchableOpacity
    style={[styles.fab, style]}
    onPress={onPress}
    activeOpacity={0.7}
    accessibilityRole="button"
  >
    <Ionicons name={iconName} size={32} color="#fff" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#333',
    borderRadius: 32,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default FloatingActionButton;
