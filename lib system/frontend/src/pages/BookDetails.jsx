import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Loader2, ArrowRight, Clock, Box, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [book, setBook] = useState(null);
  const [borrowState, setBorrowState] = useState('idle'); // idle, loading, success, error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Scroll to top automatically when navigating to this page
    window.scrollTo(0, 0);
    api.get(`/books/${id}`).then(res => setBook(res.data)).catch(console.error);
  }, [id]);

  const handleBorrow = async () => {
    if (!user) return navigate('/login');
    
    setBorrowState('loading');
    setErrorMsg('');
    
    try {
      await api.post('/borrow', { bookId: book.id });
      setBorrowState('success');
      setBook({ ...book, availableCopies: book.availableCopies - 1 });
    } catch (err) {
      setBorrowState('error');
      setErrorMsg(err.response?.data?.error || 'Failed to borrow book. Try again.');
      
      // Auto clear error state after 3 seconds
      setTimeout(() => setBorrowState('idle'), 3000);
    }
  };

  if (!book) return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
    </div>
  );

  const scarcityPercentage = (book.availableCopies / book.totalCopies) * 100;
  const isOutOfStock = book.availableCopies <= 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white relative flex flex-col md:flex-row -mx-4 -mt-4 w-[calc(100%+2rem)] overflow-hidden">
        
        {/* Massive Blurred Background */}
        <div className="absolute inset-0 z-0">
           <img src={book.coverUrl} className="w-full h-full object-cover opacity-30 blur-3xl scale-110" alt="" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/20"></div>
           <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent"></div>
        </div>

        {/* Content Wrapper */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-12 py-16 flex flex-col md:flex-row gap-12 lg:gap-20 items-center md:items-start">
          
          {/* Cover Art Image */}
          <div className="w-full md:w-1/3 max-w-[350px] shrink-0">
            <div className="rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative group">
              <img src={book.coverUrl} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" alt={book.title} />
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                   <div className="bg-red-500 text-white font-bold px-6 py-2 rounded-full uppercase tracking-widest text-sm transform -rotate-12">
                     Out of Stock
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Details & Actions */}
          <div className="w-full md:w-2/3 flex flex-col pt-4">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-teal-400 text-xs font-bold uppercase tracking-widest w-fit">
              <Box size={14} /> {book.genre}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 tracking-tighter leading-tight drop-shadow-lg">
              {book.title}
            </h1>
            
            <p className="text-2xl text-slate-300 font-medium mb-8">
              By <span className="text-white">{book.author}</span>
            </p>

            <div className="bg-[#111]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 md:p-8 mb-8 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-3">Synopsis</h3>
              <p className="text-slate-400 leading-relaxed text-lg mb-0">{book.description}</p>
            </div>

            {/* Inventory Scarcity System */}
            <div className="mb-8 p-6 bg-slate-900/50 border border-white/5 rounded-2xl w-full max-w-md backdrop-blur-md">
              <div className="flex justify-between items-end mb-3">
                <span className="text-sm font-bold text-slate-300 uppercase tracking-wider">Library Circulation</span>
                <span className="text-sm font-mono text-slate-400">{book.availableCopies} of {book.totalCopies} left</span>
              </div>
              
              <div className="w-full bg-black rounded-full h-3 mb-2 border border-white/10 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isOutOfStock ? 'bg-red-500' : scarcityPercentage < 30 ? 'bg-amber-500' : 'bg-teal-500'
                  }`} 
                  style={{ width: `${scarcityPercentage}%` }}
                ></div>
              </div>
              
              {scarcityPercentage > 0 && scarcityPercentage < 30 && (
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold mt-2">
                  <Clock size={14} /> High Demand. Borrow soon.
                </div>
              )}
            </div>

            {/* Smart Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center w-full max-w-md">
              {borrowState === 'idle' && (
                <button 
                  onClick={handleBorrow} 
                  disabled={isOutOfStock} 
                  className={`w-full py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-xl text-lg ${
                    isOutOfStock 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                      : 'bg-teal-500 text-black hover:bg-teal-400 border border-teal-400 shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_30px_rgba(45,212,191,0.4)] hover:-translate-y-1'
                  }`}
                >
                  <BookOpen size={22} className={isOutOfStock ? 'text-slate-500' : 'text-black'} /> 
                  {isOutOfStock ? 'Unavailable' : 'Borrow Book'}
                </button>
              )}

              {borrowState === 'loading' && (
                <button disabled className="w-full py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-3 bg-slate-800 text-white border border-white/20 transition-all duration-300 text-lg cursor-wait">
                  <Loader2 size={22} className="animate-spin text-teal-500" /> 
                  Processing Request...
                </button>
              )}

              {borrowState === 'success' && (
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-3 bg-green-500 text-black shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:bg-green-400 transition-all duration-300 hover:-translate-y-1 text-lg group"
                >
                  <CheckCircle size={22} className="text-black" /> 
                  Successfully Borrowed!
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              {borrowState === 'error' && (
                <button disabled className="w-full py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-2 bg-red-500/20 text-red-400 border border-red-500/50 transition-all duration-300 text-base flex-col">
                  <div className="flex items-center gap-2"><AlertCircle size={20} /> Error</div>
                  <span className="text-xs text-red-300/80 font-normal">{errorMsg}</span>
                </button>
              )}
              
              {borrowState === 'idle' && !isOutOfStock && (
                <p className="text-xs text-slate-500 w-full text-center sm:text-left mt-2 hidden sm:block">
                  Checkout valid for 14 days.
                </p>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
export default BookDetails;
