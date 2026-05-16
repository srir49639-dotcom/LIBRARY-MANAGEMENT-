const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'library.db');
const db = new Database(dbPath, { verbose: console.log });

const data = [
  ['Adventure and action', 'Jurassic Park', 'Michael Crichton'],
  ['Adventure and action', 'The Hobbit', 'J.R.R. Tolkien'],
  ['Adventure and action', 'The Hunger Games', 'Suzanne Collins'],
  ['Adventure and action', 'The Count of Monte Cristo', 'Alexandre Dumas'],
  ['Adventure and action', 'The Three Musketeers', 'Alexandre Dumas'],
  ['Adventure and action', 'Treasure Island', 'Robert Louis Stevenson'],
  ['Adventure and action', 'The Fellowship of the Ring', 'J.R.R. Tolkien'],
  ['Adventure and action', 'The Return of the King', 'J.R.R. Tolkien'],
  ['Adventure and action', 'The Hunt for Red October', 'Tom Clancy'],
  ['Adventure and action', 'Seven Deadly Wonders', 'Matthew Reilly'],
  
  ['Fantasy and science fiction', 'The Arabian Nights', 'Unknown Author'],
  ['Fantasy and science fiction', 'Alice’s Adventures in Wonderland', 'Lewis Carroll'],
  ['Fantasy and science fiction', 'The Lord of the Rings', 'J.R.R. Tolkien'],
  ['Fantasy and science fiction', 'Dune', 'Frank Herbert'],
  ['Fantasy and science fiction', 'Ender’s Game', 'Orson Scott Card'],
  ['Fantasy and science fiction', 'Foundation', 'Isaac Asimov'],
  ['Fantasy and science fiction', 'The Left Hand of Darkness', 'Ursula K. Le Guin'],
  ['Fantasy and science fiction', 'A Wizard of Earthsea', 'Ursula K. Le Guin'],
  ['Fantasy and science fiction', 'The Name of the Wind', 'Patrick Rothfuss'],
  ['Fantasy and science fiction', 'Children of Blood and Bone', 'Tomi Adeyemi'],

  ['Mystery, thriller, horror', 'And Then There Were None', 'Agatha Christie'],
  ['Mystery, thriller, horror', 'The Silent Patient', 'Alex Michaelides'],
  ['Mystery, thriller, horror', 'Gone Girl', 'Gillian Flynn'],
  ['Mystery, thriller, horror', 'The Girl with the Dragon Tattoo', 'Stieg Larsson'],
  ['Mystery, thriller, horror', 'The Da Vinci Code', 'Dan Brown'],
  ['Mystery, thriller, horror', 'The Shining', 'Stephen King'],
  ['Mystery, thriller, horror', 'Misery', 'Stephen King'],
  ['Mystery, thriller, horror', 'The Murder of Roger Ackroyd', 'Agatha Christie'],
  ['Mystery, thriller, horror', 'Before I Go to Sleep', 'S. J. Watson'],
  ['Mystery, thriller, horror', 'The Truth About the Harry Quebert Affair', 'Joël Dicker'],

  ['Romance, historical fiction', 'Pride and Prejudice', 'Jane Austen'],
  ['Romance, historical fiction', 'Jane Eyre', 'Charlotte Brontë'],
  ['Romance, historical fiction', 'Outlander', 'Diana Gabaldon'],
  ['Romance, historical fiction', 'Me Before You', 'Jojo Moyes'],
  ['Romance, historical fiction', 'The Book Thief', 'Markus Zusak'],
  ['Romance, historical fiction', 'All the Light We Cannot See', 'Anthony Doerr'],
  ['Romance, historical fiction', 'The Nightingale', 'Kristin Hannah'],
  ['Romance, historical fiction', 'The Pillars of the Earth', 'Ken Follett'],
  ['Romance, historical fiction', 'Gone with the Wind', 'Margaret Mitchell'],
  ['Romance, historical fiction', 'Atonement', 'Ian McEwan'],

  ["Young adult, children's", 'Harry Potter and the Sorcerer’s Stone', 'J.K. Rowling'],
  ["Young adult, children's", 'Percy Jackson and the Olympians', 'Rick Riordan'],
  ["Young adult, children's", 'Wonder', 'R. J. Palacio'],
  ["Young adult, children's", 'Charlotte’s Web', 'E. B. White'],
  ["Young adult, children's", 'Matilda', 'Roald Dahl'],
  ["Young adult, children's", 'The Fault in Our Stars', 'John Green'],
  ["Young adult, children's", 'The Giver', 'Lois Lowry'],
  ["Young adult, children's", 'Holes', 'Louis Sachar'],
  ["Young adult, children's", 'Anne of Green Gables', 'L. M. Montgomery'],
  ["Young adult, children's", 'Diary of a Wimpy Kid', 'Jeff Kinney'],

  ['Biography and memoir', 'The Diary of a Young Girl', 'Anne Frank'],
  ['Biography and memoir', 'Educated', 'Tara Westover'],
  ['Biography and memoir', 'Becoming', 'Michelle Obama'],
  ['Biography and memoir', 'Long Walk to Freedom', 'Nelson Mandela'],
  ['Biography and memoir', 'Steve Jobs', 'Walter Isaacson'],
  ['Biography and memoir', 'When Breath Becomes Air', 'Paul Kalanithi'],
  ['Biography and memoir', 'Born a Crime', 'Trevor Noah'],
  ['Biography and memoir', 'I Know Why the Caged Bird Sings', 'Maya Angelou'],
  ['Biography and memoir', 'A Moveable Feast', 'Ernest Hemingway'],
  ['Biography and memoir', 'The Glass Castle', 'Jeannette Walls'],

  ['Self-help and history', 'Atomic Habits', 'James Clear'],
  ['Self-help and history', 'The 7 Habits of Highly Effective People', 'Stephen R. Covey'],
  ['Self-help and history', 'Think and Grow Rich', 'Napoleon Hill'],
  ['Self-help and history', 'Sapiens', 'Yuval Noah Harari'],
  ['Self-help and history', 'Guns, Germs, and Steel', 'Jared Diamond'],
  ['Self-help and history', 'The Power of Habit', 'Charles Duhigg'],
  ['Self-help and history', 'How to Win Friends and Influence People', 'Dale Carnegie'],
  ['Self-help and history', 'Man’s Search for Meaning', 'Viktor E. Frankl'],
  ['Self-help and history', 'Meditations', 'Marcus Aurelius'],
  ['Self-help and history', 'The Subtle Art of Not Giving a Fck*', 'Mark Manson'],

  ['Business, stocks/investing, finance guides', 'Rich Dad Poor Dad', 'Robert T. Kiyosaki'],
  ['Business, stocks/investing, finance guides', 'The Intelligent Investor', 'Benjamin Graham'],
  ['Business, stocks/investing, finance guides', 'One Up On Wall Street', 'Peter Lynch'],
  ['Business, stocks/investing, finance guides', 'Common Stocks and Uncommon Profits', 'Philip Fisher'],
  ['Business, stocks/investing, finance guides', 'The Psychology of Money', 'Morgan Housel'],
  ['Business, stocks/investing, finance guides', 'A Random Walk Down Wall Street', 'Burton G. Malkiel'],
  ['Business, stocks/investing, finance guides', 'Security Analysis', 'Benjamin Graham and David Dodd'],
  ['Business, stocks/investing, finance guides', 'The Little Book of Common Sense Investing', 'John C. Bogle'],
  ['Business, stocks/investing, finance guides', 'The Essays of Warren Buffett', 'Warren Buffett'],
  ['Business, stocks/investing, finance guides', 'Your Money or Your Life', 'Vicki Robin'],

  ['Science, travel, cookbooks', 'A Brief History of Time', 'Stephen Hawking'],
  ['Science, travel, cookbooks', 'The Selfish Gene', 'Richard Dawkins'],
  ['Science, travel, cookbooks', 'Cosmos', 'Carl Sagan'],
  ['Science, travel, cookbooks', 'Silent Spring', 'Rachel Carson'],
  ['Science, travel, cookbooks', 'Into the Wild', 'Jon Krakauer'],
  ['Science, travel, cookbooks', 'Eat, Pray, Love', 'Elizabeth Gilbert'],
  ['Science, travel, cookbooks', 'Wild', 'Cheryl Strayed'],
  ['Science, travel, cookbooks', 'The Geography of Bliss', 'Eric Weiner'],
  ['Science, travel, cookbooks', 'Joy of Cooking', 'Irma S. Rombauer'],
  ['Science, travel, cookbooks', 'Salt, Fat, Acid, Heat', 'Samin Nosrat'],

  ['Comics and Graphic Novels', 'Maus', 'Art Spiegelman'],
  ['Comics and Graphic Novels', 'Watchmen', 'Alan Moore'],
  ['Comics and Graphic Novels', 'V for Vendetta', 'Alan Moore'],
  ['Comics and Graphic Novels', 'Saga', 'Brian K. Vaughan'],
  ['Comics and Graphic Novels', 'Batman: The Killing Joke', 'Alan Moore'],
  ['Comics and Graphic Novels', 'The Sandman', 'Neil Gaiman'],
  ['Comics and Graphic Novels', 'Blankets', 'Craig Thompson'],
  ['Comics and Graphic Novels', 'Persepolis', 'Marjane Satrapi'],
  ['Comics and Graphic Novels', 'Bone', 'Jeff Smith'],
  ['Comics and Graphic Novels', 'Ms. Marvel', 'G. Willow Wilson'],

  ['Art and Photography', 'Understanding Exposure', 'Bryan Peterson'],
  ['Art and Photography', 'The Photographer’s Eye', 'Michael Freeman'],
  ['Art and Photography', 'On Photography', 'Susan Sontag'],
  ['Art and Photography', 'Steal Like an Artist', 'Austin Kleon'],
  ['Art and Photography', 'Ways of Seeing', 'John Berger'],
  ['Art and Photography', 'The Story of Art', 'E. H. Gombrich'],
  ['Art and Photography', 'Humans of New York', 'Brandon Stanton'],
  ['Art and Photography', 'Art and Visual Perception', 'Rudolf Arnheim'],
  ['Art and Photography', 'The Decisive Moment', 'Henri Cartier-Bresson'],
  ['Art and Photography', 'Camera Lucida', 'Roland Barthes'],

  ['Technology and Programming', 'Clean Code', 'Robert C. Martin'],
  ['Technology and Programming', 'The Pragmatic Programmer', 'Andrew Hunt'],
  ['Technology and Programming', 'Introduction to Algorithms', 'Thomas H. Cormen'],
  ['Technology and Programming', 'Python Crash Course', 'Eric Matthes'],
  ['Technology and Programming', 'Automate the Boring Stuff with Python', 'Al Sweigart'],
  ['Technology and Programming', 'Code Complete', 'Steve McConnell'],
  ['Technology and Programming', 'Head First Design Patterns', 'Eric Freeman'],
  ['Technology and Programming', 'You Don’t Know JS', 'Kyle Simpson'],
  ['Technology and Programming', 'Designing Data-Intensive Applications', 'Martin Kleppmann'],
  ['Technology and Programming', 'Cracking the Coding Interview', 'Gayle Laakmann McDowell'],

  ['Poetry and Drama', 'Leaves of Grass', 'Walt Whitman'],
  ['Poetry and Drama', 'The Waste Land', 'T. S. Eliot'],
  ['Poetry and Drama', 'Romeo and Juliet', 'William Shakespeare'],
  ['Poetry and Drama', 'Hamlet', 'William Shakespeare'],
  ['Poetry and Drama', 'Macbeth', 'William Shakespeare'],
  ['Poetry and Drama', 'Death of a Salesman', 'Arthur Miller'],
  ['Poetry and Drama', 'Oedipus Rex', 'Sophocles'],
  ['Poetry and Drama', 'The Glass Menagerie', 'Tennessee Williams'],
  ['Poetry and Drama', 'A Streetcar Named Desire', 'Tennessee Williams'],
  ['Poetry and Drama', 'Waiting for Godot', 'Samuel Beckett']
];

const getImg = (kw) => 'https://images.unsplash.com/photo-' + kw + '?q=80&w=400&h=600&auto=format&fit=crop';
const images = {
    'Adventure and action': ['1549405230-67503ced0878', '1506466010722-395aa2bef877', '1605663866417-76ce00d3d5bd'],
    'Fantasy and science fiction': ['1635070041078-e363dbe005cb', '1451187580459-43490279c0fa', '1603593025211-1da4bc2f0412'],
    'Mystery, thriller, horror': ['1587876931560-607e0c46b1df', '1430285561322-780c604b1568'],
    'Romance, historical fiction': ['1562690868-60bbe7293e94', '1469854523086-cc02fe5d8800'],
    "Young adult, children's": ['1605370335787-8e6f1f44d827', '1512820790803-83ca734da794'],
    'Biography and memoir': ['1516979187457-637abb4f9353', '1589829085413-56de8ae18c73'],
    'Self-help and history': ['1555601568-c9e6f328489b', '1579373903781-fd5c0c30c4cd'],
    'Business, stocks/investing, finance guides': ['1590283603385-17ffb3a7f29f', '1611974789855-9c2a0a7236a3'],
    'Science, travel, cookbooks': ['1473691955023-da1c49c95c78', '1556910103-1c02745aae4d'],
    'Comics and Graphic Novels': ['1612036782180-6f0b6cd846fe', '1608889825103-eb5ed706fc54'],
    'Art and Photography': ['1499781350541-7783f6c6a0c8', '1516035069371-29a1b244cc32'],
    'Technology and Programming': ['1555066931-4365d14bab8c', '1526379095098-d400fd0bfce8'],
    'Poetry and Drama': ['1544256718-3fc87569766e', '1568283363063-4ee10e53a2eb']
};

const stmt = db.prepare('INSERT INTO books (title, author, genre, description, coverUrl, totalCopies, availableCopies) VALUES (?, ?, ?, ?, ?, ?, ?)');

db.transaction(() => {
  for (const b of data) {
    const existing = db.prepare('SELECT id FROM books WHERE title = ?').get(b[1]);
    if (!existing) {
      const pool = images[b[0]] || ['1544256718-3fc87569766e'];
      const imgId = pool[Math.floor(Math.random() * pool.length)];
      stmt.run(b[1], b[2], b[0], 'A classic masterpiece by ' + b[2] + '.', getImg(imgId), 5, 5);
    }
  }
})();
console.log('Massive seed successful!');
