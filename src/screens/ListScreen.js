import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useBooks, sortBooks } from '../context/BooksContext';
import BookForm from '../components/BookForm';
import BookItem from '../components/BookItem';
import BookFilter from '../components/BookFilter';
import BookSummary from '../components/BookSummary';
import { colors, spacing, shadows } from '../styles/theme';

const ListScreen = ({ navigation }) => {
  const { user, loading: authLoading, logout } = useAuth();
  const { books, loading: booksLoading, addBook, toggleFavorite, errorBook, setErrorBook } = useBooks();

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Form feedback states
  const [formSuccess, setFormSuccess] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  // Guard against unauthenticated access
  useEffect(() => {
    if (!authLoading && !user) {
      navigation.replace('Home');
    }
  }, [user, authLoading, navigation]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
      navigation.replace('Home');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // Filtered books logic
  const filteredBooks = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    const filtered = books.filter((book) => {
      // 1. Search Query (Title or Author contains text, case-insensitive)
      if (trimmedQuery) {
        const titleMatch = (book.title || '').toLowerCase().includes(trimmedQuery);
        const authorMatch = (book.author || '').toLowerCase().includes(trimmedQuery);
        if (!titleMatch && !authorMatch) {
          return false;
        }
      }

      // 2. Genre Filter
      if (selectedGenre !== 'All' && book.genre !== selectedGenre) {
        return false;
      }

      // 3. Status Filter
      if (selectedStatus !== 'All' && book.status !== selectedStatus) {
        return false;
      }

      // 4. Favorites Only Switch
      if (favoritesOnly && !book.favorite) {
        return false;
      }

      return true;
    });

    return sortBooks(filtered);
  }, [books, searchQuery, selectedGenre, selectedStatus, favoritesOnly]);

  // Handle Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedStatus('All');
    setFavoritesOnly(false);
  };

  // Handle Add Book Submit
  const handleAddBook = async (bookData) => {
    setFormSuccess('');
    setErrorBook('');
    try {
      await addBook(bookData);
      setFormSuccess('Book added');
      // Auto-hide success message after 4 seconds
      setTimeout(() => {
        setFormSuccess('');
      }, 4000);
    } catch (err) {
      // Error is caught and stored in errorBook via BooksContext
      throw err;
    }
  };

  // While checking auth, display clean loading without flashing list
  if (authLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView testID="list-screen" style={styles.safeArea}>
      {/* Header with user's e-mail and Logout button */}
      <View style={styles.header}>
        <View style={styles.userContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={16} color={colors.primary} />
          </View>
          <View style={styles.userTextWrapper}>
            <Text style={styles.welcomeText}>Signed in as</Text>
            <Text style={styles.emailText} numberOfLines={1}>
              {user.email}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookItem
            book={item}
            onPress={() => navigation.navigate('Detail', { bookId: item.id })}
            onToggleFavorite={toggleFavorite}
          />
        )}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {/* Toggle Add Book Form Accordion */}
            <TouchableOpacity
              style={styles.formToggleHeader}
              onPress={() => setIsFormExpanded(!isFormExpanded)}
              activeOpacity={0.8}
            >
              <View style={styles.formToggleTitleRow}>
                <Ionicons
                  name={isFormExpanded ? 'remove-circle-outline' : 'add-circle-outline'}
                  size={22}
                  color={colors.primary}
                />
                <Text style={styles.formToggleText}>
                  {isFormExpanded ? 'Hide Add Book Form' : 'Add a New Book'}
                </Text>
              </View>
              <Ionicons
                name={isFormExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {/* Add Book Form */}
            {isFormExpanded && (
              <BookForm
                onSubmit={handleAddBook}
                submitLabel="Add Book"
                testID="book-form"
                successMessage={formSuccess}
                errorMessage={errorBook}
              />
            )}

            {/* Filter & Search Bar */}
            <BookFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              favoritesOnly={favoritesOnly}
              onFavoritesOnlyChange={setFavoritesOnly}
              onClear={handleClearFilters}
            />

            {/* Book Summary Component */}
            <BookSummary books={filteredBooks} />

            {/* List Title Row */}
            <View style={styles.booksListHeaderRow}>
              <Text style={styles.booksSectionTitle}>Your Books</Text>
              {booksLoading && <ActivityIndicator size="small" color={colors.primary} />}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View testID="books-empty" style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="book-outline" size={48} color={colors.textLight} />
            </View>
            <Text style={styles.emptyTitle}>No books found</Text>
            <Text style={styles.emptySubtitle}>
              {books.length === 0
                ? 'Your bookshelf is empty. Add your first book above!'
                : 'No books match the active search or filters.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.sm,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  userTextWrapper: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emailText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.errorLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.error,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  listHeader: {
    marginBottom: spacing.xs,
  },
  formToggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm + 4,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  formToggleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  formToggleText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  booksListHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  booksSectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
    ...shadows.sm,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default ListScreen;
