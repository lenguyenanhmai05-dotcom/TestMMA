import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, shadows } from '../styles/theme';

const GENRE_OPTIONS = ['Choose genre', 'Fiction', 'Non-Fiction', 'Academic', 'Other'];
const STATUS_OPTIONS = ['Choose status', 'To Read', 'Reading', 'Finished'];

const BookForm = ({
  initialValues = null,
  onSubmit,
  onCancel = null,
  isEdit = false,
  submitLabel = 'Add Book',
  testID = 'book-form',
  successMessage = '',
  errorMessage = '',
}) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [author, setAuthor] = useState(initialValues?.author || '');
  const [genre, setGenre] = useState(initialValues?.genre || '');
  const [status, setStatus] = useState(initialValues?.status || '');
  const [rating, setRating] = useState(
    initialValues?.rating !== undefined && initialValues?.rating !== null
      ? String(initialValues.rating)
      : ''
  );
  const [notes, setNotes] = useState(initialValues?.notes || '');

  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Picker modal states
  const [genreModalVisible, setGenreModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  // Validate single field
  const validateField = (fieldName, val) => {
    switch (fieldName) {
      case 'title': {
        const trimmed = (val || '').trim();
        if (!trimmed) return 'Title is required';
        if (val.length > 100) return 'Title must be at most 100 characters';
        return null;
      }
      case 'author': {
        const trimmed = (val || '').trim();
        if (!trimmed) return 'Author is required';
        if (val.length > 60) return 'Author must be at most 60 characters';
        return null;
      }
      case 'genre': {
        if (!val || val === 'Choose genre') return 'Please choose a genre';
        return null;
      }
      case 'status': {
        if (!val || val === 'Choose status') return 'Please choose a status';
        return null;
      }
      case 'rating': {
        const trimmed = (val || '').trim();
        if (trimmed !== '') {
          const num = Number(trimmed);
          if (!/^[0-5]$/.test(trimmed) || isNaN(num) || num < 0 || num > 5) {
            return 'Rating must be a whole number from 0 to 5';
          }
        }
        return null;
      }
      case 'notes': {
        if (val && val.length > 300) return 'Notes must be at most 300 characters';
        return null;
      }
      default:
        return null;
    }
  };

  // Re-validate fields when user types (only if form has been submitted once)
  const handleChange = (fieldName, value, setter) => {
    setter(value);
    if (hasSubmitted) {
      const fieldError = validateField(fieldName, value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (fieldError) {
          newErrors[fieldName] = fieldError;
        } else {
          delete newErrors[fieldName];
        }
        return newErrors;
      });
    }
  };

  const handleSelectGenre = (selected) => {
    const actualVal = selected === 'Choose genre' ? '' : selected;
    setGenre(actualVal);
    setGenreModalVisible(false);
    if (hasSubmitted) {
      const err = validateField('genre', actualVal);
      setErrors((prev) => {
        const updated = { ...prev };
        if (err) updated.genre = err;
        else delete updated.genre;
        return updated;
      });
    }
  };

  const handleSelectStatus = (selected) => {
    const actualVal = selected === 'Choose status' ? '' : selected;
    setStatus(actualVal);
    setStatusModalVisible(false);
    if (hasSubmitted) {
      const err = validateField('status', actualVal);
      setErrors((prev) => {
        const updated = { ...prev };
        if (err) updated.status = err;
        else delete updated.status;
        return updated;
      });
    }
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);

    const titleErr = validateField('title', title);
    const authorErr = validateField('author', author);
    const genreErr = validateField('genre', genre);
    const statusErr = validateField('status', status);
    const ratingErr = validateField('rating', rating);
    const notesErr = validateField('notes', notes);

    const newErrors = {};
    if (titleErr) newErrors.title = titleErr;
    if (authorErr) newErrors.author = authorErr;
    if (genreErr) newErrors.genre = genreErr;
    if (statusErr) newErrors.status = statusErr;
    if (ratingErr) newErrors.rating = ratingErr;
    if (notesErr) newErrors.notes = notesErr;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        title: title.trim(),
        author: author.trim(),
        genre,
        status,
        rating: rating.trim() !== '' ? Number(rating.trim()) : null,
        notes: notes.trim(),
      });

      if (!isEdit) {
        // Clear form on add success
        setTitle('');
        setAuthor('');
        setGenre('');
        setStatus('');
        setRating('');
        setNotes('');
        setHasSubmitted(false);
        setErrors({});
      }
    } catch (_err) {
      // Handled by parent or error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <View testID={testID} style={styles.card}>
      <Text style={styles.cardHeader}>
        {isEdit ? 'Edit Book Details' : 'Add a New Book'}
      </Text>

      {/* Success banner */}
      {successMessage ? (
        <View testID="book-success" style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}

      {/* Error banner */}
      {errorMessage ? (
        <View testID="error-book" style={styles.errorBanner}>
          <Ionicons name="alert-circle" size={18} color={colors.error} />
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      {/* Title input */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          placeholder="Enter book title"
          placeholderTextColor={colors.textLight}
          value={title}
          onChangeText={(val) => handleChange('title', val, setTitle)}
          autoCapitalize="sentences"
        />
        {errors.title && <Text style={styles.fieldError}>{errors.title}</Text>}
      </View>

      {/* Author input */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Author *</Text>
        <TextInput
          style={[styles.input, errors.author && styles.inputError]}
          placeholder="Enter author name"
          placeholderTextColor={colors.textLight}
          value={author}
          onChangeText={(val) => handleChange('author', val, setAuthor)}
          autoCapitalize="words"
        />
        {errors.author && <Text style={styles.fieldError}>{errors.author}</Text>}
      </View>

      {/* Genre Picker */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Genre *</Text>
        <TouchableOpacity
          style={[styles.pickerTrigger, errors.genre && styles.inputError]}
          onPress={() => setGenreModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={genre ? styles.pickerTriggerText : styles.pickerPlaceholderText}>
            {genre || 'Choose genre'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        {errors.genre && <Text style={styles.fieldError}>{errors.genre}</Text>}
      </View>

      {/* Status Picker */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Status *</Text>
        <TouchableOpacity
          style={[styles.pickerTrigger, errors.status && styles.inputError]}
          onPress={() => setStatusModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={status ? styles.pickerTriggerText : styles.pickerPlaceholderText}>
            {status || 'Choose status'}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        {errors.status && <Text style={styles.fieldError}>{errors.status}</Text>}
      </View>

      {/* Rating input */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Rating (0 - 5, optional)</Text>
        <TextInput
          style={[styles.input, errors.rating && styles.inputError]}
          placeholder="e.g. 5"
          placeholderTextColor={colors.textLight}
          value={rating}
          onChangeText={(val) => handleChange('rating', val, setRating)}
          keyboardType="numeric"
          maxLength={1}
        />
        {errors.rating && <Text style={styles.fieldError}>{errors.rating}</Text>}
      </View>

      {/* Notes input */}
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.notes && styles.inputError]}
          placeholder="Add short notes (max 300 characters)"
          placeholderTextColor={colors.textLight}
          value={notes}
          onChangeText={(val) => handleChange('notes', val, setNotes)}
          multiline
          numberOfLines={3}
        />
        {errors.notes && <Text style={styles.fieldError}>{errors.notes}</Text>}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        {isEdit && onCancel ? (
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[styles.button, styles.submitButton, isEdit && styles.flexButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>{submitLabel}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Genre Selection Modal */}
      <Modal visible={genreModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setGenreModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Genre</Text>
              {GENRE_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.modalOption,
                    (genre === item || (!genre && item === 'Choose genre')) && styles.modalOptionActive,
                  ]}
                  onPress={() => handleSelectGenre(item)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      item === 'Choose genre' && styles.modalPlaceholderText,
                      genre === item && styles.modalOptionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {genre === item ? (
                    <Ionicons name="checkmark" size={18} color={colors.primary} />
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Status Selection Modal */}
      <Modal visible={statusModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setStatusModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Status</Text>
              {STATUS_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.modalOption,
                    (status === item || (!status && item === 'Choose status')) && styles.modalOptionActive,
                  ]}
                  onPress={() => handleSelectStatus(item)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      item === 'Choose status' && styles.modalPlaceholderText,
                      status === item && styles.modalOptionTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {status === item ? (
                    <Ionicons name="checkmark" size={18} color={colors.primary} />
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: spacing.md,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successLight,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    gap: 8,
  },
  successText: {
    color: colors.success,
    fontWeight: '600',
    fontSize: 14,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorLight,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.md,
    gap: 8,
  },
  errorText: {
    color: colors.error,
    fontWeight: '500',
    fontSize: 13,
    flex: 1,
  },
  fieldGroup: {
    marginBottom: spacing.sm + 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  textArea: {
    minHeight: 65,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: '#FFF5F5',
  },
  fieldError: {
    ...typography.error,
    marginTop: 4,
  },
  pickerTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  pickerTriggerText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  pickerPlaceholderText: {
    fontSize: 14,
    color: colors.textLight,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: spacing.sm,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexButton: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: colors.primary,
    flex: 1,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  cancelButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    flex: 1,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: spacing.md,
    ...shadows.lg,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalOptionActive: {
    backgroundColor: colors.primaryLight,
  },
  modalOptionText: {
    fontSize: 15,
    color: colors.text,
  },
  modalPlaceholderText: {
    color: colors.textLight,
    fontStyle: 'italic',
  },
  modalOptionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default BookForm;
