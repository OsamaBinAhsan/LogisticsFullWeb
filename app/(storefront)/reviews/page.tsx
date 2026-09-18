'use client';

import * as React from 'react';
import Link from 'next/link';

interface ReviewItem {
  id: string;
  author: string;
  role: string;
  route: string;
  score: number;
  date: string;
  tag: string;
  title: string;
  body: string;
  tamperVerified: boolean;
  transitHours: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: 'REV-01',
    author: 'Marcus Vance',
    role: 'Senior Freight Director, SkyLog',
    route: 'NRT ➔ LAX (Terminal 4)',
    score: 5,
    date: '3 hours ago',
    tag: 'Drone Air Drop',
    title: 'Zero G-force damage on surgical optic sensors',
    body: 'We subjected the Kevlar modular pod to severe turbulence over the Pacific corridor. The onboard impact sensor logged a peak of only 0.04G. Package arrived 45 minutes ahead of scheduled SLA.',
    tamperVerified: true,
    transitHours: '7.8 hrs',
  },
  {
    id: 'REV-02',
    author: 'Dr. Elena Rostova',
    role: 'Lead Field Engineer, BioPharma Lab',
    route: 'FRA ➔ JFK (Cold Chain)',
    score: 5,
    date: 'Yesterday',
    tag: 'Cold Chain Relay',
    title: 'Consistent -4°C temperature maintained throughout 8h hop',
    body: 'Automated pre-clearance at Frankfurt cut ground holding time to zero. The telemetry logs showed no thermal spikes. Absolute gold standard in medical freight dispatch.',
    tamperVerified: true,
    transitHours: '6.9 hrs',
  },
  {
    id: 'REV-03',
    author: 'Kenji Takahashi',
    role: 'Hardware Prototyper & Buyer',
    route: 'HND ➔ SFO (Skyport Bay)',
    score: 5,
    date: '2 days ago',
    tag: 'Verified Consumer',
    title: 'Balcony tether drop was seamless and futuristic',
    body: 'Ordered custom PCB prototype boards on Tuesday morning, drone tether landed on my balcony roof landing pad before sundown. The cryptographic QR seal unlocked instantly on phone scan.',
    tamperVerified: true,
    transitHours: '4.2 hrs',
  },
  {
    id: 'REV-04',
    author: 'Sarah Jenkins',
    role: 'Operations Lead, Nordic Supply',
    route: 'BER ➔ LHR (Hyper-Rail)',
    score: 4.8,
    date: '3 days ago',
    tag: 'Courier Log',
    title: 'Zero-emission high speed rail delivery executed flawlessly',
    body: 'Eurasian rail freight network synchronized with London local electric vans. Customer received live WhatsApp push notifications every 50 kilometers.',
    tamperVerified: true,
    transitHours: '12.4 hrs',
  },
];

export default function CustomerReviewsPage() {
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [modalOpen, setModalOpen] = React.useState(false);
  const [submittedToast, setSubmittedToast] = React.useState(false);

  const filters = [
    { id: 'all', label: 'All Field Reports' },
    { id: 'verified', label: 'Verified Deliveries' },
    { id: 'drone', label: 'Drone Drops' },
    { id: 'cold', label: 'Cold Chain Relay' },
  ];

  const filteredReviews = REVIEWS.filter((r) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'verified') return r.tamperVerified;
    if (activeFilter === 'drone') return r.tag.includes('Drone');
    if (activeFilter === 'cold') return r.tag.includes('Cold');
    return true;
  });

  return (
    <div className="w-full flex flex-col min-h-screen bg-surface">
      {/* Top Ambient Telemetry Strip */}
      <div className="w-full bg-surface-container-low py-3 px-6 lg:px-12 border-b border-surface-container-high">
        <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs uppercase tracking-wider font-bold">
              <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
              Telemetry Sync: Active
            </span>
            <span className="font-body-sm text-xs text-on-surface-variant hidden sm:inline">
              Global Beacon Handshakes: 948,204 packets/hr
            </span>
          </div>
          <div className="flex items-center gap-6 font-label-sm text-xs text-on-surface-variant font-medium">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">verified_user</span>
              Cryptographic Chain Signed
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">eco</span>
              Carbon-Neutral Field Labs
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
              Updated 2m ago
            </span>
          </div>
        </div>
      </div>

      {/* Hero Feedback & Telemetry Header */}
      <section className="relative w-full px-6 lg:px-12 py-12 lg:py-16 overflow-hidden">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Title & Value Pitch */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-xs uppercase tracking-widest font-bold">
              <span className="material-symbols-outlined text-[16px]">sensors</span>
              Decentralized Sensory Vault
            </div>
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-on-surface tracking-tight leading-tight">
              Verified Field Reports &{' '}
              <span className="text-primary underline decoration-secondary-fixed decoration-wavy decoration-2 underline-offset-8">
                Community Telemetry
              </span>
            </h1>
            <p className="font-body-lg text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Over 14,800 authenticated delivery logs, drop tests, and thermal telemetry notes recorded directly from global supply chain operators, courier engineers, and verified buyers in 140+ countries.
            </p>

            {/* Dynamic Action Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-xs uppercase tracking-wider font-bold shadow-md hover:bg-primary-container active:scale-95 transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[20px]">add_task</span>
                Submit Field Report
              </button>
              <a
                href="#dropTestGallery"
                className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-surface-container-high text-on-surface font-label-lg text-xs uppercase tracking-wider font-bold hover:bg-surface-container-highest transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[20px] text-primary">video_camera_front</span>
                Watch 4.2m Drop Tests
              </a>
              <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-secondary-container/50 text-on-secondary-container font-label-sm text-xs font-bold">
                <span className="material-symbols-outlined text-[16px] text-secondary">encrypted</span>
                Serial Scan Authentication
              </div>
            </div>

            {/* Trust Badges Strip */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col gap-1">
                <span className="font-headline text-2xl font-bold text-primary">100%</span>
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Hardware Scanned</span>
                <span className="font-body-sm text-xs text-on-surface-variant/80">Anti-bot verified dispatch</span>
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col gap-1">
                <span className="font-headline text-2xl font-bold text-on-surface">18.4 hrs</span>
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Average Transit</span>
                <span className="font-body-sm text-xs text-on-surface-variant/80">Sub-day air cargo relay</span>
              </div>
              <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm flex flex-col gap-1">
                <span className="font-headline text-2xl font-bold text-secondary">0.00%</span>
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Transit Breakage</span>
                <span className="font-body-sm text-xs text-on-surface-variant/80">Kevlar & Air-Cushion test</span>
              </div>
            </div>
          </div>

          {/* Live Aggregate Score Card */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-card flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
                <span className="font-label-md text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                  Aggregate Score
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-xs font-bold">
                v4.8 Telemetry
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="font-headline text-6xl text-on-surface font-bold tracking-tight">4.92</span>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-tertiary-container">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[24px]">star</span>
                  ))}
                </div>
                <span className="font-body-sm text-xs text-on-surface-variant mt-1">Based on 14,821 telemetry logs</span>
              </div>
            </div>

            {/* Distribution Bars */}
            <div className="space-y-2.5">
              {[
                { stars: '5 Star', pct: '91%' },
                { stars: '4 Star', pct: '7%' },
                { stars: '3 Star', pct: '1.5%' },
                { stars: '2 Star', pct: '0.4%' },
                { stars: '1 Star', pct: '0.1%' },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-3 font-label-md text-xs">
                  <span className="w-12 text-on-surface-variant font-medium">{row.stars}</span>
                  <div className="flex-1 h-2 rounded-full bg-surface-container-low overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: row.pct }} />
                  </div>
                  <span className="w-8 text-right font-mono text-outline">{row.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter Chips Bar */}
      <section className="w-full px-6 lg:px-12 py-4 border-y border-surface-container-high bg-surface-container-low">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {filters.map((f) => {
              const isSelected = activeFilter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-4 py-2 rounded-full font-label-md text-xs font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-on-surface text-surface shadow-sm'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <span className="font-label-sm text-xs text-outline hidden md:inline">
            Showing {filteredReviews.length} authenticated field reports
          </span>
        </div>
      </section>

      {/* Review Cards Grid */}
      <section className="w-full px-6 lg:px-12 py-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline text-base font-bold text-on-surface">{rev.author}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-bold">
                        {rev.tag}
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-on-surface-variant">{rev.role}</p>
                  </div>
                  <span className="font-mono text-xs text-outline shrink-0">{rev.date}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex text-tertiary-container">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[18px]">star</span>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-outline font-bold">
                    Route: {rev.route}
                  </span>
                </div>

                <h4 className="font-headline text-lg font-bold text-on-surface">{rev.title}</h4>
                <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">{rev.body}</p>
              </div>

              <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-secondary font-bold">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Cryptographic Seal Verified
                </span>
                <span className="font-mono text-outline">
                  Transit Time: <strong className="text-on-surface">{rev.transitHours}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Field Report Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-surface-container-lowest p-6 sm:p-8 shadow-2xl border border-outline-variant/40 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-headline text-xl font-bold text-on-surface">Submit Field Telemetry Report</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full text-outline hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setModalOpen(false);
                setSubmittedToast(true);
                setTimeout(() => setSubmittedToast(false), 3000);
              }}
              className="space-y-4 font-body-sm text-xs"
            >
              <div>
                <label className="block text-on-surface-variant font-bold mb-1">Your Name / Call Sign</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Captain Alex Rivera"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-bold mb-1">Role / Operator Unit</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flight Telemetry Tech, Tokyo Hub"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <div>
                <label className="block text-on-surface-variant font-bold mb-1">Field Observations & Drop Results</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe landing shock, temperature variance, or packaging seal integrity..."
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-primary text-on-primary font-bold text-xs uppercase tracking-wider hover:bg-primary-container transition-all"
              >
                Broadcast Report to Mesh
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Submission Confirmation Toast */}
      {submittedToast && (
        <div className="fixed top-24 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in duration-300">
          <span className="material-symbols-outlined text-[18px] text-secondary-fixed">verified</span>
          <div>
            <p className="font-label-lg text-xs font-bold">Report Accepted into Sensory Vault</p>
            <p className="font-body-sm text-xs text-inverse-on-surface/80">Pending automatic moderation queue verification.</p>
          </div>
        </div>
      )}
    </div>
  );
}
