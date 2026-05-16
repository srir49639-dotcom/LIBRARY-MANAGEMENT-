const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'library.db');
const db = new Database(dbPath, { verbose: console.log });

const rawData = `
Adventure and action
Jurassic Park — Michael Crichton
The Hobbit — J.R.R. Tolkien
The Hunger Games — Suzanne Collins
The Count of Monte Cristo — Alexandre Dumas
The Three Musketeers — Alexandre Dumas
Treasure Island — Robert Louis Stevenson
The Fellowship of the Ring — J.R.R. Tolkien
The Return of the King — J.R.R. Tolkien
The Hunt for Red October — Tom Clancy
Seven Deadly Wonders — Matthew Reilly

Fantasy and science fiction
The Arabian Nights
Alice’s Adventures in Wonderland — Lewis Carroll
The Lord of the Rings — J.R.R. Tolkien
Dune — Frank Herbert
Ender’s Game — Orson Scott Card
Foundation — Isaac Asimov
The Left Hand of Darkness — Ursula K. Le Guin
A Wizard of Earthsea — Ursula K. Le Guin
The Name of the Wind — Patrick Rothfuss
Children of Blood and Bone — Tomi Adeyemi

Mystery, thriller, horror
And Then There Were None — Agatha Christie
The Silent Patient — Alex Michaelides
Gone Girl — Gillian Flynn
The Girl with the Dragon Tattoo — Stieg Larsson
The Da Vinci Code — Dan Brown
The Shining — Stephen King
Misery — Stephen King
The Murder of Roger Ackroyd — Agatha Christie
Before I Go to Sleep — S. J. Watson
The Truth About the Harry Quebert Affair — Joël Dicker

Romance, historical fiction
Pride and Prejudice — Jane Austen
Jane Eyre — Charlotte Brontë
Outlander — Diana Gabaldon
Me Before You — Jojo Moyes
The Book Thief — Markus Zusak
All the Light We Cannot See — Anthony Doerr
The Nightingale — Kristin Hannah
The Pillars of the Earth — Ken Follett
Gone with the Wind — Margaret Mitchell
Atonement — Ian McEwan

Young adult, children's
Harry Potter and the Sorcerer’s Stone — J.K. Rowling
Percy Jackson and the Olympians — Rick Riordan
Wonder — R. J. Palacio
Charlotte’s Web — E. B. White
Matilda — Roald Dahl
The Fault in Our Stars — John Green
The Giver — Lois Lowry
Holes — Louis Sachar
Anne of Green Gables — L. M. Montgomery
Diary of a Wimpy Kid — Jeff Kinney

Biography and memoir
The Diary of a Young Girl — Anne Frank
Educated — Tara Westover
Becoming — Michelle Obama
Long Walk to Freedom — Nelson Mandela
Steve Jobs — Walter Isaacson
When Breath Becomes Air — Paul Kalanithi
Born a Crime — Trevor Noah
I Know Why the Caged Bird Sings — Maya Angelou
A Moveable Feast — Ernest Hemingway
The Glass Castle — Jeannette Walls

Self-help and history
Atomic Habits — James Clear
The 7 Habits of Highly Effective People — Stephen R. Covey
Think and Grow Rich — Napoleon Hill
Sapiens — Yuval Noah Harari
Guns, Germs, and Steel — Jared Diamond
The Power of Habit — Charles Duhigg
How to Win Friends and Influence People — Dale Carnegie
Man’s Search for Meaning — Viktor E. Frankl
Meditations — Marcus Aurelius
The Subtle Art of Not Giving a Fck* — Mark Manson

Business, stocks/investing, finance guides
Rich Dad Poor Dad — Robert T. Kiyosaki
The Intelligent Investor — Benjamin Graham
One Up On Wall Street — Peter Lynch
Common Stocks and Uncommon Profits — Philip Fisher
The Psychology of Money — Morgan Housel
A Random Walk Down Wall Street — Burton G. Malkiel
Security Analysis — Benjamin Graham and David Dodd
The Little Book of Common Sense Investing — John C. Bogle
The Essays of Warren Buffett — Warren Buffett
Your Money or Your Life — Vicki Robin and Joe Dominguez

Science, travel, cookbooks
A Brief History of Time — Stephen Hawking
The Selfish Gene — Richard Dawkins
Cosmos — Carl Sagan
Silent Spring — Rachel Carson
Into the Wild — Jon Krakauer
Eat, Pray, Love — Elizabeth Gilbert
Wild — Cheryl Strayed
The Geography of Bliss — Eric Weiner
Joy of Cooking — Irma S. Rombauer
Salt, Fat, Acid, Heat — Samin Nosrat

Comics and Graphic Novels
Maus — Art Spiegelman
Watchmen — Alan Moore
V for Vendetta — Alan Moore and David Lloyd
Saga — Brian K. Vaughan and Fiona Staples
Batman: The Killing Joke — Alan Moore and Brian Bolland
The Sandman — Neil Gaiman
Blankets — Craig Thompson
Persepolis — Marjane Satrapi
Bone — Jeff Smith
Ms. Marvel — G. Willow Wilson

Art and Photography
Understanding Exposure — Bryan Peterson
The Photographer’s Eye — Michael Freeman
On Photography — Susan Sontag
Steal Like an Artist — Austin Kleon
Ways of Seeing — John Berger
The Story of Art — E. H. Gombrich
Humans of New York — Brandon Stanton
Art and Visual Perception — Rudolf Arnheim
The Decisive Moment — Henri Cartier-Bresson
Camera Lucida — Roland Barthes

Technology and Programming
Clean Code — Robert C. Martin
The Pragmatic Programmer — Andrew Hunt and David Thomas
Introduction to Algorithms — Cormen, Leiserson, Rivest, and Stein
Python Crash Course — Eric Matthes
Automate the Boring Stuff with Python — Al Sweigart
Code Complete — Steve McConnell
Head First Design Patterns — Eric Freeman
You Don’t Know JS — Kyle Simpson
Designing Data-Intensive Applications — Martin Kleppmann
Cracking the Coding Interview — Gayle Laakmann McDowell

Poetry and Drama
Leaves of Grass — Walt Whitman
The Waste Land — T. S. Eliot
Romeo and Juliet — William Shakespeare
Hamlet — William Shakespeare
Macbeth — William Shakespeare
Death of a Salesman — Arthur Miller
Oedipus Rex — Sophocles
The Glass Menagerie — Tennessee Williams
A Streetcar Named Desire — Tennessee Williams
Waiting for Godot — Samuel Beckett
`;

const getCategoryImg = (cat) => {
  const images = {
    "Adventure and action": ["https://images.unsplash.com/photo-1549405230-67503ced0878", "https://images.unsplash.com/photo-1506466010722-395aa2bef877", "https://images.unsplash.com/photo-1605663866417-76ce00d3d5bd"],
    "Fantasy and science fiction": ["https://images.unsplash.com/photo-1635070041078-e363dbe005cb", "https://images.unsplash.com/photo-1451187580459-43490279c0fa", "https://images.unsplash.com/photo-1603593025211-1da4bc2f0412"],
    "Mystery, thriller, horror": ["https://images.unsplash.com/photo-1587876931560-607e0c46b1df", "https://images.unsplash.com/photo-1430285561322-780c604b1568"],
    "Romance, historical fiction": ["https://images.unsplash.com/photo-1562690868-60bbe7293e94", "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"],
    "Young adult, children's": ["https://images.unsplash.com/photo-1605370335787-8e6f1f44d827", "https://images.unsplash.com/photo-1512820790803-83ca734da794"],
    "Biography and memoir": ["https://images.unsplash.com/photo-1516979187457-637abb4f9353", "https://images.unsplash.com/photo-1589829085413-56de8ae18c73"],
    "Self-help and history": ["https://images.unsplash.com/photo-1555601568-c9e6f328489b", "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd"],
    "Business, stocks/investing, finance guides": ["https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f", "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3"],
    "Science, travel, cookbooks": ["https://images.unsplash.com/photo-1473691955023-da1c49c95c78", "https://images.unsplash.com/photo-1556910103-1c02745aae4d"],
    "Comics and Graphic Novels": ["https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe", "https://images.unsplash.com/photo-1608889825103-eb5ed706fc54"],
    "Art and Photography": ["https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"],
    "Technology and Programming": ["https://images.unsplash.com/photo-1555066931-4365d14bab8c", "https://images.unsplash.com/photo-1526379095098-d400fd0bfce8"],
    "Poetry and Drama": ["https://images.unsplash.com/photo-1544256718-3fc87569766e", "https://images.unsplash.com/photo-1568283363063-4ee10e53a2eb"]
  };
  
  const pool = images[cat] || ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570"];
  const selected = pool[Math.floor(Math.random() * pool.length)];
  return `${selected}?q=80&w=400&h=600&auto=format&fit=crop`;
};

const books = [];
let currentCategory = "";

rawData.split('\\n').forEach(line => {
  line = line.trim();
  if(!line) return;
  if (!line.includes('—') && line.length > 5 && line !== "The Arabian Nights") {
    currentCategory = line;
    return;
  }
  
  let title = line;
  let author = "Unknown Author";
  
  if (line.includes('—')) {
    const parts = line.split('—');
    title = parts[0].trim();
    author = parts[1].trim();
  }
  else if (line === "The Arabian Nights") {
    title = line;
  }

  books.push({
    title,
    author,
    genre: currentCategory,
    description: `A classic entry in ${currentCategory}.`,
    coverUrl: getCategoryImg(currentCategory),
    totalCopies: 5,
    availableCopies: 5
  });
});

const insertBook = db.prepare('INSERT INTO books (title, author, genre, description, coverUrl, totalCopies, availableCopies) VALUES (?, ?, ?, ?, ?, ?, ?)');

db.transaction(() => {
  for (const b of books) {
    const existing = db.prepare('SELECT id FROM books WHERE title = ?').get(b.title);
    if (!existing) {
      insertBook.run(b.title, b.author, b.genre, b.description, b.coverUrl, b.totalCopies, b.availableCopies);
    }
  }
})();
console.log(`Successfully seeded ${books.length} books!`);
