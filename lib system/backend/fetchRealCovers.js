const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'library.db');
const db = new Database(dbPath, { verbose: null });

async function fixImages() {
  const books = db.prepare("SELECT id, title FROM books WHERE coverUrl LIKE '%unsplash%'").all();
  console.log(`Found ${books.length} books with generic placeholders. Downloading REAL covers...`);
  
  for (const b of books) {
    try {
      const res = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(b.title)}&limit=1`);
      const data = await res.json();
      if (data.docs && data.docs.length > 0 && data.docs[0].cover_i) {
         const url = `https://covers.openlibrary.org/b/id/${data.docs[0].cover_i}-L.jpg`;
         db.prepare('UPDATE books SET coverUrl = ? WHERE id = ?').run(url, b.id);
         console.log(`✅ Fetched real authentic cover for: ${b.title}`);
      } else {
         // Fallback to a custom text generated image
         const url = `https://placehold.co/400x600/1c1c1e/ffffff?font=Montserrat&text=${encodeURIComponent(b.title)}`;
         db.prepare('UPDATE books SET coverUrl = ? WHERE id = ?').run(url, b.id);
      }
    } catch(err) {
      console.log(`❌ Failed fetching for ${b.title}`);
    }
  }
}

async function addMore() {
   console.log("\nFetching MORE brand new books from global archives...");
   const categories = {
      'science_fiction': 'Fantasy and science fiction',
      'mystery_and_detective_stories': 'Mystery, thriller, horror',
      'historical_fiction': 'Romance, historical fiction',
      'business': 'Business, stocks/investing, finance guides',
      'software_engineering': 'Technology and Programming',
      'comic_books': 'Comics and Graphic Novels'
   };
   
   const stmt = db.prepare('INSERT INTO books (title, author, genre, description, coverUrl, totalCopies, availableCopies) VALUES (?, ?, ?, ?, ?, ?, ?)');

   for (const [subject, genre] of Object.entries(categories)) {
     console.log(`\n=> Ingesting bulk subjects: ${genre}`);
     try {
         const res = await fetch(`https://openlibrary.org/subjects/${subject}.json?limit=25`);
         if (!res.ok) continue;
         const data = await res.json();
         
         db.transaction(() => {
           for (const work of data.works) {
             if (!work.cover_id) continue;
             const existing = db.prepare('SELECT id FROM books WHERE title = ?').get(work.title);
             if (existing) continue;

             const title = work.title;
             const author = work.authors && work.authors.length > 0 ? work.authors[0].name : 'Unknown Author';
             const coverUrl = `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`;
             stmt.run(title, author, genre, `A newly acquired archival text recently added to the central library circulation.`, coverUrl, 3, 3);
             console.log(`  + Added: ${title}`);
           }
         })();
     } catch(e) {
         console.log(`Error ingesting ${subject}`);
     }
   }
}

async function run() {
   await fixImages();
   await addMore();
   console.log("\n\n🎉 ENTIRE LIBRARY SYNCHRONIZED AND UPGRADED!");
}

run();
