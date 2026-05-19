import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  listings: defineTable({
    title: v.string(),
    description: v.string(),
    price: v.number(),
    roomType: v.string(), // "single" | "self-contain" | "shared" | "flat"
    location: v.string(),
    city: v.string(),
    distanceToSchool: v.optional(v.string()),
    amenities: v.array(v.string()),
    availability: v.string(), // "immediate" | "next-month"
    thumbnailUrl: v.string(),
    videoUrl: v.optional(v.string()),
    videoPublicId: v.optional(v.string()),
    agentName: v.string(),
    agentEmail: v.string(),
    agentPhone: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    // ── Payment breakdown ──
    agentFee: v.optional(v.number()),
    legalFee: v.optional(v.number()),
    cautionFee: v.optional(v.number()),
    serviceCharge: v.optional(v.number()),
    agreementFee: v.optional(v.number()),
  })
    .index("by_city", ["city"])
    .index("by_roomType", ["roomType"])
    .index("by_price", ["price"])
    .index("by_active", ["isActive"]),

  viewingRequests: defineTable({
    listingId: v.id("listings"),
    studentName: v.string(),
    studentEmail: v.string(),
    studentPhone: v.string(),
    preferredDate: v.string(),
    message: v.optional(v.string()),
    status: v.string(), // "pending" | "contacted" | "rejected"
    createdAt: v.number(),
  }).index("by_listing", ["listingId"]),
});