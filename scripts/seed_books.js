const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDD5SMBvC33W0Ya_OkNqm-zH-xgT1tXOoo",
  authDomain: "testmma-48172.firebaseapp.com",
  projectId: "testmma-48172",
  storageBucket: "testmma-48172.firebasestorage.app",
  messagingSenderId: "74396549461",
  appId: "1:74396549461:web:1e2278e7b7a322830fafdc",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const SAMPLE_BOOKS = [
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Fiction",
    status: "Reading",
    rating: 5,
    favorite: true,
    notes: "Epic science fiction masterpiece set on the desert planet Arrakis.",
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    genre: "Non-Fiction",
    status: "Finished",
    rating: 5,
    favorite: true,
    notes: "A provocative exploration of human evolution and civilization.",
  },
  {
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    genre: "Academic",
    status: "To Read",
    rating: 4,
    favorite: false,
    notes: "Essential best practices for writing maintainable and elegant code.",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Non-Fiction",
    status: "Finished",
    rating: 5,
    favorite: true,
    notes: "Practical framework for building good habits and breaking bad ones.",
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fiction",
    status: "To Read",
    rating: 4,
    favorite: false,
    notes: "The prelude to The Lord of the Rings following Bilbo Baggins.",
  },
  {
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma",
    genre: "Academic",
    status: "Reading",
    rating: 4,
    favorite: false,
    notes: "Classic catalog of software design patterns and architectural solutions.",
  },
];

async function seed() {
  try {
    console.log("Signing in with user account...");
    const cred = await signInWithEmailAndPassword(auth, "lenguyenanhmai05@gmail.com", "Mai12345");
    const userId = cred.user.uid;
    console.log("Signed in successfully. User UID:", userId);

    for (const book of SAMPLE_BOOKS) {
      const lowerTitle = book.title.trim().toLowerCase().replace(/[\/\s.]/g, '_');
      const lowerAuthor = book.author.trim().toLowerCase().replace(/[\/\s.]/g, '_');
      const docId = `${userId}_${lowerTitle}_${lowerAuthor}`;

      const bookData = {
        id: docId,
        userId: userId,
        title: book.title,
        author: book.author,
        genre: book.genre,
        status: book.status,
        rating: book.rating,
        favorite: book.favorite,
        notes: book.notes,
        createdAt: new Date().toISOString(),
      };

      console.log(`Adding book: ${book.title}...`);
      await setDoc(doc(db, "books", docId), bookData);
      console.log(`Added: ${book.title}`);
    }

    console.log("\nAll 6 sample books added to Firestore successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding books:", error);
    process.exit(1);
  }
}

seed();
