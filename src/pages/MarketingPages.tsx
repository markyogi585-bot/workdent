import React, { useState, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Search,
  Star,
  MapPin,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  SlidersHorizontal,
  ShieldCheck,
  MessageSquare,
  HelpCircle,
  BookOpen,
  CreditCard,
  Gift,
  FileText,
} from 'lucide-react';
import {
  EXO_SERVICES,
  getExoDesigners,
  ExoDesigner,
} from '../lib/exoStore';

/* ============================================================================
 * 1. OPEN DESIGNER DIRECTORY (/designers)
 * ========================================================================== */
export const DesignersDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const designers = useMemo(() => getExoDesigners(), []);

  const [selectedService, setSelectedService] = useState<string>('All');
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyReadyPayouts, setOnlyReadyPayouts] = useState(false);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [hasPortfolio, setHasPortfolio] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const allCountries = useMemo(
    () => Array.from(new Set(designers.map((d) => d.country))),
    [designers]
  );

  const filtered = useMemo(() => {
    return designers.filter((d) => {
      if (selectedService !== 'All') {
        if (!d.services.some((s) => s.service === selectedService)) return false;
      }
      if (selectedCountries.length > 0 && !selectedCountries.includes(d.country)) {
        return false;
      }
      if (onlyAvailable && !d.available) return false;
      if (onlyReadyPayouts && !d.readyForPayouts) return false;
      if (minRating > 0 && d.rating < minRating) return false;
      if (hasPortfolio && d.portfolio.length === 0) return false;
      if (minPrice !== '' || maxPrice !== '') {
        const min = minPrice === '' ? 0 : Number(minPrice);
        const max = maxPrice === '' ? 99999 : Number(maxPrice);
        const hasInRange = d.services.some(
          (s) => s.priceUsd >= min && s.priceUsd <= max
        );
        if (!hasInRange) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.title.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          d.specializations.some((sp) => sp.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [
    designers,
    selectedService,
    selectedCountries,
    onlyAvailable,
    onlyReadyPayouts,
    minPrice,
    maxPrice,
    minRating,
    hasPortfolio,
    searchQuery,
  ]);

  const clearAllFilters = () => {
    setSelectedService('All');
    setSelectedCountries([]);
    setOnlyAvailable(false);
    setOnlyReadyPayouts(false);
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setHasPortfolio(false);
    setSearchQuery('');
  };

  const toggleCountry = (c: string) => {
    setSelectedCountries((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Go back
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Browse Dental CAD Designers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            The designer directory is open to everyone. Check profiles, work samples, reviews and prices first, then decide.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search designer name, exocad, specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filters (Exact ExoConnect /designers Filters) */}
        <aside className="lg:col-span-3 rounded-2xl border border-border bg-card p-5 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <span className="font-semibold text-sm text-foreground flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-primary" /> Filters
            </span>
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-medium text-primary hover:underline cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>

          {/* Service Type */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              Service Type
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs font-medium"
            >
              <option value="All">All Services</option>
              {EXO_SERVICES.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          </div>

          {/* Location by country */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              Location by country (choose one or more)
            </label>
            <div className="space-y-1.5">
              {allCountries.map((country) => (
                <label
                  key={country}
                  className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCountries.includes(country)}
                    onChange={() => toggleCountry(country)}
                    className="rounded border-border text-primary"
                  />
                  <span>{country}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              Availability
            </label>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
              />
              <span>Available for new cases</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={onlyReadyPayouts}
                onChange={(e) => setOnlyReadyPayouts(e.target.checked)}
              />
              <span>Ready for payouts</span>
            </label>
          </div>

          {/* Pricing range */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              Pricing range (a service priced in this range)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="$ Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <input
                type="number"
                placeholder="$ Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-xs"
              />
            </div>
          </div>

          {/* Reviews and rating */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              Reviews and rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-xs"
            >
              <option value={0}>Any rating</option>
              <option value={4.5}>4.5★ and above</option>
              <option value={4.9}>4.9★ and above</option>
            </select>
          </div>

          {/* Portfolio */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              Portfolio
            </label>
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={hasPortfolio}
                onChange={(e) => setHasPortfolio(e.target.checked)}
              />
              <span>Has work samples uploaded</span>
            </label>
          </div>
        </aside>

        {/* Right Designers Grid */}
        <div className="lg:col-span-9 space-y-5">
          {filtered.map((designer) => (
            <div
              key={designer.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-2xs hover:border-primary/40 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <Link to={`/designer/${designer.id}`} className="shrink-0">
                    <img
                      src={designer.avatar}
                      alt={designer.name}
                      className="size-16 rounded-2xl object-cover border border-border"
                    />
                  </Link>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <Link
                        to={`/designer/${designer.id}`}
                        className="font-bold text-lg text-foreground hover:text-primary"
                      >
                        {designer.name}
                      </Link>
                      {designer.readyForPayouts && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[11px] font-semibold">
                          ✓ Vetted Designer
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">
                      {designer.title}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {designer.location}
                      </span>
                      <span>•</span>
                      <span className="text-amber-500 font-semibold">
                        ★ {designer.rating} ({designer.reviewsCount} reviews)
                      </span>
                      <span>•</span>
                      <span>{designer.completionRate}% completion</span>
                      <span>•</span>
                      <span>{designer.repeatClientsPct}% repeat clients</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/designer/${designer.id}`}
                    className="px-4 py-2 rounded-lg border border-border hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                  >
                    View Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => navigate(`/projects/new?designer=${designer.id}`)}
                    className="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Post a Case
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                {designer.bio}
              </p>

              {/* Services & Prices */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Services &amp; Upfront Pricing
                </div>
                <div className="flex flex-wrap gap-2">
                  {designer.services.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/projects/new?designer=${designer.id}&service=${encodeURIComponent(
                            srv.service
                          )}`
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-muted hover:bg-primary/10 border border-border hover:border-primary/40 text-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <span className="font-medium text-foreground">{srv.service}</span>
                      <span className="font-bold text-primary">${srv.priceUsd}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 2. PUBLIC DESIGNER PROFILE (/designer/:id)
 * ========================================================================== */
export const DesignerPublicProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const designers = getExoDesigners();
  const designer: ExoDesigner =
    designers.find((d) => d.id === id) || designers[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      <Link
        to="/designers"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Designer Directory
      </Link>

      {/* Top Profile Summary Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-5">
          <img
            src={designer.avatar}
            alt={designer.name}
            className="size-20 sm:size-24 rounded-2xl object-cover border border-border"
          />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{designer.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
                ✓ Vetted CAD Designer
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{designer.title}</p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span>{designer.location}</span>
              <span>•</span>
              <span>{designer.yearsExperience} yrs experience</span>
              <span>•</span>
              <span className="text-amber-500 font-semibold">
                ★ {designer.rating} ({designer.reviewsCount} reviews)
              </span>
              <span>•</span>
              <span>{designer.completionRate}% completion rate</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/projects/new?designer=${designer.id}`)}
          className="px-6 py-3 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold cursor-pointer shrink-0"
        >
          Post a Case with {designer.name.split(' ')[0]}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Bio, Specializations, Portfolio / Work Samples, Reviews */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-bold text-base text-foreground">Biography</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {designer.bio}
            </p>
            <div className="pt-2">
              <div className="text-xs font-semibold text-foreground mb-2">
                Specializations
              </div>
              <div className="flex flex-wrap gap-2">
                {designer.specializations.map((sp) => (
                  <span
                    key={sp}
                    className="px-3 py-1 rounded-full bg-muted text-xs font-medium text-foreground"
                  >
                    {sp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-bold text-base text-foreground">
              Portfolio / Work Samples ({designer.portfolio.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {designer.portfolio.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-border overflow-hidden bg-muted/30"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <div className="text-xs font-semibold text-foreground">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {item.service}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-bold text-base text-foreground">
              Dentist Reviews ({designer.reviews.length})
            </h2>
            {designer.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-xl bg-muted/50 border border-border space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground">
                    {rev.dentistName} · {rev.practiceName}
                  </span>
                  <span className="text-amber-500 font-bold">★★★★★</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: My Services & Pricing */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 lg:sticky lg:top-24">
            <h2 className="font-bold text-base text-foreground">
              Services &amp; Pricing
            </h2>
            <p className="text-xs text-muted-foreground">
              Select a service to start a new case with {designer.name}. Your card is authorized now and only charged when accepted.
            </p>
            <div className="space-y-2.5">
              {designer.services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-4 rounded-xl border border-border flex items-center justify-between gap-3 hover:border-primary transition-colors"
                >
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {srv.service}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg. turnaround: {srv.turnaroundHours}h
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-foreground tabular-nums">
                      ${srv.priceUsd}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/projects/new?designer=${designer.id}&service=${encodeURIComponent(
                            srv.service
                          )}`
                        )
                      }
                      className="px-3.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold cursor-pointer"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 3. HOW IT WORKS PAGE (/how-it-works)
 * ========================================================================== */
export const HowItWorksPage: React.FC = () => {
  const pillars = [
    {
      num: '01',
      title: 'Find the Right Designer',
      desc: 'Browse vetted dental CAD designers by specialty, turnaround time, and portfolio. No cold calls, no guesswork - just qualified talent ready to take your case.',
    },
    {
      num: '02',
      title: 'Upload & Share Files Securely',
      desc: 'Share scan files, STL files, and case notes directly through the platform. Everything stays in one place - no email chains, no Dropbox folders.',
    },
    {
      num: '03',
      title: 'Collaborate in One Place',
      desc: 'Work with your designer through a shared case workspace. Review progress, leave feedback, and track revisions without losing context.',
    },
    {
      num: '04',
      title: 'Direct Messaging',
      desc: 'Communicate directly with your designer through built-in messaging. Ask questions, clarify requirements, and stay aligned throughout the case.',
    },
    {
      num: '05',
      title: 'Integrated Payments',
      desc: "Pay securely through the platform once you're satisfied with the work. Your card is authorized when you submit and only charged when a designer accepts.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-14 space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
          ✦ Who We Are
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground leading-tight">
          A Marketplace Built for Dental CAD Collaboration.
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          ExoConnect is a fully functional marketplace that facilitates relationships between those needing dental CAD services and the expert designers who provide them - removing the single biggest hurdle in digital dentistry.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/projects/new"
            className="px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold"
          >
            Post a Case
          </Link>
          <Link
            to="/auth/register"
            className="px-6 py-3 rounded-full border border-border text-sm font-semibold"
          >
            Create Free Account
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-muted/60 border border-border p-8 sm:p-10 space-y-3">
        <h2 className="text-xl font-bold text-foreground">One workflow. No friction.</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          For dentists and labs, ExoConnect means instant access to vetted designers - no more cold searches, no more unreliable freelancers. For designers, it means a steady stream of qualified clients without the overhead of marketing and sales. Share files directly with chosen designers, collaborate on cases in one place, communicate through built-in messaging, and pay securely - all without leaving the platform.
        </p>
      </div>

      <div className="space-y-6">
        <div className="text-center">
          <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase mb-2">
            ✦ The Platform
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Everything in One Place. Nothing Left Out.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((p) => (
            <div key={p.num} className="rounded-2xl border border-border bg-card p-6 space-y-2">
              <span className="text-xs font-bold text-primary">{p.num}</span>
              <h3 className="text-lg font-bold text-foreground">{p.title}</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 4. ROLE PAGES: /as/dentist, /as/designer, /as/lab
 * ========================================================================== */
export const AsDentistPage: React.FC = () => {
  const reasons = [
    {
      num: '01',
      title: 'Scale Without Hiring',
      desc: 'Access expert CAD talent only when you need it - no overhead, no commitment. Grow your caseload without growing your payroll.',
    },
    {
      num: '02',
      title: 'Faster Turnaround Times',
      desc: 'Keep cases moving and patients happy. Designs come back quickly so your workflow never stalls waiting on a bottleneck.',
    },
    {
      num: '03',
      title: 'Higher-Quality Restorations',
      desc: 'Work with experienced designers who deeply understand esthetics, function, and manufacturability. The difference shows up chairside.',
    },
    {
      num: '04',
      title: 'Fewer Remakes & Adjustments',
      desc: 'Better designs mean more predictable outcomes. Reduce chair time, patient callbacks, and the frustration that comes with ill-fitting restorations.',
    },
    {
      num: '05',
      title: 'Expand Your Digital Capabilities',
      desc: 'Take on more veneer, crown, implant, and full-arch cases with confidence - even without an in-house design team.',
    },
    {
      num: '06',
      title: 'Focus on Patient Care',
      desc: 'Spend less time designing and more time treating. ExoConnect handles the design layer so you can focus on what you do best.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-14 space-y-14">
      <div className="space-y-4 max-w-3xl">
        <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
          ✦ For Dentists
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground leading-tight">
          Your Design Workflow Shouldn&apos;t Be a Bottleneck.
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          ExoConnect gives dentists instant access to vetted dental CAD designers who specialize in digital design and smile design - so you can deliver better dentistry without the bottleneck.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/designers"
            className="px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold"
          >
            Find a Designer
          </Link>
          <Link
            to="/auth/register"
            className="px-6 py-3 rounded-full border border-border text-sm font-semibold"
          >
            Get Started Free
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-[#0d0d1a] text-white p-8 sm:p-10 space-y-3">
        <p className="text-primary text-xs font-semibold uppercase tracking-widest">
          ✦ The Problem
        </p>
        <h2 className="text-2xl font-bold">Two bad options. Neither works.</h2>
        <p className="text-sm text-white/70 leading-relaxed max-w-3xl">
          Most practices either hire an in-house designer - a fixed cost that doesn&apos;t scale - or spend hours vetting freelancers with no guarantee of quality or turnaround. Neither option is sustainable. We&apos;ve built a curated network of professional dental CAD designers who work specifically in digital design and digital smile workflows.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Six reasons practices trust ExoConnect.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r) => (
            <div key={r.num} className="rounded-2xl border border-border bg-card p-6 space-y-2">
              <span className="text-xs font-bold text-primary">{r.num}</span>
              <h3 className="font-bold text-base text-foreground">{r.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 rounded-2xl border border-border bg-muted/40 p-8 text-center">
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-primary">48h</div>
          <div className="text-xs text-muted-foreground mt-1">Avg. turnaround</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-primary">100%</div>
          <div className="text-xs text-muted-foreground mt-1">Vetted designers</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-extrabold text-primary">0</div>
          <div className="text-xs text-muted-foreground mt-1">Long-term contracts</div>
        </div>
      </div>
    </div>
  );
};

export const AsDesignerPage: React.FC = () => {
  const reasons = [
    {
      num: '01',
      title: 'Access Qualified Dentists Worldwide',
      desc: 'Connect with practices actively seeking crowns, veneers, implants, full-arch, and smile design services - no cold outreach required.',
    },
    {
      num: '02',
      title: 'Build Recurring Client Relationships',
      desc: 'Turn one-time cases into long-term partnerships. Happy dentists come back, and your revenue becomes predictable.',
    },
    {
      num: '03',
      title: 'Increase Your Case Volume',
      desc: 'Keep your design pipeline full without spending hours on marketing and sales. ExoConnect brings the work to you.',
    },
    {
      num: '04',
      title: 'Showcase Your Expertise',
      desc: 'Build a professional profile that highlights your portfolio, specialties, turnaround times, and experience. Let your work speak for itself.',
    },
    {
      num: '05',
      title: 'Work On Your Own Terms',
      desc: 'Accept the cases that fit your skills, schedule, and pricing. You set the pace - no agency dictating your workload.',
    },
    {
      num: '06',
      title: 'Grow Your Reputation',
      desc: 'Collect verified reviews and establish credibility within the digital dentistry community. Build the kind of track record that compounds.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-14 space-y-14">
      <div className="space-y-4 max-w-3xl">
        <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
          ✦ For CAD Designers
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground leading-tight">
          Turn Your CAD Skills Into a Thriving Design Business.
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          ExoConnect gives dental CAD designers direct access to dentists actively looking for design support - eliminating cold outreach so you can focus on creating exceptional restorations.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/auth/register?role=designer"
            className="px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold"
          >
            Join as a Designer
          </Link>
          <Link
            to="/designer/jobs"
            className="px-6 py-3 rounded-full border border-border text-sm font-semibold"
          >
            Browse Open Cases
          </Link>
        </div>
      </div>

      <div className="rounded-2xl bg-[#0d0d1a] text-white p-8 sm:p-10 space-y-3">
        <p className="text-primary text-xs font-semibold uppercase tracking-widest">
          ✦ The Problem
        </p>
        <h2 className="text-2xl font-bold">Great designers shouldn&apos;t chase clients.</h2>
        <p className="text-sm text-white/70 leading-relaxed max-w-3xl">
          Most talented designers spend more time prospecting than designing. ExoConnect builds you a pipeline that doesn&apos;t require you to be a marketer. Your profile does the selling. Your work does the talking.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {reasons.map((r) => (
          <div key={r.num} className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <span className="text-xs font-bold text-primary">{r.num}</span>
            <h3 className="font-bold text-base text-foreground">{r.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AsLabPage: React.FC = () => {
  const reasons = [
    {
      num: '01',
      title: 'Increase Production Capacity On Demand',
      desc: 'Handle fluctuations in case volume without overstaffing. Scale up when cases spike, scale back when they do not.',
    },
    {
      num: '02',
      title: 'Reduce Labor Costs',
      desc: 'Access skilled CAD designers only when you need them. Eliminate the overhead of full-time hires.',
    },
    {
      num: '03',
      title: 'Accelerate Turnaround Times',
      desc: 'Keep cases moving through production by outsourcing design work during peak periods.',
    },
    {
      num: '04',
      title: 'Access Specialized Expertise',
      desc: 'Connect with designers experienced in crowns, veneers, implants, full-arch restorations, dentures, and complex digital workflows.',
    },
    {
      num: '05',
      title: 'Improve Scalability',
      desc: 'Grow your business without being limited by in-house design resources. Your capacity is now elastic, not fixed.',
    },
    {
      num: '06',
      title: 'Minimize Staffing Challenges',
      desc: 'Reduce reliance on recruiting, training, and retaining CAD personnel in a competitive labor market.',
    },
    {
      num: '07',
      title: 'Maintain Consistent Quality',
      desc: 'Work with vetted designers who understand laboratory workflows and manufacturing requirements.',
    },
    {
      num: '08',
      title: 'Focus on Production & Client Service',
      desc: 'Let expert designers handle digital design while your team concentrates on fabrication and client relationships.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-14 space-y-14">
      <div className="space-y-4 max-w-3xl">
        <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
          ✦ For Dental Labs
        </p>
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground leading-tight">
          Scale Your Lab Without Expanding Your Payroll.
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed">
          ExoConnect gives dental laboratories instant access to experienced CAD designers - increase capacity, reduce bottlenecks, and meet demanding turnarounds without full-time hiring costs.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/projects/new"
            className="px-6 py-3 rounded-full bg-primary text-white text-sm font-semibold"
          >
            Post a Case
          </Link>
          <Link
            to="/auth/register"
            className="px-6 py-3 rounded-full border border-border text-sm font-semibold"
          >
            Create Free Account
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reasons.map((r) => (
          <div key={r.num} className="rounded-2xl border border-border bg-card p-6 space-y-2">
            <span className="text-xs font-bold text-primary">{r.num}</span>
            <h3 className="font-bold text-base text-foreground">{r.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================================
 * 5. ABOUT US & OUR STORY PAGES (/about-us, /our-story)
 * ========================================================================== */
export const AboutUsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-6 py-14 space-y-12">
    <div className="space-y-4">
      <p className="text-primary text-xs font-semibold uppercase tracking-widest">
        About ExoConnect
      </p>
      <h1 className="text-3xl sm:text-5xl font-bold text-foreground">
        The marketplace for dental CAD design.
      </h1>
      <p className="text-muted-foreground text-base leading-relaxed">
        ExoConnect connects dentists and dental labs with expert CAD designers - so digital cases move from scan to finished design without the cold searches, unreliable freelancers, and endless email chains.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {[
        {
          title: 'Trust by Default',
          desc: 'Every designer on the platform is vetted, and every case is protected by secure file transfer and clear payment terms.',
        },
        {
          title: 'Quality That Shows',
          desc: 'We built ExoConnect around designers who take precision seriously - so the work you get back is ready for the chair, not the redo pile.',
        },
        {
          title: 'Fair for Both Sides',
          desc: 'Dentists and labs get reliable talent without hiring overhead. Designers get qualified work without chasing invoices.',
        },
        {
          title: 'Built on Relationships',
          desc: 'ExoConnect makes it easy to find the right match and keep working with the people who deliver.',
        },
      ].map((item) => (
        <div key={item.title} className="rounded-2xl border border-border bg-card p-6 space-y-2">
          <h3 className="font-bold text-base text-foreground">{item.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

export const OurStoryPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-6 py-14 space-y-10">
    <div className="space-y-4">
      <p className="text-primary text-xs font-semibold uppercase tracking-widest">Our Story</p>
      <h1 className="text-3xl sm:text-5xl font-bold text-foreground">
        Why we built ExoConnect.
      </h1>
      <p className="text-muted-foreground text-base leading-relaxed">
        Dental CAD design deserved a marketplace of its own - one built around trust, quality, and a workflow that actually works for both dentists and designers.
      </p>
    </div>

    <div className="space-y-4">
      {[
        {
          num: '01',
          title: 'The problem we kept seeing',
          desc: 'Digital dentistry took off, but practices and labs were stuck stitching together freelancers, agencies, and overloaded in-house designers.',
        },
        {
          num: '02',
          title: 'A better way to connect',
          desc: 'We built one place where a dentist or lab could find a vetted designer, share files securely, and pay only when the work was right.',
        },
        {
          num: '03',
          title: 'Fair for the designers too',
          desc: 'ExoConnect gives designers a steady stream of qualified cases, control over their rates and availability, and automated payments.',
        },
        {
          num: '04',
          title: 'Where we are now',
          desc: 'ExoConnect removes the friction between the people who need dental CAD work and the experts who deliver it.',
        },
      ].map((step) => (
        <div key={step.num} className="rounded-2xl border border-border bg-card p-6 space-y-1.5">
          <span className="text-xs font-bold text-primary">{step.num}</span>
          <h3 className="font-bold text-base text-foreground">{step.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ============================================================================
 * 6. COMPLETE EXOCONNECT HELP CENTER (/help & /help/:topic)
 * ========================================================================== */
export const HelpCenterPage: React.FC<{ activeTopic?: string }> = ({ activeTopic }) => {
  const { topic } = useParams<{ topic?: string }>();
  const resolvedTopic = activeTopic || topic || 'index';

  const guides = [
    {
      slug: 'getting-started-dentist',
      category: 'Getting started',
      title: 'Getting started as a dentist',
      summary:
        'Create your practice account, find your way around the portal, and post your first case.',
      content: [
        '1. Create your account: Go to the sign up page and make sure Dental Practice is selected at the top. Fill in your first name, last name, email and password, then complete practice details and enter your 6-digit verification code.',
        '2. Find your way around: Once you sign in you land on your Dashboard. Everything lives in the menu down the left: Dashboard, Projects, Messages, Designers, Referrals, Help, and Profile.',
        '3. Post your first case (5 Steps): Click New Project from the Dashboard or Projects page. Step 1: Case Details (Service Type, Project Title, Case Notes). Step 2: Choose Designer & lock in their service price. Step 3: Upload Scan Files (.STL, .PLY, .OBJ). Step 4: Review summary. Step 5: Authorize card hold.',
      ],
    },
    {
      slug: 'getting-started-designer',
      category: 'Getting started',
      title: 'Getting started as a designer',
      summary:
        'Set up your designer profile, list your services and prices, and take on your first job.',
      content: [
        '1. Create your account: Switch the toggle at the top of Sign Up to CAD Designer. Enter your specialization, years of experience, and location.',
        '2. Fill in your profile & My Services & Pricing: Go to Profile in the left menu. Add your biography, specializations, and up to 12 Portfolio / Work Samples. Under My Services & Pricing, pick each service you offer from the dropdown, enter your price (e.g. $150), and click Add Service.',
        '3. How jobs reach you: Open Jobs in the left menu. New work lands in Incoming Job Requests. Click View details to read the full case notes before clicking Accept or Decline. Accepting captures the dentist card into Escrow and opens the Case Workspace.',
      ],
    },
    {
      slug: 'cases-and-files',
      category: 'Cases and files',
      title: 'Cases and files',
      summary:
        'A tour of the case workspace, where the files, the 3D preview, the history and the conversation all live on one screen.',
      content: [
        'The Layout: A left rail (with Case Mode and Compact File List Mode) and four tabs on the right: Overview, Files, 3D & digital design, and Conversation.',
        'Files & 3D Preview: The Files tab groups Your scan files, Designer deliverables, and Web links. Open any STL, PLY, or OBJ mesh to spin it in 3D right in your browser. Press F for fullscreen and use the Left and Right arrow keys to step through every file and link.',
        'Accept, Revision, or Dispute: Once the designer submits deliverables, the dentist can click Accept Design & Complete (rate out of 5 to release payout), Send Revision, or Dispute Case.',
      ],
    },
    {
      slug: 'payments-and-refunds',
      category: 'Payments',
      title: 'Payments and refunds',
      summary:
        'How card authorization works, what the designer takes home, and what happens when a case goes wrong.',
      content: [
        'Your card is authorized, not charged: Submitting a case places a hold on your card. The charge only happens when a designer accepts the case. If no designer accepts within 6 days, the hold is released automatically.',
        'Commission & Payouts: ExoConnect keeps a 12% commission and the designer keeps 88% (e.g., on a $150 case, commission is $18 and designer receives $132 upon completion).',
        'Disputes: If a case is disputed, an ExoConnect admin reviews it and settles it in one of three ways: Refund the dentist in full (net of processing fee), Release to the designer, or Split it by percentage.',
      ],
    },
    {
      slug: 'referrals',
      category: 'Referrals',
      title: 'ExoConnect referral program',
      summary:
        "Y'all can earn money just by sharing ExoConnect with other dentists. Here's how it works.",
      content: [
        'Personal & Partner Referral Codes: Every dentist and designer gets a personal referral code and share link on the Referrals page.',
        'What you earn: When a referred dentist signs up with your link and pays for a case, you earn a 2.5% base referral reward the moment a designer accepts the job.',
      ],
    },
  ];

  const selectedGuide = guides.find((g) => g.slug === resolvedTopic);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      <div className="space-y-3">
        <p className="text-primary text-xs font-semibold uppercase tracking-widest">
          Help Center
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Guides for getting the most out of ExoConnect.
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Short, plain-language walkthroughs for dentists, labs, and designers. If something is not covered here, message our team and we will sort it out.
        </p>
      </div>

      {selectedGuide ? (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5">
          <Link
            to="/help"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Help Center
          </Link>
          <div className="text-xs font-semibold text-muted-foreground uppercase">
            {selectedGuide.category}
          </div>
          <h2 className="text-2xl font-bold text-foreground">{selectedGuide.title}</h2>
          <p className="text-sm text-muted-foreground">{selectedGuide.summary}</p>
          <div className="space-y-4 pt-2 border-t border-border">
            {selectedGuide.content.map((p, idx) => (
              <p key={idx} className="text-sm text-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {guides.map((g) => (
            <Link
              key={g.slug}
              to={`/help/${g.slug}`}
              className="rounded-2xl border border-border bg-card p-6 hover:border-primary transition-colors space-y-2"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-primary">
                {g.category}
              </div>
              <h3 className="font-bold text-base text-foreground">{g.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{g.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================================================
 * 7. CONTACT, TERMS & PRIVACY PAGES
 * ========================================================================== */
export const ContactPage: React.FC = () => {
  const [sent, setSent] = useState(false);
  return (
    <div className="max-w-4xl mx-auto px-6 py-14 space-y-10">
      <div className="space-y-3">
        <p className="text-primary text-xs font-semibold uppercase tracking-widest">Contact</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">We are here to help.</h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Whether you are placing your first case, joining as a designer, or just have a question about how ExoConnect works - reach out and we will point you in the right direction.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
          <h3 className="font-bold text-sm text-foreground">Message Us</h3>
          <p className="text-xs text-muted-foreground">
            For general questions, partnerships, and support.
          </p>
          <p className="text-xs font-semibold text-primary pt-1">support@exoconnect.io</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
          <h3 className="font-bold text-sm text-foreground">In-App Messaging</h3>
          <p className="text-xs text-muted-foreground">
            Already have an account? Message your designer or our team directly from your dashboard.
          </p>
          <Link to="/auth/login" className="text-xs font-semibold text-primary block pt-1">
            Sign in to start a conversation →
          </Link>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 space-y-2">
          <h3 className="font-bold text-sm text-foreground">For Designers</h3>
          <p className="text-xs text-muted-foreground">
            Questions about joining as a CAD designer, rates, or payouts.
          </p>
          <Link to="/help/getting-started-designer" className="text-xs font-semibold text-primary block pt-1">
            Read Designer Guide →
          </Link>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4"
      >
        <h2 className="font-bold text-lg text-foreground">Send a Message to Support</h2>
        {sent && (
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold">
            ✓ Your message has been sent to the ExoConnect team.
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Your Name"
            className="px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm"
          />
          <input
            required
            type="email"
            placeholder="you@practice.com"
            className="px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm"
          />
        </div>
        <textarea
          required
          rows={4}
          placeholder="How can we help?"
          className="w-full p-3.5 rounded-lg border border-border bg-background text-sm"
        />
        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-primary text-white text-xs font-semibold cursor-pointer"
        >
          Message support
        </button>
      </form>
    </div>
  );
};

export const TermsPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-6 py-14 space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Terms of Service</h1>
    <p className="text-sm text-muted-foreground leading-relaxed">
      ExoConnect provides a digital marketplace connecting dental practices and laboratories with independent dental CAD designers. Submitting a case authorizes a hold on your payment card; charges occur only when a designer accepts the case. Platform commission on completed cases is 12%.
    </p>
  </div>
);

export const PrivacyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-6 py-14 space-y-6">
    <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
    <p className="text-sm text-muted-foreground leading-relaxed">
      All STL, PLY, and OBJ scan files, clinical case notes, and messages uploaded to ExoConnect Case Workspaces are encrypted and accessible only to the assigned parties on the case.
    </p>
  </div>
);
