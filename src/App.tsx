import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import {
  AboutUsPage,
  AsDentistPage,
  AsDesignerPage,
  AsLabPage,
  ContactPage,
  DesignerPublicProfilePage,
  DesignersDirectoryPage,
  HelpCenterPage,
  HowItWorksPage,
  OurStoryPage,
  PrivacyPage,
  TermsPage,
} from './pages/MarketingPages';
import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
} from './pages/AuthPages';
import {
  AdminDisputesPage,
  CaseWorkspacePage,
  DentistDashboardPage,
  DentistProfilePage,
  DesignerDashboardPage,
  DesignerEarningsPage,
  DesignerJobsPage,
  DesignerProfilePage,
  NewProjectWizardPage,
  PortalMessagesPage,
  ProjectsListPage,
  ReferralsPage,
} from './pages/PortalPages';
import { getExoTheme, setExoTheme } from './lib/exoStore';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

const HelpTopicWrapper: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  return (
    <PublicLayout>
      <HelpCenterPage activeTopic={topic} />
    </PublicLayout>
  );
};

export function App() {
  useEffect(() => {
    setExoTheme(getExoTheme());
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public ExoConnect Marketing & Directory Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <LandingPage />
            </PublicLayout>
          }
        />
        <Route
          path="/designers"
          element={
            <PublicLayout>
              <DesignersDirectoryPage />
            </PublicLayout>
          }
        />
        <Route
          path="/designer/:id"
          element={
            <PublicLayout>
              <DesignerPublicProfilePage />
            </PublicLayout>
          }
        />
        <Route
          path="/how-it-works"
          element={
            <PublicLayout>
              <HowItWorksPage />
            </PublicLayout>
          }
        />
        <Route
          path="/as/dentist"
          element={
            <PublicLayout>
              <AsDentistPage />
            </PublicLayout>
          }
        />
        <Route
          path="/as/designer"
          element={
            <PublicLayout>
              <AsDesignerPage />
            </PublicLayout>
          }
        />
        <Route
          path="/as/lab"
          element={
            <PublicLayout>
              <AsLabPage />
            </PublicLayout>
          }
        />
        <Route
          path="/about-us"
          element={
            <PublicLayout>
              <AboutUsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/our-story"
          element={
            <PublicLayout>
              <OurStoryPage />
            </PublicLayout>
          }
        />
        <Route
          path="/help"
          element={
            <PublicLayout>
              <HelpCenterPage />
            </PublicLayout>
          }
        />
        <Route path="/help/:topic" element={<HelpTopicWrapper />} />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <ContactPage />
            </PublicLayout>
          }
        />
        <Route
          path="/terms"
          element={
            <PublicLayout>
              <TermsPage />
            </PublicLayout>
          }
        />
        <Route
          path="/privacy"
          element={
            <PublicLayout>
              <PrivacyPage />
            </PublicLayout>
          }
        />

        {/* ExoConnect Auth & 2-Step Role Registration Routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot" element={<ForgotPasswordPage />} />
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route
          path="/register"
          element={<Navigate to="/auth/register" replace />}
        />

        {/* Authenticated Dentist Portal Routes */}
        <Route path="/dashboard" element={<DentistDashboardPage />} />
        <Route path="/projects" element={<ProjectsListPage />} />
        <Route path="/projects/new" element={<NewProjectWizardPage />} />
        <Route path="/projects/:id" element={<CaseWorkspacePage />} />
        <Route path="/messages" element={<PortalMessagesPage />} />
        <Route path="/referrals" element={<ReferralsPage />} />
        <Route path="/profile" element={<DentistProfilePage />} />

        {/* Authenticated CAD Designer Portal Routes */}
        <Route path="/designer/dashboard" element={<DesignerDashboardPage />} />
        <Route path="/designer/jobs" element={<DesignerJobsPage />} />
        <Route path="/designer/messages" element={<PortalMessagesPage />} />
        <Route path="/designer/earnings" element={<DesignerEarningsPage />} />
        <Route path="/designer/profile" element={<DesignerProfilePage />} />

        {/* Admin Dispute Resolution Portal */}
        <Route path="/admin" element={<AdminDisputesPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
