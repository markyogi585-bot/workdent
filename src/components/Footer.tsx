import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#0d0d1a] text-white/60 pt-16 pb-8">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="text-white font-bold text-lg mb-1 inline-block">
              exo<span className="text-primary">connect</span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs mt-3">
              Connecting dental practices and labs with skilled CAD designers worldwide.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 mt-5 max-w-xs">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@practice.com"
                className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#054bce]"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-2 rounded-md hover:bg-primary/80 transition-colors whitespace-nowrap cursor-pointer"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li>
                <Link className="text-xs hover:text-white transition-colors" to="/about-us">
                  About Us
                </Link>
              </li>
              <li>
                <Link className="text-xs hover:text-white transition-colors" to="/our-story">
                  Our Story
                </Link>
              </li>
              <li>
                <Link className="text-xs hover:text-white transition-colors" to="/how-it-works">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Marketplace</h4>
            <ul className="space-y-2.5">
              <li>
                <Link className="text-xs hover:text-white transition-colors" to="/designers">
                  Browse Designers
                </Link>
              </li>
              <li>
                <Link className="text-xs hover:text-white transition-colors" to="/projects/new">
                  Post a Case
                </Link>
              </li>
              <li>
                <Link className="text-xs hover:text-white transition-colors" to="/auth/register">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
            <ul className="space-y-2.5">
              <li>
                <Link className="text-xs hover:text-white transition-colors" to="/contact">
                  Contact
                </Link>
              </li>
              <li>
                <Link className="text-xs hover:text-white transition-colors" to="/help">
                  Help Center
                </Link>
              </li>
              <li>
                <Link className="text-xs hover:text-white transition-colors" to="/terms">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link className="text-xs hover:text-white transition-colors" to="/privacy">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">© Copyright 2026 ExoConnect. All rights reserved</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/as/dentist" className="text-white/40 hover:text-white transition-colors">
              For Dentists
            </Link>
            <Link to="/as/designer" className="text-white/40 hover:text-white transition-colors">
              For Designers
            </Link>
            <Link to="/as/lab" className="text-white/40 hover:text-white transition-colors">
              For Labs
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
