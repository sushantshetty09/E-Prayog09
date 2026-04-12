import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, FlaskConical, LogIn, LogOut, User } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { AnimatePresence, motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { useAuth } from '../services/AuthContext';

const MotionSpan = motion.span as any;

const TITLES = [
  { text: "E-Prayog", lang: "en" },
  { text: "ಇ-ಪ್ರಯೋಗ", lang: "kn" },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [titleIndex, setTitleIndex] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % TITLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-nav h-20 px-6 md:px-12 flex items-center justify-between transition-colors duration-300">
      <Link to="/home" className="flex items-center gap-3 group min-w-[200px]">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-30 group-hover:opacity-60 transition-opacity"></div>
          <FlaskConical className="w-10 h-10 text-emerald-600 dark:text-emerald-400 relative z-10 transition-colors group-hover:rotate-12 duration-500 ease-in-out" />
        </div>
        <div className="flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <MotionSpan
              key={titleIndex}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight leading-none"
            >
              {TITLES[titleIndex].lang === 'en' ? (
                <>E-<span className="text-emerald-600 dark:text-emerald-400">Prayog</span></>
              ) : (
                <>ಇ-<span className="text-emerald-600 dark:text-emerald-400">ಪ್ರಯೋಗ</span></>
              )}
            </MotionSpan>
          </AnimatePresence>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`relative text-sm font-medium transition-colors duration-300 ${isActive(item.path)
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300'
              }`}
          >
            {item.label}
            {isActive(item.path) && (
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </Link>
        ))}
        {user && (
          <Link
            to={role === 'Teacher' ? '/teacher-dashboard' : '/student-dashboard'}
            className={`relative text-sm font-medium transition-colors duration-300 ${isActive('/student-dashboard') || isActive('/teacher-dashboard')
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300'
              }`}
          >
            Dashboard
            {(isActive('/student-dashboard') || isActive('/teacher-dashboard')) && (
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </Link>
        )}
      </div>

      <div className="hidden md:flex items-center">
        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/profile" aria-label="View Profile" className="group flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                  {user.displayName?.charAt(0) || <User size={14} />}
                </div>
              )}
              <span className="text-sm text-slate-600 dark:text-gray-400 hidden lg:inline">
                {user.displayName?.split(' ')[0] || 'Profile'}
              </span>
            </Link>
            <button onClick={handleLogout} aria-label="Logout" className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 hover:bg-red-500/10 text-sm font-bold transition-all flex items-center gap-2">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link to="/login">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white">
              <LogIn size={16} /> Log In
            </button>
          </Link>
        )}
      </div>

      <button className="md:hidden p-2 -mr-2 text-slate-600 dark:text-gray-400" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close menu" : "Open menu"}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <div className="absolute top-20 left-0 w-full glass-nav flex flex-col p-6 gap-4 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className="text-lg font-medium">{item.label}</Link>
          ))}
          <hr className="border-white/10" />
          {user ? (
            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-600/10 text-red-600 font-bold">
              <LogOut size={18} /> Log Out
            </button>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600 text-white font-bold">
              <LogIn size={18} /> Log In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
