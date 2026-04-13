import React, { useState, useEffect } from 'react';
import { useAuth } from '../services/AuthContext';
import { supabase } from '../services/supabase';
import { UserProfile } from '../types';
import GlassCard from '../components/GlassCard';
import { Link } from 'react-router-dom';
import { Shield, Users, GraduationCap, BookOpen, FlaskConical, Search, MoreVertical, ShieldCheck, Trash2, Settings, TrendingUp, Filter, Check, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type TabType = 'users' | 'analytics' | 'labs' | 'settings';

const AdminDashboard: React.FC = () => {
  const { profileData, user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('users');
  
  // Users Tab State
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data as UserProfile[]);
    } catch (e) {
      console.error('Error fetching users:', e);
    } finally {
      setLoadingUsers(false);
    }
  };

  const changeRole = async (uid: string, newRole: string) => {
    if (!window.confirm(`Change this user's role to ${newRole}?`)) return;
    try {
      await supabase.from('users').update({ role: newRole }).eq('id', uid);
      setUsers(users.map(u => u.id === uid ? { ...u, role: newRole } : u));
    } catch (e) {
      console.error(e);
      alert("Failed to update role");
    }
    setActiveMenuId(null);
  };

  const deleteUser = async (uid: string) => {
    if (!window.confirm("WARNING: Are you sure you want to delete this user? This cannot be undone.")) return;
    try {
      // Typically deletion requires Supabase Admin API, but we'll try to delete from public table
      // In a real prod environment, you'd call an Edge Function to delete the auth account.
      await supabase.from('users').delete().eq('id', uid);
      setUsers(users.filter(u => u.id !== uid));
    } catch (e) {
      console.error(e);
      alert("Failed to delete user. You may need to delete them from the Supabase dashboard directly.");
    }
    setActiveMenuId(null);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      
      {/* Dashboards combined, no switcher needed */}

      {/* HEADER */}
      <GlassCard className="p-6 md:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-emerald-500/20 bg-emerald-500/5 overflow-hidden relative">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full"></div>
        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Shield className="text-emerald-400" size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">Admin Control Panel</h1>
            <p className="text-emerald-400/80">Welcome back, {profileData?.full_name?.split(' ')[0] || 'Admin'}</p>
          </div>
        </div>
        <div className="z-10 px-4 py-2 rounded-xl bg-black/20 border border-white/5 text-sm font-medium text-slate-300">
          E-Prayog Platform
        </div>
      </GlassCard>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <StatsCard icon={<Users />} title="Total Users" value={users.length || "240"} trend="+12 this week" color="blue" />
         <StatsCard icon={<GraduationCap />} title="Active Students" value={users.filter(u => u.role === 'Student').length || "215"} trend="+8 this week" color="emerald" />
         <StatsCard icon={<BookOpen />} title="Teachers" value={users.filter(u => u.role === 'Teacher').length || "21"} trend="+2 this week" color="purple" />
         <StatsCard icon={<FlaskConical />} title="Labs Completed" value="1,842" trend="+154 this week" color="amber" />
      </div>

      {/* TABS */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2 no-scrollbar">
        {(['users', 'analytics', 'labs', 'settings'] as TabType[]).map(tab => (
           <button
             key={tab}
             type="button"
             onClick={() => setActiveTab(tab)}
             className={`px-6 py-3 rounded-full text-sm font-bold capitalize transition-all whitespace-nowrap ${
               activeTab === tab ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
             }`}
           >
             {tab}
           </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <GlassCard className="p-6 overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search users by name or email..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50" 
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-500" />
                    <select 
                      value={roleFilter} 
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="bg-black/20 border border-white/5 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500/50 appearance-none min-w-[150px]"
                    >
                      <option value="All">All Roles</option>
                      <option value="Student">Student</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 text-xs uppercase text-slate-500">
                        <th className="pb-3 px-4 font-bold">User</th>
                        <th className="pb-3 px-4 font-bold">Role</th>
                        <th className="pb-3 px-4 font-bold hidden md:table-cell">Details</th>
                        <th className="pb-3 px-4 font-bold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingUsers ? (
                        <tr><td colSpan={4} className="py-12 text-center text-slate-500"><Loader2 className="animate-spin inline-block mr-2" size={20} /> Loading users...</td></tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr><td colSpan={4} className="py-12 text-center text-slate-500">No users found matching criteria.</td></tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="py-4 px-4 relative">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${u.avatar || 'bg-slate-600'}`}>
                                  {u.full_name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-bold text-white text-sm">{u.full_name || 'Unnamed'}</div>
                                  <div className="text-xs text-slate-400">{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 relative">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                u.role === 'Admin' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                u.role === 'Teacher' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                                'bg-blue-500/10 text-blue-400 border-blue-500/20'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-4 px-4 relative hidden md:table-cell">
                              <div className="text-xs text-slate-300">{u.syllabus?.replace('Not Specified', 'Unknown Board')}</div>
                              <div className="text-xs text-slate-500">{u.grade?.replace('Not Specified', 'Unknown Grade')}</div>
                            </td>
                            <td className="py-4 px-4 relative text-center">
                              <button 
                                onClick={() => setActiveMenuId(activeMenuId === u.id ? null : u.id)}
                                className="p-2 rounded-lg hover:bg-white/10 text-slate-400 transition-colors"
                              >
                                <MoreVertical size={16} />
                              </button>

                              {activeMenuId === u.id && (
                                <div className="absolute right-8 top-10 w-48 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20">
                                  <div className="p-1">
                                    {u.role !== 'Teacher' && <button onClick={() => changeRole(u.id, 'Teacher')} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg">Promote to Teacher</button>}
                                    {u.role !== 'Admin' && <button onClick={() => changeRole(u.id, 'Admin')} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg">Promote to Admin</button>}
                                    {u.role !== 'Student' && <button onClick={() => changeRole(u.id, 'Student')} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg">Demote to Student</button>}
                                    <hr className="border-white/5 my-1" />
                                    <button onClick={() => deleteUser(u.id)} className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center justify-between">
                                      Delete User <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold text-white mb-6">Lab Completion by Subject</h3>
                  <div className="flex items-end h-48 gap-4 px-4">
                    {[
                      { name: 'Phy', val: 75, col: 'bg-emerald-500' },
                      { name: 'Chem', val: 56, col: 'bg-orange-500' },
                      { name: 'Bio', val: 89, col: 'bg-purple-500' },
                      { name: 'Math', val: 34, col: 'bg-blue-500' },
                      { name: 'CS', val: 65, col: 'bg-pink-500' }
                    ].map(bar => (
                      <div key={bar.name} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full bg-black/20 rounded-t-lg relative flex items-end overflow-hidden flex-1 group-hover:bg-white/5 transition-colors">
                          <motion.div 
                            initial={{ height: 0 }} animate={{ height: `${bar.val}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                            className={`w-full ${bar.col} rounded-t-sm opacity-80`}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">{bar.name}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
                
                <GlassCard className="p-6">
                  <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                    Most Popular Experiments
                    <TrendingUp size={18} className="text-emerald-400" />
                  </h3>
                  <div className="space-y-4">
                    {[
                      { name: "Ohm's Law Verification", count: 482, sub: "Physics" },
                      { name: "Titration Analysis", count: 356, sub: "Chemistry" },
                      { name: "Microscope Familiarization", count: 298, sub: "Biology" },
                      { name: "Logic Gates Simulator", count: 245, sub: "CS" }
                    ].map((lab, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <div>
                           <div className="text-sm font-bold text-white">{lab.name}</div>
                           <div className="text-xs text-slate-500">{lab.sub}</div>
                        </div>
                        <div className="text-sm text-emerald-400 font-mono font-bold">{lab.count} plays</div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {activeTab === 'labs' && (
             <motion.div key="labs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {['Physics', 'Chemistry', 'Biology', 'Mathematics', 'Computer Science'].map((sub, i) => (
                 <GlassCard key={sub} className="p-6">
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="font-bold text-white text-lg">{sub}</h3>
                     <FlaskConical className="text-slate-500" size={20} />
                   </div>
                   <p className="text-3xl font-display font-bold text-emerald-400 mb-4">{15 + i * 2} Labs</p>
                   <div className="flex items-center justify-between bg-black/20 p-2 rounded-xl">
                      <span className="text-sm font-medium text-slate-400 pl-2">Status</span>
                      <button className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/20">
                        <Check size={14} /> Published
                      </button>
                   </div>
                 </GlassCard>
               ))}
             </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <GlassCard className="p-8 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
                   <Settings className="text-emerald-400" size={24} />
                   <h2 className="text-xl font-bold text-white">Platform Settings</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Platform Name</label>
                    <input type="text" defaultValue="E-Prayog" className="w-full bg-black/20 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-400 mb-2">Default Language</label>
                    <select className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 appearance-none">
                      <option>English</option>
                      <option>Kannada</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                  
                  <div className="pt-4 space-y-4">
                    {[
                      { label: "Allow Google Login", defaultChecked: true },
                      { label: "Allow New Registrations", defaultChecked: true },
                      { label: "Maintenance Mode", defaultChecked: false }
                    ].map(toggle => (
                      <div key={toggle.label} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-sm font-bold text-white">{toggle.label}</span>
                        <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${toggle.defaultChecked ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-transform ${toggle.defaultChecked ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-4 mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors">
                    Save Configuration (Mock)
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

const StatsCard = ({ icon, title, value, trend, color }: { icon: React.ReactNode, title: string, value: string, trend: string, color: 'blue'|'emerald'|'purple'|'amber' }) => {
  const colorMap = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl border ${colorMap[color]}`}>
          {React.cloneElement(icon as React.ReactElement, { size: 24 })}
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">{trend}</span>
      </div>
      <div className="text-3xl font-display font-bold text-white mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-400">{title}</div>
    </GlassCard>
  );
};

export default AdminDashboard;
