"use client";
import { useState } from "react";
import Image from "next/image";
import { MapPin, Play, Zap, Droplets, ShieldCheck, Car, Wifi, Calendar } from "lucide-react";
import ViewingModal from "./ViewingModal";

const amenityIcons: Record<string, { icon: React.ReactNode; label: string }> = {
  water: { icon: <Droplets size={12} />, label: "Water" },
  electricity: { icon: <Zap size={12} />, label: "NEPA" },
  security: { icon: <ShieldCheck size={12} />, label: "Security" },
  parking: { icon: <Car size={12} />, label: "Parking" },
  wifi: { icon: <Wifi size={12} />, label: "WiFi" },
};

const roomTypeColors: Record<string, string> = {
  single: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  "self-contain": "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  shared: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
  flat: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
};

const roomTypeLabels: Record<string, string> = {
  single: "Single Room",
  "self-contain": "Self-Contain",
  shared: "Shared Room",
  flat: "Flat",
};

interface ListingCardProps {
  listing: {
    _id: string;
    title: string;
    description: string;
    price: number;
    roomType: string;
    location: string;
    city: string;
    distanceToSchool?: string;
    amenities: string[];
    availability: string;
    thumbnailUrl: string;
    videoUrl?: string;
    agentName: string;
  };
  index: number;
}

export default function ListingCard({ listing, index }: ListingCardProps) {
  const [showViewing, setShowViewing] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [imgError, setImgError] = useState(false);

  const hasVideo = listing.videoUrl && listing.videoUrl.length > 0;

  return (
    <>
      <div
        className="card-hover rounded-2xl overflow-hidden bg-dark-800 border border-dark-600 flex flex-col"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] overflow-hidden bg-dark-700 group">
          {!imgError ? (
            <img
              src={listing.thumbnailUrl}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-dark-500">
              <MapPin size={32} className="text-dark-500" />
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Play button */}
          {hasVideo && (
            <button
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 flex items-center justify-center group/play"
            >
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 group-hover/play:bg-lodge-500 group-hover/play:scale-110 group-hover/play:border-lodge-400">
                <Play size={18} fill="white" className="text-white ml-0.5" />
              </div>
            </button>
          )}

          {/* Video indicator badge */}
          {hasVideo && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-1 rounded-full border border-white/10">
              <Play size={8} fill="white" />
              Video tour
            </div>
          )}

          {/* Availability badge */}
          <div className="absolute top-3 right-3">
            <span className={`text-[10px] font-semibold px-2 py-1 rounded-full backdrop-blur-sm ${
              listing.availability === "immediate"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}>
              {listing.availability === "immediate" ? "Available Now" : "Next Month"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          {/* Room type + price */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <span className={`badge text-[10px] ${roomTypeColors[listing.roomType] || "bg-dark-600 text-gray-400"}`}>
                {roomTypeLabels[listing.roomType] || listing.roomType}
              </span>
              <h3 className="font-display font-semibold text-sm text-white mt-1.5 leading-tight line-clamp-2">
                {listing.title}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lodge-400 font-display font-bold text-base">
                ₦{listing.price.toLocaleString()}
              </p>
              <p className="text-gray-600 text-[10px]">/year</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <MapPin size={11} className="shrink-0 text-lodge-500" />
            <span className="truncate">{listing.location}</span>
            {listing.distanceToSchool && (
              <>
                <span className="text-dark-500">·</span>
                <span className="text-gray-600 shrink-0">{listing.distanceToSchool} walk</span>
              </>
            )}
          </div>

          {/* Amenities */}
          {listing.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {listing.amenities.slice(0, 4).map((a) => {
                const meta = amenityIcons[a];
                return meta ? (
                  <span
                    key={a}
                    className="flex items-center gap-1 text-[10px] text-gray-500 bg-dark-700 px-2 py-0.5 rounded-full border border-dark-600"
                  >
                    {meta.icon}
                    {meta.label}
                  </span>
                ) : null;
              })}
            </div>
          )}

          {/* Agent + CTA */}
          <div className="mt-auto pt-3 border-t border-dark-600 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-lodge-500/20 border border-lodge-500/30 flex items-center justify-center text-lodge-400 font-display font-bold text-[10px] shrink-0">
                {listing.agentName.charAt(0)}
              </div>
              <span className="text-gray-500 text-xs truncate">{listing.agentName}</span>
            </div>
            <button
              onClick={() => setShowViewing(true)}
              className="shrink-0 flex items-center gap-1.5 bg-lodge-500 hover:bg-lodge-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150"
            >
              <Calendar size={12} />
              Request Viewing
            </button>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && hasVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <video
              src={listing.videoUrl}
              controls
              autoPlay
              className="w-full rounded-2xl"
            />
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Viewing Request Modal */}
      {showViewing && (
        <ViewingModal
          listingId={listing._id}
          listingTitle={listing.title}
          onClose={() => setShowViewing(false)}
        />
      )}
    </>
  );
}
