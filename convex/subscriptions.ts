import { v } from "convex/values";
import { query } from "./_generated/server";

export const get = query({
  args: {
    channelId: v.id("channel"),
  },
  async handler(ctx, args) {
    const subscription = await ctx.db
      .query("subscription")
      .withIndex("by_channel", (q) => q.eq("channelId", args.channelId))
      .first();
    return subscription;
  },
});
