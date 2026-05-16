const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = 'supersecretkey_change_in_production';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.sendStatus(403);
  }
};

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim() || !email || !email.trim() || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
     return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const info = stmt.run(name, email, hash);
    const token = jwt.sign({ id: info.lastInsertRowid, email, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: info.lastInsertRowid, name, email, role: 'user' } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !email.trim() || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });
    
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });
    
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.get('/api/books', (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM books WHERE 1=1';
  let params = [];
  if (search) {
    query += ' AND (title LIKE ? OR author LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category && category !== 'All') {
    query += ' AND genre = ?';
    params.push(category);
  }
  const books = db.prepare(query).all(...params);
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(req.params.id);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

app.post('/api/books', authenticateToken, isAdmin, (req, res) => {
  const { title, author, genre, description, coverUrl, totalCopies } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO books (title, author, genre, description, coverUrl, totalCopies, availableCopies) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(title, author, genre, description, coverUrl, totalCopies, totalCopies);
    res.status(201).json({ id: info.lastInsertRowid, title, author, genre, description, coverUrl, totalCopies, availableCopies: totalCopies });
  } catch (err) {
    res.status(400).json({ error: 'Failed to add book' });
  }
});

app.put('/api/books/:id', authenticateToken, isAdmin, (req, res) => {
  const { title, author, genre, description, coverUrl, totalCopies, availableCopies } = req.body;
  try {
    const stmt = db.prepare('UPDATE books SET title = ?, author = ?, genre = ?, description = ?, coverUrl = ?, totalCopies = ?, availableCopies = ? WHERE id = ?');
    stmt.run(title, author, genre, description, coverUrl, totalCopies, availableCopies, req.params.id);
    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update book' });
  }
});

app.delete('/api/books/:id', authenticateToken, isAdmin, (req, res) => {
  try {
    db.prepare('DELETE FROM books WHERE id = ?').run(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete book' });
  }
});

app.post('/api/borrow', authenticateToken, (req, res) => {
  const { bookId } = req.body;
  const userId = req.user.id;
  
  const book = db.prepare('SELECT * FROM books WHERE id = ?').get(bookId);
  if (!book) return res.status(404).json({ error: 'Book not found' });
  if (book.availableCopies <= 0) return res.status(400).json({ error: 'No copies available' });
  
  const existingBorrow = db.prepare("SELECT * FROM borrow_records WHERE bookId = ? AND userId = ? AND status = 'active'").get(bookId, userId);
  if (existingBorrow) return res.status(400).json({ error: 'You already borrowed this' });

  db.transaction(() => {
    db.prepare('UPDATE books SET availableCopies = availableCopies - 1 WHERE id = ?').run(bookId);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    db.prepare('INSERT INTO borrow_records (bookId, userId, dueDate) VALUES (?, ?, ?)').run(bookId, userId, dueDate.toISOString());
    db.prepare('INSERT INTO notifications (userId, title, message) VALUES (?, ?, ?)').run(userId, 'Book Borrowed', `Borrowed "${book.title}".`);
  })();
  res.json({ message: 'Success' });
});

app.post('/api/return', authenticateToken, (req, res) => {
  const { recordId } = req.body;
  const userId = req.user.id;
  const record = db.prepare("SELECT * FROM borrow_records WHERE id = ? AND userId = ? AND status != 'returned'").get(recordId, userId);
  if (!record) return res.status(404).json({ error: 'Not found' });

  db.transaction(() => {
    db.prepare("UPDATE borrow_records SET status = 'returned', returnDate = CURRENT_TIMESTAMP WHERE id = ?").run(recordId);
    db.prepare('UPDATE books SET availableCopies = availableCopies + 1 WHERE id = ?').run(record.bookId);
    db.prepare('INSERT INTO notifications (userId, title, message) VALUES (?, ?, ?)').run(userId, 'Book Returned', `Book returned.`);
  })();
  res.json({ message: 'Success' });
});

app.get('/api/user/dashboard', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const activeBorrows = db.prepare(`SELECT br.*, b.title, b.author, b.coverUrl FROM borrow_records br JOIN books b ON br.bookId = b.id WHERE br.userId = ? AND br.status != 'returned'`).all(userId);
  const finesTotal = db.prepare('SELECT SUM(fineAmount) as total FROM borrow_records WHERE userId = ?').get(userId).total || 0;
  const readCount = db.prepare("SELECT COUNT(*) as count FROM borrow_records WHERE userId = ? AND status = 'returned'").get(userId).count;
  const notifications = db.prepare('SELECT * FROM notifications WHERE userId = ? ORDER BY createdAt DESC LIMIT 10').all(userId);

  res.json({
    activeBorrows,
    stats: { activeBooks: activeBorrows.length, fines: finesTotal, readBooks: readCount },
    notifications
  });
});

// SERVE FRONTEND
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route to serve React index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
