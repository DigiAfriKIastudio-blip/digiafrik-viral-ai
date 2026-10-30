import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Prototype endpoint: ownerId is a client-generated identifier, not an authentication credential.
// Add real user authentication and server-side ownership checks before production use.
export const listMine = query({
  args: { ownerId: v.string() },
  handler: async (ctx, { ownerId }) => {
    return await ctx.db.query("ideas")
      .withIndex("by_owner", (q) => q.eq("ownerId", ownerId))
      .order("desc")
      .take(100);
  }
});

export const save = mutation({
  args: {
    ownerId: v.string(),
    niche: v.string(),
    topic: v.string(),
    hook: v.string(),
    script: v.string(),
    hashtags: v.array(v.string()),
    createdAt: v.number()
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("ideas", args);
  }
});

export const remove = mutation({
  args: { ownerId: v.string(), ideaId: v.id("ideas") },
  handler: async (ctx, { ownerId, ideaId }) => {
    const idea = await ctx.db.get(ideaId);
    if (!idea || idea.ownerId !== ownerId) throw new Error("Idée introuvable.");
    await ctx.db.delete(ideaId);
    return null;
  }
});