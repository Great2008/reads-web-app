import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, PlayCircle, Clock, Award } from 'lucide-react';
import { api } from '../../services/api';

const LearnModule = ({ subView, activeData, onNavigate, onUpdateWallet }) => {
  const [categories, setCategories] = useState([]);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    if (!categories.length) api.learn.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (subView === 'list' && activeData?.id) {
      api.learn.getLessons(activeData.id).then(setLessons);
    }
  }, [subView, activeData]);

  // 1. Categories View
  if (subView === 'categories') {
    return (
      <div className="space-y-4 animate-fade-in">
        <h2 className="text-2xl font-bold dark:text-white">Select Category</h2>
        <div className="grid gap-4">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => onNavigate('learn', 'list', cat)} className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm flex items-center justify-between group hover:ring-2 hover:ring-indigo-500 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${cat.color}`}>
                  {cat.name[0]}
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg dark:text-white">{cat.name}</h3>
                  <p className="text-xs text-gray-500">{cat.count} Lessons</p>
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-indigo-500" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // 2. Lesson List View
  if (subView === 'list') {
    return (
      <div className="space-y-4 animate-fade-in">
        <button onClick={() => onNavigate('learn', 'categories')} className="text-sm text-gray-500 flex items-center gap-1 hover:text-indigo-600"><ArrowLeft size={14} /> Back</button>
        <h2 className="text-2xl font-bold dark:text-white">{activeData.name} Lessons</h2>
        {lessons.length === 0 ? <p className="text-gray-500">No lessons found.</p> : (
          lessons.map((lesson, idx) => (
            <button key={lesson.id} onClick={() => onNavigate('learn', 'content', lesson)} className="w-full bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm flex items-center justify-between text-left hover:shadow-md transition-all">
              <div className="flex items-center gap-4">
                <span className="font-mono text-gray-300 text-xl font-bold">0{idx+1}</span>
                <div>
                  <h3 className="font-bold dark:text-white">{lesson.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <Clock size={12} /> {lesson.duration} • {lesson.subject}
                  </div>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center"><PlayCircle size={16}/></div>
            </button>
          ))
        )}
      </div>
    );
  }

  // 3. Lesson Content View
  if (subView === 'content') {
    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => onNavigate('learn', 'list', activeData.category)} className="text-sm text-gray-500 flex items-center gap-1 hover:text-indigo-600"><ArrowLeft size={14} /> Back to List</button>
        
        <div className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center relative group cursor-pointer overflow-hidden">
          <PlayCircle size={64} className="text-white/80 group-hover:scale-110 transition-transform z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <span className="absolute bottom-4 left-4 text-white font-bold z-10">{activeData.title}</span>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h3>Introduction</h3>
          <p className="text-gray-600 dark:text-gray-300">In this lesson, we will cover the fundamentals of {activeData.title}. Watch the video above and pay attention to the key formulas provided.</p>
        </div>

        <button onClick={() => {
          api.learn.completeLesson(activeData.id);
          onNavigate('learn', 'quiz', activeData);
        }} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex justify-center items-center gap-2">
          Complete & Take Quiz <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  // 4. Quiz View
  if (subView === 'quiz') {
    return <QuizComponent activeData={activeData} onNavigate={onNavigate} onUpdateWallet={onUpdateWallet} />;
  }
  
  return null;
};

const QuizComponent = ({ activeData, onNavigate, onUpdateWallet }) => {
    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const [earned, setEarned] = useState(0);
    
    // In real app, fetch quiz by lesson ID
    const questions = [
        { id: 1, q: "What is 2 + 2?", options: ["3", "4", "5"], a: 1 },
        { id: 2, q: "Is physics a science?", options: ["Yes", "No", "Maybe"], a: 0 },
    ];

    const handleAnswer = (idx) => {
      if (idx === questions[step].a) setScore(s => s + 1);
      if (step < questions.length - 1) {
        setStep(s => s + 1);
      } else {
        finishQuiz();
      }
    };

    const finishQuiz = async () => {
      // Calculate final score for logic before state update completes
      const finalScore = score + (questions[step].a === 0 ? 0 : 0); // Simplified
      const result = await api.learn.submitQuiz(activeData.id, finalScore);
      setEarned(result.earned);
      setFinished(true);
      onUpdateWallet(result.earned);
    };

    if (finished) {
      return (
        <div className="text-center py-10 animate-fade-in">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Award size={40} className="text-yellow-600" />
          </div>
          <h2 className="text-3xl font-bold dark:text-white mb-2">Quiz Complete!</h2>
          <p className="text-gray-500 mb-8">You scored {score}/{questions.length}</p>
          
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 p-6 rounded-2xl mb-8">
            <p className="text-sm text-green-600 dark:text-green-400 uppercase font-bold">Reward Earned</p>
            <p className="text-4xl font-bold text-green-700 dark:text-green-300 mt-2">+{earned} TKN</p>
          </div>

          <button onClick={() => onNavigate('wallet')} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mb-3">Check Wallet</button>
          <button onClick={() => onNavigate('learn', 'categories')} className="text-gray-500 text-sm">Back to Courses</button>
        </div>
      );
    }

    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold dark:text-white">Question {step + 1}/{questions.length}</h3>
          <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-xs font-bold">Timer: 30s</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8 dark:bg-slate-700"><div style={{width: `${((step+1)/questions.length)*100}%`}} className="h-2 bg-indigo-600 rounded-full transition-all" /></div>
        
        <h2 className="text-xl font-bold mb-8 dark:text-white">{questions[step].q}</h2>
        
        <div className="space-y-3">
          {questions[step].options.map((opt, i) => (
            <button key={i} onClick={() => handleAnswer(i)} className="w-full p-4 rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 text-left font-medium transition-colors dark:text-gray-200">
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
}

export default LearnModule;