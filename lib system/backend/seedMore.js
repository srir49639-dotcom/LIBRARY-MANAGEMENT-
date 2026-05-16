const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'library.db');
const db = new Database(dbPath, { verbose: console.log });

// Update old records to match the new comprehensive category definitions
db.prepare("UPDATE books SET genre = 'Fantasy and science fiction' WHERE genre = 'Sci-Fi'").run();
db.prepare("UPDATE books SET genre = 'Self-help and history' WHERE genre = 'Self-help'").run();
db.prepare("UPDATE books SET genre = 'Adventure and action' WHERE genre = 'Fiction'").run();
db.prepare("UPDATE books SET genre = 'Technology and Programming' WHERE genre = 'Technology'").run();

const newBooks = [
  // Adventure and action
  ['The Count of Monte Cristo', 'Alexandre Dumas', 'Adventure and action', 'A classic tale of revenge and adventure.', 'https://images.unsplash.com/photo-1605663866417-76ce00d3d5bd?q=80&w=600&auto=format&fit=crop', 3],
  
  // Fantasy and science fiction
  ['Neuromancer', 'William Gibson', 'Fantasy and science fiction', 'The seminal cyberpunk novel.', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop', 4],
  
  // Mystery, thriller, horror
  ['Gone Girl', 'Gillian Flynn', 'Mystery, thriller, horror', 'A psychological thriller that tests a marriage.', 'https://images.unsplash.com/photo-1587876931560-607e0c46b1df?q=80&w=600&auto=format&fit=crop', 2],
  
  // Romance, historical fiction
  ['Pride and Prejudice', 'Jane Austen', 'Romance, historical fiction', 'A romantic comedy of manners.', 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=600&auto=format&fit=crop', 3],
  
  // Young adult, children's
  ['The Hunger Games', 'Suzanne Collins', 'Young adult, children\'s', 'In a dystopian future, teens fight to the death.', 'https://images.unsplash.com/photo-1605370335787-8e6f1f44d827?q=80&w=600&auto=format&fit=crop', 5],
  
  // Biography and memoir
  ['Steve Jobs', 'Walter Isaacson', 'Biography and memoir', 'The exclusive biography of Steve Jobs.', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format&fit=crop', 2],
  
  // Business, stocks/investing, finance guides
  ['The Intelligent Investor', 'Benjamin Graham', 'Business, stocks/investing, finance guides', 'The classic text on value investing.', 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop', 4],
  
  // Comics and Graphic Novels
  ['Watchmen', 'Alan Moore & Dave Gibbons', 'Comics and Graphic Novels', 'A deconstruction of the superhero genre.', 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=600&auto=format&fit=crop', 3],
  ['Batman: The Dark Knight Returns', 'Frank Miller', 'Comics and Graphic Novels', 'An aging Batman comes out of retirement focusing on gritty realism.', 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=600&auto=format&fit=crop', 2],
  ['Spider-Man: Blue', 'Jeph Loeb', 'Comics and Graphic Novels', 'A heartfelt retrospective on early comic adventures.', 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc54?q=80&w=600&auto=format&fit=crop', 2],
  
  // Art and Photography
  ['The Story of Art', 'E.H. Gombrich', 'Art and Photography', 'The most famous and popular book on art.', 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=600&auto=format&fit=crop', 2],

  // Poetry and Drama
  ['The Complete Works of William Shakespeare', 'William Shakespeare', 'Poetry and Drama', 'All the plays and poems from the greatest writer in the English language.', 'https://images.unsplash.com/photo-1544256718-3fc87569766e?q=80&w=600&auto=format&fit=crop', 3]
];

const insertBook = db.prepare('INSERT INTO books (title, author, genre, description, coverUrl, totalCopies, availableCopies) VALUES (?, ?, ?, ?, ?, ?, ?)');

db.transaction(() => {
  for (const b of newBooks) {
    const existing = db.prepare('SELECT id FROM books WHERE title = ?').get(b[0]);
    if (!existing) {
      insertBook.run(b[0], b[1], b[2], b[3], b[4], b[5], b[5]);
    }
  }
})();
console.log("Seeding complete successfully!");
