import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

const ROLES = ['All Roles', 'Video Editor', 'Social Media Manager', 'Creator Manager'];

export default function RoleFilter({ selectedRole, onSelectRole }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category Wedge:</Text>
      <View style={styles.pillsContainer}>
        {ROLES.map((role) => {
          const isSelected = selectedRole === role;
          return (
            <TouchableOpacity
              key={role}
              style={[styles.pill, isSelected && styles.pillSelected]}
              onPress={() => onSelectRole(role)}
            >
              <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                {role}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  pillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
