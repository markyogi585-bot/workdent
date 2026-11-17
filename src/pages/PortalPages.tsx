import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Box,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  FileText,
  FolderKanban,
  Gift,
  HelpCircle,
  LayoutDashboard,
  Link2,
  LogOut,
  MessageSquare,
  Moon,
  Plus,
  RefreshCw,
  Scale,
  Send,
  ShieldAlert,
  ShieldCheck,
  Star,
  Sun,
  Trash2,
  Upload,
  User,
  Users,
} from 'lucide-react';
import {
  EXO_SERVICES,
  ExoCase,
  ExoCaseFile,
  ExoCaseStatus,
  ExoDesigner,
  ExoRole,
  ExoUser,
  getExoCases,
  getExoDesigners,
  getExoTheme,
  getExoUser,
  logoutExoUser,
  saveExoCases,
  saveExoUser,
  setExoTheme,
  switchExoRole,
  updateExoCase,
} from '../lib/exoStore';
import { Exo3DViewer, ViewerItem } from '../components/Exo3DViewer';

function statusBadgeClasses(status: ExoCaseStatus): string {
  switch (status) {
    case 'Awaiting Designer':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    case 'In Progress':
      return 'bg-blue-500/10 text-[#054bce] dark:text-blue-400 border-blue-500/20';
    case 'Submitted':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
    case 'Revision Requested':
      return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20';
    case 'Completed':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    case 'Disputed':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
    case 'Disputed Closed':
      return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  }
}

export const PortalShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<ExoUser>(() => getExoUser());
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => getExoTheme());

  useEffect(() => {
    const sync = () => setUser(getExoUser());
    const syncTheme = () => setThemeState(getExoTheme());
    window.addEventListener('exo-store-updated', sync);
    window.addEventListener('exo-theme-changed', syncTheme);
    return () => {
      window.removeEventListener('exo-store-updated', sync);
      window.removeEventListener('exo-theme-changed', syncTheme);
    };
  }, []);

  const dentistLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Projects', icon: FolderKanban },
    { to: '/messages', label: 'Messages', icon: MessageSquare },
    { to: '/designers', label: 'Designers', icon: Users },
    { to: '/referrals', label: 'Referrals', icon: Gift },
    { to: '/help', label: 'Help', icon: HelpCircle },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  const designerLinks = [
    { to: '/designer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/designer/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/designer/messages', label: 'Messages', icon: MessageSquare },
    { to: '/designer/earnings', label: 'Earnings', icon: DollarSign },
    { to: '/referrals', label: 'Referrals', icon: Gift },
    { to: '/help', label: 'Help', icon: HelpCircle },
    { to: '/designer/profile', label: 'Profile', icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dispute Resolution', icon: Scale },
    { to: '/projects', label: 'All Cases', icon: FolderKanban },
    { to: '/designers', label: 'Designers', icon: Users },
  ];

  const navItems =
    user.role === 'designer'
      ? designerLinks
      : user.role === 'admin'
      ? adminLinks
      : dentistLinks;

  const handleRoleSwitch = (role: ExoRole) => {
    switchExoRole(role);
    if (role === 'designer') navigate('/designer/dashboard');
    else if (role === 'admin') navigate('/admin');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-[var(--muted)] text-[var(--foreground)]">
      {/* Left Collapsible Sidebar */}
      <aside
        className={`${
          collapsed ? 'w-[72px]' : 'w-64'
        } shrink-0 bg-[#0d0d1a] text-white border-r border-white/10 flex flex-col justify-between transition-all duration-200 sticky top-0 h-screen z-30`}
      >
        <div>
          {/* Top Brand + Collapse */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-white/10">
            <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-[#054bce] flex items-center justify-center text-white font-bold text-base shrink-0">
                e
              </div>
              {!collapsed && (
                <span className="font-bold text-lg tracking-tight whitespace-nowrap">
                  exo<span className="text-[#60a5fa]">connect</span>
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Role Switcher inside Sidebar */}
          {!collapsed && (
            <div className="px-3 pt-4 pb-2">
              <div className="p-1 rounded-lg bg-white/5 border border-white/10 grid grid-cols-3 gap-1">
                {(
                  [
                    { id: 'dentist', label: 'Dentist' },
                    { id: 'designer', label: 'Designer' },
                    { id: 'admin', label: 'Admin' },
                  ] as { id: ExoRole; label: string }[]
                ).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSwitch(r.id)}
                    className={`py-1.5 rounded-md text-[11px] font-semibold transition-colors ${
                      user.role === r.id
                        ? 'bg-[#054bce] text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nav items */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                location.pathname === item.to ||
                (item.to !== '/dashboard' &&
                  item.to !== '/designer/dashboard' &&
                  location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-[#054bce] text-white shadow-xs'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Card */}
        <div className="p-3 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between gap-2 px-2 py-1.5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user.avatar}
                alt={user.firstName}
                className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
              />
              {!collapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-[11px] text-gray-400 capitalize truncate">
                    {user.role === 'dentist'
                      ? 'Dental Practice'
                      : user.role === 'designer'
                      ? 'CAD Designer'
                      : 'Dispute Admin'}
                  </div>
                </div>
              )}
            </div>
            {!collapsed && (
              <button
                type="button"
                onClick={() =>
                  setExoTheme(theme === 'dark' ? 'light' : 'dark')
                }
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                title="Toggle dark/light theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {!collapsed && (
            <button
              type="button"
              onClick={() => {
                logoutExoUser();
                navigate('/');
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Portal Bar */}
        <header className="h-16 bg-[var(--background)] border-b border-[var(--border)] px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#054bce]">
              ✦ ExoConnect Workspace
            </span>
            <span className="text-xs text-[var(--muted-foreground)] hidden sm:inline">
              · {user.practiceName}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'dentist' && (
              <Link
                to="/projects/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>New Project</span>
              </Link>
            )}
            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs font-semibold hover:bg-[var(--secondary)] transition-colors"
            >
              Public Site
            </Link>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

/* ==========================================================================
   1. DENTIST DASHBOARD (/dashboard)
   ========================================================================== */
export const DentistDashboardPage: React.FC = () => {
  const [cases, setCases] = useState<ExoCase[]>(() => getExoCases());
  const user = getExoUser();

  useEffect(() => {
    const sync = () => setCases(getExoCases());
    window.addEventListener('exo-store-updated', sync);
    return () => window.removeEventListener('exo-store-updated', sync);
  }, []);

  const awaitingCount = cases.filter(
    (c) => c.status === 'Awaiting Designer'
  ).length;
  const inProgressCount = cases.filter(
    (c) => c.status === 'In Progress' || c.status === 'Revision Requested'
  ).length;
  const reviewCount = cases.filter((c) => c.status === 'Submitted').length;
  const completedCount = cases.filter((c) => c.status === 'Completed').length;

  return (
    <PortalShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, Dr. {user.firstName} {user.lastName}
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Track your dental CAD cases, review 3D STL deliverables, and manage card authorizations.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/designers"
            className="px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--secondary)] text-xs font-semibold transition-colors"
          >
            Browse Designers
          </Link>
          <Link
            to="/projects/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted-foreground)] mb-2">
            <span>Awaiting Designer</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold">{awaitingCount}</div>
          <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
            Card authorized (not yet charged)
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted-foreground)] mb-2">
            <span>In Progress</span>
            <Box className="w-4 h-4 text-[#054bce]" />
          </div>
          <div className="text-2xl font-bold">{inProgressCount}</div>
          <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
            Active CAD design in escrow
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted-foreground)] mb-2">
            <span>Ready for 3D Review</span>
            <Eye className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold">{reviewCount}</div>
          <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
            Deliverables & web links uploaded
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--muted-foreground)] mb-2">
            <span>Completed Cases</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold">{completedCount}</div>
          <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
            Approved & downloaded for CAM
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="rounded-xl bg-[var(--background)] border border-[var(--border)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold">Active & Recent Cases</h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Click any case to open the ExoConnect Case Workspace & 3D Viewer
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-[#054bce] hover:underline"
          >
            View All Projects →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)] text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                <th className="py-3 px-6">Project</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Designer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)] text-xs">
              {cases.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-[var(--muted)]/60 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="font-bold text-[var(--foreground)]">
                      {c.projectNumber} · {c.title}
                    </div>
                    <div className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                      Teeth: {c.teethInvolved} · Due {c.dueDate}
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium">{c.service}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={c.designerAvatar}
                        alt={c.designerName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-medium">{c.designerName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusBadgeClasses(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-bold">${c.priceUsd.toFixed(2)}</div>
                    <div className="text-[11px] text-[var(--muted-foreground)]">
                      {c.paymentStatus}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Link
                      to={`/projects/${c.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white font-semibold text-xs transition-colors"
                    >
                      <span>Open Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalShell>
  );
};

/* ==========================================================================
   2. PROJECTS LIST PAGE (/projects)
   ========================================================================== */
export const ProjectsListPage: React.FC = () => {
  const [cases, setCases] = useState<ExoCase[]>(() => getExoCases());
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    const sync = () => setCases(getExoCases());
    window.addEventListener('exo-store-updated', sync);
    return () => window.removeEventListener('exo-store-updated', sync);
  }, []);

  const statuses = [
    'All',
    'Awaiting Designer',
    'In Progress',
    'Submitted',
    'Revision Requested',
    'Completed',
    'Disputed',
    'Disputed Closed',
  ];

  const filtered =
    statusFilter === 'All'
      ? cases
      : cases.filter((c) => c.status === statusFilter);

  return (
    <PortalShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            All dental CAD cases posted by your practice, organized by live lifecycle status.
          </p>
        </div>
        <Link
          to="/projects/new"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              statusFilter === st
                ? 'bg-[#054bce] text-white border-[#054bce]'
                : 'bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)] hover:text-[var(--foreground)]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)] flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:border-[#054bce]/50 transition-colors"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-[#054bce]">
                  {c.projectNumber}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadgeClasses(
                    c.status
                  )}`}
                >
                  {c.status}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  · Created {c.createdAt}
                </span>
              </div>
              <h3 className="text-base font-bold">{c.title}</h3>
              <p className="text-xs text-[var(--muted-foreground)] max-w-2xl">
                {c.caseNotes}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[var(--muted-foreground)]">
                <span>
                  Service: <strong className="text-[var(--foreground)]">{c.service}</strong>
                </span>
                <span>
                  Designer: <strong className="text-[var(--foreground)]">{c.designerName}</strong>
                </span>
                <span>
                  Scan files: <strong className="text-[var(--foreground)]">{c.scanFiles.length}</strong>
                </span>
                <span>
                  Deliverables:{' '}
                  <strong className="text-[var(--foreground)]">
                    {c.deliverableFiles.length}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex sm:items-center justify-between lg:justify-end gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-[var(--border)]">
              <div className="text-left lg:text-right">
                <div className="text-lg font-bold">${c.priceUsd.toFixed(2)}</div>
                <div className="text-[11px] text-[var(--muted-foreground)]">
                  {c.paymentStatus}
                </div>
              </div>
              <Link
                to={`/projects/${c.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold transition-colors"
              >
                <span>Open Case Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </PortalShell>
  );
};

/* ==========================================================================
   3. 5-STEP NEW PROJECT WIZARD (/projects/new)
   ========================================================================== */
export const NewProjectWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDesignerId = searchParams.get('designer') || 'des-1';

  const designers = getExoDesigners();
  const user = getExoUser();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Case Details
  const [title, setTitle] = useState(
    'Monolithic Zirconia 3-Unit Posterior Bridge (#14–#16)'
  );
  const [service, setService] = useState<string>(EXO_SERVICES[0]);
  const [teethInvolved, setTeethInvolved] = useState('#14, #15, #16');
  const [material, setMaterial] = useState('Multilayer Zirconia (4Y-TZP)');
  const [caseNotes, setCaseNotes] = useState(
    '0.04mm cement spacer, anatomical occlusal morphology with light centric contact, ovate pontic on #15.'
  );

  // Step 2: Choose Designer
  const [selectedDesignerId, setSelectedDesignerId] = useState<string>(
    preselectedDesignerId
  );

  // Step 3: Upload Scan Files
  const [uploadedScans, setUploadedScans] = useState<
    { name: string; size: string; format: 'STL' | 'PLY' | 'OBJ' }[]
  >([
    { name: 'Upper_Arch_Preparation_Scan.stl', size: '14.8 MB', format: 'STL' },
    { name: 'Lower_Opposing_Arch.ply', size: '16.2 MB', format: 'PLY' },
    { name: 'Buccal_Occlusion_Bite.obj', size: '5.9 MB', format: 'OBJ' },
  ]);
  const [newScanName, setNewScanName] = useState('');

  const selectedDesigner: ExoDesigner =
    designers.find((d) => d.id === selectedDesignerId) || designers[0];

  const matchedServicePrice =
    selectedDesigner.services.find((s) => s.service === service)?.priceUsd ||
    selectedDesigner.services[0]?.priceUsd ||
    150;

  const handleAddScanFile = () => {
    const clean = newScanName.trim() || `Intraoral_Scan_${uploadedScans.length + 1}.stl`;
    const ext = clean.toLowerCase().endsWith('.ply')
      ? 'PLY'
      : clean.toLowerCase().endsWith('.obj')
      ? 'OBJ'
      : 'STL';
    setUploadedScans([
      ...uploadedScans,
      { name: clean, size: '12.4 MB', format: ext },
    ]);
    setNewScanName('');
  };

  const handleAuthorizeAndSubmit = () => {
    const allCases = getExoCases();
    const nextNum = 1051 + allCases.length;
    const price = matchedServicePrice;
    const commission = Number((price * 0.12).toFixed(2));
    const designerNet = Number((price - commission).toFixed(2));

    const newCase: ExoCase = {
      id: String(nextNum),
      projectNumber: `PRJ-${nextNum}`,
      title,
      service,
      caseNotes,
      teethInvolved,
      material,
      dentistName: `Dr. ${user.firstName} ${user.lastName}`,
      practiceName: user.practiceName,
      designerId: selectedDesigner.id,
      designerName: selectedDesigner.name,
      designerAvatar: selectedDesigner.avatar,
      priceUsd: price,
      commissionUsd: commission,
      designerNetUsd: designerNet,
      status: 'Awaiting Designer',
      paymentStatus: 'Authorized Hold',
      createdAt: 'Just now',
      dueDate: 'Within 24 Hours',
      scanFiles: uploadedScans.map((f, idx) => ({
        id: `scan-${Date.now()}-${idx}`,
        name: f.name,
        size: f.size,
        format: f.format,
        section: 'SCAN',
        uploadedBy: `Dr. ${user.firstName} ${user.lastName}`,
        uploadedAt: 'Just now',
        meshType: 'molar_bridge',
      })),
      deliverableFiles: [],
      webLinks: [],
      timeline: [
        {
          id: `tl-${Date.now()}`,
          status: `Case Created & Card Authorized ($${price.toFixed(2)})`,
          note: `Temporary authorization hold placed on card. Charged only when ${selectedDesigner.name} accepts the project (auto-releases after 6 days if unclaimed).`,
          timestamp: 'Just now',
        },
      ],
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderName: `Dr. ${user.firstName} ${user.lastName}`,
          senderRole: 'dentist',
          text: caseNotes,
          timestamp: 'Just now',
        },
      ],
    };

    saveExoCases([newCase, ...allCases]);
    navigate(`/projects/${newCase.id}`);
  };

  const stepsList = [
    { num: 1, label: 'Case Details' },
    { num: 2, label: 'Choose Designer' },
    { num: 3, label: 'Upload Scan Files' },
    { num: 4, label: 'Review' },
    { num: 5, label: 'Pay & Submit' },
  ];

  return (
    <PortalShell>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Create New Dental CAD Project
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Follow the 5-step ExoConnect workflow to send your case and authorize your payment hold.
          </p>
        </div>

        {/* 5-Step Stepper */}
        <div className="grid grid-cols-5 gap-2 mb-8">
          {stepsList.map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num as 1 | 2 | 3 | 4 | 5)}
              className={`p-3 rounded-xl border text-left transition-all ${
                step === s.num
                  ? 'bg-[#054bce] text-white border-[#054bce]'
                  : step > s.num
                  ? 'bg-blue-500/10 text-[#054bce] border-blue-500/20'
                  : 'bg-[var(--background)] text-[var(--muted-foreground)] border-[var(--border)]'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                Step 0{s.num}
              </div>
              <div className="text-xs font-bold truncate mt-0.5">{s.label}</div>
            </button>
          ))}
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold">Step 1: Case Details</h2>
              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Project Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Service Type
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
                  >
                    {EXO_SERVICES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Teeth / Arch Involved
                  </label>
                  <input
                    type="text"
                    value={teethInvolved}
                    onChange={(e) => setTeethInvolved(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Restorative Material
                  </label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Clinical Prescription & Margin / Occlusal Notes
                </label>
                <textarea
                  rows={4}
                  value={caseNotes}
                  onChange={(e) => setCaseNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold"
                >
                  <span>Next: Choose Designer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold">
                Step 2: Choose Your CAD Designer
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Select a verified CAD designer with transparent pricing for{' '}
                <strong>{service}</strong>.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {designers.map((d) => {
                  const priceObj =
                    d.services.find((s) => s.service === service) ||
                    d.services[0];
                  const isSelected = d.id === selectedDesignerId;
                  return (
                    <div
                      key={d.id}
                      onClick={() => setSelectedDesignerId(d.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#054bce] bg-blue-500/5 ring-2 ring-[#054bce]/20'
                          : 'border-[var(--border)] hover:border-[#054bce]/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={d.avatar}
                            alt={d.name}
                            className="w-11 h-11 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-sm font-bold">{d.name}</div>
                            <div className="text-[11px] text-[var(--muted-foreground)]">
                              {d.location} · ★ {d.rating} ({d.reviewsCount})
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-bold text-[#054bce]">
                            ${priceObj?.priceUsd ?? 150}
                          </div>
                          <div className="text-[10px] text-[var(--muted-foreground)]">
                            {priceObj?.turnaroundHours ?? 24}h turnaround
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--muted-foreground)] line-clamp-2">
                        {d.bio}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-lg border border-[var(--border)] text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold"
                >
                  <span>Next: Upload Scan Files</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold">
                Step 3: Upload Intraoral Scan Files (.STL, .PLY, .OBJ)
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Attach your upper, lower, and bite registration files. Your designer can inspect them immediately in the browser 3D viewer.
              </p>

              <div className="p-5 rounded-xl border-2 border-dashed border-[var(--border)] bg-[var(--muted)]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Upload className="w-6 h-6 text-[#054bce]" />
                  <div>
                    <div className="text-xs font-bold">
                      Add STL, PLY, or OBJ Intraoral Scan File
                    </div>
                    <div className="text-[11px] text-[var(--muted-foreground)]">
                      Supports 3Shape TRIOS, Medit i700, iTero, Primescan, and CBCT meshes
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={newScanName}
                    onChange={(e) => setNewScanName(e.target.value)}
                    placeholder="e.g. Waxup_Reference.stl"
                    className="px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs flex-1 sm:w-48"
                  />
                  <button
                    type="button"
                    onClick={handleAddScanFile}
                    className="px-3.5 py-2 rounded-lg bg-[#054bce] text-white text-xs font-semibold shrink-0"
                  >
                    Attach Scan
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {uploadedScans.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded bg-[#054bce]/10 text-[#054bce] font-mono font-bold text-[10px]">
                        {f.format}
                      </span>
                      <span className="font-semibold">{f.name}</span>
                      <span className="text-[var(--muted-foreground)]">
                        ({f.size})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setUploadedScans(
                          uploadedScans.filter((_, i) => i !== idx)
                        )
                      }
                      className="text-red-500 hover:underline text-[11px]"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-lg border border-[var(--border)] text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold"
                >
                  <span>Next: Review Case</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold">Step 4: Review Your Case</h2>
              <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)] space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)]">Project Title</span>
                  <span className="font-bold">{title}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)]">Service Type</span>
                  <span className="font-bold">{service}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)]">Teeth / Material</span>
                  <span className="font-bold">
                    {teethInvolved} · {material}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)]">Selected Designer</span>
                  <span className="font-bold">{selectedDesigner.name}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)]">Attached Scan Files</span>
                  <span className="font-bold">{uploadedScans.length} files (.STL / .PLY / .OBJ)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[var(--muted-foreground)]">Designer Rate</span>
                  <span className="text-base font-bold text-[#054bce]">
                    ${matchedServicePrice.toFixed(2)} USD
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-lg border border-[var(--border)] text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold"
                >
                  <span>Proceed to Step 5: Pay & Submit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold">
                Step 5: Authorize, Don&apos;t Pay Yet
              </h2>
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1.5">
                <div className="font-bold text-[#054bce] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ExoConnect Card Authorization Protection</span>
                </div>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  Submitting your case places a temporary authorization hold of{' '}
                  <strong>${matchedServicePrice.toFixed(2)}</strong> on your card. Your card is{' '}
                  <strong>only charged when {selectedDesigner.name} accepts your case</strong>. If the designer declines or does not respond within 6 days, the hold is automatically released at zero cost.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[var(--muted)] border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#054bce]" />
                    <span>Saved Practice Card · Visa ending in 4242</span>
                  </span>
                  <span className="text-emerald-600">Verified</span>
                </div>
                <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between">
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Authorization Hold Amount
                  </span>
                  <span className="text-xl font-bold">
                    ${matchedServicePrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-4 py-2.5 rounded-lg border border-[var(--border)] text-xs font-semibold"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleAuthorizeAndSubmit}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-sm font-bold shadow-sm transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize ${matchedServicePrice.toFixed(2)}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalShell>
  );
};

/* ==========================================================================
   4. THE EXOCONNECT CASE WORKSPACE (/projects/:id)
   Left Rail (Case Mode + Compact File List Mode) + Right 4 Tabs
   (Overview, Files, 3D & digital design, Conversation)
   ========================================================================== */
export const CaseWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cases, setCases] = useState<ExoCase[]>(() => getExoCases());
  const user = getExoUser();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'files' | '3d' | 'conversation'
  >('overview');
  const [leftRailMode, setLeftRailMode] = useState<'case' | 'files'>('case');

  // Modals / inline action drawers
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState(
    'Excellent marginal adaptation and occlusal anatomy. Zero chairside adjustments needed!'
  );

  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');

  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  // File & Web Link inputs
  const [newWebUrl, setNewWebUrl] = useState('');
  const [newWebLabel, setNewWebLabel] = useState('');
  const [webUrlError, setWebUrlError] = useState('');
  const [newDeliverableName, setNewDeliverableName] = useState('');
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    const sync = () => setCases(getExoCases());
    window.addEventListener('exo-store-updated', sync);
    return () => window.removeEventListener('exo-store-updated', sync);
  }, []);

  const currentCase = cases.find((c) => c.id === id) || cases[0];
  if (!currentCase) {
    return (
      <PortalShell>
        <div className="p-8 text-center">Case not found.</div>
      </PortalShell>
    );
  }

  const [activeViewerIndex, setActiveViewerIndex] = useState(0);

  const allCaseFiles: ExoCaseFile[] = [
    ...currentCase.scanFiles,
    ...currentCase.deliverableFiles,
  ];

  const viewerItems: ViewerItem[] = [
    ...allCaseFiles.map((f): ViewerItem => ({ kind: 'file', data: f })),
    ...currentCase.webLinks.map((l): ViewerItem => ({ kind: 'link', data: l })),
  ];

  // Role Actions
  const handleDesignerAcceptCase = () => {
    updateExoCase(currentCase.id, (c) => ({
      ...c,
      status: 'In Progress',
      paymentStatus: 'Escrow',
      timeline: [
        ...c.timeline,
        {
          id: `tl-${Date.now()}`,
          status: `Accepted by ${c.designerName}`,
          note: `Card authorization captured ($${c.priceUsd.toFixed(
            2
          )}) into Escrow.`,
          timestamp: 'Just now',
        },
      ],
    }));
  };

  const handleDesignerUploadAndSubmit = () => {
    const fileName =
      newDeliverableName.trim() ||
      `Final_CAD_Design_${currentCase.projectNumber}.stl`;
    const newFile: ExoCaseFile = {
      id: `del-${Date.now()}`,
      name: fileName,
      size: '13.4 MB',
      format: fileName.toLowerCase().endsWith('.ply')
        ? 'PLY'
        : fileName.toLowerCase().endsWith('.obj')
        ? 'OBJ'
        : 'STL',
      section: 'DELIVERABLE',
      uploadedBy: currentCase.designerName,
      uploadedAt: 'Just now',
      meshType: 'molar_bridge',
    };

    updateExoCase(currentCase.id, (c) => ({
      ...c,
      status: 'Submitted',
      deliverableFiles: [...c.deliverableFiles, newFile],
      timeline: [
        ...c.timeline,
        {
          id: `tl-${Date.now()}`,
          status: 'Deliverables Submitted by Designer',
          note: `Uploaded ${fileName} for dentist 3D review.`,
          timestamp: 'Just now',
        },
      ],
    }));
    setNewDeliverableName('');
  };

  const handleDentistApproveAndComplete = () => {
    updateExoCase(currentCase.id, (c) => ({
      ...c,
      status: 'Completed',
      paymentStatus: 'Released',
      ratingGiven: rating,
      reviewGiven: reviewComment,
      timeline: [
        ...c.timeline,
        {
          id: `tl-${Date.now()}`,
          status: `Accepted & Completed (${rating}★ Review)`,
          note: `Escrow released: $${c.designerNetUsd.toFixed(
            2
          )} to designer (88%) · $${c.commissionUsd.toFixed(
            2
          )} ExoConnect commission (12%).`,
          timestamp: 'Just now',
        },
      ],
    }));
    setShowAcceptModal(false);
  };

  const handleDentistSendRevision = () => {
    if (!revisionNote.trim()) return;
    updateExoCase(currentCase.id, (c) => ({
      ...c,
      status: 'Revision Requested',
      timeline: [
        ...c.timeline,
        {
          id: `tl-${Date.now()}`,
          status: 'Revision Requested by Dentist',
          note: revisionNote,
          timestamp: 'Just now',
        },
      ],
      messages: [
        ...c.messages,
        {
          id: `msg-${Date.now()}`,
          senderName: c.dentistName,
          senderRole: 'dentist',
          text: `REVISION REQUEST: ${revisionNote}`,
          timestamp: 'Just now',
        },
      ],
    }));
    setRevisionNote('');
    setShowRevisionModal(false);
  };

  const handleOpenDispute = () => {
    if (!disputeReason.trim()) return;
    updateExoCase(currentCase.id, (c) => ({
      ...c,
      status: 'Disputed',
      disputeReason,
      timeline: [
        ...c.timeline,
        {
          id: `tl-${Date.now()}`,
          status: 'Case Disputed — Frozen in Escrow',
          note: `Reason: ${disputeReason}. Forwarded to ExoConnect Arbitration.`,
          timestamp: 'Just now',
        },
      ],
    }));
    setDisputeReason('');
    setShowDisputeModal(false);
  };

  const handleAddWebLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebUrl.trim().startsWith('https://')) {
      setWebUrlError('Web link must start with https:// (e.g., https://webview.exocad...)');
      return;
    }
    setWebUrlError('');
    updateExoCase(currentCase.id, (c) => ({
      ...c,
      webLinks: [
        ...c.webLinks,
        {
          id: `wl-${Date.now()}`,
          url: newWebUrl.trim(),
          label:
            newWebLabel.trim() ||
            `3D Digital Design Preview (${c.webLinks.length + 1})`,
          addedBy: `${user.firstName} ${user.lastName}`,
          addedAt: 'Just now',
        },
      ],
    }));
    setNewWebUrl('');
    setNewWebLabel('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    updateExoCase(currentCase.id, (c) => ({
      ...c,
      messages: [
        ...c.messages,
        {
          id: `m-${Date.now()}`,
          senderName: `${user.firstName} ${user.lastName}`,
          senderRole: user.role,
          text: chatInput.trim(),
          timestamp: 'Just now',
        },
      ],
    }));
    setChatInput('');
  };

  return (
    <PortalShell>
      {/* Breadcrumb + Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/projects"
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] font-semibold flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Projects
          </Link>
          <span className="text-[var(--muted-foreground)]">/</span>
          <span className="font-mono font-bold text-[#054bce]">
            {currentCase.projectNumber}
          </span>
          <span className="font-semibold truncate max-w-md">
            {currentCase.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--muted-foreground)]">
            Viewing as:{' '}
            <strong className="capitalize text-[var(--foreground)]">
              {user.role}
            </strong>
          </span>
        </div>
      </div>

      {/* Main Two-Column ExoConnect Case Workspace */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* LEFT RAIL (4 cols): Case Mode vs Compact File List Mode */}
        <div className="lg:col-span-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] overflow-hidden">
          {/* Left Rail Mode Switcher */}
          <div className="p-2.5 bg-[var(--muted)] border-b border-[var(--border)] grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setLeftRailMode('case')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                leftRailMode === 'case'
                  ? 'bg-[#054bce] text-white'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Case Mode
            </button>
            <button
              type="button"
              onClick={() => setLeftRailMode('files')}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                leftRailMode === 'files'
                  ? 'bg-[#054bce] text-white'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Compact File List ({allCaseFiles.length})
            </button>
          </div>

          {leftRailMode === 'case' ? (
            <div className="p-5 space-y-5">
              {/* Project Number & Status Pill */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-[#054bce]">
                    {currentCase.projectNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadgeClasses(
                      currentCase.status
                    )}`}
                  >
                    {currentCase.status}
                  </span>
                </div>
                <h2 className="text-base font-bold leading-snug">
                  {currentCase.title}
                </h2>
                <p className="text-xs text-[var(--muted-foreground)] mt-1">
                  {currentCase.service} · Teeth {currentCase.teethInvolved}
                </p>
              </div>

              {/* Escrow Financial Box */}
              <div className="p-3.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">Case Total</span>
                  <span className="font-bold">
                    ${currentCase.priceUsd.toFixed(2)} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted-foreground)]">
                    Payment State
                  </span>
                  <span className="font-semibold text-[#054bce]">
                    {currentCase.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[var(--muted-foreground)] pt-1 border-t border-[var(--border)]">
                  <span>Designer Share (88%): ${currentCase.designerNetUsd.toFixed(2)}</span>
                  <span>Fee (12%): ${currentCase.commissionUsd.toFixed(2)}</span>
                </div>
              </div>

              {/* Parties */}
              <div className="space-y-2.5 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Parties
                </div>
                <div className="p-3 rounded-lg border border-[var(--border)] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[var(--muted-foreground)]">
                      Dental Practice
                    </div>
                    <div className="font-bold">{currentCase.dentistName}</div>
                    <div className="text-[11px] text-[var(--muted-foreground)]">
                      {currentCase.practiceName}
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-[var(--border)] flex items-center gap-3">
                  <img
                    src={currentCase.designerAvatar}
                    alt={currentCase.designerName}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-[10px] text-[var(--muted-foreground)]">
                      Assigned CAD Designer
                    </div>
                    <Link
                      to={`/designer/${currentCase.designerId}`}
                      className="font-bold hover:text-[#054bce]"
                    >
                      {currentCase.designerName}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Primary Role Actions */}
              <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Case Actions
                </div>

                {/* Dentist Actions */}
                {currentCase.status !== 'Completed' &&
                  currentCase.status !== 'Disputed Closed' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setShowAcceptModal(true)}
                        className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Design & Complete</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setShowRevisionModal(true)}
                          className="py-2 px-3 rounded-lg border border-[var(--border)] hover:bg-[var(--secondary)] text-xs font-semibold flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Send Revision</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowDisputeModal(true)}
                          className="py-2 px-3 rounded-lg border border-red-500/30 text-red-600 hover:bg-red-500/10 text-xs font-semibold flex items-center justify-center gap-1.5"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                          <span>Dispute Case</span>
                        </button>
                      </div>
                    </>
                  )}

                {/* Designer Actions */}
                {currentCase.status === 'Awaiting Designer' && (
                  <button
                    type="button"
                    onClick={handleDesignerAcceptCase}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white font-semibold text-xs flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Designer: Accept Case & Capture Escrow</span>
                  </button>
                )}

                {currentCase.status !== 'Completed' && (
                  <div className="p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] space-y-2">
                    <div className="text-[11px] font-semibold">
                      Designer: Upload Deliverable STL & Submit
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={newDeliverableName}
                        onChange={(e) => setNewDeliverableName(e.target.value)}
                        placeholder="Final_Crown_CAM.stl"
                        className="flex-1 px-2.5 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleDesignerUploadAndSubmit}
                        className="px-3 py-1.5 rounded-lg bg-[#054bce] text-white text-xs font-semibold shrink-0"
                      >
                        Submit Files
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Activity Timeline */}
              <div className="space-y-3 pt-2 border-t border-[var(--border)]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Activity Timeline
                </div>
                <div className="space-y-3">
                  {currentCase.timeline.map((ev) => (
                    <div
                      key={ev.id}
                      className="pl-3 border-l-2 border-[#054bce] space-y-0.5 text-xs"
                    >
                      <div className="font-bold">{ev.status}</div>
                      <div className="text-[11px] text-[var(--muted-foreground)]">
                        {ev.note}
                      </div>
                      <div className="text-[10px] text-[var(--muted-foreground)] opacity-75">
                        {ev.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Compact File List Mode */
            <div className="p-4 space-y-3">
              <div className="text-xs font-bold">
                Compact File List — Click to View in 3D
              </div>
              {allCaseFiles.map((f) => (
                <div
                  key={f.id}
                  onClick={() => setActiveTab('3d')}
                  className="p-3 rounded-xl border border-[var(--border)] hover:border-[#054bce] cursor-pointer flex items-center justify-between gap-2 text-xs transition-colors"
                >
                  <div className="truncate">
                    <div className="font-semibold truncate">{f.name}</div>
                    <div className="text-[10px] text-[var(--muted-foreground)]">
                      {f.section} · {f.format} · {f.size}
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#054bce] shrink-0">
                    3D View →
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT WORKSPACE (8 cols): 4 Tabs */}
        <div className="lg:col-span-8 space-y-4">
          {/* 4 Tabs Header */}
          <div className="p-1.5 rounded-xl bg-[var(--background)] border border-[var(--border)] grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {(
              [
                { id: 'overview', label: 'Overview', icon: FileText },
                {
                  id: 'files',
                  label: `Files (${allCaseFiles.length})`,
                  icon: FolderKanban,
                },
                {
                  id: '3d',
                  label: '3D & digital design',
                  icon: Box,
                },
                {
                  id: 'conversation',
                  label: `Conversation (${currentCase.messages.length})`,
                  icon: MessageSquare,
                },
              ] as const
            ).map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeTab === t.id
                      ? 'bg-[#054bce] text-white shadow-xs'
                      : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-6">
              <div>
                <h3 className="text-sm font-bold mb-2">
                  Clinical Prescription & Case Instructions
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
                  {currentCase.caseNotes}
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
                  <div className="text-[var(--muted-foreground)] mb-1">
                    Service Category
                  </div>
                  <div className="font-bold">{currentCase.service}</div>
                </div>
                <div className="p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
                  <div className="text-[var(--muted-foreground)] mb-1">
                    Teeth / Arch Involved
                  </div>
                  <div className="font-bold">{currentCase.teethInvolved}</div>
                </div>
                <div className="p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
                  <div className="text-[var(--muted-foreground)] mb-1">
                    Restorative Material
                  </div>
                  <div className="font-bold">{currentCase.material}</div>
                </div>
              </div>

              {/* Quick 3D Launch Banner */}
              <div className="p-5 rounded-xl bg-[#0d0d1a] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-[#60a5fa] mb-1">
                    ✦ Built-in Browser 3D STL/PLY/OBJ & Web Link Viewer
                  </div>
                  <p className="text-xs text-gray-300">
                    Inspect {currentCase.scanFiles.length} scan file(s),{' '}
                    {currentCase.deliverableFiles.length} finished deliverable(s), and{' '}
                    {currentCase.webLinks.length} interactive digital design web link(s).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('3d')}
                  className="px-4 py-2.5 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold shrink-0"
                >
                  Open 3D & Digital Design →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FILES (3 sections: Your scan files, Designer deliverables, Web links) */}
          {activeTab === 'files' && (
            <div className="space-y-5">
              {/* Section 1: Your scan files */}
              <div className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold">1. Your scan files</h3>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Intraoral STL, PLY, and OBJ preparation & antagonist scans uploaded by the dental practice
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('3d')}
                    className="text-xs font-semibold text-[#054bce] hover:underline"
                  >
                    Inspect in 3D →
                  </button>
                </div>
                <div className="space-y-2">
                  {currentCase.scanFiles.map((f) => (
                    <div
                      key={f.id}
                      className="p-3.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded bg-[#054bce]/10 text-[#054bce] font-mono font-bold text-[10px]">
                          {f.format}
                        </span>
                        <div>
                          <div className="font-semibold">{f.name}</div>
                          <div className="text-[11px] text-[var(--muted-foreground)]">
                            {f.size} · Uploaded by {f.uploadedBy} ({f.uploadedAt})
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('3d')}
                        className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--secondary)] font-semibold text-xs"
                      >
                        View 3D
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Designer deliverables */}
              <div className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold">
                      2. Designer deliverables
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Production-ready CAM STL designs uploaded by {currentCase.designerName}
                    </p>
                  </div>
                </div>
                {currentCase.deliverableFiles.length === 0 ? (
                  <div className="p-6 rounded-xl bg-[var(--muted)] text-center text-xs text-[var(--muted-foreground)]">
                    No deliverables uploaded yet. Use the Designer upload box in the left rail to submit a finished STL.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentCase.deliverableFiles.map((f) => (
                      <div
                        key={f.id}
                        className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 font-mono font-bold text-[10px]">
                            {f.format}
                          </span>
                          <div>
                            <div className="font-semibold">{f.name}</div>
                            <div className="text-[11px] text-[var(--muted-foreground)]">
                              {f.size} · Submitted by {f.uploadedBy} ({f.uploadedAt})
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveTab('3d')}
                            className="px-3 py-1.5 rounded-lg bg-[#054bce] text-white font-semibold text-xs"
                          >
                            Inspect 3D
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 3: Web links (https:// validator) */}
              <div className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-4">
                <div>
                  <h3 className="text-sm font-bold">
                    3. Web links (Digital Design Previews)
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Share exocad WebView or 3Shape Communicate links starting with{' '}
                    <code className="font-mono text-[#054bce]">https://</code> so the dentist can open them inside the 3D & digital design tab.
                  </p>
                </div>

                <form
                  onSubmit={handleAddWebLink}
                  className="grid sm:grid-cols-12 gap-2"
                >
                  <input
                    type="text"
                    value={newWebLabel}
                    onChange={(e) => setNewWebLabel(e.target.value)}
                    placeholder="Label (e.g. exocad WebView #24-#26)"
                    className="sm:col-span-4 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
                  />
                  <input
                    type="text"
                    value={newWebUrl}
                    onChange={(e) => setNewWebUrl(e.target.value)}
                    placeholder="https://webview.dentalcad.exoconnect.io/..."
                    className="sm:col-span-6 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
                  />
                  <button
                    type="submit"
                    className="sm:col-span-2 py-2 px-3 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold"
                  >
                    Add Link
                  </button>
                </form>

                {webUrlError && (
                  <div className="text-xs text-red-600 font-semibold">
                    {webUrlError}
                  </div>
                )}

                <div className="space-y-2">
                  {currentCase.webLinks.map((wl) => (
                    <div
                      key={wl.id}
                      className="p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Link2 className="w-4 h-4 text-[#054bce] shrink-0" />
                        <div className="truncate">
                          <div className="font-semibold">{wl.label}</div>
                          <div className="text-[11px] text-[var(--muted-foreground)] truncate">
                            {wl.url}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab('3d')}
                        className="px-3 py-1.5 rounded-lg bg-[#054bce] text-white text-xs font-semibold shrink-0"
                      >
                        Open in Viewer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 3D & DIGITAL DESIGN */}
          {activeTab === '3d' && (
            <div className="rounded-2xl bg-[var(--background)] border border-[var(--border)] overflow-hidden p-4">
              <Exo3DViewer
                items={viewerItems}
                activeIndex={activeViewerIndex}
                onChangeIndex={setActiveViewerIndex}
                onBackToAllFiles={() => setActiveTab('files')}
              />
            </div>
          )}

          {/* TAB 4: CONVERSATION */}
          {activeTab === 'conversation' && (
            <div className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] flex flex-col h-[520px]">
              <div className="pb-4 border-b border-[var(--border)] mb-4">
                <h3 className="text-sm font-bold">Case Conversation</h3>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Direct clinical & CAD messaging between {currentCase.dentistName} and{' '}
                  {currentCase.designerName}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {currentCase.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-xl max-w-xl text-xs ${
                      m.senderRole === user.role
                        ? 'ml-auto bg-[#054bce] text-white'
                        : 'bg-[var(--muted)] border border-[var(--border)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1 opacity-80 text-[10px] font-semibold">
                      <span>{m.senderName}</span>
                      <span>{m.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{m.text}</p>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="pt-4 mt-4 border-t border-[var(--border)] flex gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Write a message about margin lines, emergence profile, or occlusion..."
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ACCEPT DESIGN & 5-STAR REVIEW MODAL */}
      {showAcceptModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[var(--background)] border border-[var(--border)] p-6 space-y-4">
            <h3 className="text-lg font-bold">
              Accept Design & Complete Case
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Approving this design releases{' '}
              <strong>${currentCase.designerNetUsd.toFixed(2)} (88%)</strong> from escrow to{' '}
              <strong>{currentCase.designerName}</strong> and marks{' '}
              {currentCase.projectNumber} as Completed.
            </p>

            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Rate {currentCase.designerName} (1–5 Stars)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setRating(st)}
                    className={`p-2 rounded-lg border ${
                      rating >= st
                        ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                        : 'border-[var(--border)] text-gray-400'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Public Review Comment
              </label>
              <textarea
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAcceptModal(false)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDentistApproveAndComplete}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Confirm & Release Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEND REVISION MODAL */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[var(--background)] border border-[var(--border)] p-6 space-y-4">
            <h3 className="text-lg font-bold">Request CAD Revision</h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Describe the occlusal, contact, or margin adjustments needed. Funds remain safely in escrow while the designer revises the STL.
            </p>
            <textarea
              rows={4}
              value={revisionNote}
              onChange={(e) => setRevisionNote(e.target.value)}
              placeholder="e.g., Please reduce mesial contact on #24 by 0.02mm and deepen central fossa..."
              className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRevisionModal(false)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDentistSendRevision}
                className="px-4 py-2 rounded-lg bg-[#054bce] text-white text-xs font-semibold"
              >
                Send Revision Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPUTE MODAL */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[var(--background)] border border-[var(--border)] p-6 space-y-4">
            <h3 className="text-lg font-bold text-red-600">Dispute This Case</h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              Opening a dispute freezes the escrow balance and alerts the ExoConnect Arbitration team to review the 3D files and conversation history.
            </p>
            <textarea
              rows={4}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Explain the issue with the design or turnaround..."
              className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDisputeModal(false)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleOpenDispute}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
};

/* ==========================================================================
   5. PORTAL MESSAGES PAGE (/messages & /designer/messages)
   ========================================================================== */
export const PortalMessagesPage: React.FC = () => {
  const [cases, setCases] = useState<ExoCase[]>(() => getExoCases());
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    () => getExoCases()[0]?.id || '1048'
  );
  const [text, setText] = useState('');
  const user = getExoUser();

  useEffect(() => {
    const sync = () => setCases(getExoCases());
    window.addEventListener('exo-store-updated', sync);
    return () => window.removeEventListener('exo-store-updated', sync);
  }, []);

  const activeCase =
    cases.find((c) => c.id === selectedCaseId) || cases[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !activeCase) return;
    updateExoCase(activeCase.id, (c) => ({
      ...c,
      messages: [
        ...c.messages,
        {
          id: `m-${Date.now()}`,
          senderName: `${user.firstName} ${user.lastName}`,
          senderRole: user.role,
          text: text.trim(),
          timestamp: 'Just now',
        },
      ],
    }));
    setText('');
  };

  return (
    <PortalShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Case Messages</h1>
        <p className="text-xs text-[var(--muted-foreground)] mt-1">
          All conversations organized by project number.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 h-[560px]">
        <div className="lg:col-span-4 rounded-2xl bg-[var(--background)] border border-[var(--border)] overflow-y-auto divide-y divide-[var(--border)]">
          {cases.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCaseId(c.id)}
              className={`w-full text-left p-4 transition-colors ${
                c.id === activeCase?.id
                  ? 'bg-blue-500/10'
                  : 'hover:bg-[var(--muted)]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-bold text-[#054bce]">
                  {c.projectNumber}
                </span>
                <span className="text-[11px] text-[var(--muted-foreground)]">
                  {c.messages.length} msgs
                </span>
              </div>
              <div className="text-xs font-bold truncate">{c.title}</div>
              <div className="text-[11px] text-[var(--muted-foreground)] truncate mt-0.5">
                {c.designerName} · {c.dentistName}
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-8 rounded-2xl bg-[var(--background)] border border-[var(--border)] p-5 flex flex-col">
          {activeCase && (
            <>
              <div className="pb-3 mb-4 border-b border-[var(--border)] flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold">
                    {activeCase.projectNumber} · {activeCase.title}
                  </div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">
                    {activeCase.dentistName} & {activeCase.designerName}
                  </div>
                </div>
                <Link
                  to={`/projects/${activeCase.id}`}
                  className="text-xs font-semibold text-[#054bce] hover:underline"
                >
                  Open Case Workspace →
                </Link>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {activeCase.messages.length === 0 ? (
                  <div className="text-xs text-[var(--muted-foreground)] text-center py-12">
                    No messages yet on this case.
                  </div>
                ) : (
                  activeCase.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl max-w-lg text-xs ${
                        m.senderRole === user.role
                          ? 'ml-auto bg-[#054bce] text-white'
                          : 'bg-[var(--muted)] border border-[var(--border)]'
                      }`}
                    >
                      <div className="flex justify-between gap-4 text-[10px] opacity-80 font-semibold mb-1">
                        <span>{m.senderName}</span>
                        <span>{m.timestamp}</span>
                      </div>
                      <p>{m.text}</p>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={handleSend}
                className="pt-3 mt-3 border-t border-[var(--border)] flex gap-2"
              >
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Reply to thread..."
                  className="flex-1 px-3.5 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#054bce] text-white text-xs font-semibold"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </PortalShell>
  );
};

/* ==========================================================================
   6. REFERRALS PAGE (/referrals)
   Personal code 2FEGD5WD, share link, 2.5% reward tracking (Pending, Approved, Paid)
   ========================================================================== */
export const ReferralsPage: React.FC = () => {
  const user = getExoUser();
  const [copied, setCopied] = useState(false);
  const referralCode = user.referralCode || '2FEGD5WD';
  const shareUrl = `https://exoconnect.io/auth/register?ref=${referralCode}`;

  const handleCopy = (val: string) => {
    navigator.clipboard?.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PortalShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            ExoConnect Referral Program
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Invite dental practices, labs, or CAD designers and earn a{' '}
            <strong>2.5% referral reward</strong> on every completed project they do on ExoConnect.
          </p>
        </div>

        {/* Code & Share Link Card */}
        <div className="p-6 rounded-2xl bg-[#0d0d1a] text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#60a5fa] mb-1">
                ✦ Your Personal Referral Code
              </div>
              <div className="font-mono text-2xl font-bold tracking-wider">
                {referralCode}
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy( shareUrl )}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied Share Link!' : 'Copy Share Link'}</span>
            </button>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono text-gray-300">
            <span className="truncate">{shareUrl}</span>
            <Link
              to={`/auth/register?ref=${referralCode}`}
              className="text-[#60a5fa] hover:underline ml-3 shrink-0 font-sans font-semibold"
            >
              Test Link →
            </Link>
          </div>
        </div>

        {/* 3 Reward Status Totals: Pending, Approved, Paid */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-xs font-semibold text-[var(--muted-foreground)] mb-1">
              Pending Rewards (2.5%)
            </div>
            <div className="text-2xl font-bold text-amber-500">$42.50</div>
            <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
              From active escrow cases in progress
            </div>
          </div>
          <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-xs font-semibold text-[var(--muted-foreground)] mb-1">
              Approved Rewards
            </div>
            <div className="text-2xl font-bold text-[#054bce]">$118.00</div>
            <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
              Verified completed cases ready for next payout
            </div>
          </div>
          <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-xs font-semibold text-[var(--muted-foreground)] mb-1">
              Paid Rewards
            </div>
            <div className="text-2xl font-bold text-emerald-600">$390.00</div>
            <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
              Disbursed to your connected payout account
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
};

/* ==========================================================================
   7. DENTIST PROFILE PAGE (/profile)
   ========================================================================== */
export const DentistProfilePage: React.FC = () => {
  const [user, setUser] = useState<ExoUser>(() => getExoUser());
  const [savedBanner, setSavedBanner] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveExoUser(user);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  return (
    <PortalShell>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dental Practice Profile
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Manage your practice details, intraoral scanner preferences, and billing settings.
          </p>
        </div>

        {savedBanner && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Practice profile saved.</span>
          </div>
        )}

        <form
          onSubmit={handleSave}
          className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                First Name
              </label>
              <input
                type="text"
                value={user.firstName}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Last Name
              </label>
              <input
                type="text"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Practice / Lab Name
              </label>
              <input
                type="text"
                value={user.practiceName}
                onChange={(e) =>
                  setUser({ ...user, practiceName: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={user.location}
                onChange={(e) => setUser({ ...user, location: e.target.value })}
                className="w-full px-3.5 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">
              Default Clinical & Milling / Scanner Notes
            </label>
            <textarea
              rows={3}
              value={user.bio}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold"
          >
            Save Practice Changes
          </button>
        </form>
      </div>
    </PortalShell>
  );
};

/* ==========================================================================
   8. CAD DESIGNER DASHBOARD (/designer/dashboard)
   Includes "Your Payment Gateway setup is incomplete" banner + Setup Payment toggle
   ========================================================================== */
export const DesignerDashboardPage: React.FC = () => {
  const [user, setUser] = useState<ExoUser>(() => getExoUser());
  const [cases, setCases] = useState<ExoCase[]>(() => getExoCases());

  useEffect(() => {
    const sync = () => {
      setUser(getExoUser());
      setCases(getExoCases());
    };
    window.addEventListener('exo-store-updated', sync);
    return () => window.removeEventListener('exo-store-updated', sync);
  }, []);

  const incomingRequests = cases.filter(
    (c) => c.status === 'Awaiting Designer'
  );
  const activeJobs = cases.filter(
    (c) => c.status === 'In Progress' || c.status === 'Revision Requested' || c.status === 'Submitted'
  );
  const completedJobs = cases.filter((c) => c.status === 'Completed');
  const totalEarned = completedJobs.reduce((acc, c) => acc + c.designerNetUsd, 0);

  const togglePaymentGateway = () => {
    const updated = saveExoUser({
      paymentGatewayConnected: !user.paymentGatewayConnected,
    });
    setUser(updated);
  };

  return (
    <PortalShell>
      {/* Payment Gateway Alert Banner (exact ExoConnect Designer Onboarding check) */}
      {!user.paymentGatewayConnected ? (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                Your Payment Gateway setup is incomplete
              </div>
              <div className="text-[11px] text-[var(--muted-foreground)]">
                Connect your Stripe Express payout account so dental practices see your &quot;Ready for payouts&quot; badge and you can receive your 88% share immediately upon case completion.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={togglePaymentGateway}
            className="px-4 py-2 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold shrink-0"
          >
            Setup Payment
          </button>
        </div>
      ) : (
        <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              Payment Gateway Connected · Ready for automatic 88% escrow payouts
            </span>
          </div>
          <button
            type="button"
            onClick={togglePaymentGateway}
            className="text-[11px] text-[var(--muted-foreground)] hover:underline"
          >
            Simulate Incomplete Setup
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            CAD Designer Studio · {user.firstName} {user.lastName}
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Manage incoming dental scan requests, upload finished CAM STLs, and track your 88% net payouts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/designer/des-1"
            className="px-3.5 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs font-semibold hover:bg-[var(--secondary)]"
          >
            Preview Public Profile
          </Link>
          <Link
            to="/designer/profile"
            className="px-3.5 py-2 rounded-lg bg-[#054bce] text-white text-xs font-semibold"
          >
            Manage Services & Pricing
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
          <div className="text-xs text-[var(--muted-foreground)] font-semibold mb-1">
            Incoming Requests
          </div>
          <div className="text-2xl font-bold text-amber-500">
            {incomingRequests.length}
          </div>
          <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
            Card authorized · awaiting your acceptance
          </div>
        </div>
        <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
          <div className="text-xs text-[var(--muted-foreground)] font-semibold mb-1">
            Active CAD Jobs
          </div>
          <div className="text-2xl font-bold text-[#054bce]">
            {activeJobs.length}
          </div>
          <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
            In design or awaiting dentist approval
          </div>
        </div>
        <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
          <div className="text-xs text-[var(--muted-foreground)] font-semibold mb-1">
            Completed Projects
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {completedJobs.length}
          </div>
          <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
            99% completion rate
          </div>
        </div>
        <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
          <div className="text-xs text-[var(--muted-foreground)] font-semibold mb-1">
            Net Released Earnings (88%)
          </div>
          <div className="text-2xl font-bold">${totalEarned.toFixed(2)}</div>
          <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
            After 12% ExoConnect commission
          </div>
        </div>
      </div>

      {/* Quick link to Incoming Jobs */}
      <div className="rounded-xl bg-[var(--background)] border border-[var(--border)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold">Incoming & Active CAD Cases</h2>
          <Link
            to="/designer/jobs"
            className="text-xs font-semibold text-[#054bce] hover:underline"
          >
            Go to Full Jobs Queue →
          </Link>
        </div>
        <div className="space-y-3">
          {cases.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#054bce]">
                    {c.projectNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusBadgeClasses(
                      c.status
                    )}`}
                  >
                    {c.status}
                  </span>
                </div>
                <div className="font-bold text-sm mt-1">{c.title}</div>
                <div className="text-[11px] text-[var(--muted-foreground)]">
                  Client: {c.dentistName} ({c.practiceName}) · Your 88% Payout:{' '}
                  <strong>${c.designerNetUsd.toFixed(2)}</strong>
                </div>
              </div>
              <Link
                to={`/projects/${c.id}`}
                className="px-4 py-2 rounded-lg bg-[#054bce] text-white font-semibold text-xs shrink-0"
              >
                Open Case Workspace
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
};

/* ==========================================================================
   9. DESIGNER JOBS PAGE (/designer/jobs)
   Incoming Job Requests table at top (Accept / Decline) + Active Jobs below
   ========================================================================== */
export const DesignerJobsPage: React.FC = () => {
  const [cases, setCases] = useState<ExoCase[]>(() => getExoCases());

  useEffect(() => {
    const sync = () => setCases(getExoCases());
    window.addEventListener('exo-store-updated', sync);
    return () => window.removeEventListener('exo-store-updated', sync);
  }, []);

  const incoming = cases.filter((c) => c.status === 'Awaiting Designer');
  const activeAndPast = cases.filter((c) => c.status !== 'Awaiting Designer');

  const handleAccept = (caseId: string) => {
    updateExoCase(caseId, (c) => ({
      ...c,
      status: 'In Progress',
      paymentStatus: 'Escrow',
      timeline: [
        ...c.timeline,
        {
          id: `tl-${Date.now()}`,
          status: `Accepted by ${c.designerName}`,
          note: `Card authorization captured ($${c.priceUsd.toFixed(
            2
          )}) into Escrow. Case moved to In Progress.`,
          timestamp: 'Just now',
        },
      ],
    }));
  };

  const handleDecline = (caseId: string) => {
    updateExoCase(caseId, (c) => ({
      ...c,
      status: 'Disputed Closed',
      paymentStatus: 'Refunded',
      timeline: [
        ...c.timeline,
        {
          id: `tl-${Date.now()}`,
          status: 'Declined by Designer — Card Hold Released',
          note: 'Authorization hold voided immediately at zero charge to dentist.',
          timestamp: 'Just now',
        },
      ],
    }));
  };

  return (
    <PortalShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            CAD Designer Jobs Queue
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Accept incoming case requests to capture the dentist&apos;s card authorization into escrow and begin designing.
          </p>
        </div>

        {/* Incoming Job Requests Table */}
        <div className="rounded-2xl bg-[var(--background)] border border-[var(--border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] bg-amber-500/5">
            <h2 className="text-sm font-bold">
              Incoming Job Requests ({incoming.length})
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Accepting captures the authorized amount into escrow; declining immediately releases the hold on the dentist&apos;s card.
            </p>
          </div>

          {incoming.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--muted-foreground)]">
              No pending incoming requests right now. All requests have been accepted!
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {incoming.map((c) => (
                <div
                  key={c.id}
                  className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#054bce]">
                        {c.projectNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-semibold text-[11px]">
                        Awaiting Your Acceptance
                      </span>
                    </div>
                    <div className="text-sm font-bold">{c.title}</div>
                    <div className="text-[var(--muted-foreground)]">
                      Dentist: <strong>{c.dentistName}</strong> ({c.practiceName}) · Scans:{' '}
                      <strong>{c.scanFiles.length} STL/PLY</strong> · Your 88% Payout:{' '}
                      <strong className="text-emerald-600">
                        ${c.designerNetUsd.toFixed(2)}
                      </strong>{' '}
                      (Case total ${c.priceUsd.toFixed(2)})
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/projects/${c.id}`}
                      className="px-3.5 py-2 rounded-lg border border-[var(--border)] font-semibold hover:bg-[var(--secondary)]"
                    >
                      View details
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleAccept(c.id)}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDecline(c.id)}
                      className="px-3.5 py-2 rounded-lg border border-red-500/30 text-red-600 hover:bg-red-500/10 font-semibold"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active & Completed Jobs */}
        <div className="rounded-2xl bg-[var(--background)] border border-[var(--border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-sm font-bold">
              Active & Past Jobs ({activeAndPast.length})
            </h2>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {activeAndPast.map((c) => (
              <div
                key={c.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#054bce]">
                      {c.projectNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadgeClasses(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="text-sm font-bold mt-1">{c.title}</div>
                  <div className="text-[var(--muted-foreground)] mt-0.5">
                    {c.dentistName} · Designer Net (88%):{' '}
                    <strong>${c.designerNetUsd.toFixed(2)}</strong>
                  </div>
                </div>
                <Link
                  to={`/projects/${c.id}`}
                  className="px-4 py-2 rounded-lg bg-[#054bce] text-white font-semibold text-xs self-start sm:self-auto"
                >
                  Open Workspace & Upload STL
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
};

/* ==========================================================================
   10. DESIGNER EARNINGS PAGE (/designer/earnings)
   88% Designer Share vs 12% ExoConnect Commission breakdown
   ========================================================================== */
export const DesignerEarningsPage: React.FC = () => {
  const cases = getExoCases();
  const completed = cases.filter((c) => c.status === 'Completed');
  const escrow = cases.filter((c) => c.paymentStatus === 'Escrow');

  const totalEarned = completed.reduce((s, c) => s + c.designerNetUsd, 0);
  const inEscrowNet = escrow.reduce((s, c) => s + c.designerNetUsd, 0);

  return (
    <PortalShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Earnings & Payout Ledger
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Transparent 88% designer share on every project (12% ExoConnect platform commission).
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-xs text-[var(--muted-foreground)] font-semibold mb-1">
              Total Earnings (88% Net)
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              ${(totalEarned + 4120).toFixed(2)}
            </div>
            <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
              Lifetime net CAD design payouts
            </div>
          </div>
          <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-xs text-[var(--muted-foreground)] font-semibold mb-1">
              Total Withdrawn
            </div>
            <div className="text-2xl font-bold">$4,120.00</div>
            <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
              Transferred to bank via Stripe Express
            </div>
          </div>
          <div className="p-5 rounded-xl bg-[var(--background)] border border-[var(--border)]">
            <div className="text-xs text-[var(--muted-foreground)] font-semibold mb-1">
              Active Escrow Balance (88%)
            </div>
            <div className="text-2xl font-bold text-[#054bce]">
              ${inEscrowNet.toFixed(2)}
            </div>
            <div className="text-[11px] text-[var(--muted-foreground)] mt-1">
              Released immediately when dentist approves design
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-[var(--background)] border border-[var(--border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)]">
            <h2 className="text-sm font-bold">
              Project Commission & Payout Breakdown (88% / 12%)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--muted)] text-[11px] uppercase text-[var(--muted-foreground)]">
                  <th className="py-3 px-6">Project</th>
                  <th className="py-3 px-4">Dentist Price (100%)</th>
                  <th className="py-3 px-4">ExoConnect Fee (12%)</th>
                  <th className="py-3 px-4">Your Net Payout (88%)</th>
                  <th className="py-3 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {cases.map((c) => (
                  <tr key={c.id}>
                    <td className="py-3.5 px-6 font-semibold">
                      {c.projectNumber} · {c.service}
                    </td>
                    <td className="py-3.5 px-4">${c.priceUsd.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-[var(--muted-foreground)]">
                      -${c.commissionUsd.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">
                      ${c.designerNetUsd.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-6">{c.paymentStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalShell>
  );
};

/* ==========================================================================
   11. DESIGNER PROFILE & SERVICES MANAGER (/designer/profile)
   Preview Profile button, Specializations tag adder, Portfolio up to 12 images,
   and "My Services & Pricing" dropdown + price + Add Service manager
   ========================================================================== */
export const DesignerProfilePage: React.FC = () => {
  const [user, setUser] = useState<ExoUser>(() => getExoUser());
  const [newSpec, setNewSpec] = useState('');
  const [selectedService, setSelectedService] = useState<string>(
    EXO_SERVICES[4]
  );
  const [servicePrice, setServicePrice] = useState('145');
  const [turnaroundHours, setTurnaroundHours] = useState('24');

  const [portfolioTitle, setPortfolioTitle] = useState('');
  const [portfolioService, setPortfolioService] = useState<string>(
    EXO_SERVICES[0]
  );
  const [portfolioImage, setPortfolioImage] = useState(
    'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80'
  );
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveBasic = (e: React.FormEvent) => {
    e.preventDefault();
    saveExoUser(user);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(servicePrice) || 120;
    const turnNum = Number(turnaroundHours) || 24;
    const nextServices = [
      ...user.services.filter((s) => s.service !== selectedService),
      {
        id: `srv-${Date.now()}`,
        service: selectedService,
        priceUsd: priceNum,
        turnaroundHours: turnNum,
      },
    ];
    const updated = saveExoUser({ services: nextServices });
    setUser(updated);
  };

  const handleRemoveService = (id: string) => {
    const updated = saveExoUser({
      services: user.services.filter((s) => s.id !== id),
    });
    setUser(updated);
  };

  const handleAddPortfolio = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portfolioTitle.trim() || user.portfolio.length >= 12) return;
    const nextPortfolio = [
      ...user.portfolio,
      {
        id: `pf-${Date.now()}`,
        title: portfolioTitle.trim(),
        service: portfolioService,
        image: portfolioImage,
      },
    ];
    const updated = saveExoUser({ portfolio: nextPortfolio });
    setUser(updated);
    setPortfolioTitle('');
  };

  return (
    <PortalShell>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              CAD Designer Profile & Services
            </h1>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">
              Configure your public marketplace profile, portfolio samples (up to 12), and per-service pricing.
            </p>
          </div>
          <Link
            to="/designer/des-1"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#054bce] text-white text-xs font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Preview Profile</span>
          </Link>
        </div>

        {savedNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600">
            Designer profile & public directory listing updated!
          </div>
        )}

        {/* My Services & Pricing */}
        <div className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-4">
          <div>
            <h2 className="text-base font-bold">My Services & Pricing</h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Set your exact USD rate per restoration type. You keep 88% of the listed rate on every case.
            </p>
          </div>

          <form
            onSubmit={handleAddService}
            className="grid sm:grid-cols-12 gap-3 items-end"
          >
            <div className="sm:col-span-5">
              <label className="block text-[11px] font-semibold mb-1">
                Service Type
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
              >
                {EXO_SERVICES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-semibold mb-1">
                Price (USD $)
              </label>
              <input
                type="number"
                min={20}
                value={servicePrice}
                onChange={(e) => setServicePrice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold mb-1">
                Turnaround (hrs)
              </label>
              <input
                type="number"
                min={6}
                value={turnaroundHours}
                onChange={(e) => setTurnaroundHours(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold"
              >
                Add Service
              </button>
            </div>
          </form>

          <div className="divide-y divide-[var(--border)] pt-2">
            {user.services.map((s) => (
              <div
                key={s.id}
                className="py-3 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold">{s.service}</span>
                  <span className="text-[var(--muted-foreground)] ml-2">
                    · {s.turnaroundHours}h turnaround
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-[#054bce]">
                    ${s.priceUsd.toFixed(2)} USD
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveService(s.id)}
                    className="text-red-500 hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Basic Profile & Specializations */}
        <form
          onSubmit={handleSaveBasic}
          className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-4"
        >
          <h2 className="text-base font-bold">Basic Profile Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">
                First Name
              </label>
              <input
                type="text"
                value={user.firstName}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">
              Headline / CAD Credentials
            </label>
            <input
              type="text"
              value={user.title}
              onChange={(e) => setUser({ ...user, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Bio</label>
            <textarea
              rows={3}
              value={user.bio}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">
              Specializations & CAD Software Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {user.specializations.map((sp) => (
                <span
                  key={sp}
                  className="px-2.5 py-1 rounded-full bg-blue-500/10 text-[#054bce] text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{sp}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setUser({
                        ...user,
                        specializations: user.specializations.filter(
                          (x) => x !== sp
                        ),
                      })
                    }
                    className="hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSpec}
                onChange={(e) => setNewSpec(e.target.value)}
                placeholder="Add specialization (e.g. Blenderfordental, MillBox)..."
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
              />
              <button
                type="button"
                onClick={() => {
                  if (!newSpec.trim()) return;
                  setUser({
                    ...user,
                    specializations: [...user.specializations, newSpec.trim()],
                  });
                  setNewSpec('');
                }}
                className="px-3.5 py-2 rounded-lg border border-[var(--border)] text-xs font-semibold"
              >
                Add Tag
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-[#054bce] text-white text-xs font-semibold"
          >
            Save Profile Info
          </button>
        </form>

        {/* Portfolio / Work Samples (up to 12 images) */}
        <div className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold">
                Portfolio / Work Samples ({user.portfolio.length} / 12)
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Showcase up to 12 high-resolution CAD screenshots on your public ExoConnect designer page.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleAddPortfolio}
            className="grid sm:grid-cols-12 gap-2"
          >
            <input
              type="text"
              value={portfolioTitle}
              onChange={(e) => setPortfolioTitle(e.target.value)}
              placeholder="Sample title (e.g. Full-Arch Titanium Bar)"
              className="sm:col-span-5 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
            />
            <select
              value={portfolioService}
              onChange={(e) => setPortfolioService(e.target.value)}
              className="sm:col-span-4 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs"
            >
              {EXO_SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="sm:col-span-3 py-2 px-3 rounded-lg bg-[#054bce] text-white text-xs font-semibold"
            >
              Add Portfolio Sample
            </button>
          </form>

          <div className="grid sm:grid-cols-3 gap-4">
            {user.portfolio.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-[var(--border)] overflow-hidden bg-[var(--muted)]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3 text-xs">
                  <div className="font-bold truncate">{item.title}</div>
                  <div className="text-[11px] text-[var(--muted-foreground)]">
                    {item.service}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalShell>
  );
};

/* ==========================================================================
   12. ADMIN DISPUTES PORTAL (/admin)
   Settle disputed cases with 1 of 3 outcomes:
   - Refund Dentist in Full (net of card processing fee)
   - Release to Designer (88% share)
   - Split It (custom percentage)
   ========================================================================== */
export const AdminDisputesPage: React.FC = () => {
  const [cases, setCases] = useState<ExoCase[]>(() => getExoCases());
  const [splitPct, setSplitPct] = useState<number>(50);

  useEffect(() => {
    const sync = () => setCases(getExoCases());
    window.addEventListener('exo-store-updated', sync);
    return () => window.removeEventListener('exo-store-updated', sync);
  }, []);

  const handleSettle = (
    caseId: string,
    outcome: 'refund' | 'release' | 'split'
  ) => {
    updateExoCase(caseId, (c) => {
      if (outcome === 'refund') {
        const processingFee = Number((c.priceUsd * 0.029 + 0.3).toFixed(2));
        const netRefund = Number((c.priceUsd - processingFee).toFixed(2));
        return {
          ...c,
          status: 'Disputed Closed',
          paymentStatus: 'Refunded',
          disputeResolutionNote: `Refunded Dentist in Full ($${netRefund} net of $${processingFee} card processing fee).`,
          timeline: [
            ...c.timeline,
            {
              id: `tl-${Date.now()}`,
              status: 'Dispute Closed — Refund Dentist in Full',
              note: `Refunded $${netRefund.toFixed(
                2
              )} to dental practice (net of card processing fee).`,
              timestamp: 'Just now',
            },
          ],
        };
      }
      if (outcome === 'release') {
        return {
          ...c,
          status: 'Disputed Closed',
          paymentStatus: 'Released',
          disputeResolutionNote: `Released $${c.designerNetUsd.toFixed(
            2
          )} (88% share) to ${c.designerName}.`,
          timeline: [
            ...c.timeline,
            {
              id: `tl-${Date.now()}`,
              status: 'Dispute Closed — Released to Designer (88%)',
              note: `Designer received $${c.designerNetUsd.toFixed(2)}.`,
              timestamp: 'Just now',
            },
          ],
        };
      }
      const dentistAmt = Number(((c.priceUsd * splitPct) / 100).toFixed(2));
      const designerAmt = Number(
        ((c.designerNetUsd * (100 - splitPct)) / 100).toFixed(2)
      );
      return {
        ...c,
        status: 'Disputed Closed',
        paymentStatus: 'Split',
        disputeResolutionNote: `Split Outcome (${splitPct}% Dentist $${dentistAmt} / ${
          100 - splitPct
        }% Designer $${designerAmt}).`,
        timeline: [
          ...c.timeline,
          {
            id: `tl-${Date.now()}`,
            status: `Dispute Closed — Custom Split (${splitPct}% / ${
              100 - splitPct
            }%)`,
            note: `Dentist refunded $${dentistAmt}; Designer paid $${designerAmt}.`,
            timestamp: 'Just now',
          },
        ],
      };
    });
  };

  return (
    <PortalShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            ExoConnect Dispute & Escrow Arbitration
          </h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Review case files, 3D STL meshes, and conversation logs to settle disputed projects using one of ExoConnect&apos;s 3 official resolution outcomes.
          </p>
        </div>

        <div className="space-y-4">
          {cases.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-2xl bg-[var(--background)] border border-[var(--border)] space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#054bce]">
                      {c.projectNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusBadgeClasses(
                        c.status
                      )}`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mt-1">{c.title}</h3>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Dentist: {c.dentistName} · Designer: {c.designerName} · Escrow:{' '}
                    <strong>${c.priceUsd.toFixed(2)}</strong>
                  </p>
                </div>
                <Link
                  to={`/projects/${c.id}`}
                  className="text-xs font-semibold text-[#054bce] hover:underline"
                >
                  Inspect Case 3D Files & Chat →
                </Link>
              </div>

              {c.disputeResolutionNote && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-600">
                  Resolution: {c.disputeResolutionNote}
                </div>
              )}

              <div className="pt-3 border-t border-[var(--border)] flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSettle(c.id, 'refund')}
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                >
                  1. Refund Dentist in Full (Net of Fee)
                </button>
                <button
                  type="button"
                  onClick={() => handleSettle(c.id, 'release')}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  2. Release to Designer (88% Share)
                </button>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={10}
                    max={90}
                    value={splitPct}
                    onChange={(e) => setSplitPct(Number(e.target.value))}
                    className="w-16 px-2 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs text-center"
                  />
                  <button
                    type="button"
                    onClick={() => handleSettle(c.id, 'split')}
                    className="px-4 py-2 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white text-xs font-semibold"
                  >
                    3. Split It ({splitPct}% / {100 - splitPct}%)
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PortalShell>
  );
};
