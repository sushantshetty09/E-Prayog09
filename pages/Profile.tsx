import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { Loader2, CheckCircle2, User, Mail, Shield, ShieldCheck, GraduationCap, Calendar, Save, X, Edit3, Settings, BookOpen, Link2, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const AVATAR_COLORS = [
  'bg-slate-500', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 
  'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 
  'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-pink-500'
];

const SUBJECT_COLORS: Record<string, string> = {
  physics: 'bg-emerald-500',
  chemistry: 'bg-orange-500',
  biology: 'bg-purple-500',
  math: 'bg-blue-500',
  cs: 'bg-pink-500'
};

const Profile: React.FC = () => {
  const { user: authUser, loading: authLoading, profileData, role, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Teacher-linking state
  const [teacherCodeInput, setTeacherCodeInput] = useState('');
  const [linkingTeacher, setLinkingTeacher] = useState(false);
  const [linkedTeacherName, setLinkedTeacherName] = useState<string | null>(null);
  const [linkError, setLinkError] = useState('');
  const [linkSuccess, setLinkSuccess] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    grade: 'Not Specified',
    syllabus: 'Not Specified',
    institution: '',
    language: 'English',
    avatar: 'bg-emerald-500',
  });

  useEffect(() => {
    if (!authLoading && !authUser) {
      navigate('/login');
    } else if (profileData) {
      setFormData({
        full_name: profileData.full_name || authUser?.user_metadata?.full_name || '',
        grade: profileData.grade || 'Not Specified',
        syllabus: profileData.syllabus || 'Not Specified',
        institution: profileData.institution || '',
        language: profileData.language || 'English',
        avatar: (profileData.avatar && profileData.avatar.startsWith('bg-')) ? profileData.avatar : 'bg-emerald-500',
      });
      // If student is already linked to a teacher, resolve teacher name
      if (profileData.teacher_code && role === 'Student') {
        resolveTeacherName(profileData.teacher_code);
      }
    }
  }, [authUser, authLoading, profileData, navigate]);

  const resolveTeacherName = async (code: string) => {
    try {
      const { data } = await supabase
        .from('users')
        .select('name, full_name')
        .eq('class_code', code)
        .eq('role', 'Teacher')
        .single();
      if (data) setLinkedTeacherName(data.name || data.full_name);
    } catch { /* ignore */ }
  };

  const handleLinkTeacher = async () => {
    if (!authUser || !teacherCodeInput.trim()) return;
    setLinkingTeacher(true);
    setLinkError('');
    setLinkSuccess(false);
    const code = teacherCodeInput.trim().toUpperCase();
    try {
      // Verify the code belongs to a real teacher
      const { data: teacher, error: lookupErr } = await supabase
        .from('users')
        .select('full_name')
        .eq('class_code', code)
        .eq('role', 'Teacher')
        .single();
      if (lookupErr || !teacher) {
        setLinkError('Invalid class code. No teacher found with that code.');
        return;
      }
      // Save the teacher_code to the student's profile
      const { error } = await supabase
        .from('users')
        .update({ teacher_code: code })
        .eq('id', authUser.id);
      if (error) throw error;
      setLinkedTeacherName(teacher.full_name);
      setLinkSuccess(true);
      setTeacherCodeInput('');
      await refreshProfile();
      setTimeout(() => setLinkSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      setLinkError('Failed to link. Please try again.');
    } finally {
      setLinkingTeacher(false);
    }
  };

  const handleUnlinkTeacher = async () => {
    if (!authUser) return;
    try {
      await supabase.from('users').update({ teacher_code: null }).eq('id', authUser.id);
      setLinkedTeacherName(null);
      await refreshProfile();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!authUser) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name,
          grade: formData.grade,
          syllabus: formData.syllabus,
          institution: formData.institution,
          language: formData.language,
          avatar: formData.avatar,
        })
        .eq('id', authUser.id);
        
      if (error) throw error;
      
      await refreshProfile();
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      console.error(e);
      alert('Failed to save profile. Please make sure the database schema is updated.');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !profileData) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  const avatarUrl = profileData.avatar?.startsWith('http') ? profileData.avatar : (authUser?.user_metadata?.avatar_url);
  const createdDate = authUser?.created_at ? new Date(authUser.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown';

  const progress = profileData.progress || { physics: 0, chemistry: 0, biology: 0, math: 0, cs: 0 };

  return (
    <div className="pt-24 min-h-screen pb-12 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-white">Your Profile</h1>
        {saveSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
            <CheckCircle2 size={18} />
            <span className="text-sm font-bold">Profile Saved!</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: IDENTITY CARD */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <GlassCard className="flex flex-col items-center text-center p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full"></div>
            
            <div className={`w-32 h-32 rounded-full mb-6 flex items-center justify-center text-5xl font-bold text-white shadow-xl shadow-black/20 z-10 border-4 border-white/10 ${avatarUrl ? '' : formData.avatar}`}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                formData.full_name?.charAt(0)?.toUpperCase() || <User size={48} />
              )}
            </div>

            {isEditing && !avatarUrl && (
              <div className="w-full mb-6 z-10">
                <p className="text-xs text-slate-400 font-bold mb-2 uppercase">Theme Color</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {AVATAR_COLORS.map(color => (
                     <button
                       key={color}
                       onClick={() => setFormData({...formData, avatar: color})}
                       className={`w-6 h-6 rounded-full ${color} ${formData.avatar === color ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-100'} transition-all`}
                     />
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-2xl font-bold text-white mb-1 z-10">{formData.full_name || 'E-Prayog User'}</h2>
            
            <div className="flex items-center gap-2 text-sm font-medium z-10 mb-6">
              {role === 'Admin' ? (
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1"><ShieldCheck size={14}/> Admin</span>
              ) : role === 'Teacher' ? (
                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1"><BookOpen size={14}/> Teacher</span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1"><GraduationCap size={14}/> Student</span>
              )}
            </div>

            <div className="w-full space-y-3 text-sm z-10">
              <div className="flex items-center justify-between text-slate-400 bg-white/5 py-2 px-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-2"><Mail size={16} /> Email</div>
                <span className="text-white truncate max-w-[150px]" title={authUser?.email}>{authUser?.email}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 bg-white/5 py-2 px-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-2"><Shield size={16} /> User ID</div>
                <span className="text-white font-mono">{authUser?.id?.substring(0,8)}...</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 bg-white/5 py-2 px-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-2"><Calendar size={16} /> Joined</div>
                <span className="text-white">{createdDate}</span>
              </div>
            </div>
            
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="mt-6 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center justify-center gap-2 z-10"
              >
                <Edit3 size={18} /> Edit Profile
              </button>
            )}
          </GlassCard>

          {role === 'Admin' && (
            <GlassCard className="p-6 border-red-500/30 bg-red-500/5">
              <div className="flex flex-col items-center text-center">
                <ShieldCheck className="text-red-400 mb-2" size={32} />
                <h3 className="text-white font-bold mb-1">Admin Capabilities Active</h3>
                <p className="text-sm text-slate-400 mb-4">You have access to the unified administrative console.</p>
                <div className="w-full space-y-2">
                  <button onClick={() => navigate('/dashboard')} className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors">Go to Dashboard →</button>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* RIGHT COLUMN: DETAILS & PROGRESS */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Account Details */}
          <GlassCard className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white flex items-center gap-2"><Settings size={20} className="text-emerald-400" /> Account Settings</h2>
              {isEditing && (
                <div className="flex items-center gap-3">
                  <button onClick={() => {
                    setIsEditing(false);
                    // Revert changes
                    setFormData({
                      full_name: profileData.full_name || '',
                      grade: profileData.grade || 'Not Specified',
                      syllabus: profileData.syllabus || 'Not Specified',
                      institution: profileData.institution || '',
                      language: profileData.language || 'English',
                      avatar: (profileData.avatar && profileData.avatar.startsWith('bg-')) ? profileData.avatar : 'bg-emerald-500',
                    });
                  }} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-bold transition-colors">Cancel</button>
                  <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50">
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Display Name</label>
                {isEditing ? (
                  <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
                ) : (
                  <div className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-white cursor-not-allowed">{formData.full_name || 'Not set'}</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Institution / School</label>
                {isEditing ? (
                  <input type="text" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} placeholder="e.g. KV MG Railway Colony" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" />
                ) : (
                  <div className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-white cursor-not-allowed">{formData.institution || 'Not set'}</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Grade / Class</label>
                {isEditing ? (
                  <select value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 appearance-none">
                    <option value="Not Specified">Not Specified</option>
                    <option value="1st PUC / Class 11">1st PUC / Class 11</option>
                    <option value="2nd PUC / Class 12">2nd PUC / Class 12</option>
                  </select>
                ) : (
                  <div className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-white cursor-not-allowed">{formData.grade}</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Syllabus / Board</label>
                {isEditing ? (
                  <select value={formData.syllabus} onChange={e => setFormData({...formData, syllabus: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 appearance-none">
                    <option value="Not Specified">Not Specified</option>
                    <option value="Karnataka PUC">Karnataka PUC</option>
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                  </select>
                ) : (
                  <div className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-white cursor-not-allowed">{formData.syllabus}</div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Preferred Language</label>
                {isEditing ? (
                  <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 appearance-none">
                    <option value="English">English</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Hindi">Hindi</option>
                  </select>
                ) : (
                  <div className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-white cursor-not-allowed">{formData.language}</div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Teacher Linking Section (Students only) */}
          {(role === 'Student') && (
            <GlassCard className="p-8 border-amber-500/20 bg-amber-500/5">
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Link2 size={20} className="text-amber-400" /> Link to Teacher
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                Enter your teacher's 6-character class code to link your progress.
              </p>

              {profileData?.teacher_code && linkedTeacherName ? (
                <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-green-300 font-bold">Linked to {linkedTeacherName}</p>
                      <p className="text-xs text-green-400/60 font-mono">Code: {profileData.teacher_code}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleUnlinkTeacher}
                    className="px-4 py-2 rounded-xl bg-white/5 text-slate-400 border border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 text-sm font-bold transition-all"
                  >
                    Unlink
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                      type="text"
                      maxLength={6}
                      value={teacherCodeInput}
                      onChange={e => { setTeacherCodeInput(e.target.value.toUpperCase()); setLinkError(''); }}
                      placeholder="e.g. AB3K7M"
                      className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-lg tracking-[0.2em] placeholder-slate-600 focus:outline-none focus:border-amber-500/50 uppercase"
                    />
                  </div>
                  <button
                    onClick={handleLinkTeacher}
                    disabled={linkingTeacher || teacherCodeInput.length < 6}
                    className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-all flex items-center gap-2 disabled:opacity-40 shrink-0"
                  >
                    {linkingTeacher ? <Loader2 className="animate-spin" size={18} /> : <Link2 size={18} />}
                    Link
                  </button>
                </div>
              )}

              {linkError && (
                <p className="mt-3 text-sm text-red-400 font-bold">{linkError}</p>
              )}
              {linkSuccess && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-sm text-green-400 font-bold flex items-center gap-1">
                  <CheckCircle2 size={14} /> Successfully linked!
                </motion.p>
              )}
            </GlassCard>
          )}

          {/* Progress Overview Section */}
          <GlassCard className="p-8">
            <h2 className="text-xl font-bold text-white mb-6">Subject Progress Overview</h2>
            
            <div className="space-y-6">
              {Object.entries(progress).map(([subject, val]: [string, any]) => {
                const colorClass = SUBJECT_COLORS[subject.toLowerCase()] || 'bg-emerald-500';
                const percentage = Math.min(100, Math.max(0, parseInt(val) || 0));
                
                return (
                  <div key={subject}>
                    <div className="flex justify-between mb-2">
                       <span className="text-sm font-bold text-slate-300 capitalize">{subject}</span>
                       <span className="text-sm font-mono text-slate-400">{percentage}%</span>
                    </div>
                    <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${colorClass} shadow-[0_0_10px_currentColor] opacity-80`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

        </div>
      </div>
    </div>
  );
};

export default Profile;
