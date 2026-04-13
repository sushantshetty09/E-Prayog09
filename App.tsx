import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIFloatingTutor from './components/AIFloatingTutor';

// Lazy-loaded pages
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'));
const Subjects = React.lazy(() => import('./pages/Subjects'));
const SubjectView = React.lazy(() => import('./pages/SubjectView'));
const LabView = React.lazy(() => import('./pages/LabView'));
const TutorPage = React.lazy(() => import('./pages/TutorPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-500 font-medium">Loading E-Prayog...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-white">
          <Navbar />
          <main className="flex-1">
            <React.Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/subjects/:subjectId" element={<SubjectView />} />
                <Route path="/subjects/:subjectId/:labId" element={<LabView />} />
                <Route path="/tutor" element={<TutorPage />} />
                <Route path="*" element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-display font-bold text-emerald-400 mb-4">404</h1>
                      <p className="text-slate-400 mb-6">Page not found</p>
                      <a href="/home" className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all">Go Home</a>
                    </div>
                  </div>
                } />
              </Routes>
            </React.Suspense>
          </main>
          <Footer />
          <AIFloatingTutor />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
