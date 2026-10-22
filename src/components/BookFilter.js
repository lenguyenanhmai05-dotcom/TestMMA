import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, shadows } from '../styles/theme';

const GENRE_FILTERS = ['All', 'Fiction', 'Non-Fiction', 'Academic', 'Other'];
const STATUS_FILTERS = ['All', 'To Read', 'Reading', 'Finished'];

const BookFilter = ({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  selectedStatus,
  onStatusChange,
  favoritesOnly,
  onFavoritesOnlyChange,
  onClear,
}) => {
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedGenre !== 'All' ||
    selectedStatus !== 'All' ||
    favoritesOnly;

  return (
    <View style={styles.container}>
      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title or author..."
          placeholderTextColor={colors.textLight}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => onSearchChange('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Genre Filter Pills */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionLabel}>Genre:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillScroll}>
          {GENRE_FILTERS.map((genre) => (
            <TouchableOpacity
              key={genre}
              style={[
                styles.pill,
                selectedGenre === genre && styles.pillActive,
              ]}
              onPress={() => onGenreChange(genre)}
            >
              <Text
                style={[
                  styles.pillText,
                  selectedGenre === genre && styles.pillTextActive,
                ]}
              >
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Status Filter Pills */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionLabel}>Status:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillScroll}>
          {STATUS_FILTERS.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.pill,
                selectedStatus === status && styles.pillActive,
              ]}
              onPress={() => onStatusChange(status)}
            >
              <Text
                style={[
                  styles.pillText,
                  selectedStatus === status && styles.pillTextActive,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Favorites Only Switch & Clear Button */}
      <View style={styles.bottomRow}>
        <View style={styles.switchContainer}>
          <Ionicons
            name={favoritesOnly ? 'star' : 'star-outline'}
            size={18}
            color={favoritesOnly ? colors.starFilled : colors.textSecondary}
          />
          <Text style={styles.switchLabel}>Favorites only</Text>
          <Switch
            value={favoritesOnly}
            onValueChange={onFavoritesOnlyChange}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={favoritesOnly ? colors.primary : '#FFFFFF'}
          />
        </View>

        {hasActiveFilters && (
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <Ionicons name="refresh" size={14} color={colors.error} />
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: spacing.sm + 4,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    padding: 0,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    width: 55,
  },
  pillScroll: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.errorLight,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.error,
  },
});

export default BookFilter;
