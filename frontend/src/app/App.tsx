import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from '@/context/LanguageContext';
import { WorkspaceProvider } from '@/context/WorkspaceContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { WorkspaceLayout } from '@/components/layout/WorkspaceLayout';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PublicRoute } from '@/components/auth/PublicRoute';
import { Skeleton } from '@/components/shared/Skeleton';

// Lazy-loaded page components for code splitting
const Homepage = lazy(() => import('@/pages/home/Homepage'));
const About = lazy(() => import('@/pages/about/About'));
const NotFound = lazy(() => import('@/pages/not-found/NotFound'));

// Auth Pages
const Login = lazy(() => import('@/pages/auth/Login'));
const Signup = lazy(() => import('@/pages/auth/Signup'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));

// Workspace Pages
const WorkspaceHome = lazy(() => import('@/pages/workspace/WorkspaceHome'));
const AISathiWorkspace = lazy(() => import('@/pages/ai-sathi/AISathiWorkspace'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const Hallmarking = lazy(() => import('@/pages/workspace/Hallmarking'));
const Licensing = lazy(() => import('@/pages/workspace/Licensing'));
const Labs = lazy(() => import('@/pages/workspace/Labs'));

// Page loading fallback
function PageSkeleton() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-8 py-8 space-y-4">
      <Skeleton className="h-8 w-80 rounded-xl" />
      <Skeleton className="h-5 w-96 rounded-lg" />
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  );
}

// Wrapper for simple fade animations
const Fade = ({ children }: { children: React.ReactNode }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
    {children}
  </motion.div>
);

// Public layout wrapper for Landing/About pages
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen bg-background text-on-surface transition-colors duration-300 app-shell">
    <Header />
    <main className="flex-1" id="main-content" role="main">
      {children}
    </main>
    <Footer />
  </div>
);

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* PUBLIC ROUTES (Landing / About) */}
        <Route path="/" element={<PublicLayout><Fade><Homepage /></Fade></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><Fade><About /></Fade></PublicLayout>} />
        
        {/* AUTH ROUTES (Login / Signup) */}
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Fade><Login /></Fade>} />
            <Route path="/signup" element={<Fade><Signup /></Fade>} />
            <Route path="/forgot-password" element={<Fade><ForgotPassword /></Fade>} />
          </Route>
        </Route>

        {/* PRIVATE WORKSPACE ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/workspace" element={<WorkspaceLayout />}>
            <Route index element={<Fade><WorkspaceHome /></Fade>} />
            <Route path="ai-sathi" element={<Fade><AISathiWorkspace /></Fade>} />
            <Route path="hallmarking" element={<Fade><Hallmarking /></Fade>} />
            <Route path="licensing" element={<Fade><Licensing /></Fade>} />
            <Route path="labs" element={<Fade><Labs /></Fade>} />
            <Route path="settings" element={<Fade><ProfilePage /></Fade>} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<PublicLayout><Fade><NotFound /></Fade></PublicLayout>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <WorkspaceProvider>
            <BrowserRouter>
              <Suspense fallback={<PageSkeleton />}>
                <AnimatedRoutes />
              </Suspense>
            </BrowserRouter>
          </WorkspaceProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
