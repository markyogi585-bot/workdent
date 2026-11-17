import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import {
  DEFAULT_EXO_USERS,
  EXO_SERVICES,
  ExoRole,
  saveExoUser,
  switchExoRole,
} from '../lib/exoStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('amelia@vanceprosthodontics.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ExoRole>('dentist');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = switchExoRole(selectedRole);
    saveExoUser({ ...user, email: email || user.email, loggedIn: true });
    if (selectedRole === 'designer') {
      navigate('/designer/dashboard');
    } else if (selectedRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const handleQuickRoleSelect = (role: ExoRole) => {
    setSelectedRole(role);
    setEmail(DEFAULT_EXO_USERS[role].email);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-[var(--background)] text-[var(--foreground)]">
      {/* Left dark #0d0d1a ExoConnect panel */}
      <div className="hidden lg:flex lg:col-span-6 bg-[#0d0d1a] text-white p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, #054bce 0%, transparent 55%)',
          }}
        />
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#054bce] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              e
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              exo<span className="text-[#60a5fa]">connect</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg my-auto py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-blue-300 mb-6">
            <span>✦ Dental CAD Marketplace</span>
          </div>
          <h1 className="text-3xl xl:text-4xl font-bold tracking-tight leading-tight mb-5">
            Connect with the best dental CAD designers.
          </h1>
          <p className="text-gray-300 text-base leading-relaxed mb-10">
            Professional STL files. Fast turnaround. Guaranteed quality. Review designs in 3D right in your browser and pay only when a designer accepts your case.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold text-white">1,200+</div>
              <div className="text-xs text-gray-400 mt-1">Designers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">50K+</div>
              <div className="text-xs text-gray-400 mt-1">Projects Done</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">4.9★</div>
              <div className="text-xs text-gray-400 mt-1">Avg Rating</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-gray-400">
          <span>© 2026 ExoConnect. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 xl:px-20 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <Link to="/" className="lg:hidden inline-flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#054bce] text-white font-bold flex items-center justify-center text-sm">
                e
              </div>
              <span className="font-bold text-base">exoconnect</span>
            </Link>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Welcome back
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            Sign in to your ExoConnect account to manage cases, STL scans, and payouts.
          </p>

          {/* Role Switcher Pill Bar */}
          <div className="mb-6 p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
              Select Account Role
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'dentist', label: 'Dental Practice' },
                  { id: 'designer', label: 'CAD Designer' },
                  { id: 'admin', label: 'Dispute Admin' },
                ] as { id: ExoRole; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleQuickRoleSelect(tab.id)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedRole === tab.id
                      ? 'bg-[#054bce] text-white shadow-xs'
                      : 'bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@practice.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:border-[#054bce]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold">Password</label>
                <Link
                  to="/auth/forgot"
                  className="text-xs font-semibold text-[#054bce] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:border-[#054bce]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Sign In to ExoConnect</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--border)]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-[var(--background)] text-[var(--muted-foreground)]">
                or continue with
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const user = switchExoRole(selectedRole);
              saveExoUser({ ...user, loggedIn: true });
              navigate(
                selectedRole === 'designer'
                  ? '/designer/dashboard'
                  : selectedRole === 'admin'
                  ? '/admin'
                  : '/dashboard'
              );
            }}
            className="w-full py-2.5 px-4 rounded-lg border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--secondary)] text-sm font-semibold flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-xs text-[var(--muted-foreground)] mt-6">
            Don&apos;t have an account?{' '}
            <Link
              to="/auth/register"
              className="font-semibold text-[#054bce] hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole: 'dentist' | 'designer' =
    searchParams.get('role') === 'designer' ? 'designer' : 'dentist';
  const refCode = searchParams.get('ref') || '';

  const [role, setRole] = useState<'dentist' | 'designer'>(initialRole);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Step 2 Dentist fields
  const [practiceName, setPracticeName] = useState('');
  const [practiceType, setPracticeType] = useState('General Dentistry');
  const [location, setLocation] = useState('');

  // Step 2 Designer fields
  const [specialization, setSpecialization] = useState<string>(EXO_SERVICES[0]);
  const [yearsExp, setYearsExp] = useState('5');
  const [designerLocation, setDesignerLocation] = useState('');

  // Step 3 6-digit verification code
  const [verificationCode, setVerificationCode] = useState('482910');

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleVerifyComplete = (e: React.FormEvent) => {
    e.preventDefault();
    const baseUser = switchExoRole(role);
    saveExoUser({
      ...baseUser,
      firstName: firstName || baseUser.firstName,
      lastName: lastName || baseUser.lastName,
      email: email || baseUser.email,
      role,
      practiceName:
        role === 'dentist'
          ? practiceName || baseUser.practiceName
          : `${firstName || 'Studio'} Dental CAD`,
      practiceType:
        role === 'dentist' ? practiceType : 'Independent CAD Designer',
      location:
        role === 'dentist'
          ? location || baseUser.location
          : designerLocation || baseUser.location,
      yearsExperience:
        role === 'designer' ? Number(yearsExp) || 5 : baseUser.yearsExperience,
      specializations:
        role === 'designer' ? [specialization] : baseUser.specializations,
      referredByCode: refCode || undefined,
      loggedIn: true,
    });

    if (role === 'designer') {
      navigate('/designer/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-[var(--background)] text-[var(--foreground)]">
      {/* Left dark panel */}
      <div className="hidden lg:flex lg:col-span-5 bg-[#0d0d1a] text-white p-12 flex-col justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#054bce] flex items-center justify-center text-white font-bold text-lg">
              e
            </div>
            <span className="font-bold text-xl tracking-tight">
              exo<span className="text-[#60a5fa]">connect</span>
            </span>
          </Link>
        </div>

        <div className="my-auto py-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-blue-300 mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {role === 'dentist' ? 'For Dental Practices & Labs' : 'For CAD Designers'}
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight leading-tight mb-4">
            {role === 'dentist'
              ? 'Send scans directly to vetted CAD designers.'
              : 'Get paid for your dental CAD expertise.'}
          </h1>
          <p className="text-sm text-gray-300 leading-relaxed mb-8">
            {role === 'dentist'
              ? 'Free to join. Browse real portfolios, authorize your card only when submitting a case, and review every restoration in 3D before approving.'
              : 'Set your own rates per service, keep 88% of every completed project, and receive direct payouts with zero subscription required.'}
          </p>

          <div className="space-y-3 text-xs text-gray-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#60a5fa] shrink-0" />
              <span>2-step role onboarding with instant workspace access</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#60a5fa] shrink-0" />
              <span>Built-in 3D STL/PLY/OBJ viewer & digital web link preview</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#60a5fa] shrink-0" />
              <span>Escrow payment protection on every single case</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-400">
          © 2026 ExoConnect. Connect. Design. Deliver.
        </div>
      </div>

      {/* Right form */}
      <div className="lg:col-span-7 flex flex-col justify-center px-6 sm:px-12 xl:px-20 py-12">
        <div className="max-w-lg w-full mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <span className="text-xs font-semibold text-[var(--muted-foreground)]">
              Step {step} of 3
            </span>
          </div>

          {refCode && (
            <div className="mb-5 px-4 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-[#054bce] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Referred with code {refCode}</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Create your ExoConnect account
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            Choose your account type to customize your workspace.
          </p>

          {/* Role Toggle: Dental Practice vs CAD Designer */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-[var(--muted)] border border-[var(--border)] mb-6">
            <button
              type="button"
              onClick={() => setRole('dentist')}
              className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                role === 'dentist'
                  ? 'bg-[#054bce] text-white shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Dental Practice
            </button>
            <button
              type="button"
              onClick={() => setRole('designer')}
              className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                role === 'designer'
                  ? 'bg-[#054bce] text-white shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              CAD Designer
            </button>
          </div>

          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Amelia"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:border-[#054bce]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Vance"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:border-[#054bce]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dr.vance@practice.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:border-[#054bce]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  Password (minimum 8 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:border-[#054bce]"
                  />
                </div>
              </div>

              {error && (
                <div className="text-xs font-semibold text-red-600 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              {role === 'dentist' ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">
                      Practice or Laboratory Name
                    </label>
                    <input
                      type="text"
                      required
                      value={practiceName}
                      onChange={(e) => setPracticeName(e.target.value)}
                      placeholder="Vance Prosthodontics & Implant Center"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:border-[#054bce]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">
                      Practice Type
                    </label>
                    <select
                      value={practiceType}
                      onChange={(e) => setPracticeType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:border-[#054bce]"
                    >
                      <option>General Dentistry</option>
                      <option>Prosthodontics & Implant Center</option>
                      <option>Orthodontics & Esthetic Clinic</option>
                      <option>Commercial Dental Laboratory</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">
                      Location (City, Country)
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="San Francisco, United States"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:border-[#054bce]"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">
                      Primary CAD Specialization
                    </label>
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:border-[#054bce]"
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
                      Years of CAD Design Experience
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      required
                      value={yearsExp}
                      onChange={(e) => setYearsExp(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:border-[#054bce]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">
                      Location (City, Country)
                    </label>
                    <input
                      type="text"
                      required
                      value={designerLocation}
                      onChange={(e) => setDesignerLocation(e.target.value)}
                      placeholder="Stockholm, Sweden"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:border-[#054bce]"
                    />
                  </div>
                </>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-lg border border-[var(--border)] text-xs font-semibold hover:bg-[var(--secondary)]"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <span>Send 6-Digit Verification Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleVerifyComplete} className="space-y-4">
              <div className="p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
                <div className="text-xs font-semibold text-[#054bce] mb-1">
                  Check your inbox
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">
                  We sent a 6-digit verification code to{' '}
                  <span className="font-semibold text-[var(--foreground)]">
                    {email || 'your email'}
                  </span>
                  . Enter it below to activate your ExoConnect workspace.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-center tracking-[0.4em] font-mono text-lg font-bold focus:outline-none focus:border-[#054bce]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>Verify & Open Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-center text-xs text-[var(--muted-foreground)] mt-6">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="font-semibold text-[#054bce] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--muted)] px-4 py-12">
      <div className="max-w-md w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl p-8 shadow-xs">
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Reset your password
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] mb-6 leading-relaxed">
          Enter the email address associated with your ExoConnect account and we&apos;ll send you a password reset link.
        </p>

        {sent ? (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 space-y-2">
            <div className="font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Password reset email sent</span>
            </div>
            <p>
              If an account exists for <strong>{email}</strong>, you will receive instructions to reset your password shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@practice.com"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm focus:outline-none focus:border-[#054bce]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-[#054bce] hover:bg-[#043ca8] text-white font-semibold text-sm transition-colors"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
