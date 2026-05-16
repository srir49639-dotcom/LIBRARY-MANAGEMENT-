import { useState, useEffect } from 'react';
import { BookOpen, Edit2, Trash2, Plus, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../utils/api';
import PageTransition from '../components/PageTransition';

const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentBook, setCurrentBook] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    description: '',
    coverUrl: '',
    totalCopies: 1,
  });

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/books');
      setBooks(data);
    } catch (err) {
      setError('Failed to fetch books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpenModal = (mode, book = null) => {
    setModalMode(mode);
    if (mode === 'edit' && book) {
      setCurrentBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description,
        coverUrl: book.coverUrl,
        totalCopies: book.totalCopies,
        availableCopies: book.availableCopies
      });
    } else {
      setCurrentBook(null);
      setFormData({
        title: '',
        author: '',
        genre: '',
        description: '',
        coverUrl: '',
        totalCopies: 1,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentBook(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalCopies' || name === 'availableCopies' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === 'add') {
        await api.post('/books', formData);
      } else if (modalMode === 'edit' && currentBook) {
        await api.put(`/books/${currentBook.id}`, formData);
      }
      await fetchBooks();
      closeModal();
    } catch (err) {
      alert(err.response?.data?.error || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await api.delete(`/books/${id}`);
      await fetchBooks();
    } catch (err) {
      alert('Failed to delete book');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center -mx-4 -mt-4 w-[calc(100%+2rem)]">
        <Loader2 className="w-16 h-16 text-teal-500 animate-spin mb-6" />
        <p className="text-teal-400 font-bold tracking-widest uppercase text-sm animate-pulse">Loading Inventory...</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="w-full min-h-screen bg-black text-white px-6 md:px-12 xl:px-16 pt-8 pb-20 -mx-4 -mt-4 w-[calc(100%+2rem)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-6 border-b border-white/5">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Dashboard</span>
            </h1>
            <p className="text-slate-400">Manage the central library inventory</p>
          </div>
          <button 
            onClick={() => handleOpenModal('add')}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-indigo-500 text-white hover:bg-indigo-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          >
            <Plus size={20} /> Add New Book
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-slate-300 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4 font-bold">Book</th>
                  <th className="px-6 py-4 font-bold">Genre</th>
                  <th className="px-6 py-4 font-bold text-center">Total Copies</th>
                  <th className="px-6 py-4 font-bold text-center">Available</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {books.map(book => (
                  <tr key={book.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img src={book.coverUrl || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200'} alt="" className="w-12 h-16 object-cover rounded shadow-md" />
                      <div>
                        <p className="font-bold text-white text-base">{book.title}</p>
                        <p className="text-slate-400 text-xs">{book.author}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{book.genre}</td>
                    <td className="px-6 py-4 text-center font-mono text-slate-200">{book.totalCopies}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${book.availableCopies > 0 ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {book.availableCopies}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal('edit', book)} className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(book.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {books.length === 0 && (
               <div className="py-12 text-center text-slate-500 flex flex-col items-center">
                 <BookOpen size={48} className="mb-4 text-slate-700" />
                 <p>No books found in the inventory.</p>
               </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1c] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 relative">
              <h2 className="text-3xl font-extrabold text-white mb-6">
                {modalMode === 'add' ? 'Add New Book' : 'Edit Book'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Title</label>
                    <input type="text" name="title" required value={formData.title} onChange={handleFormChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Author</label>
                    <input type="text" name="author" required value={formData.author} onChange={handleFormChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Genre</label>
                    <input type="text" name="genre" required value={formData.genre} onChange={handleFormChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Copies</label>
                    <input type="number" min="0" name="totalCopies" required value={formData.totalCopies} onChange={handleFormChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none" />
                  </div>
                  {modalMode === 'edit' && (
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Available Copies</label>
                      <input type="number" min="0" name="availableCopies" required value={formData.availableCopies} onChange={handleFormChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none" />
                    </div>
                  )}
                  <div className={`space-y-2 ${modalMode === 'add' ? 'md:col-span-2' : ''}`}>
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon size={14} /> Cover Image URL
                    </label>
                    <input type="url" name="coverUrl" required placeholder="https://..." value={formData.coverUrl} onChange={handleFormChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Description</label>
                    <textarea name="description" rows="3" required value={formData.description} onChange={handleFormChange} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none resize-none"></textarea>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
                  <button type="button" onClick={closeModal} className="px-6 py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-400 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2">
                    {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                    {modalMode === 'add' ? 'Add Book' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
