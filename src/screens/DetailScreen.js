import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBooks } from '../context/BooksContext';
import BookForm from '../components/BookForm';
import { colors, spacing, shadows } from '../styles/theme';

const DetailScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const { books, updateBook, deleteBook, toggleFavorite, errorBook, setErrorBook } = useBooks();

  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Find book from books list
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.textLight} />
          <Text style={styles.notFoundText}>Book not found</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Handle Edit Save
  const handleSaveEdit = async (updatedData) => {
    try {
      await updateBook(book.id, updatedData);
      setIsEditing(false);
    } catch (err) {
      throw err;
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await deleteBook(book.id);
      setDeleteModalVisible(false);
      navigation.goBack();
    } catch (err) {
      console.error('Delete error:', err);
      Alert.alert('Error', err.message || 'Failed to delete book');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {isEditing ? 'Edit Book' : 'Book Details'}
        </Text>

        {/* Favorite toggle star in header */}
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => toggleFavorite(book.id, book.favorite)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={book.favorite ? 'star' : 'star-outline'}
            size={24}
            color={book.favorite ? colors.starFilled : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {isEditing ? (
          /* Edit Mode using the same validation form */
          <BookForm
            initialValues={book}
            onSubmit={handleSaveEdit}
            onCancel={() => {
              setErrorBook('');
              setIsEditing(false);
            }}
            isEdit
            submitLabel="Save"
            errorMessage={errorBook}
          />
        ) : (
          /* View Mode */
          <View style={styles.viewContainer}>
            <View style={styles.mainCard}>
              <View style={styles.bookHeaderRow}>
                <View style={styles.bookHeaderLeft}>
                  <Text style={styles.bookTitle}>{book.title}</Text>
                  <Text style={styles.bookAuthor}>by {book.author}</Text>
                </View>
                <TouchableOpacity
                  style={styles.favoriteBadge}
                  onPress={() => toggleFavorite(book.id, book.favorite)}
                >
                  <Ionicons
                    name={book.favorite ? 'star' : 'star-outline'}
                    size={28}
                    color={book.favorite ? colors.starFilled : colors.starEmpty}
                  />
                </TouchableOpacity>
              </View>

              {/* Tags Row */}
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailItemLabel}>Genre</Text>
                  <View style={styles.tag}>
                    <Text style={styles.tagText}>{book.genre}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailItemLabel}>Status</Text>
                  <View style={[styles.tag, styles.statusTag]}>
                    <Text style={styles.statusTagText}>{book.status}</Text>
                  </View>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailItemLabel}>Rating</Text>
                  <View style={styles.ratingBox}>
                    <Ionicons name="star" size={14} color={colors.accent} />
                    <Text style={styles.ratingBoxText}>
                      {book.rating !== null && book.rating !== undefined ? `${book.rating} / 5` : 'None'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Notes Section */}
              <View style={styles.notesSection}>
                <Text style={styles.notesLabel}>Notes</Text>
                <View style={styles.notesBox}>
                  <Text style={styles.notesText}>
                    {book.notes ? book.notes : 'No notes added for this book.'}
                  </Text>
                </View>
              </View>

              {/* Created At */}
              {book.createdAt ? (
                <Text style={styles.createdDate}>
                  Added: {new Date(book.createdAt).toLocaleDateString()}
                </Text>
              ) : null}
            </View>

            {/* Action Buttons: Edit and Delete */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setErrorBook('');
                  setIsEditing(true);
                }}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => setDeleteModalVisible(true)}
                activeOpacity={0.8}
              >
                <Ionicons name="trash-outline" size={18} color={colors.error} />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning-outline" size={32} color={colors.error} />
            </View>
            <Text style={styles.modalTitle}>Delete Book?</Text>
            <Text style={styles.modalMessage}>
              {`Are you sure you want to delete "${book.title}"? This action cannot be undone.`}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setDeleteModalVisible(false)}
                disabled={deleting}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalDeleteBtn}
                onPress={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalDeleteText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  viewContainer: {
    gap: spacing.md,
  },
  mainCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  bookHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  bookHeaderLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  bookTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 28,
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  favoriteBadge: {
    padding: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
    gap: 8,
  },
  detailItem: {
    flex: 1,
  },
  detailItemLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  statusTag: {
    backgroundColor: '#FEF3C7',
  },
  statusTagText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  ratingBoxText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#854D0E',
  },
  notesSection: {
    marginTop: spacing.md,
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  notesBox: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  notesText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  createdDate: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: spacing.md,
    textAlign: 'right',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    ...shadows.sm,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.errorLight,
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: 15,
    fontWeight: '700',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textSecondary,
    marginVertical: spacing.md,
  },
  backBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    ...shadows.lg,
  },
  modalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  modalDeleteBtn: {
    flex: 1,
    backgroundColor: colors.error,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalDeleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default DetailScreen;
