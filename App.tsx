import React, { lazy } from 'react';
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

// Phase 2 Pages
const Profile = React.lazy(() => import('./pages/Profile'));
const About = React.lazy(() => import('./pages/About'));
const StudentDashboard = React.lazy(() => import('./pages/StudentDashboard'));
const TeacherDashboard = React.lazy(() => import('./pages/TeacherDashboard'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const StaffLogin = React.lazy(() => import('./pages/StaffLogin'));

// Tools
const Tools = lazy(() => import('./pages/Tools'));
const FormulaSheet = lazy(() => import('./pages/tools/FormulaSheet'));
const LogicGates = lazy(() => import('./pages/tools/LogicGates'));
const PeriodicTableTool = lazy(() => import('./pages/tools/PeriodicTableTool'));
const Constants = lazy(() => import('./pages/tools/Constants'));
const CalculatorTool = lazy(() => import('./pages/tools/CalculatorTool'));
const SafetyGuide = lazy(() => import('./pages/tools/SafetyGuide'));
const BioDiagrams = lazy(() => import('./pages/tools/BioDiagrams'));

import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './services/AuthContext';

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      <p className="text-sm text-slate-500 font-medium">Loading E-Prayog...</p>
    </div>
  </div>
);

const RoleLanding: React.FC = () => {
  const { role, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (role === 'Admin') return <AdminDashboard />;
  if (role === 'Teacher') return <TeacherDashboard />;
  return <StudentDashboard />;
};

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
                <Route path="/staff-login" element={<StaffLogin />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/about" element={<About />} />
                
                <Route path="/subjects" element={<Subjects />} />
                <Route path="/subjects/:subjectId" element={<SubjectView />} />
                <Route path="/subjects/:subjectId/:labId" element={<LabView />} />
                <Route path="/tutor" element={<TutorPage />} />
                
                {/* Protected Dashboards & Profile */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <RoleLanding />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
                <Route path="/tools/formula-sheet" element={<ProtectedRoute><FormulaSheet /></ProtectedRoute>} />
                <Route path="/tools/logic-gates" element={<ProtectedRoute><LogicGates /></ProtectedRoute>} />
                <Route path="/tools/periodic-table" element={<ProtectedRoute><PeriodicTableTool /></ProtectedRoute>} />
                <Route path="/tools/constants" element={<ProtectedRoute><Constants /></ProtectedRoute>} />
                <Route path="/tools/calculator" element={<ProtectedRoute><CalculatorTool /></ProtectedRoute>} />
                <Route path="/tools/safety-guide" element={<ProtectedRoute><SafetyGuide /></ProtectedRoute>} />
                <Route path="/tools/bio-diagrams" element={<ProtectedRoute><BioDiagrams /></ProtectedRoute>} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <RoleLanding />
                    </ProtectedRoute>
                  }
                />
                
                <Route path="/student-dashboard" element={<Navigate to="/dashboard" replace />} />
                <Route path="/teacher-dashboard" element={<Navigate to="/dashboard" replace />} />
                <Route path="/admin-dashboard" element={<Navigate to="/dashboard" replace />} />
                <Route path="/teacher" element={<Navigate to="/dashboard" replace />} />
                <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
                <Route path="/student" element={<Navigate to="/dashboard" replace />} />

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
