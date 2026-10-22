import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows } from '../styles/theme';

const STATUS_COLORS = {
  'To Read': { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
  'Reading': { bg: '#E0F2FE', text: '#0284C7', border: '#BAE6FD' },
  'Finished': { bg: '#DCFCE7', text: '#16A34A', border: '#BBF7D0' },
};

const GENRE_BADGE = {
  'Fiction': { bg: '#F3E8FF', text: '#9333EA' },
  'Non-Fiction': { bg: '#FCE7F3', text: '#DB2777' },
  'Academic': { bg: '#E0E7FF', text: '#4F46E5' },
  'Other': { bg: '#F1F5F9', text: '#475569' },
};

const BookItem = ({ book, onPress, onToggleFavorite }) => {
  const statusStyle = STATUS_COLORS[book.status] || STATUS_COLORS['To Read'];
  const genreStyle = GENRE_BADGE[book.genre] || GENRE_BADGE['Other'];

  return (
    <TouchableOpacity
      testID="book-item"
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            by {book.author}
          </Text>
        </View>

        {/* Favorite toggle star */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(book.id, book.favorite)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={book.favorite ? 'star' : 'star-outline'}
            size={24}
            color={book.favorite ? colors.starFilled : colors.starEmpty}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.badgeRow}>
          {/* Genre Badge */}
          <View style={[styles.badge, { backgroundColor: genreStyle.bg }]}>
            <Text style={[styles.badgeText, { color: genreStyle.text }]}>
              {book.genre}
            </Text>
          </View>

          {/* Status Badge */}
          <View
            style={[
              styles.badge,
              styles.statusBadge,
              { backgroundColor: statusStyle.bg, borderColor: statusStyle.border },
            ]}
          >
            <Text style={[styles.badgeText, { color: statusStyle.text }]}>
              {book.status}
            </Text>
          </View>

          {/* Optional Rating Badge */}
          {book.rating !== null && book.rating !== undefined ? (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color={colors.accent} />
              <Text style={styles.ratingText}>{book.rating}/5</Text>
            </View>
          ) : null}
        </View>

        <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  author: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadge: {
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#854D0E',
  },
});

export default BookItem;
