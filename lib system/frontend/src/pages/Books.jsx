import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Box, BookOpen } from 'lucide-react';
import api from '../utils/api';
import PageTransition from '../components/PageTransition';

const CATEGORIES = [
  "All",
  "Adventure and action",
  "Fantasy and science fiction",
  "Mystery, thriller, horror",
  "Romance, historical fiction",
  "Young adult, children's",
  "Biography and memoir",
  "Self-help and history",
  "Business, stocks/investing, finance guides",
  "Science, travel, cookbooks",
  "Comics and Graphic Novels",
  "Art and Photography",
  "Technology and Programming",
  "Poetry and Drama"
];

const Books = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/books?search=${search}&category=${encodeURIComponent(category)}`);
        setBooks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    const t = setTimeout(fetchBooks, 300);
    return () => clearTimeout(t);
  }, [search, category]);

  return (
    <PageTransition>
      <div className="w-full px-6 md:px-12 xl:px-16 pt-8 pb-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 text-white tracking-tight leading-tight">
          The Ultimate PDF Library
        </h1>

        <div className="flex flex-col gap-8 mb-10 w-full">
          {/* Premium Glowing Search Bar */}
          <div className="relative w-full max-w-3xl group">
             {/* Neon Glow Behind Search Bar */}
             <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-60 transition duration-500" />
             
             {/* Actual Input Container */}
             <div className="relative bg-[#050505]/80 backdrop-blur-xl border border-white/20 rounded-full flex items-center px-6 py-4 shadow-2xl">
               <Search className="text-teal-400 mr-4" size={24} />
               <input 
                 type="text" 
                 placeholder="Search titles, authors, or categories..." 
                 value={search}
                 onChange={e => setSearch(e.target.value)} 
                 className="w-full bg-transparent border-none text-white text-lg placeholder-slate-500 font-medium focus:outline-none focus:ring-0"
               />
               {search && (
                 <button 
                   onClick={() => setSearch('')}
                   className="ml-4 text-slate-400 hover:text-white transition-colors text-xs font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full uppercase tracking-wider"
                 >
                   Clear
                 </button>
               )}
             </div>
          </div>

          {/* Top Horizontal Categories (Pills) */}
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border ${
                  category === cat 
                    ? 'bg-teal-500 text-black border-teal-500 shadow-[0_0_15px_rgba(45,212,191,0.3)]' 
                    : 'bg-[#151515] text-slate-300 border-white/10 hover:bg-[#222] hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Book Grid */}
        <div className="w-full">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
               {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                  <div key={i} className="bg-[#1c1c1e] overflow-hidden aspect-[2/3] skeleton rounded-xl"></div>
               ))}
            </div>
          ) : books.length === 0 ? (
            <div className="glass-panel p-16 text-center shadow-xl border border-white/10">
              <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
              <h2 className="text-2xl font-bold text-slate-300 mb-2">No books found</h2>
              <p className="text-slate-500">We couldn't find anything matching your search in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
              {books.map(book => (
                <div 
                  key={book.id} 
                  onClick={() => navigate(`/books/${book.id}`)} 
                  className="cursor-pointer hover:scale-105 transition-transform duration-300 relative group/card flex flex-col"
                >
                  <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-[#1c1c1e] border border-white/5 shadow-lg flex items-center justify-center p-4">
                    {/* Book Cover Image */}
                    <img 
                      src={book.coverUrl} 
                      className="absolute inset-0 w-full h-full object-cover" 
                      alt={book.title} 
                      loading="lazy"
                    />

                    {/* Dark gradient overlay for the dynamic text cover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
                    
                    {/* The dynamic book title functioning as the cover image */}
                    <h2 className="relative z-10 text-xl md:text-2xl font-black text-white text-center leading-tight drop-shadow-xl">
                      {book.title}
                    </h2>
                    
                    {/* Bottom Gradient Overlay for Copies Available */}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end p-2 md:p-3 opacity-100 group-hover/card:opacity-100 transition-opacity">
                       <div className="flex w-full justify-between items-center">
                         <span className={`text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-1 rounded-sm uppercase tracking-wider ${book.availableCopies > 0 ? "bg-teal-500/90 text-white" : "bg-red-500/90 text-white"}`}>
                            {book.availableCopies > 0 ? 'In Stock' : 'Out'}
                         </span>
                         <span className="text-[10px] md:text-[11px] font-bold text-slate-300 flex items-center gap-1 font-mono">
                            <Box size={10} className="text-teal-400" /> 
                            {book.availableCopies}/{book.totalCopies}
                         </span>
                       </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 pb-1 px-1 bg-transparent w-full">
                    <h3 className="text-[14px] md:text-[15px] font-semibold text-slate-100 line-clamp-1 md:line-clamp-2 leading-tight">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};
export default Books;
