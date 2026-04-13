import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import { FlaskConical, Bot, GraduationCap, ShieldCheck, Languages, Trophy, Heart, ArrowRight, Atom, Zap, Dna, Calculator, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { SUBJECTS } from '../constants';

const MotionDiv = motion.div as any;

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const FEATURES = [
  { icon: <FlaskConical size={28} />, title: '2D Interactive Simulations', desc: 'All experiments run in the browser — no WebGL, no downloads.', color: 'emerald' },
  { icon: <Bot size={28} />, title: 'AI Science Tutor', desc: 'Ask doubts in English, Kannada, or Hindi — powered by Gemini.', color: 'amber' },
  { icon: <GraduationCap size={28} />, title: 'Karnataka PUC Aligned', desc: 'Covers both 1st and 2nd PUC syllabus for all 5 science subjects.', color: 'blue' },
  { icon: <ShieldCheck size={28} />, title: 'Safe & Accessible', desc: 'No chemicals, no risk — experiment anytime, anywhere.', color: 'purple' },
  { icon: <Languages size={28} />, title: 'Multilingual Support', desc: 'Full English, Kannada, and Hindi support throughout.', color: 'cyan' },
  { icon: <Trophy size={28} />, title: 'Gamified Learning', desc: 'Quizzes, viva voce, assignments, and completion tracking.', color: 'rose' },
];

const SUBJECT_ICON_MAP: Record<string, React.ReactNode> = {
  Physics: <Zap size={28} />,
  Chemistry: <FlaskConical size={28} />,
  Biology: <Dna size={28} />,
  Math: <Calculator size={28} />,
  CS: <Monitor size={28} />,
};

const SUBJECT_COLOR_MAP: Record<string, string> = {
  Physics: 'emerald',
  Chemistry: 'amber',
  Biology: 'purple',
  Math: 'blue',
  CS: 'rose',
};

const SUBJECT_DESCRIPTIONS: Record<string, string> = {
  Physics: 'Electricity, optics, mechanics, and modern physics experiments.',
  Chemistry: 'Titrations, qualitative analysis, and organic reactions.',
  Biology: 'Microscopy, plant anatomy, genetics, and enzymology.',
  Math: 'Probability, calculus demonstrations, and geometric proofs.',
  CS: 'Logic gates, sorting algorithms, and data structure visualizations.',
};

const About: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating Background Decorations */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-40 left-20 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-blue-500/5 blur-[100px] rounded-full" style={{ animationDuration: '8s', animationName: 'pulse', animationIterationCount: 'infinite' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 blur-[150px] rounded-full"></div>
      </div>

      {/* ========== SECTION 1: HERO ========== */}
      <section className="pt-32 pb-24 px-6 lg:px-12 max-w-6xl mx-auto text-center relative">
        <MotionDiv {...fadeIn}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-8">
            <Atom size={16} className="animate-spin" style={{ animationDuration: '8s' }} /> Open Source Science Lab
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-white leading-tight mb-6">
            Redefining Science<br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Education in Karnataka
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
            E-Prayog brings every PUC experiment to life through interactive 2D simulations, 
            AI tutoring, and a curriculum built specifically for Karnataka students.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/subjects" className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2">
              Explore Labs <ArrowRight size={20} />
            </Link>
            <Link to="/tutor" className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg transition-all flex items-center gap-2">
              <Bot size={20} /> Try AI Tutor
            </Link>
          </div>
        </MotionDiv>
      </section>

      {/* ========== SECTION 2: STATS ROW ========== */}
      <section className="py-12 px-6 lg:px-12 max-w-5xl mx-auto">
        <MotionDiv {...fadeIn} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: '67+', label: 'Experiments' },
            { num: '5', label: 'Subjects' },
            { num: '2D', label: 'Interactive' },
            { num: 'AI', label: 'Powered' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
              <div className="text-3xl sm:text-4xl font-display font-bold text-emerald-400 mb-1">{stat.num}</div>
              <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </MotionDiv>
      </section>

      {/* ========== SECTION 3: MISSION ========== */}
      <section className="py-24 px-6 lg:px-12 max-w-6xl mx-auto">
        <MotionDiv {...fadeIn}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6">Our Mission</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                E-Prayog aims to democratize practical science education for Karnataka PUC students. 
                We believe every student — regardless of whether their school has a physical lab — 
                deserves hands-on experimental learning.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Our 2D interactive simulations recreate real experiments faithfully, complete with 
                observations, viva voce, quizzes, and AI-powered doubt solving. All running entirely 
                in the browser — free, forever.
              </p>
            </div>
            <GlassCard hoverEffect={false} className="p-8 bg-emerald-500/5 border-emerald-500/20">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: '10k+', label: 'Students Reached' },
                  { num: '67+', label: 'Lab Experiments' },
                  { num: '24/7', label: 'AI Support' },
                  { num: '100%', label: 'Free Forever' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-display font-bold text-emerald-400 mb-1">{stat.num}</div>
                    <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </MotionDiv>
      </section>

      {/* ========== SECTION 4: FEATURES GRID ========== */}
      <section className="py-24 px-6 lg:px-12 max-w-6xl mx-auto">
        <MotionDiv {...fadeIn} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">Why E-Prayog?</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Everything you need for practical science education, built for the Indian classroom.</p>
        </MotionDiv>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <MotionDiv key={feature.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <GlassCard hoverEffect={true} color={feature.color} className="p-8 h-full">
                <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 flex items-center justify-center text-${feature.color}-400 mb-5`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </GlassCard>
            </MotionDiv>
          ))}
        </div>
      </section>

      {/* ========== SECTION 5: SUBJECTS ========== */}
      <section className="py-24 px-6 lg:px-12 max-w-6xl mx-auto">
        <MotionDiv {...fadeIn} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">Subjects Covered</h2>
          <p className="text-slate-400">Comprehensive coverage across all 5 PUC science streams.</p>
        </MotionDiv>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {SUBJECTS.map((subject) => {
            const color = SUBJECT_COLOR_MAP[subject.name] || 'emerald';
            return (
              <MotionDiv key={subject.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                <Link to={`/subjects/${subject.id}`}>
                  <GlassCard color={color} className="p-6 text-center h-full">
                    <div className={`mx-auto w-14 h-14 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center text-${color}-400 mb-4`}>
                      {SUBJECT_ICON_MAP[subject.name] || <FlaskConical size={28} />}
                    </div>
                    <h3 className="text-white font-bold mb-1">{subject.name}</h3>
                    <p className="text-emerald-400 text-sm font-bold mb-2">{subject.labs.length} experiments</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{SUBJECT_DESCRIPTIONS[subject.name] || subject.description}</p>
                  </GlassCard>
                </Link>
              </MotionDiv>
            );
          })}
        </div>
      </section>

      {/* ========== SECTION 6: TEAM ========== */}
      <section className="py-24 px-6 lg:px-12 max-w-4xl mx-auto">
        <MotionDiv {...fadeIn} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-2 flex items-center justify-center gap-2">
            Built with <Heart size={28} className="text-red-400 fill-red-400" /> for Karnataka Students
          </h2>
        </MotionDiv>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Sushant Shetty', title: 'Full-Stack Developer', school: 'Atria Institute of Technology', initials: 'SS', color: 'bg-emerald-500' },
            { name: 'Mahesh R Madiwalar', title: 'Co-developer', school: 'Contributor', initials: 'MM', color: 'bg-blue-500' },
          ].map(person => (
            <MotionDiv key={person.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <GlassCard hoverEffect={false} className="p-6 flex items-center gap-5">
                <div className={`w-16 h-16 rounded-2xl ${person.color} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
                  {person.initials}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{person.name}</h3>
                  <p className="text-emerald-400 text-sm font-medium">{person.title}</p>
                  <p className="text-slate-500 text-xs mt-1">{person.school}</p>
                </div>
              </GlassCard>
            </MotionDiv>
          ))}
        </div>
      </section>

      {/* ========== SECTION 7: CTA ========== */}
      <section className="py-24 px-6 lg:px-12 max-w-4xl mx-auto text-center">
        <MotionDiv {...fadeIn}>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white mb-6">
            Ready to Start Experimenting?
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of Karnataka students already learning through interactive simulations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/subjects" className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2">
              Explore Labs <ArrowRight size={20} />
            </Link>
            <Link to="/tutor" className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg transition-all flex items-center gap-2">
              <Bot size={20} /> Try AI Tutor
            </Link>
          </div>
        </MotionDiv>
      </section>

    </div>
  );
};

export default About;
