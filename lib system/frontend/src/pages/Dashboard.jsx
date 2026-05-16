import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Bell, LogOut, ArrowRight, Loader2, Library, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchDashboard = () => {
      api.get('/user/dashboard')
         .then(res => setData(res.data))
         .catch(err => {
             console.error('Dashboard Error:', err);
             setError(err.response?.data?.error || err.message || 'Failed to establish connection to Central Archives.');
         });
  };

  useEffect(() => { 
     if (!user) {
         navigate('/login');
         return;
     }
     fetchDashboard(); 
  }, [user, navigate]);

  const handleReturn = async (recordId) => {
    setProcessingId(recordId);
    try {
      await api.post('/return', { recordId });
      await fetchDashboard();
    } catch(err) {
      alert("Return protocol failed. Please contact admin.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  if (error) return (
     <div className="min-h-screen bg-black flex items-center flex-col justify-center gap-4 -mx-4 -mt-4 w-[calc(100%+2rem)] px-6">
        <AlertCircle size={64} className="text-red-500 mb-2" />
        <h2 className="text-3xl font-extrabold text-white text-center">Dashboard Disconnected</h2>
        <p className="text-slate-400 text-center max-w-md">{error}</p>
        <button onClick={handleLogout} className="mt-6 px-10 py-4 bg-[#1c1c1e] text-white rounded-xl font-bold border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all">
          Sign Out & Retry
        </button>
     </div>
  );

  if (!data) return (
     <div className="min-h-screen bg-black flex flex-col items-center justify-center -mx-4 -mt-4 w-[calc(100%+2rem)]">
        <Loader2 className="w-16 h-16 text-teal-500 animate-spin mb-6" />
        <p className="text-teal-400 font-bold tracking-widest uppercase text-sm animate-pulse">Syncing User Archives...</p>
     </div>
  );

  return (
    <PageTransition>
      <div className="w-full min-h-screen bg-black text-white px-6 md:px-12 xl:px-16 pt-8 pb-20 -mx-4 -mt-4 w-[calc(100%+2rem)]">
         
         {/* Welcome Banner */}
         <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-6 border-b border-white/5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-teal-400 text-xs font-bold uppercase tracking-widest">
                 <User size={14} /> Personal Interface
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                 Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">{user.name}</span>
              </h1>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#151515] text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-all border border-white/5"
            >
              <LogOut size={18} /> Sign Out
            </button>
         </div>

         {/* Analytic Metric Cards */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-teal-500/20 blur-2xl rounded-full group-hover:bg-teal-500/30 transition-all"></div>
               <Library size={24} className="text-teal-400 mb-4" />
               <p className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-1">Active Returns</p>
               <h2 className="text-5xl font-extrabold text-white">{data.stats.activeBooks}</h2>
            </div>
            
            <div className="bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/20 blur-2xl rounded-full group-hover:bg-indigo-500/30 transition-all"></div>
               <BookOpen size={24} className="text-indigo-400 mb-4" />
               <p className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-1">Libraries Read</p>
               <h2 className="text-5xl font-extrabold text-white">{data.stats.readBooks}</h2>
            </div>

            <div className="bg-[#111111]/80 backdrop-blur-xl border border-red-500/10 rounded-3xl p-8 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/20 blur-2xl rounded-full group-hover:bg-red-500/30 transition-all"></div>
               <AlertCircle size={24} className="text-red-400 mb-4" />
               <p className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-1">Unpaid Fines</p>
               <h2 className="text-5xl font-extrabold text-white">${data.stats.fines.toFixed(2)}</h2>
            </div>
         </div>

         {/* Content Grid */}
         <div className="flex flex-col lg:flex-row gap-10">
            
            {/* Active Borrowed Books */}
            <div className="w-full lg:w-2/3">
               <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                 <Library size={24} className="text-teal-500" /> Currently Borrowed
               </h3>
               
               {data.activeBorrows.length === 0 ? (
                 <div className="bg-[#151515] border border-white/5 rounded-3xl p-12 text-center shadow-inner">
                    <BookOpen size={48} className="mx-auto text-slate-700 mb-4" />
                    <h4 className="text-xl font-bold text-slate-300 mb-2">Your library is empty</h4>
                    <p className="text-slate-500 mb-6">You are not currently borrowing any physical textbooks or graphics novels.</p>
                    <button onClick={() => navigate('/books')} className="px-8 py-3 bg-teal-500 text-black font-bold rounded-full hover:bg-teal-400 transition-colors inline-flex items-center gap-2">
                       Explore Archive <ArrowRight size={18} />
                    </button>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {data.activeBorrows.map(record => (
                     <div key={record.id} className="bg-[#1c1c1e] border border-white/5 rounded-2xl flex items-center p-4 gap-6 group hover:border-teal-500/30 transition-colors">
                        <img src={record.coverUrl} className="w-16 md:w-20 rounded-lg shadow-md aspect-[2/3] object-cover" alt="" />
                        <div className="flex-1">
                           <h4 className="font-bold text-white text-lg line-clamp-1">{record.title}</h4>
                           <p className="text-slate-400 text-sm mb-2">{record.author}</p>
                           <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 rounded text-xs font-mono text-slate-300">
                             Due: {new Date(record.dueDate).toLocaleDateString()}
                           </div>
                        </div>
                        <button 
                          onClick={() => handleReturn(record.id)} 
                          disabled={processingId === record.id}
                          className="px-6 py-4 rounded-xl font-bold transition-all border border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-black shrink-0 disabled:opacity-50 flex items-center gap-2"
                        >
                          {processingId === record.id ? <Loader2 size={20} className="animate-spin" /> : "Return Asset"}
                        </button>
                     </div>
                   ))}
                 </div>
               )}
            </div>

            {/* Notifications Feed */}
            <div className="w-full lg:w-1/3">
               <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                 <Bell size={24} className="text-teal-500" /> Logs & Alerts
               </h3>
               
               <div className="bg-[#111] border border-white/5 rounded-3xl p-6 overflow-hidden relative">
                 {data.notifications.length === 0 ? (
                   <p className="text-slate-500 text-center py-10">No recent activity on your account.</p>
                 ) : (
                   <div className="space-y-6">
                     {data.notifications.map((notif, i) => (
                       <div key={notif.id} className={`flex gap-4 relative ${i !== data.notifications.length - 1 ? "after:content-[''] after:absolute after:left-1.5 after:-bottom-6 after:w-px after:h-4 after:bg-white/10" : ""}`}>
                         <div className="w-3 h-3 rounded-full bg-teal-500 mt-1.5 shadow-[0_0_10px_rgba(45,212,191,0.5)] shrink-0"></div>
                         <div>
                           <h5 className="font-bold text-slate-200 text-sm">{notif.title}</h5>
                           <p className="text-slate-400 text-sm mb-1">{notif.message}</p>
                           <span className="text-[10px] text-slate-600 font-mono">{new Date(notif.createdAt).toLocaleString()}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            </div>

         </div>
      </div>
    </PageTransition>
  );
};
export default Dashboard;
