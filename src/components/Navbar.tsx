import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
} from 'lucide-react';
import {
  getExoUser,
  getExoTheme,
  setExoTheme,
  switchExoRole,
  ExoUser,
} from '../lib/exoStore';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<ExoUser>(() => getExoUser());
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => getExoTheme());
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => setUser(getExoUser());
    const syncTheme = () => setThemeState(getExoTheme());
    window.addEventListener('exo-store-updated', sync);
    window.addEventListener('exo-theme-changed', syncTheme);
    return () => {
      window.removeEventListener('exo-store-updated', sync);
      window.removeEventListener('exo-theme-changed', syncTheme);
    };
  }, [location.pathname]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setExoTheme(next);
    setThemeState(next);
  };

  const currentAudienceLabel =
    location.pathname === '/as/designer'
      ? "I'm a Designer"
      : location.pathname === '/as/lab'
      ? "I'm a Dental Lab"
      : "I'm a dentist";

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo: exoconnect */}
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-xl tracking-tight text-foreground flex items-center">
            <span>exo</span>
            <span className="text-primary">connect</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/how-it-works"
              className="text-muted-foreground hover:text-foreground text-sm font-medium px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              How it works?
            </Link>
            <a
              href="/#features"
              className="text-muted-foreground hover:text-foreground text-sm font-medium px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              Features
            </a>
            <Link
              to="/designers"
              className="text-muted-foreground hover:text-foreground text-sm font-medium px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              Browse Designers
            </Link>

            {/* "I'm a dentist" Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setRoleDropdownOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <span>{currentAudienceLabel}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-48 rounded-xl bg-card border border-border shadow-lg py-1.5 z-50">
                  <Link
                    to="/as/dentist"
                    onClick={() => setRoleDropdownOpen(false)}
                    className="block px-3.5 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    I&apos;m a Dentist
                  </Link>
                  <Link
                    to="/as/designer"
                    onClick={() => setRoleDropdownOpen(false)}
                    className="block px-3.5 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    I&apos;m a Designer
                  </Link>
                  <Link
                    to="/as/lab"
                    onClick={() => setRoleDropdownOpen(false)}
                    className="block px-3.5 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    I&apos;m a Dental Lab
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Side Controls */}
        <div className="hidden md:flex items-center gap-2">
          {/* Quick Portal Switcher Pill so user can jump straight into Dentist or Designer Portal */}
          <div className="flex items-center bg-muted p-0.5 rounded-lg border border-border text-xs font-medium mr-1">
            <button
              type="button"
              onClick={() => {
                switchExoRole('dentist');
                navigate('/dashboard');
              }}
              className="px-2.5 py-1.5 rounded-md hover:bg-card hover:text-foreground text-muted-foreground transition-colors cursor-pointer"
              title="Open Dentist Portal"
            >
              Dentist Portal
            </button>
            <button
              type="button"
              onClick={() => {
                switchExoRole('designer');
                navigate('/designer/dashboard');
              }}
              className="px-2.5 py-1.5 rounded-md hover:bg-card hover:text-foreground text-muted-foreground transition-colors cursor-pointer"
              title="Open CAD Designer Portal"
            >
              Designer Portal
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <Link
            to="/auth/login"
            className="text-muted-foreground hover:text-foreground text-sm font-medium px-4 py-2 transition-colors rounded-lg hover:bg-muted"
          >
            Login
          </Link>

          <Link
            to="/auth/register"
            className="inline-flex items-center justify-center rounded-lg text-sm font-medium px-5 h-10 bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
          >
            Get Started
          </Link>

          {user.loggedIn && (
            <Link
              to={user.role === 'designer' ? '/designer/dashboard' : '/dashboard'}
              className="inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold px-3.5 h-10 border border-border hover:bg-muted text-foreground transition-colors"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
              <span>Dashboard</span>
            </Link>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="md:hidden flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            className="size-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-2">
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted"
          >
            How it works?
          </Link>
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted"
          >
            Features
          </a>
          <Link
            to="/designers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted"
          >
            Browse Designers
          </Link>
          <Link
            to="/as/dentist"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            I&apos;m a Dentist
          </Link>
          <Link
            to="/as/designer"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            I&apos;m a Designer
          </Link>
          <Link
            to="/as/lab"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            I&apos;m a Dental Lab
          </Link>
          <div className="pt-2 border-t border-border flex items-center gap-2">
            <Link
              to="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-lg border border-border text-sm font-medium text-foreground"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
            >
              Get Started
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                switchExoRole('dentist');
                setMobileMenuOpen(false);
                navigate('/dashboard');
              }}
              className="py-2 rounded-lg bg-muted text-xs font-semibold text-foreground cursor-pointer"
            >
              Dentist Portal
            </button>
            <button
              type="button"
              onClick={() => {
                switchExoRole('designer');
                setMobileMenuOpen(false);
                navigate('/designer/dashboard');
              }}
              className="py-2 rounded-lg bg-muted text-xs font-semibold text-foreground cursor-pointer"
            >
              Designer Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
