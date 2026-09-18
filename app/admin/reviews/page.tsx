'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AdminReview {
  id: string;
  author: string;
  initials: string;
  role: string;
  serial: string;
  location: string;
  route: string;
  date: string;
  rating: number;
  deliveryTime: string;
  title: string;
  content: string;
  tamperSealVerified: boolean;
  transitGForce: string;
  status: 'pending' | 'approved' | 'flagged';
  featured: boolean;
}

const INITIAL_REVIEWS: AdminReview[] = [
  {
    id: 'rev-1',
    author: 'Elena Rostova',
    initials: 'ER',
    role: 'Aviation Hardware Director',
    serial: 'SN-AURA-9812-TITAN',
    location: 'Munich, Germany',
    route: 'JFK ➔ MUC (AF-902)',
    date: 'Today, 14:22',
    rating: 5,
    deliveryTime: '41 mins',
    title: 'Transcontinental flight reached our rooftop landing pad in 41 minutes sharp',
    content: 'Beacon v4 transcontinental test reached our rooftop landing pad in 41 minutes sharp. Packaging vacuum seal integrity intact, haptic response is unmatched. Decoupled telemetry linked to our ERP immediately.',
    tamperSealVerified: true,
    transitGForce: '0.02G',
    status: 'pending',
    featured: true,
  },
  {
    id: 'rev-2',
    author: 'Klaus Von Berg',
    initials: 'KV',
    role: 'Logistics Systems Architect',
    serial: 'SN-CRYO-4402-FRA',
    location: 'Frankfurt, Germany',
    route: 'JFK ➔ FRA (Corridor A-1)',
    date: 'Yesterday',
    rating: 4,
    deliveryTime: '1h 14m',
    title: 'Hardware is exceptional, but slight seal delay at Frankfurt customs',
    content: 'Hardware is exceptional, but slight seal delay at Frankfurt customs held the delivery for 24 extra minutes. Recommend automated pre-clearance documents for stratospheric freight corridors.',
    tamperSealVerified: true,
    transitGForce: '0.04G',
    status: 'pending',
    featured: false,
  },
  {
    id: 'rev-3',
    author: 'Marcus Sterling',
    initials: 'MS',
    role: 'Autonomous Fleet Operator',
    serial: 'SN-AURA-1029-BER',
    location: 'Berlin, Germany',
    route: 'LHR ➔ BER (Drone Sortie)',
    date: '2 days ago',
    rating: 5,
    deliveryTime: '28 mins',
    title: 'Balcony drop precision within 4 centimeters',
    content: 'Autonomous drone descent was textbook. Deceleration rockets engaged at 3 meters elevation, lowering the parcel onto our balcony target with zero package deformation.',
    tamperSealVerified: true,
    transitGForce: '0.01G',
    status: 'approved',
    featured: true,
  },
  {
    id: 'rev-4',
    author: 'Dr. Aris Thorne',
    initials: 'AT',
    role: 'Cryogenics Lead',
    serial: 'SN-CRYO-8819-TKO',
    location: 'Tokyo, Japan',
    route: 'FRA ➔ HND (AF-114)',
    date: '3 days ago',
    rating: 5,
    deliveryTime: '14.2 hrs',
    title: 'Cryo-bay remained at exactly -4.2°C across the entire Pacific corridor',
    content: 'Zero thermal variance recorded across 9,000 km of stratospheric transport. The telemetry beacon relayed live sensor packets every 30 seconds via low-earth orbit link.',
    tamperSealVerified: true,
    transitGForce: '0.03G',
    status: 'approved',
    featured: true,
  },
  {
    id: 'rev-5',
    author: 'Devon Vance',
    initials: 'DV',
    role: 'Security Specialist',
    serial: 'SN-SEAL-3310-NYC',
    location: 'New York, USA',
    route: 'BOS ➔ JFK',
    date: '4 days ago',
    rating: 5,
    deliveryTime: '19 mins',
    title: 'Kevlar outer packaging took severe drop tests without structural blemish',
    content: 'We ran stress simulations on arrival. The tamper-evident cryptographic tape changes hue if exposed to shearing force, proving virgin factory packaging condition.',
    tamperSealVerified: true,
    transitGForce: '0.02G',
    status: 'approved',
    featured: false,
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>(INITIAL_REVIEWS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'featured'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (id: string, credit = false) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'approved' } : r
      )
    );
    showToast(
      credit
        ? 'Review approved + $15 freight compensation credit transferred!'
        : 'Review approved and published to public storefront!'
    );
  };

  const handleToggleFeatured = (id: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, featured: !r.featured } : r
      )
    );
    showToast('Featured status updated for storefront hero display.');
  };

  const handleReject = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review archived and removed from publishing queue.');
  };

  const filtered = reviews.filter((r) => {
    if (filter === 'pending' && r.status !== 'pending') return false;
    if (filter === 'approved' && r.status !== 'approved') return false;
    if (filter === 'featured' && !r.featured) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.author.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.serial.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-on-surface">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-2xl border border-outline-variant/30 flex items-center gap-3 animate-fade-in text-sm font-medium">
          <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Strip */}
      <div className="px-8 py-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-surface-container-lowest border-b border-surface-container shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-12 bg-primary rounded-full" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight">
                Customer Reviews & Field Telemetry Moderation
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-secondary-fixed/30 text-on-secondary-fixed text-xs font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
                {pendingCount} Pending Approval
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
              Cryptographically verified buyer field reports and flight corridor evaluations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/reviews"
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container text-on-surface font-bold text-xs transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            View Public Reviews Page
          </Link>
        </div>
      </div>

      <div className="p-8 space-y-6 max-w-[1720px] mx-auto w-full">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
              Aggregate Field Score
            </span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="font-headline text-3xl font-bold text-on-surface">4.92</span>
              <span className="text-amber-500 text-sm font-bold flex items-center">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                / 5.0
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">Across 1,480 verified missions</p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
              Net Positive Sentiment
            </span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="font-headline text-3xl font-bold text-secondary">94%</span>
              <span className="text-xs text-secondary font-bold">+2.4% this week</span>
            </div>
            <p className="text-xs text-on-surface-variant">Automated NLP sentiment analyzer</p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
              Cryptographic Seals Intact
            </span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="font-headline text-3xl font-bold text-primary">100.0%</span>
            </div>
            <p className="text-xs text-on-surface-variant">Zero transit tamper occurrences</p>
          </div>

          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm">
            <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
              Moderation Latency
            </span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="font-headline text-3xl font-bold text-on-surface">3.2m</span>
              <span className="text-xs text-on-surface-variant">Turnaround SLA</span>
            </div>
            <p className="text-xs text-on-surface-variant">99.8% approved within 15 min</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest p-4 rounded-2xl border border-surface-container shadow-sm">
          <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-full overflow-x-auto border border-outline-variant/30">
            <button
              onClick={() => setFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === 'pending'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === 'approved'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === 'featured'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Storefront Featured
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-outline">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviewer, serial, route..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low rounded-full text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary border border-outline-variant/30"
            />
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filtered.map((rev) => (
            <div
              key={rev.id}
              className={`bg-surface-container-lowest p-6 rounded-3xl border border-surface-container shadow-sm space-y-4 transition-all hover:shadow-md ${
                rev.status === 'pending' ? 'border-l-4 border-l-secondary-fixed' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center font-headline text-sm">
                    {rev.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline text-base font-bold text-on-surface">{rev.author}</span>
                      <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                      <span className="text-[10px] text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded-full">
                        {rev.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px] text-outline mt-0.5">
                      <span>{rev.serial}</span>
                      <span>•</span>
                      <span>{rev.route}</span>
                      <span>•</span>
                      <span>Transit Time: {rev.deliveryTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined text-[18px]"
                        style={{
                          fontVariationSettings: "'FILL' 1",
                          color: i < rev.rating ? '#f59e0b' : '#c3c6d7',
                        }}
                      >
                        star
                      </span>
                    ))}
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      rev.status === 'approved'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : 'bg-tertiary-fixed text-on-tertiary-fixed'
                    }`}
                  >
                    {rev.status === 'approved' ? 'Storefront Live' : 'Pending Review'}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-headline text-sm font-bold text-on-surface mb-1">{rev.title}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-low/60 p-3.5 rounded-2xl">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-surface-container">
                <div className="flex items-center gap-4 text-xs font-mono text-outline">
                  <span className="flex items-center gap-1 text-secondary font-bold">
                    <span className="material-symbols-outlined text-[16px]">verified_user</span>
                    Tamper Seal: Cryptographically Verified
                  </span>
                  <span>Impact: {rev.transitGForce}</span>
                  <span>{rev.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFeatured(rev.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all flex items-center gap-1 ${
                      rev.featured
                        ? 'bg-amber-500/10 border-amber-500 text-amber-600'
                        : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {rev.featured ? 'star' : 'star_border'}
                    </span>
                    {rev.featured ? 'Featured' : 'Feature on Storefront'}
                  </button>

                  {rev.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(rev.id, true)}
                        className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all flex items-center gap-1 shadow-sm active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[16px]">price_check</span>
                        Approve + $15 Credit
                      </button>
                      <button
                        onClick={() => handleApprove(rev.id, false)}
                        className="px-3.5 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-xs hover:bg-secondary-fixed-dim transition-all flex items-center gap-1 shadow-sm active:scale-95"
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                        Approve
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleReject(rev.id)}
                      className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-red-50 hover:text-red-600 text-on-surface-variant font-bold text-xs transition-all"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
