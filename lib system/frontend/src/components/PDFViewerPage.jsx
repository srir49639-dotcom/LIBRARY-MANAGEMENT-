import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, ZoomIn, ZoomOut, Maximize, FileText, ChevronRight, Bookmark } from 'lucide-react';
import PageTransition from './PageTransition';

const PDFViewerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const totalPages = 342;

  return (
    <PageTransition>
      <div className="w-full min-h-screen bg-[#050505] pt-4 px-4 md:px-8 -mx-4 -mt-4 w-[calc(100%+2rem)] pb-10 flex flex-col">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-6">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="text-teal-400" /> Document Preview
              </h1>
              <p className="text-sm text-slate-400">Viewing PDF ID: {id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors">
              <Bookmark size={18} /> Bookmark
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-lg transition-colors shadow-[0_0_15px_rgba(45,212,191,0.3)]">
              <Download size={18} /> Download PDF
            </button>
          </div>
        </div>

        {/* Toolbar & Viewer Container */}
        <div className="flex-1 flex flex-col md:flex-row gap-6">
          
          {/* Main Viewer Area */}
          <div className="flex-1 bg-[#111] border border-white/5 rounded-2xl flex flex-col relative overflow-hidden shadow-2xl">
            {/* PDF Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-white/5 bg-black/50 backdrop-blur-md z-10">
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-white transition-colors"><ZoomOut size={18} /></button>
                <span className="text-sm font-bold text-slate-300 w-12 text-center">100%</span>
                <button className="p-2 text-slate-400 hover:text-white transition-colors"><ZoomIn size={18} /></button>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className="p-1 text-slate-400 hover:text-teal-400 transition-colors disabled:opacity-30"
                  disabled={page === 1}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm font-mono text-slate-300">
                  <input 
                    type="number" 
                    value={page} 
                    onChange={(e) => setPage(Number(e.target.value))}
                    className="w-12 bg-black border border-white/10 rounded px-1 py-0.5 text-center text-white focus:outline-none focus:border-teal-500 mr-1" 
                  /> 
                  / {totalPages}
                </span>
                <button 
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  className="p-1 text-slate-400 hover:text-teal-400 transition-colors disabled:opacity-30"
                  disabled={page === totalPages}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <button className="p-2 text-slate-400 hover:text-white transition-colors"><Maximize size={18} /></button>
            </div>

            {/* Mock PDF Page Render */}
            <div className="flex-1 flex items-center justify-center bg-[#0a0a0a] p-4 md:p-8 overflow-y-auto">
              <div className="w-full max-w-3xl aspect-[1/1.4] bg-white rounded shadow-[0_0_30px_rgba(0,0,0,0.5)] p-12 flex flex-col relative group">
                <h2 className="text-4xl font-serif font-bold text-slate-800 border-b-2 border-slate-200 pb-6 mb-8">Chapter {page}: Introduction</h2>
                <div className="space-y-4">
                  <div className="w-full h-4 bg-slate-200 rounded"></div>
                  <div className="w-full h-4 bg-slate-200 rounded"></div>
                  <div className="w-11/12 h-4 bg-slate-200 rounded"></div>
                  <div className="w-full h-4 bg-slate-200 rounded"></div>
                  <div className="w-3/4 h-4 bg-slate-200 rounded mb-8"></div>
                  
                  <div className="w-full aspect-video bg-slate-100 border border-slate-200 rounded flex items-center justify-center text-slate-400 mb-8">
                     [Figure {page}.1]
                  </div>

                  <div className="w-full h-4 bg-slate-200 rounded"></div>
                  <div className="w-full h-4 bg-slate-200 rounded"></div>
                  <div className="w-5/6 h-4 bg-slate-200 rounded"></div>
                </div>
                
                {/* Watermark overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                   <h1 className="text-6xl font-black text-black -rotate-45">LUMINA PREVIEW</h1>
                </div>
              </div>
            </div>
          </div>
          
          {/* Thumbnails Sidebar */}
          <div className="w-full md:w-64 bg-[#111] border border-white/5 rounded-2xl p-4 hidden lg:flex flex-col">
            <h3 className="font-bold text-white mb-4">Contents</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
               {[1, 2, 3, 4, 5, 6].map(p => (
                 <div 
                   key={p} 
                   onClick={() => setPage(p)}
                   className={`aspect-[1/1.4] w-full rounded cursor-pointer border-2 transition-all p-2 flex flex-col items-center justify-center bg-white ${page === p ? 'border-teal-500 shadow-[0_0_15px_rgba(45,212,191,0.2)]' : 'border-transparent opacity-50 hover:opacity-100'}`}
                 >
                    <div className="w-full h-1 bg-slate-200 mb-1"></div>
                    <div className="w-full h-1 bg-slate-200 mb-1"></div>
                    <div className="w-3/4 h-1 bg-slate-200"></div>
                    <span className="mt-auto text-[10px] font-bold text-slate-400">{p}</span>
                 </div>
               ))}
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default PDFViewerPage;
