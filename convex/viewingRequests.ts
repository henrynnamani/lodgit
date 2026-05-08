import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const submitRequest = mutation({
  args: {
    listingId: v.id("listings"),
    studentName: v.string(),
    studentEmail: v.string(),
    studentPhone: v.string(),
    preferredDate: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("viewingRequests", {
      ...args,
      status: "pending",
      createdAt: Date.now(),
    });
  },
});

export const getByListing = query({
  args: { listingId: v.id("listings") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("viewingRequests")
      .withIndex("by_listing", (q) => q.eq("listingId", args.listingId))
      .collect();
  },
});
