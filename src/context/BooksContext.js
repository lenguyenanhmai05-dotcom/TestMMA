import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  setDoc, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { useAuth } from './AuthContext';

const BooksContext = createContext({
  books: [],
  loading: false,
  errorBook: '',
  setErrorBook: () => {},
  addBook: async () => {},
  updateBook: async () => {},
  deleteBook: async () => {},
  toggleFavorite: async () => {},
});

// Helper to sort books alphabetically by title (case-insensitive), tie-breaker by author
export const sortBooks = (bookList) => {
  return [...bookList].sort((a, b) => {
    const titleA = (a.title || '').trim().toLowerCase();
    const titleB = (b.title || '').trim().toLowerCase();
    const titleCmp = titleA.localeCompare(titleB);
    if (titleCmp !== 0) return titleCmp;

    const authorA = (a.author || '').trim().toLowerCase();
    const authorB = (b.author || '').trim().toLowerCase();
    return authorA.localeCompare(authorB);
  });
};

export const BooksProvider = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorBook, setErrorBook] = useState('');

  // Realtime subscription to the user's books
  useEffect(() => {
    if (!user || !isFirebaseConfigured) {
      return;
    }

    const q = query(
      collection(db, 'books'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedBooks = [];
        snapshot.forEach((docSnapshot) => {
          fetchedBooks.push({
            id: docSnapshot.id,
            ...docSnapshot.data(),
          });
        });
        setBooks(sortBooks(fetchedBooks));
        setLoading(false);
      },
      (error) => {
        console.error('Firestore onSnapshot error:', error);
        setErrorBook(error.message);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      setBooks([]);
    };
  }, [user]);

  // Add a new book
  const addBook = async (bookData) => {
    setErrorBook('');
    if (!user) throw new Error('User not authenticated');

    const cleanTitle = (bookData.title || '').trim();
    const cleanAuthor = (bookData.author || '').trim();
    const lowerTitle = cleanTitle.toLowerCase();
    const lowerAuthor = cleanAuthor.toLowerCase();

    // Check duplicate in current user's books (case-insensitive)
    const isDuplicate = books.some(
      (b) =>
        (b.title || '').trim().toLowerCase() === lowerTitle &&
        (b.author || '').trim().toLowerCase() === lowerAuthor
    );

    if (isDuplicate) {
      const err = new Error('A book with this title and author already exists.');
      setErrorBook(err.message);
      throw err;
    }

    // Deterministic document ID to reinforce uniqueness at Firestore level
    const sanitizedTitle = lowerTitle.replace(/[\/\s.]/g, '_');
    const sanitizedAuthor = lowerAuthor.replace(/[\/\s.]/g, '_');
    const docId = `${user.uid}_${sanitizedTitle}_${sanitizedAuthor}`;
    const bookRef = doc(db, 'books', docId);

    try {
      const newBook = {
        id: docId,
        userId: user.uid,
        title: cleanTitle,
        author: cleanAuthor,
        genre: bookData.genre,
        status: bookData.status,
        rating: bookData.rating !== undefined && bookData.rating !== null && bookData.rating !== '' 
          ? Number(bookData.rating) 
          : null,
        favorite: Boolean(bookData.favorite),
        notes: bookData.notes ? String(bookData.notes).trim() : '',
        createdAt: new Date().toISOString(),
      };

      await setDoc(bookRef, newBook);
      return newBook;
    } catch (err) {
      console.error('Firestore addBook error:', err);
      const msg = err.message || 'Failed to add book to Firestore.';
      setErrorBook(msg);
      throw err;
    }
  };

  // Update an existing book
  const updateBook = async (bookId, updatedData) => {
    setErrorBook('');
    if (!user) throw new Error('User not authenticated');

    const cleanTitle = (updatedData.title || '').trim();
    const cleanAuthor = (updatedData.author || '').trim();
    const lowerTitle = cleanTitle.toLowerCase();
    const lowerAuthor = cleanAuthor.toLowerCase();

    // Check duplicate if title or author is changed
    const isDuplicate = books.some(
      (b) =>
        b.id !== bookId &&
        (b.title || '').trim().toLowerCase() === lowerTitle &&
        (b.author || '').trim().toLowerCase() === lowerAuthor
    );

    if (isDuplicate) {
      const err = new Error('Another book with this title and author already exists.');
      setErrorBook(err.message);
      throw err;
    }

    try {
      const bookRef = doc(db, 'books', bookId);
      const payload = {
        title: cleanTitle,
        author: cleanAuthor,
        genre: updatedData.genre,
        status: updatedData.status,
        rating: updatedData.rating !== undefined && updatedData.rating !== null && updatedData.rating !== '' 
          ? Number(updatedData.rating) 
          : null,
        favorite: Boolean(updatedData.favorite),
        notes: updatedData.notes ? String(updatedData.notes).trim() : '',
      };

      await updateDoc(bookRef, payload);
    } catch (err) {
      console.error('Firestore updateBook error:', err);
      const msg = err.message || 'Failed to update book.';
      setErrorBook(msg);
      throw err;
    }
  };

  // Delete a book
  const deleteBook = async (bookId) => {
    setErrorBook('');
    if (!user) throw new Error('User not authenticated');

    try {
      const bookRef = doc(db, 'books', bookId);
      await deleteDoc(bookRef);
    } catch (err) {
      console.error('Firestore deleteBook error:', err);
      const msg = err.message || 'Failed to delete book.';
      setErrorBook(msg);
      throw err;
    }
  };

  // Toggle favorite
  const toggleFavorite = async (bookId, currentFavorite) => {
    setErrorBook('');
    if (!user) throw new Error('User not authenticated');

    try {
      const bookRef = doc(db, 'books', bookId);
      await updateDoc(bookRef, {
        favorite: !currentFavorite,
      });
    } catch (err) {
      console.error('Firestore toggleFavorite error:', err);
      setErrorBook(err.message || 'Failed to toggle favorite.');
      throw err;
    }
  };

  return (
    <BooksContext.Provider
      value={{
        books,
        loading,
        errorBook,
        setErrorBook,
        addBook,
        updateBook,
        deleteBook,
        toggleFavorite,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

export const useBooks = () => useContext(BooksContext);
