'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '../../../context/store';
import GlassCard from '../../../components/GlassCard';
import { UserCheck, Users, Calendar, Clock, BookOpen, AlertCircle } from 'lucide-react';

export default function CounselorDashboardPage() {
  const { token, apiUrl } = useStore();
  const [students, setStudents] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch Students list
        const resStud = await fetch(`${apiUrl}/api/counselor/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataStud = await resStud.json();
        if (resStud.ok) setStudents(dataStud);

        // Fetch Appointments list
        const resAppt = await fetch(`${apiUrl}/api/counselor/appointments`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dataAppt = await resAppt.json();
        if (resAppt.ok) setAppointments(dataAppt);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [token, apiUrl]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
          <UserCheck className="w-8 h-8 text-indigo-400" />
          Counselor Consultation Desk
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review student diagnostics, access appointments schedule, and post study guidelines.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-indigo-400 animate-pulse text-sm">
          📂 Syncing counselor databases...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Student Roster */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard glowColor="purple" className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                Active Student Roster ({students.length})
              </h2>
              
              <div className="space-y-3">
                {students.map((stud, idx) => (
                  <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-white text-sm">{stud.fullName}</p>
                      <p className="text-slate-400">{stud.school} • Grade {stud.grade}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-[10px] font-bold text-indigo-300 uppercase bg-indigo-950/40 px-2 py-0.5 rounded-full border border-indigo-500/25">
                        {stud.xp} XP
                      </span>
                      <p className="text-[10px] text-slate-500 font-mono">Streak: {stud.streak} Days</p>
                    </div>
                  </div>
                ))}
                {students.length === 0 && (
                  <p className="text-center text-slate-500 py-6">No enrolled student records found.</p>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Appointments Planner */}
          <div className="space-y-6">
            <GlassCard glowColor="cyan" className="p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                Appointments Calendar ({appointments.length})
              </h2>

              <div className="space-y-3">
                {appointments.map((appt, idx) => (
                  <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">{appt.studentName}</span>
                      <span className="text-[10px] text-cyan-300 font-mono bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-500/20 uppercase">
                        {appt.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 text-[10px] font-mono">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-cyan-400" /> {appt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-cyan-400" /> {appt.time}</span>
                    </div>
                    {appt.notes && (
                      <p className="text-[10px] text-slate-500 italic bg-black/40 p-2 rounded">
                        Notes: {appt.notes}
                      </p>
                    )}
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div className="text-center py-8 text-slate-500 space-y-2">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs">No pending consultation bookings logged.</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

        </div>
      )}
    </div>
  );
}
