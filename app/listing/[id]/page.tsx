"use client";
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import {
  Home, ArrowLeft, MapPin, Clock, Wifi, Zap, Droplets,
  Shield, Car, Play, X, Phone, Mail, Eye, CheckCircle,
  Loader, Share2, Heart, BedDouble, Building2, Calendar,
  Banknote, Info,
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const AMENITY_ICONS: Record<string, { icon: React.ReactNode; label: string }> = {
  water:       { icon: <Droplets size={16} />, label: "Running Water" },
  electricity: { icon: <Zap size={16} />,      label: "Electricity (NEPA)" },
  security:    { icon: <Shield size={16} />,   label: "Security" },
  parking:     { icon: <Car size={16} />,      label: "Parking" },
  wifi:        { icon: <Wifi size={16} />,     label: "WiFi" },
};

const ROOM_TYPE_LABELS: Record<string, string> = {
  "single":       "Single Room",
  "self-contain": "Self-Contain",
  "shared":       "Shared Room",
  "flat":         "Flat",
};

const DISTANCE_LABELS: Record<string, string> = {
  "5min":  "≤ 5 min walk",
  "10min": "≤ 10 min walk",
  "20min": "≤ 20 min walk",
};

const fmt = (n: number) => `₦${n.toLocaleString()}`;

// ─── Payment Breakdown ────────────────────────────────────────────────────────

type FeeRow = { label: string; key: string; description: string };

const FEE_ROWS: FeeRow[] = [
  { label: "Annual Rent",        key: "price",         description: "Base rent for one year" },
  { label: "Agent Fee",          key: "agentFee",      description: "One-time fee paid to the agent" },
  { label: "Legal Fee",          key: "legalFee",      description: "Documentation and tenancy agreement" },
  { label: "Caution/Security",   key: "cautionFee",    description: "Refundable deposit held by landlord" },
  { label: "Service Charge",     key: "serviceCharge", description: "Covers maintenance and shared utilities" },
  { label: "Agreement Fee",      key: "agreementFee",  description: "Signing and stamping of tenancy agreement" },
];

function PaymentBreakdown({ listing }: { listing: any }) {
  const fees = FEE_ROWS.filter((r) => listing[r.key] != null && listing[r.key] > 0);
  const total = fees.reduce((sum, r) => sum + (listing[r.key] ?? 0), 0);
  const [tooltip, setTooltip] = useState<string | null>(null);

  if (fees.length === 0) return null;

  return (
    <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Banknote size={15} className="text-lodge-400" />
        <h2 className="font-display font-bold text-white text-sm">Payment Breakdown</h2>
      </div>

      <div className="flex flex-col gap-2">
        {fees.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between py-2 border-b border-dark-700 last:border-0"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400 text-sm">{row.label}</span>
              <button
                onMouseEnter={() => setTooltip(row.key)}
                onMouseLeave={() => setTooltip(null)}
                className="relative text-gray-600 hover:text-gray-400 transition-colors"
              >
                <Info size={11} />
                {tooltip === row.key && (
                  <div className="absolute left-5 -top-1 z-10 w-44 bg-dark-700 border border-dark-600 text-gray-300 text-[10px] leading-relaxed rounded-lg px-2.5 py-2 shadow-xl pointer-events-none">
                    {row.description}
                  </div>
                )}
              </button>
            </div>
            <span className="text-white text-sm font-semibold tabular-nums">
              {fmt(listing[row.key])}
            </span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between bg-lodge-500/10 border border-lodge-500/20 rounded-xl px-4 py-3">
        <div>
          <p className="text-lodge-300 text-xs font-semibold uppercase tracking-wide">Total Move-In Cost</p>
          <p className="text-gray-500 text-[10px] mt-0.5">First year, one-time fees inclusive</p>
        </div>
        <p className="font-display font-extrabold text-lodge-300 text-xl tabular-nums">
          {fmt(total)}
        </p>
      </div>

      <p className="text-gray-600 text-[10px] leading-relaxed">
        * Caution fee is typically refundable at the end of tenancy. Always confirm all fees with the agent before payment.
      </p>
    </div>
  );
}

// ─── Request Viewing Modal ────────────────────────────────────────────────────

function RequestViewingModal({ listing, onClose }: { listing: any; onClose: () => void }) {
  const requestViewing = useMutation(api.viewingRequests?.submitRequest);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestViewing?.({
        listingId: listing._id,
        studentName: form.name,
        studentEmail: form.email,
        studentPhone: form.phone,
        preferredDate: "",
        message: form.message,
      });
      setDone(true);
    } catch {
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-dark-700 border border-dark-500 text-white text-sm rounded-xl px-4 py-2.5 placeholder:text-gray-600 focus:border-lodge-500 focus:outline-none transition-colors";
  const labelClass = "text-xs font-medium text-gray-400 mb-1.5 block";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-dark-700">
          <div>
            <h3 className="font-display font-bold text-white">Request a Viewing</h3>
            <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{listing.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className="p-8 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle size={28} className="text-emerald-400" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white">Request Sent!</h4>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                The agent will contact you shortly via phone or email.
              </p>
            </div>
            <button
              onClick={onClose}
              className="lodge-gradient text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelClass}>Full Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Your full name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone *</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="080xxxxxxxx"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="optional"
                  className={inputClass}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Message</label>
                <textarea
                  rows={2}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  placeholder="When are you available to view?"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 lodge-gradient hover:opacity-90 disabled:opacity-60 text-white font-display font-bold text-sm py-3 rounded-xl transition-opacity"
            >
              {loading ? <Loader size={16} className="animate-spin" /> : <Eye size={16} />}
              {loading ? "Sending..." : "Send Viewing Request"}
            </button>
            <p className="text-center text-gray-600 text-[10px]">
              Your contact details will only be shared with this agent.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Video Modal ──────────────────────────────────────────────────────────────

function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-sm"
        >
          <X size={16} /> Close
        </button>
        <video
          src={url}
          controls
          autoPlay
          className="w-full rounded-2xl aspect-video bg-black"
        />
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-dark-800 border border-dark-700 rounded-xl p-3.5 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-lodge-500/10 flex items-center justify-center shrink-0">
        <span className="text-lodge-400">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-white text-sm font-semibold mt-0.5">{value}</p>
      </div>
    </div>
  );
}

// ─── Loading / Not Found ──────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <Loader size={24} className="animate-spin text-lodge-400" />
    </div>
  );
}

function NotFoundScreen() {
  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center">
        <Building2 size={24} className="text-gray-600" />
      </div>
      <div>
        <h2 className="font-display font-bold text-white text-xl">Listing Not Found</h2>
        <p className="text-gray-500 text-sm mt-1">This property may have been removed.</p>
      </div>
      <Link
        href="/"
        className="lodge-gradient text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
      >
        Browse Listings
      </Link>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = useQuery(api.listings.getById, { id: params.id as Id<"listings"> });

  const [showModal, setShowModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (listing === undefined) return <LoadingScreen />;
  if (listing === null) return <NotFoundScreen />;

  const isAvailableNow = listing.availability === "immediate";

  return (
    <>
      <div className="min-h-screen bg-dark-900">

        {/* ── Nav ── */}
        <nav className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg lodge-gradient flex items-center justify-center">
                <Home size={14} fill="white" className="text-white" />
              </div>
              <span className="font-display font-bold text-white text-base tracking-tight">LodgeIt</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors"
              >
                <Share2 size={14} />
                {copied
                  ? <span className="text-emerald-400 text-xs">Copied!</span>
                  : <span className="hidden sm:inline">Share</span>
                }
              </button>
              <button
                onClick={() => setSaved((p) => !p)}
                className={`flex items-center gap-1.5 text-sm transition-colors ${saved ? "text-red-400" : "text-gray-500 hover:text-white"}`}
              >
                <Heart size={14} fill={saved ? "currentColor" : "none"} />
                <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
              </button>
              <Link href="/" className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm transition-colors">
                <ArrowLeft size={14} />
                Back
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

          {/* ── Hero ── */}
          <div className="relative rounded-2xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-dark-800">
            {listing.thumbnailUrl ? (
              <img src={listing.thumbnailUrl} alt={listing.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 size={48} className="text-dark-600" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute top-4 left-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isAvailableNow
                  ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                  : "bg-amber-500/20 border border-amber-500/30 text-amber-400"
              }`}>
                {isAvailableNow ? "● Available Now" : "● Next Month"}
              </span>
            </div>

            {listing.videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm border border-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-black/80 transition-colors"
              >
                <Play size={12} fill="white" /> Watch Tour
              </button>
            )}

            <div className="absolute bottom-4 left-4">
              <p className="text-white font-display font-extrabold text-2xl sm:text-3xl">
                {fmt(listing.price)}
                <span className="text-white/60 font-normal text-sm ml-1">/year</span>
              </p>
            </div>
          </div>

          {/* ── Content Grid ── */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left — Details */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Title + Meta */}
              <div>
                <h1 className="font-display font-extrabold text-white text-2xl sm:text-3xl leading-tight">
                  {listing.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <MapPin size={13} className="text-lodge-400" />
                    {listing.location}, {listing.city}
                  </span>
                  {listing.distanceToSchool && (
                    <span className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Clock size={13} className="text-lodge-400" />
                      {DISTANCE_LABELS[listing.distanceToSchool] || listing.distanceToSchool} to campus
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard icon={<BedDouble size={15} />} label="Room Type" value={ROOM_TYPE_LABELS[listing.roomType] || listing.roomType} />
                <StatCard icon={<MapPin size={15} />} label="City" value={listing.city} />
                <StatCard icon={<Calendar size={15} />} label="Move In" value={isAvailableNow ? "Immediately" : "Next Month"} />
              </div>

              {/* Description */}
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
                <h2 className="font-display font-bold text-white text-sm mb-3">About this Lodge</h2>
                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>
              </div>

              {/* Payment Breakdown */}
              <PaymentBreakdown listing={listing} />

              {/* Amenities */}
              {listing.amenities?.length > 0 && (
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
                  <h2 className="font-display font-bold text-white text-sm mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {listing.amenities.map((amenity: string) => {
                      const config = AMENITY_ICONS[amenity];
                      return (
                        <div key={amenity} className="flex items-center gap-2.5 bg-dark-700 border border-dark-600 rounded-xl p-3">
                          <span className="text-lodge-400">{config?.icon}</span>
                          <span className="text-gray-300 text-sm">{config?.label || amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
                <h2 className="font-display font-bold text-white text-sm mb-3">Location</h2>
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="text-lodge-400 mt-0.5 shrink-0" />
                  <p className="text-gray-400 text-sm">{listing.location}, {listing.city}</p>
                </div>
                {listing.distanceToSchool && (
                  <div className="flex items-center gap-2 mt-2">
                    <Clock size={15} className="text-lodge-400 shrink-0" />
                    <p className="text-gray-400 text-sm">
                      {DISTANCE_LABELS[listing.distanceToSchool] || listing.distanceToSchool} walking distance to campus
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right — CTA Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 flex flex-col gap-4">

                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 flex flex-col gap-4">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Annual Rent</p>
                    <p className="font-display font-extrabold text-white text-3xl mt-1">{fmt(listing.price)}</p>
                    <p className="text-gray-600 text-xs mt-0.5">per year • negotiable</p>
                  </div>

                  <div className="h-px bg-dark-700" />

                  {/* Agent */}
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-3">Listed By</p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full lodge-gradient flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {listing.agentName?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                      <div>
                        <p className="text-white text-sm font-semibold">{listing.agentName}</p>
                        <p className="text-gray-500 text-xs">Verified Agent</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-gray-600 text-xs">
                        <Phone size={12} />
                        <span className="blur-sm select-none">080 xxxx xxxx</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-xs">
                        <Mail size={12} />
                        <span className="blur-sm select-none">agent@email.com</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-[10px] mt-2">Contact details revealed after viewing request</p>
                  </div>

                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full flex items-center justify-center gap-2 lodge-gradient hover:opacity-90 text-white font-display font-bold text-sm py-3.5 rounded-xl transition-opacity"
                  >
                    <Eye size={16} />
                    Request Viewing
                  </button>

                  {listing.videoUrl && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="w-full flex items-center justify-center gap-2 bg-dark-700 border border-dark-600 hover:border-lodge-500/40 text-gray-300 hover:text-white font-semibold text-sm py-3 rounded-xl transition-colors"
                    >
                      <Play size={14} /> Watch Video Tour
                    </button>
                  )}
                </div>

                {/* Safety tip */}
                <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <Shield size={13} className="text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-amber-400/80 text-xs leading-relaxed">
                      Always inspect the property in person before making any payment. LodgeIt does not collect payments.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Mobile Bottom CTA ── */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-dark-900/95 backdrop-blur-xl border-t border-dark-700 flex gap-3">
            {listing.videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="flex items-center justify-center gap-2 bg-dark-700 border border-dark-600 text-gray-300 font-semibold text-sm py-3 px-4 rounded-xl"
              >
                <Play size={14} />
              </button>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 flex items-center justify-center gap-2 lodge-gradient text-white font-display font-bold text-sm py-3 rounded-xl"
            >
              <Eye size={16} />
              Request Viewing — {fmt(listing.price)}/yr
            </button>
          </div>
          <div className="lg:hidden h-20" />
        </div>
      </div>

      {showModal && <RequestViewingModal listing={listing} onClose={() => setShowModal(false)} />}
      {showVideo && listing.videoUrl && <VideoModal url={listing.videoUrl} onClose={() => setShowVideo(false)} />}
    </>
  );
}