import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ideas: defineTable({
    ownerId: v.string(),
    niche: v.string(),
    topic: v.string(),
    hook: v.string(),
    script: v.string(),
    hashtags: v.array(v.string()),
    createdAt: v.number()
  }).index("by_owner", ["ownerId"])
});