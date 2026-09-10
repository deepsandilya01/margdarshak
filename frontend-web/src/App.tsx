import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ComparisonTray from './components/comparison/ComparisonTray';
import { Skeleton } from './components/shared/Skeleton';

// Lazy-loaded page components for code splitting
const Homepage = lazy(() => import('./pages/home/Homepage'));
const StandardsExplorer = lazy(() => import('./pages/standards/StandardsExplorer'));
const StandardDetail = lazy(() => import('./pages/standards/StandardDetail'));
const ProductDiscovery = lazy(() => import('./pages/discover/ProductDiscovery'));
const DiscoveryResults = lazy(() => import('./pages/discover/DiscoveryResults'));
const QCOExplorer = lazy(() => import('./pages/qco/QCOExplorer'));
const QCODetail = lazy(() => import('./pages/qco/QCODetail'));
const LabFinder = lazy(() => import('./pages/labs/LabFinder'));
const LabDetail = lazy(() => import('./pages/labs/LabDetail'));
const AISathiWorkspace = lazy(() => import('./pages/ai-sathi/AISathiWorkspace'));
const ComplianceWorkspace = lazy(() => import('./pages/workspace/ComplianceWorkspace'));
const SavedItems = lazy(() => import('./pages/saved/SavedItems'));
const ResourcesLibrary = lazy(() => import('./pages/resources/ResourcesLibrary'));
const ResourceDetail = lazy(() => import('./pages/resources/ResourceDetail'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Phase 2 components
const CertificationPage = lazy(() => import('./pages/certification/CertificationPage'));
const HallmarkingPage = lazy(() => import('./pages/hallmarking/HallmarkingPage'));
const ComparisonWorkspace = lazy(() => import('./pages/compare/ComparisonWorkspace'));
const HelpCenter = lazy(() => import('./pages/help/HelpCenter'));
const ReportsList = lazy(() => import('./pages/reports/ReportsList'));
const ReportPreview = lazy(() => import('./pages/reports/ReportPreview'));
const ProfilePage = lazy(() => import('./pages/account/ProfilePage'));
const ResearchHistory = lazy(() => import('./pages/ai-sathi/ResearchHistory'));
const ComplianceJourneyDetail = lazy(() => import('./pages/workspace/ComplianceJourneyDetail'));

// Phase 3 components
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const About = lazy(() => import('./pages/about/About'));
const Notifications = lazy(() => import('./pages/notifications/Notifications'));

// Placeholder pages for remaining stub routes
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="w-full max-w-[1440px] mx-auto px-8 py-16 flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-4">
      <span className="material-symbols-outlined text-[32px] text-on-surface-variant">construction</span>
    </div>
    <h1 className="text-headline-md text-on-surface mb-2">{title}</h1>
    <p className="text-[14px] text-on-surface-variant">This section is coming soon in the next delivery phase.</p>
  </div>
);

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

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Homepage */}
        <Route path="/" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><Homepage /></motion.div>} />

        {/* Standards */}
        <Route path="/standards" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><StandardsExplorer /></motion.div>} />
        <Route path="/standards/:id" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><StandardDetail /></motion.div>} />

        {/* Product Discovery */}
        <Route path="/discover" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><ProductDiscovery /></motion.div>} />
        <Route path="/discover/results" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><DiscoveryResults /></motion.div>} />

        {/* QCOs */}
        <Route path="/qco" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><QCOExplorer /></motion.div>} />
        <Route path="/qco/:id" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><QCODetail /></motion.div>} />

        {/* Laboratories */}
        <Route path="/laboratories" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><LabFinder /></motion.div>} />
        <Route path="/laboratories/:id" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><LabDetail /></motion.div>} />

        {/* AI Sathi */}
        <Route path="/ai-sathi" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><AISathiWorkspace /></motion.div>} />
        <Route path="/history" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><ResearchHistory /></motion.div>} />

        {/* Compliance Workspace */}
        <Route path="/workspace" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><ComplianceWorkspace /></motion.div>} />
        <Route path="/workspace/:id" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><ComplianceJourneyDetail /></motion.div>} />

        {/* Saved / Comparison */}
        <Route path="/saved" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><SavedItems /></motion.div>} />
        <Route path="/compare" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><ComparisonWorkspace /></motion.div>} />

        {/* Resources */}
        <Route path="/resources" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><ResourcesLibrary /></motion.div>} />
        <Route path="/resources/:id" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><ResourceDetail /></motion.div>} />

        {/* Phase 2 */}
        <Route path="/certification" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><CertificationPage /></motion.div>} />
        <Route path="/hallmarking" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><HallmarkingPage /></motion.div>} />
        <Route path="/help" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><HelpCenter /></motion.div>} />
        <Route path="/reports" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} exit={{ opacity: 0, y: -10 }}><ReportsList /></motion.div>} />
        <Route path="/reports/:id" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} exit={{ opacity: 0, y: -10 }}><ReportPreview /></motion.div>} />
        <Route path="/profile" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><ProfilePage /></motion.div>} />
        
        {/* Phase 3 */}
        <Route path="/login" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><Login /></motion.div>} />
        <Route path="/signup" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><Signup /></motion.div>} />
        <Route path="/forgot-password" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><ForgotPassword /></motion.div>} />
        <Route path="/about" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><About /></motion.div>} />
        <Route path="/notifications" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><Notifications /></motion.div>} />
        <Route path="/settings" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><ProfilePage /></motion.div>} />

        {/* 404 */}
        <Route path="*" element={<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}><NotFound /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <WorkspaceProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-background text-on-surface transition-colors duration-300 app-shell">
              <Header />

              <main className="flex-1 pt-2 md:pt-3" id="main-content" role="main">
                <Suspense fallback={<PageSkeleton />}>
                  <AnimatedRoutes />
                </Suspense>
              </main>

              {/* Global comparison tray */}
              <ComparisonTray />

              {/* Footer */}
              <Footer />
            </div>
          </BrowserRouter>
        </WorkspaceProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
