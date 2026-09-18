'use client';

import * as React from 'react';
import Link from 'next/link';

interface ShipmentData {
  id: string;
  destination: string;
  zone: string;
  carrier: string;
  vehicle: string;
  eta: string;
  status: string;
  altitude: string;
  velocity: string;
  temp: string;
  gforce: string;
  tamperSeal: string;
  progress: number;
  events: { time: string; title: string; location: string; done: boolean }[];
}

const SHIPMENTS: Record<string, ShipmentData> = {
  'AC-9821-NYC': {
    id: 'AC-9821-NYC',
    destination: 'Brooklyn, NY 11201',
    zone: 'Zone 1A',
    carrier: 'Aura SkyLine Priority',
    vehicle: 'Boeing 777F → Van #EV-44',
    eta: '14:20 EST',
    status: 'Airborne In-Transit',
    altitude: '38,000 ft',
    velocity: 'Mach 0.82',
    temp: '-4.2°C',
    gforce: '0.02 G (Nominal)',
    tamperSeal: 'Intact & Cryptographically Signed',
    progress: 72,
    events: [
      { time: '04:12 GMT', title: 'Package Sealed & RFID Inscribed', location: 'Tokyo Sorting Terminal 4', done: true },
      { time: '06:30 GMT', title: 'Trans-Pacific Freight Takeoff', location: 'Flight AUR-7721 Narita', done: true },
      { time: '11:45 EST', title: 'JFK Customs Pre-Clearance Automated', location: 'New York Cargo Hub Alpha', done: true },
      { time: '14:20 EST', title: 'Final Dispatch & Loading Bay Drop', location: 'Brooklyn Delivery Unit 9', done: false },
    ],
  },
  'AC-4412-TKO': {
    id: 'AC-4412-TKO',
    destination: 'Shibuya-ku, Tokyo 150-0002',
    zone: 'Zone APAC-1',
    carrier: 'Aura Express Drone Ring',
    vehicle: 'SkyCrane Octocopter #DRN-08',
    eta: '45m Remaining',
    status: 'Low-Altitude Flight',
    altitude: '420 ft',
    velocity: '85 km/h',
    temp: '+18.0°C',
    gforce: '0.01 G (Smooth)',
    tamperSeal: 'Active Drone Tether Lock',
    progress: 88,
    events: [
      { time: '13:00 JST', title: 'Automated Manifest Verified', location: 'Haneda Skyport Dock 3', done: true },
      { time: '13:15 JST', title: 'Drone Battery Full & Launch', location: 'Tokyo Urban Skyway', done: true },
      { time: '14:00 JST', title: 'Rooftop Tether Drop SLA', location: 'Shibuya Tower Landing Pad', done: false },
    ],
  },
  'AC-1029-BER': {
    id: 'AC-1029-BER',
    destination: 'Mitte, Berlin 10115',
    zone: 'Zone EU-North',
    carrier: 'Trans-Eurasian Hyper-Rail',
    vehicle: 'Maglev Cargo Unit #MG-104',
    eta: '18:40 CET',
    status: 'Ground Magnetic Relay',
    altitude: 'Ground Surface',
    velocity: '450 km/h',
    temp: '+4.5°C',
    gforce: '0.00 G (Maglev Stable)',
    tamperSeal: 'Zero-Access Sealed Container',
    progress: 54,
    events: [
      { time: '08:00 CET', title: 'Loaded onto Maglev Freight Pod', location: 'Frankfurt Central Depot', done: true },
      { time: '12:30 CET', title: 'Passing Leipzig Switch Point', location: 'Eurasian Corridor Track 2', done: true },
      { time: '18:40 CET', title: 'Arrival at Berlin Distribution Center', location: 'Berlin Ostbahnhof Depot', done: false },
    ],
  },
};

export default function RealTimeTrackerPage() {
  const [activeWaybill, setActiveWaybill] = React.useState('AC-9821-NYC');
  const [searchInput, setSearchInput] = React.useState('AC-9821-NYC');
  const [toastMsg, setToastMsg] = React.useState<string | null>(null);

  const current = SHIPMENTS[activeWaybill] || SHIPMENTS['AC-9821-NYC'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = searchInput.trim().toUpperCase();
    if (SHIPMENTS[cleaned]) {
      setActiveWaybill(cleaned);
      triggerToast(`Radar locked onto ${cleaned}`);
    } else {
      setActiveWaybill('AC-9821-NYC');
      triggerToast(`Waybill ${cleaned} not found, displaying active demonstration corridor`);
    }
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="w-full flex flex-col min-h-screen bg-surface">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-24 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold">
            <span className="material-symbols-outlined text-[18px]">radar</span>
          </div>
          <div>
            <p className="font-label-lg text-xs font-bold leading-tight">Radar Telemetry Synchronized</p>
            <p className="font-body-sm text-xs text-inverse-on-surface/80">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Hero Command Bar */}
      <section className="w-full max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
        {/* Status Line */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface font-label-sm text-xs uppercase tracking-wider font-bold">
              Aura Telemetry Engine v4.2
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
            <span className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
              </span>
              Sub-second GPS Synchronized
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => triggerToast('Simulated push notification dispatched to courier handheld')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-primary hover:bg-surface-container-high font-label-md text-xs font-bold transition-all shadow-sm border border-outline-variant/40"
            >
              <span className="material-symbols-outlined text-[16px]">notifications_active</span>
              Simulate Dispatch Push
            </button>
            <button
              type="button"
              onClick={() => triggerToast('Permanent cryptographic tracking URL copied')}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-label-md text-xs font-bold transition-all shadow-sm border border-outline-variant/40"
            >
              <span className="material-symbols-outlined text-[16px]">share</span>
              Share Link
            </button>
          </div>
        </div>

        {/* Search Bar & Recent Chips */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-card border border-outline-variant/40 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[22px]">
                radar
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Waybill, Container ID or Consignment..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-low text-on-surface font-headline text-sm uppercase placeholder:normal-case placeholder:font-body-md placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary transition-all"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-5 py-2 rounded-full bg-primary text-on-primary font-label-md text-xs uppercase font-bold tracking-wider hover:bg-primary-container transition-all"
              >
                Locate
              </button>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <span className="font-label-sm text-xs uppercase tracking-wider text-outline whitespace-nowrap pl-1">
                Recent:
              </span>
              {Object.keys(SHIPMENTS).map((code) => {
                const isSelected = activeWaybill === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setActiveWaybill(code);
                      setSearchInput(code);
                      triggerToast(`Switched radar focus to ${code}`);
                    }}
                    className={`px-3.5 py-1.5 rounded-full font-label-md text-xs transition-all whitespace-nowrap font-bold ${
                      isSelected
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    #{code}
                  </button>
                );
              })}
            </div>
          </form>
        </div>

        {/* Active Waybill Manifest Summary Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Waybill & Destination */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/40 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-outline font-bold">Consignment Code</span>
                <h2 className="font-headline text-xl text-on-surface font-bold tracking-tight mt-0.5">{current.id}</h2>
              </div>
              <span className="p-2 rounded-full bg-surface-container text-primary">
                <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              </span>
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low rounded-xl px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-outline">location_on</span>
                <span className="font-body-sm text-xs text-on-surface font-semibold">{current.destination}</span>
              </div>
              <span className="font-label-sm text-[10px] text-primary uppercase font-bold">{current.zone}</span>
            </div>
          </div>

          {/* Carrier & Mode */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/40 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-outline font-bold">Carrier Route</span>
                <h2 className="font-headline text-xl text-on-surface font-bold tracking-tight mt-0.5">{current.carrier}</h2>
              </div>
              <span className="p-2 rounded-full bg-secondary-container text-on-secondary-container">
                <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
              </span>
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low rounded-xl px-3 py-2 text-xs">
              <span className="text-on-surface-variant font-medium">Vehicle / Relay</span>
              <span className="font-bold text-on-surface">{current.vehicle}</span>
            </div>
          </div>

          {/* Live ETA */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/40 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-outline font-bold">Predicted Delivery</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-headline text-xl text-primary font-bold">{current.eta}</span>
                </div>
              </div>
              <span className="p-2 rounded-full bg-surface-container text-secondary">
                <span className="material-symbols-outlined text-[20px]">schedule</span>
              </span>
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low rounded-xl px-3 py-2 text-xs">
              <span className="text-on-surface-variant font-medium">Delivery SLA</span>
              <span className="font-bold text-secondary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Guaranteed On-Target
              </span>
            </div>
          </div>

          {/* Status Pill Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm border border-outline-variant/40 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-outline font-bold">Lifecycle State</span>
                <h2 className="font-headline text-xl text-on-surface font-bold tracking-tight mt-0.5">{current.status}</h2>
              </div>
              <span className="p-2 rounded-full bg-secondary-fixed/30 text-on-secondary-fixed">
                <span className="material-symbols-outlined text-[20px]">sensors</span>
              </span>
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between bg-surface-container-low rounded-xl px-3 py-2 text-xs">
              <span className="text-on-surface-variant font-medium">Progress</span>
              <span className="font-bold text-primary font-mono">{current.progress}%</span>
            </div>
          </div>
        </div>

        {/* Tactical Cargo Radar Visualizer Centerpiece */}
        <div className="bg-inverse-surface text-inverse-on-surface rounded-3xl p-8 shadow-xl relative overflow-hidden mb-8">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#b4c5ff_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-ping" />
                  <span className="font-label-sm text-xs uppercase tracking-widest text-primary-fixed-dim font-bold">
                    Telemetry HUD & Flight Vector
                  </span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-white mt-1">
                  Active Corridor Stream: {current.carrier}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-surface-variant/20 text-xs font-mono text-secondary-fixed font-bold">
                  VECTOR // LOCK-48
                </span>
              </div>
            </div>

            {/* Radar Simulation Display Box */}
            <div className="relative w-full h-48 sm:h-64 rounded-2xl bg-black/40 border border-surface-variant/20 flex items-center justify-center overflow-hidden">
              {/* Concentric sweep rings */}
              <div className="absolute w-96 h-96 rounded-full border border-primary/20 animate-ping opacity-20" />
              <div className="absolute w-72 h-72 rounded-full border border-primary/30" />
              <div className="absolute w-48 h-48 rounded-full border border-dashed border-outline-variant/40" />

              {/* Waypoint Nodes and Flight Path SVG */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 60 180 Q 300 40 700 120 T 1100 160"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeDasharray="6 6"
                />
              </svg>

              <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/30 border border-primary text-secondary-fixed flex items-center justify-center animate-pulse">
                  <span className="material-symbols-outlined text-[28px]">flight</span>
                </div>
                <span className="font-mono text-xs text-white font-bold bg-black/60 px-3 py-1 rounded-full border border-white/10">
                  {current.id} • Lat 35.77 • Lon 140.39
                </span>
              </div>
            </div>

            {/* Sensor Data Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-surface-variant/10 border border-surface-variant/20">
                <span className="text-[10px] uppercase font-mono text-inverse-on-surface/60 block">Altitude</span>
                <span className="font-headline text-lg font-bold text-white">{current.altitude}</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-variant/10 border border-surface-variant/20">
                <span className="text-[10px] uppercase font-mono text-inverse-on-surface/60 block">Velocity</span>
                <span className="font-headline text-lg font-bold text-secondary-fixed">{current.velocity}</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-variant/10 border border-surface-variant/20">
                <span className="text-[10px] uppercase font-mono text-inverse-on-surface/60 block">Internal Cabin Temp</span>
                <span className="font-headline text-lg font-bold text-primary-fixed">{current.temp}</span>
              </div>
              <div className="p-4 rounded-xl bg-surface-variant/10 border border-surface-variant/20">
                <span className="text-[10px] uppercase font-mono text-inverse-on-surface/60 block">Impact Sensor</span>
                <span className="font-headline text-lg font-bold text-secondary-fixed">{current.gforce}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chronological Event Timeline */}
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-card border border-outline-variant/40">
          <h3 className="font-headline text-2xl font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">timeline</span>
            Chronological Custody & Milestone Timeline
          </h3>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-surface-container-high">
            {current.events.map((ev, idx) => (
              <div key={idx} className="relative flex items-start gap-4">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    ev.done
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-high text-outline border border-outline-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {ev.done ? 'check' : 'radio_button_unchecked'}
                  </span>
                </div>
                <div className="flex-1 bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-headline text-base font-bold text-on-surface">{ev.title}</h4>
                    <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">{ev.location}</p>
                  </div>
                  <span className="font-mono text-xs font-bold text-primary px-3 py-1 rounded-full bg-surface-container-lowest shrink-0 self-start sm:self-center">
                    {ev.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
