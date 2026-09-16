'use client';

import React, { useState } from 'react';
import GlassCard from '../../../components/GlassCard';
import { Calendar, BookOpen, Clock, ListTodo, Plus, Trash } from 'lucide-react';

const EXAM_DATA: Record<string, { name: string; date: string; syllabus: string[]; duration: string; details: string }> = {
  jee: {
    name: "JEE Main & Advanced",
    date: "April & May 2027",
    duration: "3 Hours",
    syllabus: ["Physics (Mechanics, Electrodynamics)", "Chemistry (Organic, Inorganic, Physical)", "Mathematics (Calculus, Algebra, Coordinate Geometry)"],
    details: "Premium engineering gate to IITs and NITs. Requires intensive numerical problem solving."
  },
  neet: {
    name: "NEET UG",
    date: "May 2027",
    duration: "3 Hours 20 Min",
    syllabus: ["Biology (Botany, Zoology, Genetics)", "Physics (Kinematics, Thermodynamics)", "Chemistry (Organic compounds, Equilibrium)"],
    details: "Single entrance window for medical programs (MBBS/BDS) in India."
  },
  clat: {
    name: "CLAT (Common Law Admission Test)",
    date: "December 2026",
    duration: "2 Hours",
    syllabus: ["Legal Reasoning", "Logical Reasoning", "English Comprehension", "Quantitative Techniques", "General Knowledge"],
    details: "National law admission gate to premium NLUs. Focuses on speed reading and arguments analysis."
  },
  cat: {
    name: "CAT (Common Admission Test)",
    date: "November 2026",
    duration: "2 Hours",
    syllabus: ["Quantitative Aptitude (QA)", "Data Interpretation & Logical Reasoning (DILR)", "Verbal Ability & Reading Comprehension (VARC)"],
    details: "Gate to elite Indian Institutes of Management (IIMs). Requires deep analytical capabilities."
  },
  uceed: {
    name: "UCEED (Undergraduate Common Entrance Examination for Design)",
    date: "January 2027",
    duration: "3 Hours",
    syllabus: ["Visualization and Spatial Ability", "Observation and Design Sensitivity", "Analytical and Logical Reasoning", "Drawing Skills"],
    details: "Design gateway to IIT Bombay, IIT Guwahati, IIITDM Jabalpur and others."
  }
};

export default function EntranceExamsPage() {
  const [activeTab, setActiveTab] = useState('jee');
  
  // Custom Study Planner State
  const [todos, setTodos] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Solve past 5 years JEE rotation mechanics papers', done: false },
    { id: '2', text: 'Revise coordinate chemistry reactions notes', done: true }
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setTodos(prev => [...prev, { id: Math.random().toString(), text: newTodo, done: false }]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTodo = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const exam = EXAM_DATA[activeTab];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <Calendar className="w-8 h-8 text-indigo-400" />
          Entrance Exam Navigator
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Track syllabus outlines, exam timelines, and manage your custom study checklist.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {Object.entries(EXAM_DATA).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              activeTab === key
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-neon-purple'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            {value.name.split(' ')[0]} {/* first name abbreviation */}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Exam Details */}
        <div className="lg:col-span-3 space-y-6">
          <GlassCard glowColor="purple" className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest block">Exam Specsheet</span>
                <h2 className="text-2xl font-black text-white mt-1">{exam.name}</h2>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-3 py-1 rounded-full font-bold">
                📅 {exam.date}
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
              {exam.details}
            </p>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-400" /> Core Syllabus Segments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {exam.syllabus.map((s, idx) => (
                  <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-slate-200">
                    {s}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold font-mono">
              <Clock className="w-4 h-4 text-slate-500" /> Exam duration: {exam.duration}
            </div>
          </GlassCard>
        </div>

        {/* Right: Study Planner Widget */}
        <GlassCard glowColor="cyan" className="lg:col-span-2 space-y-5 h-fit">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-cyan-400" />
            Study Prep Planner
          </h2>

          <form onSubmit={addTodo} className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="e.g. Read legal torts section"
              className="flex-grow px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {todos.map(t => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTodo(t.id)}
                    className="w-4 h-4 rounded border-white/10 bg-[#0d0826] checked:bg-indigo-600 focus:ring-0 cursor-pointer"
                  />
                  <span className={`text-xs text-slate-300 ${t.done ? 'line-through text-slate-500' : ''}`}>
                    {t.text}
                  </span>
                </div>
                <button
                  onClick={() => removeTodo(t.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-all"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {todos.length === 0 && (
              <p className="text-center text-xs text-slate-500 py-6">Your scheduler queue is empty!</p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
