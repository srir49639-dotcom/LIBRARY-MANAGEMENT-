import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, CheckCircle, FileText, ChevronLeft, Award, HelpCircle, AlertCircle } from 'lucide-react';
import PageTransition from './PageTransition';

const MOCK_COURSE = {
  id: 1,
  title: "Premium Masterclass: Advanced Studies",
  instructor: "Dr. A. Sharma",
  progress: 25,
  modules: [
    { id: 1, title: "Module 1: Foundations & Concepts", duration: "45 min", completed: true },
    { id: 2, title: "Module 2: Advanced Strategies", duration: "1h 20m", completed: false },
    { id: 3, title: "Module 3: Expert Analysis", duration: "55 min", completed: false },
    { id: 4, title: "Module 4: Final Assessment", duration: "2h", completed: false }
  ],
  questions: [
    { id: 1, text: "Which of the following is the most optimal approach for solving complex strategic problems?", options: ["Brute Force", "Dynamic Programming", "Random Guessing", "Ignoring the problem"], correctIndex: 1, explanation: "Dynamic Programming breaks problems down into smaller subproblems." },
    { id: 2, text: "In macroeconomics, what does GDP stand for?", options: ["Gross Domestic Product", "General Data Protection", "Global Development Plan", "Gross Development Protocol"], correctIndex: 0, explanation: "GDP is the total market value of all finished goods and services." }
  ]
};

const CourseStudyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tutorials'); // 'tutorials' or 'practice'
  const [activeVideo, setActiveVideo] = useState(MOCK_COURSE.modules[1]);
  
  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (qId, optionIdx) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    MOCK_COURSE.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) score++;
    });
    return score;
  };

  return (
    <PageTransition>
      <div className="w-full min-h-screen bg-black pt-6 px-4 md:px-12 -mx-4 -mt-4 w-[calc(100%+2rem)] pb-20">
        
        {/* Header */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ChevronLeft size={20} /> Back to Dashboard
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-bold uppercase tracking-widest mb-3">
              <Award size={14} /> Official Curriculum
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">{MOCK_COURSE.title}</h1>
            <p className="text-slate-400 mt-2 font-medium">Instructor: {MOCK_COURSE.instructor}</p>
          </div>
          
          {/* Progress Bar */}
          <div className="bg-[#111] border border-white/10 rounded-xl p-4 w-full md:w-64">
            <div className="flex justify-between text-sm font-bold text-slate-300 mb-2">
              <span>Course Progress</span>
              <span className="text-teal-400">{MOCK_COURSE.progress}%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <div className="bg-gradient-to-r from-teal-500 to-indigo-500 h-2 rounded-full" style={{ width: `${MOCK_COURSE.progress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('tutorials')}
            className={`pb-4 px-2 text-lg font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'tutorials' ? 'border-teal-500 text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Video Tutorials
          </button>
          <button 
            onClick={() => setActiveTab('practice')}
            className={`pb-4 px-2 text-lg font-bold border-b-2 whitespace-nowrap transition-colors ${activeTab === 'practice' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Practice Exam
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'tutorials' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-[#0a0a0a] rounded-2xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl">
                {/* Simulated Video Thumbnail */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
                
                <button className="w-20 h-20 bg-teal-500/90 text-black rounded-full flex items-center justify-center relative z-10 hover:scale-110 transition-transform shadow-[0_0_30px_rgba(45,212,191,0.4)] group-hover:bg-teal-400">
                  <Play size={32} className="ml-2" />
                </button>
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white font-bold text-2xl">{activeVideo.title}</h3>
                </div>
              </div>
            </div>

            {/* Modules Sidebar */}
            <div className="bg-[#111] border border-white/5 rounded-2xl p-6 h-fit max-h-[600px] overflow-y-auto custom-scrollbar">
              <h3 className="text-xl font-bold text-white mb-6">Course Modules</h3>
              <div className="space-y-3">
                {MOCK_COURSE.modules.map(mod => (
                  <div 
                    key={mod.id}
                    onClick={() => setActiveVideo(mod)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all ${activeVideo.id === mod.id ? 'bg-teal-500/10 border-teal-500/30' : 'bg-black border-white/5 hover:border-white/20'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className={`font-bold text-sm ${activeVideo.id === mod.id ? 'text-teal-400' : 'text-slate-300'}`}>{mod.title}</h4>
                      {mod.completed && <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />}
                    </div>
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Play size={10} /> {mod.duration}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Practice Exam UI */}
            <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-white">Mock Assessment</h2>
                <div className="flex items-center gap-2 text-indigo-400 font-bold bg-indigo-500/10 px-4 py-2 rounded-lg">
                  <HelpCircle size={18} /> {MOCK_COURSE.questions.length} Questions
                </div>
              </div>

              <div className="space-y-12">
                {MOCK_COURSE.questions.map((q, idx) => (
                  <div key={q.id} className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-6"><span className="text-indigo-400 mr-2">Q{idx + 1}.</span> {q.text}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = selectedAnswers[q.id] === optIdx;
                        const isCorrect = q.correctIndex === optIdx;
                        
                        let btnClass = "p-4 rounded-xl border text-left font-semibold transition-all ";
                        
                        if (!showResults) {
                          btnClass += isSelected ? "bg-indigo-500/20 border-indigo-500 text-indigo-400" : "bg-black border-white/10 text-slate-300 hover:border-white/30";
                        } else {
                          if (isCorrect) {
                            btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-400";
                          } else if (isSelected && !isCorrect) {
                            btnClass += "bg-red-500/20 border-red-500 text-red-400";
                          } else {
                            btnClass += "bg-black border-white/5 text-slate-600 opacity-50";
                          }
                        }

                        return (
                          <button 
                            key={optIdx} 
                            onClick={() => handleAnswerSelect(q.id, optIdx)}
                            className={btnClass}
                            disabled={showResults}
                          >
                            <span className="inline-block w-6 text-slate-500 mr-2">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Explanation */}
                    {showResults && (
                      <div className={`mt-6 p-4 rounded-xl border ${selectedAnswers[q.id] === q.correctIndex ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                        <div className="flex items-start gap-3">
                          <AlertCircle size={20} className={selectedAnswers[q.id] === q.correctIndex ? 'text-emerald-500' : 'text-red-500'} />
                          <div>
                            <p className="font-bold text-white mb-1">
                              {selectedAnswers[q.id] === q.correctIndex ? 'Correct!' : 'Incorrect'}
                            </p>
                            <p className="text-sm text-slate-400 leading-relaxed">{q.explanation}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Submission */}
              <div className="mt-12 pt-8 border-t border-white/10 flex justify-end">
                {!showResults ? (
                  <button 
                    onClick={() => setShowResults(true)}
                    className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-indigo-500/25"
                    disabled={Object.keys(selectedAnswers).length < MOCK_COURSE.questions.length}
                  >
                    Submit Assessment
                  </button>
                ) : (
                  <div className="text-right">
                    <p className="text-slate-400 font-bold mb-2">Final Score</p>
                    <p className="text-5xl font-black text-white">{calculateScore()} <span className="text-2xl text-slate-600">/ {MOCK_COURSE.questions.length}</span></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
};

export default CourseStudyPage;
