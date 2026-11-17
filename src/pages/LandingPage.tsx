import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MousePointerClick,
  PenLine,
  Users,
  FileUp,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Box,
  Layers,
  ShieldCheck,
  Gift,
  MessageSquare,
  Star,
  Check,
} from 'lucide-react';
import { SEED_EXO_DESIGNERS } from '../lib/exoStore';

const FIVE_STEPS = [
  {
    number: '01',
    title: 'Post your case',
    description:
      'Tell the designer what you need. It takes a couple of minutes and you do it once per case.',
    bullets: [
      'Pick the service you need from the ones designers offer',
      'Give the case a title, like Crown & Bridge - Upper Left Molar',
      'Add your notes: teeth involved, material, occlusion, anything unusual',
    ],
    icon: PenLine,
    nextLabel: 'Choose your designer',
  },
  {
    number: '02',
    title: 'Choose your designer',
    description:
      'See the designers who offer that service, along with their ratings, work samples, and exact price.',
    bullets: [
      'Compare verified dental CAD designers side by side',
      'Review portfolios, turnaround times, and completion rates',
      'Click a designer and select their service to lock in the price',
    ],
    icon: Users,
    nextLabel: 'Upload your scans',
  },
  {
    number: '03',
    title: 'Upload your scans',
    description:
      'Drag your intraoral or desktop scan files directly onto the dropzone, or click to browse.',
    bullets: [
      'Supports STL, PLY, OBJ, DICOM, and ZIP archives',
      'Upload upper arch, lower antagonist, and bite scans together',
      'Files stay organized inside your dedicated Case Workspace',
    ],
    icon: FileUp,
    nextLabel: "Authorize, don't pay",
  },
  {
    number: '04',
    title: "Authorize, don't pay",
    description:
      'Submitting a case places a hold on your card. You are charged only when a designer accepts.',
    bullets: [
      'Your card is authorized now, not charged upon submission',
      'The charge only happens when your chosen designer accepts the job',
      'If nobody takes the case within 6 days, the hold is released automatically',
    ],
    icon: CreditCard,
    nextLabel: 'Review and approve',
  },
  {
    number: '05',
    title: 'Review and approve',
    description:
      'Inspect the finished CAD deliverable in the built-in 3D browser viewer or web link before releasing payment.',
    bullets: [
      'Spin STL, PLY, and OBJ files in 3D right in your browser',
      'Open embedded exocad / 3Shape digital design web links in one tab',
      'Click Accept Design & Complete to rate the designer and release payment, or Send Revision',
    ],
    icon: CheckCircle2,
    nextLabel: 'Post your case',
  },
];

export const LandingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [workspacePreviewTab, setWorkspacePreviewTab] = useState<
    'Overview' | 'Files' | '3D & digital design' | 'Conversation'
  >('Files');

  const stepData = FIVE_STEPS[activeStep];

  return (
    <div className="bg-background text-foreground">
      {/* 1. HERO BANNER SECTION */}
      <section className="relative bg-[#0d0d1a] text-white overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(5,75,206,0.32),transparent_55%)] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 sm:py-20 lg:py-24 relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-white/90">
                <span className="text-primary">✦</span>
                <span>The Marketplace for Dental CAD Design</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-tight leading-[1.08] text-white">
                Connect with the best dental CAD designers.
              </h1>

              <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-xl">
                Post a case, pick your vetted CAD designer, inspect STL &amp; PLY files in the built-in browser 3D viewer, and pay only when a designer accepts your case.
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/projects/new"
                  className="inline-flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm h-12 px-7 transition-all"
                >
                  <span>Post a Case</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  to="/designers"
                  className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm h-12 px-7 transition-all"
                >
                  Browse Designers
                </Link>
                <Link
                  to="/auth/register?role=designer"
                  className="inline-flex items-center justify-center rounded-full text-white/70 hover:text-white text-sm font-medium px-4 h-12 transition-colors"
                >
                  Join as a Designer →
                </Link>
              </div>

              <div className="pt-4 grid grid-cols-3 gap-6 max-w-md border-t border-white/10">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">1,200+</div>
                  <div className="text-xs text-white/50">Vetted CAD Designers</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">50K+</div>
                  <div className="text-xs text-white/50">Projects Done</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white tabular-nums">4.9★</div>
                  <div className="text-xs text-white/50">Avg Rating</div>
                </div>
              </div>
            </div>

            {/* Right Interactive Case Workspace Card Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/15 bg-[#141428] shadow-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-white/20" />
                    <span className="size-2.5 rounded-full bg-white/20" />
                    <span className="size-2.5 rounded-full bg-white/20" />
                    <span className="text-xs text-white/50 ml-2 font-medium">
                      Case Workspace · #PRJ-1048
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold">
                    Escrow Protected
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-primary font-semibold">Crown &amp; Bridge</div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        Upper Left Molar Bridge (#24–#26)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-white/50">Authorized</div>
                      <div className="text-base font-bold text-white tabular-nums">$150.00</div>
                    </div>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-white/10 relative h-44 bg-[#0d0d1a]">
                    <img
                      src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=900&q=80"
                      alt="3D CAD Restoration Preview"
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between bg-black/75 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-[11px]">
                      <span className="text-white font-medium">
                        Final_Zirconia_Bridge_24_26.stl
                      </span>
                      <span className="text-emerald-400 font-semibold">3D Preview Ready</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={SEED_EXO_DESIGNERS[0].avatar}
                        alt={SEED_EXO_DESIGNERS[0].name}
                        className="size-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {SEED_EXO_DESIGNERS[0].name}
                        </div>
                        <div className="text-[11px] text-white/50">4.98★ · 164 cases</div>
                      </div>
                    </div>
                    <Link
                      to="/projects/1048"
                      className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition-colors"
                    >
                      Open Case Workspace →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (EXACT EXOCONNECT 5-STEP INTERACTIVE SECTION) */}
      <section id="how-it-works" className="bg-background pt-12 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase mb-3">
              ✦ How It Works
            </p>
            <h2 className="text-[2rem] sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-tight">
              From scan to finished design
              <br className="hidden sm:block" /> in five steps.
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-[14px] leading-relaxed">
              Post a case, pick your designer, and approve the result. No hiring, no contracts, and you only pay when a designer takes your case.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
            {/* Left Dark Accordion Column */}
            <div className="bg-[#0d0d1a] rounded-2xl p-3 sm:p-4 flex flex-col gap-1">
              <p className="flex items-center gap-2 px-4 pt-1 pb-2 text-[12px] font-medium text-white/50">
                <MousePointerClick className="w-3.5 h-3.5 text-primary" />
                <span>Click any step to see it in action</span>
              </p>

              {FIVE_STEPS.map((step, idx) => {
                const isExpanded = activeStep === idx;
                const Icon = step.icon;
                return (
                  <button
                    key={step.number}
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() => setActiveStep(idx)}
                    className={`group text-left rounded-xl px-4 py-4 transition-colors w-full cursor-pointer ${
                      isExpanded ? 'bg-white/[0.08]' : 'hover:bg-white/[0.06]'
                    }`}
                  >
                    <span className="flex items-center gap-4">
                      <span
                        className={`shrink-0 size-9 rounded-lg flex items-center justify-center ${
                          isExpanded ? 'bg-primary text-white' : 'bg-white/10 text-white/50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="flex flex-col">
                        <span
                          className={`text-[11px] font-bold tracking-widest tabular-nums ${
                            isExpanded ? 'text-white/70' : 'text-white/30'
                          }`}
                        >
                          STEP {step.number}
                        </span>
                        <span
                          className={`font-semibold text-[15px] ${
                            isExpanded ? 'text-white' : 'text-white/50'
                          }`}
                        >
                          {step.title}
                        </span>
                      </span>
                      {!isExpanded && (
                        <span className="ml-auto shrink-0 size-7 rounded-full border border-white/15 flex items-center justify-center text-white/40 group-hover:border-white/40 group-hover:text-white">
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      )}
                    </span>

                    {isExpanded && (
                      <span className="block mt-4 pl-[3.25rem] pr-1">
                        <span className="block text-white/70 text-[13.5px] leading-relaxed">
                          {step.description}
                        </span>
                        <span className="block mt-4 space-y-2">
                          {step.bullets.map((b) => (
                            <span
                              key={b}
                              className="flex gap-2.5 text-white/60 text-[13px] leading-relaxed"
                            >
                              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                              <span>{b}</span>
                            </span>
                          ))}
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Interactive Step Preview Window */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-border bg-card shadow-xl shadow-black/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/60">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-foreground/15" />
                    <span className="size-2.5 rounded-full bg-foreground/15" />
                    <span className="size-2.5 rounded-full bg-foreground/15" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    exoconnect.io — Step {activeStep + 1}: {stepData.title}
                  </span>
                </div>

                {/* Live Interactive UI Preview for Steps 1–5 */}
                <div className="p-6 sm:p-8 bg-[#f0f2f5] dark:bg-[#141428] min-h-[340px] flex flex-col justify-between">
                  {activeStep === 0 && (
                    <div className="bg-card rounded-xl border border-border p-5 space-y-4 shadow-xs">
                      <div className="text-xs font-bold uppercase tracking-wider text-primary">
                        New Project · Step 1: Case Details
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">
                          Service Type
                        </label>
                        <div className="px-3.5 py-2 rounded-lg border border-border bg-muted/40 text-sm font-medium">
                          Crown &amp; Bridge
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">
                          Project Title
                        </label>
                        <div className="px-3.5 py-2 rounded-lg border border-border bg-muted/40 text-sm font-medium">
                          Crown &amp; Bridge - Upper Left Molar (#24–#26)
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-foreground mb-1">
                          Case Notes
                        </label>
                        <div className="px-3.5 py-2 rounded-lg border border-border bg-muted/40 text-xs text-muted-foreground">
                          Teeth #24–#26 monolithic zirconia bridge, 0.04mm spacer, light occlusion.
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-primary">
                        New Project · Step 2: Choose Designer
                      </div>
                      {SEED_EXO_DESIGNERS.slice(0, 2).map((d, i) => (
                        <div
                          key={d.id}
                          className={`p-4 rounded-xl bg-card border flex items-center justify-between gap-4 ${
                            i === 0 ? 'border-primary ring-2 ring-primary/15' : 'border-border'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={d.avatar}
                              alt={d.name}
                              className="size-11 rounded-full object-cover"
                            />
                            <div>
                              <div className="text-sm font-bold text-foreground">{d.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {d.location} · ★ {d.rating} ({d.reviewsCount})
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-primary">
                              ${d.services[0].priceUsd}
                            </div>
                            <div className="text-[11px] text-muted-foreground">Crown &amp; Bridge</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="bg-card rounded-xl border border-border p-6 space-y-4 text-center">
                      <div className="text-xs font-bold uppercase tracking-wider text-primary text-left">
                        New Project · Step 3: Upload Scan Files
                      </div>
                      <div className="border-2 border-dashed border-primary/40 rounded-xl p-6 bg-primary/5 space-y-2">
                        <FileUp className="w-8 h-8 text-primary mx-auto" />
                        <div className="text-sm font-semibold text-foreground">
                          Click to upload or drag and drop
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Accepted file types: .STL, .PLY, .OBJ, .DCM, .ZIP
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs bg-muted px-3.5 py-2 rounded-lg">
                        <span className="font-medium text-foreground">
                          Upper_Arch_Prep_24_26.stl (14.2 MB)
                        </span>
                        <span className="text-emerald-600 font-semibold">✓ Attached</span>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          Step 4 &amp; 5: Authorize, Don&apos;t Pay
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-xs font-semibold">
                          Card Hold Only
                        </span>
                      </div>
                      <div className="p-3.5 rounded-lg bg-muted/70 text-xs text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Your card is authorized now, not charged.</strong>{' '}
                        The charge only happens when a designer accepts the case. If no designer takes the case within 6 days, the hold is released automatically.
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div>
                          <div className="text-xs text-muted-foreground">Amount to Authorize</div>
                          <div className="text-xl font-bold text-foreground">$150.00</div>
                        </div>
                        <Link
                          to="/projects/new"
                          className="px-5 py-2.5 rounded-lg bg-primary text-white text-xs font-semibold"
                        >
                          Authorize $150.00
                        </Link>
                      </div>
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          Step 5: Review 3D Mesh &amp; Approve
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 text-xs font-semibold">
                          Submitted for Review
                        </span>
                      </div>
                      <div className="p-4 rounded-xl bg-[#0d0d1a] text-white flex items-center justify-between">
                        <div>
                          <div className="text-xs font-semibold">
                            Final_Zirconia_Bridge_24_26_CAM.stl
                          </div>
                          <div className="text-[11px] text-white/60">
                            3D Browser Viewer + exocad Web Link attached
                          </div>
                        </div>
                        <Link
                          to="/projects/1048"
                          className="px-3 py-1.5 rounded-lg bg-primary text-xs font-semibold"
                        >
                          Spin in 3D →
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Link
                          to="/projects/1048"
                          className="flex-1 text-center py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                        >
                          Accept Design &amp; Complete
                        </Link>
                        <Link
                          to="/projects/1048"
                          className="px-4 py-2 rounded-lg border border-border text-xs font-semibold text-foreground"
                        >
                          Send Revision
                        </Link>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Click any step on the left to preview</span>
                    <Link
                      to="/projects/new"
                      className="font-semibold text-primary hover:underline"
                    >
                      Try Live Case Wizard →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Step Counter & Prev/Next Controls */}
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground tabular-nums">
                  Step {activeStep + 1} of 5
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                    aria-label="Previous step"
                    className="size-8 rounded-full border border-border flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveStep((s) => (s + 1) % 5)}
                    className="inline-flex items-center gap-1.5 px-4 h-8 rounded-full bg-primary hover:bg-primary/90 text-white text-xs font-medium cursor-pointer"
                  >
                    <span>Next: {stepData.nextLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-border flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">
                  Want to see who is on the platform first?
                </span>
                <div className="flex items-center gap-4 font-semibold">
                  <Link to="/designers" className="text-primary hover:underline">
                    Browse designers
                  </Link>
                  <Link to="/auth/register" className="text-foreground hover:text-primary">
                    Create a free account →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURES & THE CASE WORKSPACE SECTION */}
      <section id="features" className="bg-muted/50 py-14 lg:py-20 border-y border-border">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase mb-3">
              ✦ Features
            </p>
            <h2 className="text-[2rem] sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-tight">
              Everything your dental CAD design needs.
            </h2>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              Find the right designer, send your scans, review the work and pay safely, all in one place.
            </p>
          </div>

          {/* Highlight Card: The Case Workspace */}
          <div className="max-w-6xl mx-auto rounded-2xl bg-card border border-border shadow-sm overflow-hidden mb-8">
            <div className="grid lg:grid-cols-12">
              <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <p className="text-primary text-xs font-semibold tracking-[0.15em] uppercase">
                    ✦ The Case Workspace
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                    One screen for the whole case.
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Stop chasing files across email threads and chat apps. Every case gets its own workspace, and both you and your designer work from the same place.
                  </p>

                  <ul className="space-y-3 pt-2 text-sm text-foreground">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>Scan files, deliverables and web links, sorted and labeled</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>A 3D viewer and your digital design link one tab away</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>A conversation with your designer, inside the case</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>A timeline of every status the case has passed through</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <Link
                    to="/projects/1048"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    <span>Explore Live Case Workspace (#PRJ-1048)</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Interactive Case Workspace Preview Tabs */}
              <div className="lg:col-span-7 bg-[#0d0d1a] text-white p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {(
                      ['Overview', 'Files', '3D & digital design', 'Conversation'] as const
                    ).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setWorkspacePreviewTab(tab)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          workspacePreviewTab === tab
                            ? 'bg-primary text-white'
                            : 'text-white/60 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold">
                    Status: Submitted · Escrow $150
                  </span>
                </div>

                <div className="my-6 min-h-[200px] flex flex-col justify-center">
                  {workspacePreviewTab === 'Files' && (
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-white/50 uppercase">
                        Your Scan Files &amp; Designer Deliverables
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                        <span>Upper_Arch_Prep_24_26.stl · 14.2 MB</span>
                        <span className="text-primary font-semibold">Open in 3D Viewer →</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-primary/15 border border-primary/40 flex items-center justify-between text-xs">
                        <span>Final_Zirconia_Bridge_24_26_CAM.stl · 11.8 MB (Deliverable)</span>
                        <span className="text-emerald-400 font-semibold">Ready to Review</span>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                        <span>Web Link: exocad WebView 3D Design Preview</span>
                        <span className="text-sky-400 font-semibold">https:// ↗</span>
                      </div>
                    </div>
                  )}

                  {workspacePreviewTab === 'Overview' && (
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/50">Service</div>
                        <div className="font-semibold text-white mt-1">Crown &amp; Bridge</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/50">Payment Status</div>
                        <div className="font-semibold text-emerald-400 mt-1">
                          Escrow ($150.00)
                        </div>
                      </div>
                      <div className="col-span-2 p-3.5 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-white/50">Case Notes</div>
                        <div className="text-white/80 mt-1">
                          3-unit posterior monolithic zirconia bridge (#24–#26). 0.04mm cement spacer, hygienic pontic.
                        </div>
                      </div>
                    </div>
                  )}

                  {workspacePreviewTab === '3D & digital design' && (
                    <div className="text-center space-y-3 py-4">
                      <Box className="w-10 h-10 text-primary mx-auto" />
                      <div className="text-sm font-bold">
                        Interactive WebGL 3D Mesh &amp; Design Link Viewer
                      </div>
                      <p className="text-xs text-white/60 max-w-md mx-auto">
                        Press F for fullscreen and use Left / Right arrow keys to step through every STL, PLY, OBJ, and digital design web link.
                      </p>
                    </div>
                  )}

                  {workspacePreviewTab === 'Conversation' && (
                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-white/10 max-w-md">
                        <div className="font-bold text-white/90">Dr. Amelia Vance</div>
                        <div className="text-white/70 mt-0.5">
                          Please keep the distal margin on #26 at 0.04mm spacer.
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-primary/30 border border-primary/40 max-w-md ml-auto">
                        <div className="font-bold text-white">Marcus Lindqvist, CDT</div>
                        <div className="text-white/90 mt-0.5">
                          Uploaded the finished CAM STL and exocad web preview link!
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                  <span>Left rail + 4 tabs on one screen</span>
                  <Link to="/projects/1048" className="text-white font-semibold hover:underline">
                    Launch Full Workspace →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 6-Card Feature Grid (Exact ExoConnect Cards) */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-card rounded-2xl border border-border p-8 flex flex-col justify-between">
              <div>
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Users className="size-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 leading-snug">
                  See designers before you join
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  The designer directory is open to everyone. Check profiles, work samples, reviews and prices first, then decide.
                </p>
              </div>
              <Link
                to="/designers"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline mt-5"
              >
                <span>Browse designers</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 flex flex-col">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <CreditCard className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 leading-snug">
                Your card is held, not charged
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Submitting a case places a hold on your card. You are charged only when a designer accepts. If nobody takes it in 6 days, the hold is released.
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 flex flex-col">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Box className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 leading-snug">
                3D preview in the browser
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Open STL, PLY and OBJ files and spin them around without downloading anything. Step through every file in fullscreen with the arrow keys.
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 flex flex-col">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Layers className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 leading-snug">
                Review digital design links in the case
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Attach a digital design web link to any case and open it right inside the workspace, so design reviews do not happen over email.
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 flex flex-col">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <ShieldCheck className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 leading-snug">
                Revisions and disputes built in
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ask for changes with one click. If something goes wrong, open a dispute and the ExoConnect team reviews it and settles it with a refund, a release or a split.
              </p>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8 flex flex-col">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Gift className="size-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2 leading-snug">
                Referrals that pay
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Share your referral code with a colleague. When their case is paid, you earn. It is tracked for you on your Referrals page.
              </p>
            </div>
          </div>

          {/* Dark Callout Banner for Digital Design Professionals */}
          <div className="max-w-6xl mx-auto mt-8 rounded-2xl bg-[#0d0d1a] px-8 py-10 sm:px-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-white/50 text-[11px] font-bold tracking-[0.18em] uppercase mb-2">
                For digital design professionals
              </p>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                Set your own prices. Build your profile. Get paid for your work.
              </h3>
              <p className="mt-3 text-white/60 text-sm leading-relaxed">
                List the services you offer, add work samples to your public profile, and take on cases from dentists who choose you.
              </p>
            </div>
            <Link
              to="/as/designer"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-full text-sm font-medium shrink-0 transition-all"
            >
              <span>Join as a designer</span>
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. PRICING SECTION (EXACT EXOCONNECT STRUCTURE) */}
      <section id="pricing" className="bg-[#F8F6F1] dark:bg-background py-14 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="text-[#054bce] text-xs font-semibold tracking-[0.15em] uppercase mb-3">
              ✦ Pricing
            </p>
            <h2 className="text-[2rem] sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-tight">
              Flexible Pricing Built For
              <br />
              Freelance Digital Design Professionals
            </h2>
            <p className="text-muted-foreground mt-4 text-[13.5px]">
              Start free on Standard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch pt-4 max-w-3xl mx-auto">
            {/* Standard Plan */}
            <div className="rounded-2xl p-7 bg-card border border-border shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-sm font-bold text-foreground">Standard</div>
                <div className="text-xs text-muted-foreground mt-1">
                  For independent CAD designers starting on ExoConnect
                </div>
                <div className="mt-5 mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">$0</span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>
                <Link
                  to="/auth/register?role=designer"
                  className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-semibold flex items-center justify-center mb-6 transition-colors"
                >
                  Start Free on Standard
                </Link>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Public designer profile &amp; up to 12 portfolio samples</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Set your own custom prices per dental service</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Keep 88% of every completed case (12% commission)</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Full Case Workspace, 3D viewer &amp; direct payouts</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="rounded-2xl p-7 bg-card border-2 border-primary shadow-sm flex flex-col justify-between relative">
              <span className="absolute -top-3 right-5 px-3 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                High Volume
              </span>
              <div>
                <div className="text-sm font-bold text-foreground">Pro Designer</div>
                <div className="text-xs text-muted-foreground mt-1">
                  For high-volume freelance designers &amp; micro-labs
                </div>
                <div className="mt-5 mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">$49</span>
                  <span className="text-xs text-muted-foreground">/ month</span>
                </div>
                <Link
                  to="/auth/register?role=designer"
                  className="w-full h-10 rounded-lg bg-foreground hover:opacity-90 text-background text-xs font-semibold flex items-center justify-center mb-6 transition-opacity"
                >
                  Join as Pro Designer
                </Link>
                <ul className="space-y-3 text-xs text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Priority placement in the open Designer Directory</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Reduced platform commission on high-volume cases</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Unlimited portfolio work samples &amp; featured badge</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Dedicated support &amp; partner referral tracking</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 max-w-3xl mx-auto rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm font-semibold text-foreground">For dentists</p>
            <p className="mt-1 text-[13.5px] text-muted-foreground">
              Free to join. You only pay the price of each case.
            </p>
          </div>
        </div>
      </section>

      {/* 5. TRUSTED BY SECTION */}
      <section className="bg-background py-14 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
            <div>
              <h2 className="text-[2.4rem] sm:text-5xl lg:text-[3.1rem] font-black text-foreground leading-[1.08] tracking-tight">
                Trusted By Dental
                <br />
                Practices &amp; Digital Design
                <br />
                Professionals Worldwide
              </h2>
            </div>
            <div className="flex flex-col justify-between h-full gap-6">
              <p className="text-muted-foreground text-[15px] leading-relaxed max-w-md">
                See how ExoConnect is helping dental professionals collaborate faster, deliver better results, and grow their workflow with confidence.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {SEED_EXO_DESIGNERS.slice(0, 2).map((d) => (
                  <Link
                    key={d.id}
                    to={`/designer/${d.id}`}
                    className="p-4 rounded-xl border border-border bg-card hover:border-primary transition-colors space-y-2"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={d.avatar}
                        alt={d.name}
                        className="size-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-foreground">{d.name}</div>
                        <div className="text-[11px] text-muted-foreground">{d.location}</div>
                      </div>
                    </div>
                    <div className="text-xs text-amber-500 font-semibold">
                      ★★★★★ {d.rating} ({d.reviewsCount} reviews)
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA BANNER */}
      <section className="relative overflow-hidden bg-[#0d0d1a]">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-20 relative z-10">
          <div className="max-w-xl">
            <h2 className="text-[2rem] sm:text-4xl lg:text-[2.75rem] font-bold text-white leading-tight">
              Ready To Transform Your
              <br />
              Dental CAD Workflow?
            </h2>
            <p className="text-white/60 mt-4 text-[13.5px] leading-relaxed">
              See how ExoConnect is helping dental professionals collaborate faster, deliver better results, and grow their workflow with confidence.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                to="/designers"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-full text-sm font-medium transition-all"
              >
                Find a Designer
              </Link>
              <Link
                to="/auth/register?role=designer"
                className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-white text-black hover:bg-white/90 text-sm font-medium transition-all"
              >
                Join as a Designer
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
