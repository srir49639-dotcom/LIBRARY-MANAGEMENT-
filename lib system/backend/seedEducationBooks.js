const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'library.db');
const db = new Database(dbPath, { verbose: console.log });

const books = [
  {
    title: 'UPSC Civil Services: Indian Polity',
    author: 'M. Laxmikanth',
    genre: 'Academic Literature',
    description: 'The ultimate guide for IAS preparation focusing on Indian governance and constitution.',
    coverUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1212&auto=format&fit=crop',
    totalCopies: 10
  },
  {
    title: 'IPS Strategy & Criminal Law',
    author: 'Kiran Bedi',
    genre: 'Academic Literature',
    description: 'Comprehensive strategies for cracking the IPS examinations and understanding penal codes.',
    coverUrl: 'https://images.unsplash.com/photo-1589998059171-989d887dda1e?q=80&w=1212&auto=format&fit=crop',
    totalCopies: 5
  },
  {
    title: 'MBA Entrance: CAT Quantitative Aptitude',
    author: 'Arun Sharma',
    genre: 'Business, stocks/investing, finance guides',
    description: 'Master quantitative aptitude and logical reasoning for elite IIM admissions.',
    coverUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1212&auto=format&fit=crop',
    totalCopies: 8
  },
  {
    title: 'Data Science & Analytics for Professionals',
    author: 'Wes McKinney',
    genre: 'Computer Science & Technology',
    description: 'A complete handbook on transforming data into business insights.',
    coverUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1212&auto=format&fit=crop',
    totalCopies: 12
  },
  {
    title: 'Cracking the Coding Interview',
    author: 'Gayle Laakmann McDowell',
    genre: 'Computer Science & Technology',
    description: '189 Programming Questions and Solutions for Software Engineers.',
    coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop',
    totalCopies: 15
  },
  {
    title: 'UPSC Mains: General Studies Paper I',
    author: 'R. S. Sharma',
    genre: 'Academic Literature',
    description: 'Detailed analysis of Indian History, Geography and Society for UPSC Mains.',
    coverUrl: 'https://images.unsplash.com/photo-1461360228754-6e81c478b882?q=80&w=1200&auto=format&fit=crop',
    totalCopies: 10
  },
  {
    title: 'MBA Marketing Management',
    author: 'Philip Kotler',
    genre: 'Business, stocks/investing, finance guides',
    description: 'The definitive textbook for modern marketing strategies and management.',
    coverUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop',
    totalCopies: 8
  },
  {
    title: 'Machine Learning for Absolute Beginners',
    author: 'Oliver Theobald',
    genre: 'Computer Science & Technology',
    description: 'A plain English introduction to Machine Learning algorithms and AI.',
    coverUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop',
    totalCopies: 12
  },
  {
    title: 'SSC CGL Complete Guide',
    author: 'Rakesh Yadav',
    genre: 'Academic Literature',
    description: 'Master quantitative aptitude and general awareness for SSC examinations.',
    coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop',
    totalCopies: 20
  },
  {
    title: 'Bank PO & Clerk Prep Strategy',
    author: 'B. S. Sijwali',
    genre: 'Academic Literature',
    description: 'Comprehensive strategies for banking exams and reasoning tests.',
    coverUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop',
    totalCopies: 15
  },
  {
    title: 'B.Tech Engineering Physics',
    author: 'H. C. Verma',
    genre: 'Science Fiction Archives', 
    description: 'Core concepts of quantum mechanics and applied physics for engineers.',
    coverUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop',
    totalCopies: 6
  },
  {
    title: 'Cyber Security Essentials',
    author: 'William Stallings',
    genre: 'Computer Science & Technology',
    description: 'Protecting networks, cryptography, and digital forensics.',
    coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
    totalCopies: 5
  }
];

const insertBook = db.prepare('INSERT INTO books (title, author, genre, description, coverUrl, totalCopies, availableCopies) VALUES (?, ?, ?, ?, ?, ?, ?)');

const addEducationBooks = db.transaction((books) => {
  for (const book of books) {
    // Check if it already exists to prevent duplicates
    const existing = db.prepare('SELECT id FROM books WHERE title = ?').get(book.title);
    if (!existing) {
      insertBook.run(book.title, book.author, book.genre, book.description, book.coverUrl, book.totalCopies, book.totalCopies);
      console.log(`Added: ${book.title}`);
    } else {
      console.log(`Skipped (already exists): ${book.title}`);
    }
  }
});

addEducationBooks(books);
console.log('Successfully seeded educational books!');
