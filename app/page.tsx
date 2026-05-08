"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  Search, SlidersHorizontal, Building2, X,
  ChevronDown, Home, Plus
} from "lucide-react";
import ListingCard from "@/components/ListingCard";
import Filters from "@/components/Filters";

const DEFAULT_FILTERS = {
  city: "all",
  roomType: "all",
  maxPrice: 600000,
  amenities: [] as string[],
  availability: "all",
  distanceToSchool: "any",
};

export default function HomePage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [search, setSearch] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sort, setSort] = useState<"newest" | "cheapest" | "closest">("newest");

  const seedListings = useMutation(api.listings.seedListings);

  const listings = useQuery(api.listings.getAll, {
    city: filters.city !== "all" ? filters.city : undefined,
    roomType: filters.roomType !== "all" ? filters.roomType : undefined,
    maxPrice: filters.maxPrice < 600000 ? filters.maxPrice : undefined,
    amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
    availability: filters.availability !== "all" ? filters.availability : undefined,
    distanceToSchool: filters.distanceToSchool !== "any" ? filters.distanceToSchool : undefined,
  });

  useEffect(() => {
    seedListings();
  }, []);

  const updateFilters = (newFilters: Partial<typeof DEFAULT_FILTERS>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const filtered = (listings || []).filter((l) =>
    search.trim() === "" ||
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase()) ||
    l.city.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "cheapest") return a.price - b.price;
    if (sort === "newest") return b.createdAt - a.createdAt;
    if (sort === "closest") {
      const d: Record<string, number> = { "5min": 1, "10min": 2, "20min": 3 };
      return (d[a.distanceToSchool || "20min"] || 3) - (d[b.distanceToSchool || "20min"] || 3);
    }
    return 0;
  });

  const activeFilterCount = [
    filters.city !== "all",
    filters.roomType !== "all",
    filters.maxPrice < 600000,
    filters.amenities.length > 0,
    filters.availability !== "all",
    filters.distanceToSchool !== "any",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded-lg lodge-gradient flex items-center justify-center">
              <Home size={14} fill="white" className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-base tracking-tight">
              LodgeIt
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-sm relative hidden sm:block">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by location or title..."
              className="w-full bg-dark-700 border border-dark-600 text-white text-sm rounded-xl pl-9 pr-3 py-2 placeholder:text-gray-600 focus:border-lodge-500 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white">
                <X size={13} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden relative flex items-center gap-1.5 bg-dark-700 border border-dark-600 text-gray-400 text-xs px-3 py-2 rounded-xl hover:border-lodge-500 transition-colors"
            >
              <SlidersHorizontal size={13} />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-lodge-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <Link
              href="/list-property"
              className="flex items-center gap-1.5 lodge-gradient text-white text-xs font-semibold px-3 py-2 rounded-xl hover:opacity-90 transition-opacity"
            >
              <Plus size={13} />
              List a Lodge
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden bg-dark-800 border-b border-dark-700">
        <div className="absolute inset-0 bg-gradient-to-br from-lodge-500/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-lodge-500/10 border border-lodge-500/20 text-lodge-400 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <span className="w-1.5 h-1.5 bg-lodge-500 rounded-full animate-pulse" />
              Now in Enugu, Nsukka & more
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white leading-tight tracking-tight">
              Find your lodge.{" "}
              <span className="text-lodge-500">No stress.</span>
            </h1>
            <p className="text-gray-500 text-sm sm:text-base mt-3 leading-relaxed">
              Verified student housing near your campus. Browse listings from trusted agents, watch video tours, and request viewings — all in one place.
            </p>

            {/* Mobile search */}
            <div className="mt-5 sm:hidden relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search location or title..."
                className="w-full bg-dark-700 border border-dark-600 text-white text-sm rounded-xl pl-9 pr-3 py-2.5 placeholder:text-gray-600 focus:border-lodge-500 transition-colors"
              />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-5 mt-6">
              {[
                { label: "Listings", value: listings?.length ?? "—" },
                { label: "Cities", value: "4+" },
                { label: "Price Range", value: "₦80k–₦600k" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-white font-display font-bold text-xl">{s.value}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0 sticky top-20 self-start max-h-[calc(100vh-5rem)] overflow-y-auto bg-dark-800 border border-dark-700 rounded-2xl">
            <Filters filters={filters} onChange={updateFilters} />
          </aside>

          {/* Listings */}
          <div className="flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between mb-5 gap-3">
              <p className="text-gray-500 text-sm">
                <span className="text-white font-semibold font-display">{sorted.length}</span> lodges found
              </p>
              <div className="flex items-center gap-1.5">
                {(["newest", "cheapest", "closest"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSort(s)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors capitalize ${
                      sort === s
                        ? "bg-lodge-500/10 border-lodge-500/40 text-lodge-400"
                        : "bg-dark-800 border-dark-700 text-gray-600 hover:text-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            {listings === undefined ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-dark-800 border border-dark-700">
                    <div className="aspect-[4/3] skeleton" />
                    <div className="p-4 flex flex-col gap-3">
                      <div className="h-4 skeleton rounded w-3/4" />
                      <div className="h-3 skeleton rounded w-1/2" />
                      <div className="h-8 skeleton rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Building2 size={40} className="text-dark-600 mb-4" />
                <h3 className="font-display font-bold text-white text-lg">No lodges found</h3>
                <p className="text-gray-600 text-sm mt-1">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => {
                    setFilters(DEFAULT_FILTERS);
                    setSearch("");
                  }}
                  className="mt-4 text-lodge-500 hover:text-lodge-400 text-sm font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {sorted.map((listing, i) => (
                  <ListingCard key={listing._id} listing={listing} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="relative ml-auto w-72 h-full bg-dark-800 border-l border-dark-700 overflow-y-auto">
            <Filters filters={filters} onChange={updateFilters} onClose={() => setShowMobileFilters(false)} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-dark-700 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded lodge-gradient flex items-center justify-center">
              <Home size={10} fill="white" className="text-white" />
            </div>
            <span className="font-display font-bold text-white text-sm">LodgeIt</span>
          </div>
          <p className="text-gray-600 text-xs text-center">
            Connecting students to verified housing. Confirm all details with the agent before payment.
          </p>
          <Link href="/list-property" className="text-lodge-500 text-xs hover:text-lodge-400 transition-colors">
            Are you an agent? List here →
          </Link>
        </div>
      </footer>
    </div>
  );
}
