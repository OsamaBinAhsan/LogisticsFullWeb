'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ordersService } from '@/lib/services/orders.service';
import type { AuraOrder } from '@/types';

interface DispatchItem {
  id: string;
  trackingId: string;
  destination: string;
  cargo: string;
  priority: 'Priority Express' | 'Drone Sortie' | 'Customs Flag' | 'Balcony Drone' | 'Standard Air';
  priorityType: 'express' | 'drone' | 'customs' | 'standard';
  eta: string;
  speedTier: string;
  temp: string;
  weight: string;
  status: string;
}

const INITIAL_DISPATCHES: DispatchItem[] = [
  {
    id: 'd-1',
    trackingId: '#AC-9821-NYC',
    destination: 'New York, US (JFK)',
    cargo: 'Aura Beacon v4 (Titanium Edition)',
    priority: 'Priority Express',
    priorityType: 'express',
    eta: 'ETA: 42 mins',
    speedTier: 'Sub-orbital Fast',
    temp: '-3.8°C',
    weight: '1.42 kg',
    status: 'In Flight (AF-902)',
  },
  {
    id: 'd-2',
    trackingId: '#AC-9844-BER',
    destination: 'Berlin, DE (BER)',
    cargo: 'Cryo Pod Array (3x Unit)',
    priority: 'Drone Sortie',
    priorityType: 'drone',
    eta: 'ETA: 1h 14m',
    speedTier: 'Hub Transfer',
    temp: '-4.6°C',
    weight: '3.10 kg',
    status: 'Airborne (Pod-9)',
  },
  {
    id: 'd-3',
    trackingId: '#AC-7719-TYO',
    destination: 'Tokyo, JP (HND)',
    cargo: 'Optic Core Glass Lenses',
    priority: 'Customs Flag',
    priorityType: 'customs',
    eta: 'Hold @ Gate 3',
    speedTier: 'Document Lock',
    temp: '+18.2°C',
    weight: '0.85 kg',
    status: 'Inspection Required',
  },
  {
    id: 'd-4',
    trackingId: '#AC-6632-SIN',
    destination: 'Singapore, SG (SIN)',
    cargo: 'Precision Chrono Ring',
    priority: 'Balcony Drone',
    priorityType: 'drone',
    eta: 'ETA: 18 mins',
    speedTier: 'Final Approach',
    temp: '+21.0°C',
    weight: '0.34 kg',
    status: 'Descent Vector',
  },
  {
    id: 'd-5',
    trackingId: '#AC-5511-LHR',
    destination: 'London, UK (LHR)',
    cargo: 'Ceramic Hub Node',
    priority: 'Standard Air',
    priorityType: 'standard',
    eta: 'ETA: 3h 10m',
    speedTier: 'Cruising Flight AF-902',
    temp: '+15.4°C',
    weight: '2.18 kg',
    status: 'Cruising Corridor A-1',
  },
];

interface ReviewItem {
  id: string;
  name: string;
  initials: string;
  serial: string;
  stars: number;
  quote: string;
  origin: string;
  hasWarning?: boolean;
  status: 'pending' | 'approved' | 'credited';
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Elena Rostova',
    initials: 'ER',
    serial: 'SN-AURA-9812-TITAN',
    stars: 5,
    quote: 'Beacon v4 transcontinental test reached our rooftop landing pad in 41 minutes sharp. Packaging vacuum seal integrity intact, haptic response is unmatched.',
    origin: 'Dispatched from JFK Hub #1',
    status: 'pending',
  },
  {
    id: 'rev-2',
    name: 'Klaus Von Berg',
    initials: 'KV',
    serial: 'SN-CRYO-4402-FRA',
    stars: 4,
    quote: 'Hardware is exceptional, but slight seal delay at Frankfurt customs held the delivery for 24 extra minutes. Recommend automated pre-clearance documents.',
    origin: 'Frankfurt Core Dispatch',
    hasWarning: true,
    status: 'pending',
  },
];

export default function AdminOverviewPage() {
  const [orders, setOrders] = useState<AuraOrder[]>([]);
  const [filter, setFilter] = useState<'all' | 'express' | 'drone' | 'customs'>('all');
  const [dispatches, setDispatches] = useState<DispatchItem[]>(INITIAL_DISPATCHES);
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [activeFlights, setActiveFlights] = useState(38);
  const [selectedPayload, setSelectedPayload] = useState<DispatchItem | null>(null);
  const [showRerouteModal, setShowRerouteModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sensorsSynced, setSensorsSynced] = useState(false);

  useEffect(() => {
    ordersService.getOrders().then((data: any) => {
      const ords = Array.isArray(data) ? data : data?.orders || [];
      setOrders(ords);
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSimulateSortie = () => {
    setActiveFlights((prev) => prev + 1);
    const newId = `#AC-${Math.floor(1000 + Math.random() * 9000)}-DRN`;
    const newSortie: DispatchItem = {
      id: `d-${Date.now()}`,
      trackingId: newId,
      destination: 'Zurich, CH (ZRH)',
      cargo: 'Autonomous Sensor Beacon',
      priority: 'Drone Sortie',
      priorityType: 'drone',
      eta: 'ETA: 24 mins',
      speedTier: 'Sub-orbital Fast',
      temp: '-4.1°C',
      weight: '0.90 kg',
      status: 'Launched Sortie Vector',
    };
    setDispatches((prev) => [newSortie, ...prev]);
    showToast(`Drone Sortie Launched! Waybill ${newId} airborne on Corridor Alpine-4.`);
  };

  const handleApproveReview = (id: string, credit = false) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: credit ? 'credited' : 'approved' } : r
      )
    );
    showToast(credit ? 'Review approved + $15 freight credit wired to customer wallet!' : 'Review approved and published to public storefront!');
  };

  const handleDownloadManifest = () => {
    showToast('IATA Electronic Cargo Airway Manifest (A-1 Atlantic) generated & downloaded.');
  };

  const handleSyncSensors = () => {
    setSensorsSynced(true);
    showToast('Telemetry Synced: 2,400 RFID and Pallet Cryo-sensors refreshed.');
    setTimeout(() => setSensorsSynced(false), 2000);
  };

  const filteredDispatches = dispatches.filter((d) => {
    if (filter === 'all') return true;
    if (filter === 'express') return d.priorityType === 'express';
    if (filter === 'drone') return d.priorityType === 'drone';
    if (filter === 'customs') return d.priorityType === 'customs';
    return true;
  });

  const totalGMV = orders.length > 0 
    ? orders.reduce((sum, o) => sum + o.total, 0) + 142890
    : 142890;

  const pendingReviewsCount = reviews.filter((r) => r.status === 'pending').length;

  return (
    <div className="flex flex-col w-full min-h-screen bg-background text-on-surface">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-2xl shadow-2xl border border-outline-variant/30 flex items-center gap-3 animate-fade-in text-sm font-medium">
          <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Command Header Strip */}
      <div className="px-8 py-6 flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-surface-container-lowest border-b border-surface-container shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-2.5 h-12 bg-primary rounded-full" />
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-headline-md text-2xl font-bold text-on-surface tracking-tight">
                Fleet Command & Operations Matrix
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-secondary-fixed/30 text-on-secondary-fixed text-xs font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
                Aura-Mesh v4.8 Syncing
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
              Real-time autonomous dispatch telemetry & customer experience stream
            </p>
          </div>
        </div>

        {/* Quick Operations Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="flex items-center bg-surface-container-low px-3.5 py-1.5 rounded-full border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[18px] mr-2">satellite_alt</span>
            <span className="font-label-md text-xs text-on-surface font-semibold">
              Sub-orbital Array: <span className="text-secondary font-bold">Lock-9</span>
            </span>
          </div>

          <button
            onClick={handleDownloadManifest}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-xs font-bold transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
            IATA Manifest
          </button>

          <button
            onClick={() => setShowRerouteModal(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">emergency_share</span>
            Emergency Customs Re-Route
          </button>
        </div>
      </div>

      <div className="p-8 space-y-8 max-w-[1720px] mx-auto w-full">
        {/* Section 1: KPI Telemetry Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* KPI 1: Active Flights */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
                Active Global Flights
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-ping" />
            </div>
            <div className="my-3">
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-3xl font-bold text-on-surface">{activeFlights}</span>
                <span className="font-label-md text-xs text-primary font-bold">Airborne</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-[16px] text-secondary">trending_up</span>
                4 stratospheric freighters
              </p>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '78%' }} />
            </div>
          </div>

          {/* KPI 2: Revenue */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
                Today&apos;s Revenue / GMV
              </span>
              <span className="material-symbols-outlined text-primary text-[20px]">payments</span>
            </div>
            <div className="my-3">
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-3xl font-bold text-on-surface">
                  ${totalGMV.toLocaleString()}
                </span>
                <span className="font-label-md text-xs text-secondary font-bold">+18.4%</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-1">vs 24h trailing cycle</p>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary-fixed h-full rounded-full" style={{ width: '92%' }} />
            </div>
          </div>

          {/* KPI 3: SLA Velocity */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
                Dispatch SLA Velocity
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                Sub-15m
              </span>
            </div>
            <div className="my-3">
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-3xl font-bold text-on-surface">99.94%</span>
              </div>
              <p className="font-body-sm text-xs text-secondary flex items-center gap-1 mt-1 font-semibold">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Strict ISO-9002 compliance
              </p>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '99.9%' }} />
            </div>
          </div>

          {/* KPI 4: Reviews Queue */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
                Reviews Moderation
              </span>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold">
                {pendingReviewsCount} Active
              </span>
            </div>
            <div className="my-3">
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-3xl font-bold text-on-surface">{pendingReviewsCount}</span>
                <span className="font-label-md text-xs text-tertiary font-semibold">In Queue</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-1">Avg turnaround: 3.2m</p>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-tertiary-container h-full rounded-full" style={{ width: `${pendingReviewsCount * 25}%` }} />
            </div>
          </div>

          {/* KPI 5: Drone Energy */}
          <div className="bg-surface-container-lowest p-5 rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-[11px] uppercase tracking-wider text-outline font-bold">
                Drone Array Energy
              </span>
              <span className="material-symbols-outlined text-secondary text-[20px]">battery_charging_full</span>
            </div>
            <div className="my-3">
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-3xl font-bold text-on-surface">94.2%</span>
                <span className="font-label-md text-xs text-secondary font-bold">Optimal</span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-1">112 Balcony Pods ready</p>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full" style={{ width: '94.2%' }} />
            </div>
          </div>
        </div>

        {/* Section 2: Live Radar & Tactical Route Control (Hero Centerpiece) */}
        <div className="bg-inverse-surface text-inverse-on-surface rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden">
          {/* Subtle Tactical Grid Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#b4c5ff_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10 mb-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-secondary-fixed animate-ping" />
                <span className="font-label-sm text-xs uppercase tracking-widest text-primary-fixed-dim font-bold">
                  Orbital Trans-Pacific & Trans-Atlantic Live Vectors
                </span>
              </div>
              <h2 className="font-headline text-2xl mt-1 font-bold text-white">
                Global Cargo Radar Stream & Corridors
              </h2>
            </div>

            {/* Radar Quick Controls */}
            <div className="flex items-center flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-surface-variant/20 px-3.5 py-1.5 rounded-full text-inverse-on-surface border border-white/10">
                <span className="material-symbols-outlined text-[16px] text-secondary-fixed">speed</span>
                <span className="font-mono text-xs">Mach 0.82 Cruising</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-variant/20 px-3.5 py-1.5 rounded-full text-inverse-on-surface border border-white/10">
                <span className="material-symbols-outlined text-[16px] text-primary-fixed">ac_unit</span>
                <span className="font-mono text-xs">Cryo-Bay: -4.2°C</span>
              </div>
              <button
                onClick={handleSimulateSortie}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-xs font-bold hover:bg-secondary-fixed-dim transition-all shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
                Simulate Drone Sortie
              </button>
            </div>
          </div>

          {/* Centerpiece Visualization Canvas */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 relative z-10">
            {/* SVG Vector Radar Display */}
            <div className="xl:col-span-8 bg-black/40 rounded-2xl p-6 min-h-[360px] flex flex-col justify-between relative overflow-hidden border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 font-mono text-xs text-primary-fixed-dim">
                  <span>LAT: 40.7128° N</span>
                  <span>•</span>
                  <span>LON: 74.0060° W</span>
                  <span>•</span>
                  <span className="text-secondary-fixed animate-pulse font-bold">CARGO LOCK: ENERGEN-6</span>
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-primary-fixed-dim bg-primary/20 px-3 py-1 rounded-full border border-primary/30 font-bold">
                  Active Transits (4 Sectors)
                </span>
              </div>

              {/* Radar SVG Canvas */}
              <div className="relative w-full h-64 flex items-center justify-center my-4">
                <svg className="w-full h-full max-w-2xl" fill="none" viewBox="0 0 700 240" xmlns="http://www.w3.org/2000/svg">
                  {/* Radar Coordinate Rings */}
                  <circle cx="350" cy="120" r="110" stroke="#2563eb" strokeDasharray="4 4" strokeOpacity="0.25" />
                  <circle cx="350" cy="120" r="70" stroke="#2563eb" strokeOpacity="0.35" />
                  <circle cx="350" cy="120" r="25" stroke="#b2f746" strokeOpacity="0.5" />
                  <line stroke="#2563eb" strokeOpacity="0.15" x1="350" x2="350" y1="10" y2="230" />
                  <line stroke="#2563eb" strokeOpacity="0.15" x1="150" x2="550" y1="120" y2="120" />

                  {/* Flight Arcs */}
                  {/* Route JFK -> FRA */}
                  <path d="M 120 80 Q 230 30 360 85" stroke="#0053db" strokeDasharray="6 3" strokeWidth="2.5" />
                  {/* Route FRA -> SIN */}
                  <path d="M 360 85 Q 470 140 580 160" stroke="#b2f746" strokeWidth="2.5" />
                  {/* Route SIN -> HND */}
                  <path d="M 580 160 Q 610 110 630 75" stroke="#ffb783" strokeDasharray="4 2" strokeWidth="2" />

                  {/* Node JFK */}
                  <circle cx="120" cy="80" fill="#2563eb" r="6" />
                  <text fill="#ffffff" fontFamily="Space Grotesk" fontSize="11" fontWeight="700" x="100" y="65">JFK (NYC)</text>
                  <text fill="#c3c6d7" fontFamily="Plus Jakarta Sans" fontSize="9" x="100" y="100">Load: 94%</text>

                  {/* Node FRA */}
                  <circle cx="360" cy="85" fill="#b2f746" r="7" />
                  <circle className="animate-pulse" cx="360" cy="85" r="14" stroke="#b2f746" strokeOpacity="0.4" strokeWidth="1.5" />
                  <text fill="#ffffff" fontFamily="Space Grotesk" fontSize="11" fontWeight="700" x="345" y="68">FRA (Frankfurt)</text>
                  <text fill="#b2f746" fontFamily="Plus Jakarta Sans" fontSize="9" x="345" y="110">Hub Anchor</text>

                  {/* Node SIN */}
                  <circle cx="580" cy="160" fill="#2563eb" r="6" />
                  <text fill="#ffffff" fontFamily="Space Grotesk" fontSize="11" fontWeight="700" x="560" y="185">SIN (Changi)</text>

                  {/* Node HND */}
                  <circle cx="630" cy="75" fill="#ffb783" r="6" />
                  <text fill="#ffffff" fontFamily="Space Grotesk" fontSize="11" fontWeight="700" x="610" y="60">HND (Tokyo)</text>

                  {/* In-Flight Beacon Aircraft Marker */}
                  <g transform="translate(260, 52)">
                    <circle cx="0" cy="0" fill="#ffffff" r="5" />
                    <polygon fill="#b2f746" points="-4,-7 10,0 -4,7 -1,0" transform="rotate(18)" />
                    <circle className="animate-ping" cx="0" cy="0" r="12" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" />
                    <text fill="#ffffff" fontFamily="Space Grotesk" fontSize="9" fontWeight="600" x="14" y="4">AF-902 [Mach 0.82]</text>
                  </g>

                  <g transform="translate(480, 126)">
                    <circle cx="0" cy="0" fill="#ffffff" r="4" />
                    <polygon fill="#b4c5ff" points="-4,-6 8,0 -4,6 -1,0" transform="rotate(25)" />
                    <text fill="#b4c5ff" fontFamily="Space Grotesk" fontSize="9" x="12" y="4">AF-114 [Mach 0.79]</text>
                  </g>
                </svg>
              </div>

              <div className="flex flex-wrap items-center justify-between text-xs text-primary-fixed-dim pt-3 bg-black/30 px-4 py-2 rounded-xl">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-secondary-fixed" />
                  High-Speed Corridor: Atlantic Prime A-1
                </span>
                <span className="font-mono text-white/80">Telemetry Relay: Low Earth Satellite 99.4% Link Rate</span>
              </div>
            </div>

            {/* Radar Hub Status Telemetry List */}
            <div className="xl:col-span-4 flex flex-col justify-between space-y-3">
              {/* Hub 1: JFK */}
              <div className="bg-surface-variant/10 p-4 rounded-2xl flex items-center justify-between hover:bg-surface-variant/20 transition-all border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary-fixed">
                    <span className="material-symbols-outlined text-[20px]">flight</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-headline text-sm font-bold text-white">JFK Logistics</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-fixed/20 text-secondary-fixed">
                        92% Cap
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-outline-variant">Departure Delay: 0.00 min</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
              </div>

              {/* Hub 2: FRA */}
              <div className="bg-surface-variant/10 p-4 rounded-2xl flex items-center justify-between hover:bg-surface-variant/20 transition-all border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary-fixed">
                    <span className="material-symbols-outlined text-[20px]">hub</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-headline text-sm font-bold text-white">Frankfurt Core</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/30 text-primary-fixed-dim">
                        88% Cap
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-outline-variant">14 Sorties Dispatched / hr</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
              </div>

              {/* Hub 3: HND */}
              <div className="bg-surface-variant/10 p-4 rounded-2xl flex items-center justify-between hover:bg-surface-variant/20 transition-all border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface-variant/30 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[20px]">flight_land</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-headline text-sm font-bold text-white">Tokyo Narita</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-variant/30 text-white">
                        64% Cap
                      </span>
                    </div>
                    <p className="font-body-sm text-xs text-outline-variant">Weather: Clear / Mach Reg 1</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
              </div>

              {/* Sortie Alert Micro-Card */}
              <div className="bg-primary-container/20 p-3.5 rounded-2xl flex items-center justify-between border border-primary/30">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-secondary-fixed text-[20px]">radar</span>
                  <span className="font-label-md text-xs text-primary-fixed font-bold">
                    Autonomous Sky-Lane 4 Active
                  </span>
                </div>
                <span className="text-[10px] font-bold text-secondary-fixed uppercase tracking-wider">
                  Clear Vector
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Two-Column Operational Command Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Column 1: Live Dispatch Feed & Real-time Orders Table (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-headline text-lg font-bold text-on-surface">
                  Live Autonomous Dispatch Manifest
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Real-time parcel routing and payload inspection feed
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-full overflow-x-auto border border-outline-variant/30">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filter === 'all'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  All Dispatches
                </button>
                <button
                  onClick={() => setFilter('express')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filter === 'express'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Air Priority
                </button>
                <button
                  onClick={() => setFilter('drone')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filter === 'drone'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Balcony Drone
                </button>
                <button
                  onClick={() => setFilter('customs')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    filter === 'customs'
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Customs Hold
                </button>
              </div>
            </div>

            {/* Orders Table Container */}
            <div className="bg-surface-container-lowest rounded-3xl p-4 border border-surface-container shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-surface-container-low text-outline font-label-sm uppercase tracking-wider font-bold">
                    <th className="p-3.5 rounded-l-xl">Tracking ID</th>
                    <th className="p-3.5">Destination</th>
                    <th className="p-3.5">Cargo / Type</th>
                    <th className="p-3.5">Priority</th>
                    <th className="p-3.5">Velocity / SLA</th>
                    <th className="p-3.5 rounded-r-xl text-right">Payload Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredDispatches.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low/50 transition-colors group">
                      <td className="p-3.5 font-mono font-bold text-primary">{item.trackingId}</td>
                      <td className="p-3.5 font-semibold text-on-surface">{item.destination}</td>
                      <td className="p-3.5 text-on-surface-variant">{item.cargo}</td>
                      <td className="p-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            item.priorityType === 'express'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : item.priorityType === 'drone'
                              ? 'bg-primary-fixed text-on-primary-fixed-variant'
                              : item.priorityType === 'customs'
                              ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                              : 'bg-surface-container-high text-on-surface'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.priorityType === 'express'
                                ? 'bg-secondary'
                                : item.priorityType === 'drone'
                                ? 'bg-primary'
                                : item.priorityType === 'customs'
                                ? 'bg-tertiary'
                                : 'bg-outline'
                            }`}
                          />
                          {item.priority}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono text-on-surface font-semibold">{item.eta}</div>
                        <span className="text-[10px] text-on-surface-variant block">{item.speedTier}</span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedPayload(item)}
                          className="px-3 py-1.5 rounded-full bg-surface-container hover:bg-primary hover:text-white text-on-surface font-bold text-xs transition-all"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Column 2: Customer Reviews Moderation Queue (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline text-lg font-bold text-on-surface">Reviews Moderation</h3>
                  <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold">
                    Live Feed
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Verified buyer feedback awaiting storefront publishing
                </p>
              </div>

              {/* Sentiment Meter Indicator */}
              <div className="text-right">
                <span className="font-headline text-lg font-bold text-secondary">94%</span>
                <span className="block font-label-sm text-[10px] uppercase text-outline font-bold">
                  Positive Sentiment
                </span>
              </div>
            </div>

            {/* Moderation Sentiment Bar */}
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
              <div className="bg-secondary-fixed h-full" style={{ width: '94%' }} />
              <div className="bg-surface-variant h-full" style={{ width: '5%' }} />
              <div className="bg-tertiary h-full" style={{ width: '1%' }} />
            </div>

            {/* Moderation Queue Items Container */}
            <div className="space-y-3.5">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className={`bg-surface-container-lowest p-5 rounded-3xl border border-surface-container shadow-sm space-y-3.5 transition-all hover:shadow-md ${
                    rev.status !== 'pending'
                      ? 'opacity-60 bg-surface-container-low'
                      : rev.hasWarning
                      ? 'border-l-4 border-l-tertiary-fixed'
                      : 'border-l-4 border-l-secondary-fixed'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center font-headline text-sm">
                        {rev.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-headline text-sm font-bold text-on-surface">{rev.name}</span>
                          <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                        </div>
                        <span className="font-mono text-[10px] text-on-surface-variant">{rev.serial}</span>
                      </div>
                    </div>

                    {/* Rating Stars */}
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-[16px]"
                          style={{
                            fontVariationSettings: "'FILL' 1",
                            color: i < rev.stars ? '#f59e0b' : '#c3c6d7',
                          }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>

                  <blockquote className="font-body-md text-xs text-on-surface font-medium leading-relaxed bg-surface-container-low/60 p-3 rounded-xl">
                    &ldquo;{rev.quote}&rdquo;
                  </blockquote>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-outline">{rev.origin}</span>

                    {rev.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        {rev.hasWarning ? (
                          <button
                            onClick={() => handleApproveReview(rev.id, true)}
                            className="px-3.5 py-1.5 rounded-full bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all flex items-center gap-1 shadow-sm active:scale-95"
                          >
                            <span className="material-symbols-outlined text-[16px]">price_check</span>
                            Approve + $15 Credit
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApproveReview(rev.id, false)}
                            className="px-3.5 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-xs hover:bg-secondary-fixed-dim transition-all flex items-center gap-1 shadow-sm active:scale-95"
                          >
                            <span className="material-symbols-outlined text-[16px]">check</span>
                            Approve (Storefront)
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-secondary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        {rev.status === 'credited' ? 'Credited & Approved' : 'Published to Storefront'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Fleet Telemetry & Stock SKU Capacity Vault */}
        <div className="bg-surface-container-lowest p-6 rounded-3xl border border-surface-container shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface">
                Global Warehouse Hubs & SKU Storage Capacity
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Real-time dock telemetry, robotics sorting speed, and autonomous restocking alerts
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSyncSensors}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high font-bold text-xs transition-all active:scale-95"
              >
                <span className={`material-symbols-outlined text-[18px] ${sensorsSynced ? 'animate-spin text-primary' : ''}`}>
                  cached
                </span>
                Sync Pallet Sensors
              </button>
              <Link
                href="/admin/inventory"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-on-primary hover:bg-primary-container font-bold text-xs transition-all shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
                Trigger Bulk Re-Stock
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hub JFK Card */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-surface-container space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-outline font-bold">
                    Hub Node Alpha
                  </span>
                  <h4 className="font-headline text-base text-on-surface font-bold mt-0.5">JFK Logistics Vault</h4>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-tertiary-container text-on-tertiary-container">
                  92% High
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Storage Utilization</span>
                  <span className="font-bold text-on-surface">18,420 / 20,000 SKUs</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className="bg-tertiary-container h-full rounded-full transition-all duration-500" style={{ width: '92%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container">
                  <span className="text-outline text-[10px] block">Drone Docks</span>
                  <span className="font-bold text-secondary">24 Active / 24</span>
                </div>
                <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container">
                  <span className="text-outline text-[10px] block">Auto Pack SLA</span>
                  <span className="font-bold text-primary">3.1 min / SKU</span>
                </div>
              </div>
            </div>

            {/* Hub FRA Card */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-surface-container space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-outline font-bold">
                    Hub Node Beta
                  </span>
                  <h4 className="font-headline text-base text-on-surface font-bold mt-0.5">Frankfurt Mega Hub</h4>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container">
                  88% Stable
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Storage Utilization</span>
                  <span className="font-bold text-on-surface">31,680 / 36,000 SKUs</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '88%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container">
                  <span className="text-outline text-[10px] block">Drone Docks</span>
                  <span className="font-bold text-secondary">38 Active / 40</span>
                </div>
                <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container">
                  <span className="text-outline text-[10px] block">Auto Pack SLA</span>
                  <span className="font-bold text-primary">2.4 min / SKU</span>
                </div>
              </div>
            </div>

            {/* Hub HND Card */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-surface-container space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-outline font-bold">
                    Hub Node Gamma
                  </span>
                  <h4 className="font-headline text-base text-on-surface font-bold mt-0.5">Tokyo Narita Core</h4>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary-fixed text-on-primary-fixed-variant">
                  64% Ready
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Storage Utilization</span>
                  <span className="font-bold text-on-surface">12,800 / 20,000 SKUs</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '64%' }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container">
                  <span className="text-outline text-[10px] block">Drone Docks</span>
                  <span className="font-bold text-secondary">18 Active / 18</span>
                </div>
                <div className="bg-surface-container-lowest p-2.5 rounded-xl border border-surface-container">
                  <span className="text-outline text-[10px] block">Auto Pack SLA</span>
                  <span className="font-bold text-primary">2.9 min / SKU</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payload Inspection HUD Modal */}
      {selectedPayload && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-surface-container pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[22px]">deployed_code</span>
                </div>
                <div>
                  <h3 className="font-headline text-base font-bold text-on-surface">
                    Payload Telemetry: {selectedPayload.trackingId}
                  </h3>
                  <span className="text-xs text-on-surface-variant font-mono">{selectedPayload.cargo}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedPayload(null)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-surface-container-low p-3.5 rounded-2xl space-y-1">
                <span className="text-outline text-[10px] block uppercase font-bold">Destination</span>
                <span className="font-bold text-on-surface">{selectedPayload.destination}</span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-2xl space-y-1">
                <span className="text-outline text-[10px] block uppercase font-bold">Speed / SLA</span>
                <span className="font-bold text-secondary">{selectedPayload.speedTier}</span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-2xl space-y-1">
                <span className="text-outline text-[10px] block uppercase font-bold">Cryo Cabin Temp</span>
                <span className="font-bold font-mono text-primary">{selectedPayload.temp}</span>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-2xl space-y-1">
                <span className="text-outline text-[10px] block uppercase font-bold">Gross Payload</span>
                <span className="font-bold font-mono text-on-surface">{selectedPayload.weight}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">verified_user</span>
                  Tamper Seal Crypto Integrity
                </span>
                <span className="font-mono text-secondary font-bold">SECURE (SHA-256)</span>
              </div>
              <p className="text-[11px] text-on-surface-variant">
                Live accelerometers report &lt; 0.04G peak impact during transit. No hermetic violations.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  showToast(`Waybill ${selectedPayload.trackingId} dispatch vector verified.`);
                  setSelectedPayload(null);
                }}
                className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all shadow-md"
              >
                Acknowledge Telemetry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Customs Re-Route Modal */}
      {showRerouteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-surface-container rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-surface-container pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-[22px]">emergency_share</span>
                </div>
                <div>
                  <h3 className="font-headline text-base font-bold text-on-surface">Emergency Customs Re-Route</h3>
                  <span className="text-xs text-on-surface-variant">AuraOS Autonomous Sky-Lane Override</span>
                </div>
              </div>
              <button
                onClick={() => setShowRerouteModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Select flagged consignments to re-route around regional customs blockades or dispatch drone feeders:
            </p>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-surface-container-low border border-tertiary/30 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-on-surface">#AC-7719-TYO</span>
                  <p className="text-[10px] text-tertiary font-medium">Tokyo HND - Gate 3 Document Hold</p>
                </div>
                <button
                  onClick={() => {
                    setDispatches((prev) =>
                      prev.map((d) =>
                        d.id === 'd-3'
                          ? { ...d, priority: 'Priority Express', priorityType: 'express', eta: 'ETA: 55 mins', speedTier: 'Sky-Lane Direct Override' }
                          : d
                      )
                    );
                    setShowRerouteModal(false);
                    showToast('Sky-Lane Override Executed! #AC-7719-TYO re-routed to Express Corridor.');
                  }}
                  className="px-3 py-1.5 rounded-full bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-all"
                >
                  Override Hold
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRerouteModal(false)}
                className="px-4 py-2 rounded-full bg-surface-container text-on-surface font-bold text-xs hover:bg-surface-container-high transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
