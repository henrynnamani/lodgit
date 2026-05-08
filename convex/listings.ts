import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  args: {
    city: v.optional(v.string()),
    roomType: v.optional(v.string()),
    maxPrice: v.optional(v.number()),
    amenities: v.optional(v.array(v.string())),
    availability: v.optional(v.string()),
    distanceToSchool: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let listings = await ctx.db
      .query("listings")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    if (args.city && args.city !== "all") {
      listings = listings.filter(
        (l) => l.city.toLowerCase() === args.city!.toLowerCase()
      );
    }
    if (args.roomType && args.roomType !== "all") {
      listings = listings.filter((l) => l.roomType === args.roomType);
    }
    if (args.maxPrice) {
      listings = listings.filter((l) => l.price <= args.maxPrice!);
    }
    if (args.availability && args.availability !== "all") {
      listings = listings.filter((l) => l.availability === args.availability);
    }
    if (args.distanceToSchool && args.distanceToSchool !== "any") {
      listings = listings.filter(
        (l) => l.distanceToSchool === args.distanceToSchool
      );
    }
    if (args.amenities && args.amenities.length > 0) {
      listings = listings.filter((l) =>
        args.amenities!.every((a) => l.amenities.includes(a))
      );
    }

    return listings.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getById = query({
  args: { id: v.id("listings") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    price: v.number(),
    roomType: v.string(),
    location: v.string(),
    city: v.string(),
    distanceToSchool: v.optional(v.string()),
    amenities: v.array(v.string()),
    availability: v.string(),
    thumbnailUrl: v.string(),
    videoUrl: v.optional(v.string()),
    videoPublicId: v.optional(v.string()),
    agentName: v.string(),
    agentEmail: v.string(),
    agentPhone: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("listings", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const seedListings = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("listings").collect();
    if (existing.length > 0) return "already seeded";

    const listings = [
      {
        title: "Cozy Self-Contain off Ekulu",
        description: "Spacious self-contain with modern finishing, running water and 24/7 electricity. Tiled floors, wardrobe space and burglar-proof windows. Very serene environment.",
        price: 180000,
        roomType: "self-contain",
        location: "Ekulu, Enugu",
        city: "Enugu",
        distanceToSchool: "10min",
        amenities: ["water", "electricity", "security"],
        availability: "immediate",
        thumbnailUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
        videoUrl: "",
        agentName: "Chukwudi Okafor",
        agentEmail: "chukwudi@lodgeit.ng",
        agentPhone: "08012345678",
        isActive: true,
        createdAt: Date.now() - 86400000,
      },
      {
        title: "Single Room – New Build Awkunanaw",
        description: "Brand new single room in a quiet compound. Kitchen and bathroom shared among 4 students. Good road access and very close to bus stop.",
        price: 95000,
        roomType: "single",
        location: "Awkunanaw, Enugu",
        city: "Enugu",
        distanceToSchool: "5min",
        amenities: ["water", "electricity"],
        availability: "immediate",
        thumbnailUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
        videoUrl: "",
        agentName: "Ngozi Eze",
        agentEmail: "ngozi@lodgeit.ng",
        agentPhone: "08023456789",
        isActive: true,
        createdAt: Date.now() - 172800000,
      },
      {
        title: "2-Bedroom Flat – Independence Layout",
        description: "Well-maintained 2-bedroom flat with sitting room, kitchen and 2 bathrooms. Fully tiled, with constant EEDC supply. Suitable for small group of students.",
        price: 450000,
        roomType: "flat",
        location: "Independence Layout, Enugu",
        city: "Enugu",
        distanceToSchool: "20min",
        amenities: ["water", "electricity", "parking", "security"],
        availability: "next-month",
        thumbnailUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
        videoUrl: "",
        agentName: "Emeka Nwosu",
        agentEmail: "emeka@lodgeit.ng",
        agentPhone: "08034567890",
        isActive: true,
        createdAt: Date.now() - 259200000,
      },
      {
        title: "Shared Room – Hilltop Nsukka",
        description: "Affordable shared room for 2 students. Close to UNN main gate. Shared bathroom and kitchen facilities in good condition.",
        price: 80000,
        roomType: "shared",
        location: "Hilltop, Nsukka",
        city: "Nsukka",
        distanceToSchool: "5min",
        amenities: ["water", "electricity"],
        availability: "immediate",
        thumbnailUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
        videoUrl: "",
        agentName: "Amaka Onah",
        agentEmail: "amaka@lodgeit.ng",
        agentPhone: "08045678901",
        isActive: true,
        createdAt: Date.now() - 43200000,
      },
      {
        title: "Self-Contain – Odim Street Nsukka",
        description: "Decent self-contain with indoor plumbing and kitchen. Quiet compound, borehole water, and prepaid meter. Walking distance to campus.",
        price: 150000,
        roomType: "self-contain",
        location: "Odim Street, Nsukka",
        city: "Nsukka",
        distanceToSchool: "10min",
        amenities: ["water", "electricity", "security"],
        availability: "immediate",
        thumbnailUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80",
        videoUrl: "",
        agentName: "Ifeanyi Ugwu",
        agentEmail: "ifeanyi@lodgeit.ng",
        agentPhone: "08056789012",
        isActive: true,
        createdAt: Date.now() - 600000,
      },
      {
        title: "Mini Flat – New Haven Enugu",
        description: "Clean mini flat with bedroom, sitting area and kitchen all-in-one. Perfect for focused students. DSTV point, good ventilation and spacious wardrobe.",
        price: 260000,
        roomType: "self-contain",
        location: "New Haven, Enugu",
        city: "Enugu",
        distanceToSchool: "20min",
        amenities: ["water", "electricity", "parking"],
        availability: "next-month",
        thumbnailUrl: "https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=600&q=80",
        videoUrl: "",
        agentName: "Blessing Ani",
        agentEmail: "blessing@lodgeit.ng",
        agentPhone: "08067890123",
        isActive: true,
        createdAt: Date.now() - 3600000,
      },
    ];

    for (const listing of listings) {
      await ctx.db.insert("listings", listing);
    }
    return "seeded";
  },
});
