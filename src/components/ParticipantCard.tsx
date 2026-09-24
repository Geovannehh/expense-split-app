import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Participant } from '@/api/types';
import { colors, radius, spacing, typography } from '@/theme';

export function ParticipantCard({ participant }: { participant: Participant }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{participant.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View>
        <Text style={styles.name}>{participant.name}</Text>
        <Text style={styles.email}>{participant.email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: { ...typography.bodyBold, color: colors.primaryLight },
  name: { ...typography.bodyBold, color: colors.text },
  email: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
