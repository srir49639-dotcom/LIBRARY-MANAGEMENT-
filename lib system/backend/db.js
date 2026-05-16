const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'library.db');
const db = new Database(dbPath, { verbose: console.log });

db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user'
  );

  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT,
    description TEXT,
    coverUrl TEXT,
    totalCopies INTEGER DEFAULT 1,
    availableCopies INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS borrow_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    borrowDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    dueDate DATETIME NOT NULL,
    returnDate DATETIME,
    fineAmount REAL DEFAULT 0,
    status TEXT DEFAULT 'active',
    FOREIGN KEY (bookId) REFERENCES books (id),
    FOREIGN KEY (userId) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bookId INTEGER NOT NULL,
    userId INTEGER NOT NULL,
    reservationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (bookId) REFERENCES books (id),
    FOREIGN KEY (userId) REFERENCES users (id)
  );
  
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    isRead INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (id)
  );
`);

const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
if (userCount === 0) {
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run('Admin User', 'admin@library.com', hash, 'admin');
  
  const userHash = bcrypt.hashSync('user123', 10);
  db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run('Test User', 'user@library.com', userHash, 'user');

  const insertBook = db.prepare('INSERT INTO books (title, author, genre, description, coverUrl, totalCopies, availableCopies) VALUES (?, ?, ?, ?, ?, ?, ?)');
  insertBook.run('The Midnight Library', 'Matt Haig', 'Fiction', 'Between life and death there is a library.', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1287&auto=format&fit=crop', 5, 5);
  insertBook.run('Atomic Habits', 'James Clear', 'Self-help', 'No matter your goals, Atomic Habits offers a proven framework for improving.', 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1212&auto=format&fit=crop', 3, 2);
  insertBook.run('Dune', 'Frank Herbert', 'Sci-Fi', 'Set on the desert planet Arrakis.', 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1288&auto=format&fit=crop', 4, 4);
  insertBook.run('Project Hail Mary', 'Andy Weir', 'Sci-Fi', 'A lone astronaut must save the earth from disaster.', 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1287&auto=format&fit=crop', 2, 0);
  insertBook.run('Clean Code', 'Robert C. Martin', 'Technology', 'A Handbook of Agile Software Craftsmanship.', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1470&auto=format&fit=crop', 2, 2);
}

module.exports = db;
