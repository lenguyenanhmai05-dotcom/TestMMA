import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows } from '../styles/theme';

const STATUS_TIE_BREAKER = {
  'To Read': 1,
  'Reading': 2,
  'Finished': 3,
};

const BookSummary = ({ books = [] }) => {
  const totalCount = books.length;
  const favoriteCount = books.filter((b) => b.favorite).length;

  // Calculate status breakdown
  const statusCounts = {};
  books.forEach((book) => {
    if (book.status) {
      statusCounts[book.status] = (statusCounts[book.status] || 0) + 1;
    }
  });

  // Only statuses that appear (count > 0)
  const breakdown = Object.keys(statusCounts).map((status) => ({
    status,
    count: statusCounts[status],
  }));

  // Sort breakdown:
  // 1. Status with the most books first
  // 2. Equal counts: To Read, then Reading, then Finished
  breakdown.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return (STATUS_TIE_BREAKER[a.status] || 99) - (STATUS_TIE_BREAKER[b.status] || 99);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Summary of Displayed Books</Text>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Ionicons name="book" size={18} color={colors.primary} />
          </View>
          <View>
            <Text testID="book-count" style={styles.statValue}>
              {totalCount}
            </Text>
            <Text style={styles.statLabel}>Total Books</Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="star" size={18} color={colors.accent} />
          </View>
          <View>
            <Text testID="favorite-count" style={styles.statValue}>
              {favoriteCount}
            </Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
        </View>
      </View>

      {/* Status Breakdown Section */}
      {breakdown.length > 0 && (
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Status Breakdown:</Text>
          <View style={styles.breakdownList}>
            {breakdown.map((item) => (
              <View key={item.status} style={styles.breakdownRow}>
                <View style={styles.breakdownStatusCol}>
                  <View
                    style={[
                      styles.statusDot,
                      item.status === 'To Read' && { backgroundColor: '#D97706' },
                      item.status === 'Reading' && { backgroundColor: '#0284C7' },
                      item.status === 'Finished' && { backgroundColor: '#16A34A' },
                    ]}
                  />
                  <Text style={styles.breakdownStatusName}>{item.status}</Text>
                </View>
                <View style={styles.breakdownBadge}>
                  <Text style={styles.breakdownCountText}>{item.count} books</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  header: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: spacing.sm + 2,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  breakdownSection: {
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  breakdownList: {
    gap: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  breakdownStatusCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  breakdownStatusName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  breakdownBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  breakdownCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
});

export default BookSummary;
