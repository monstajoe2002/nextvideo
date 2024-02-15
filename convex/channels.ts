import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { genRandStr } from "../src/lib/utils";
import { authQuery } from "./util";
import { getOneFrom } from "convex-helpers/server/relationships";
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    // Check if we've already stored this identity before.
    const channel = await ctx.db
      .query("channel")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (channel !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (channel.name !== identity.name) {
        await ctx.db.patch(channel._id, { name: identity.name });
      }
      return channel._id;
    }
    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("channel", {
      name: identity.name ?? `user-${genRandStr(8)}`,
      email: identity.email!,
      tokenIdentifier: identity.tokenIdentifier,
      avatar: identity.pictureUrl,
      subscribers: 0,
    });
  },
});
export const getById = query({
  args: { channelId: v.union(v.id("channel"), v.string()) },
  async handler({ db }, args) {
    const channel = await db
      .query("channel")
      .filter((q) => q.eq("_id", args.channelId))
      .first();
    return channel;
  },
});

export const getByVideoId = query({
  args: {
    videoId: v.id("video"),
  },
  async handler({ db }, { videoId }) {
    const video = await db.get(videoId);
    const channel = await db.get(video!.channelId);
    return channel;
  },
});

export const get = authQuery({
  args: {},
  handler: async (ctx) => {
    return ctx.channel;
  },
});
export const subscribe = mutation({
  args: {
    channelId: v.id("channel"),
    subscriberId: v.id("channel"),
  },
  async handler({ db, auth }, { channelId, subscriberId }) {
    const channel = await db.get(channelId);
    const subscriber = await db
      .query("channel")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", subscriberId))
      .unique();
    if (!channel) {
      return;
    }
    const identity = await auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    if (identity?.tokenIdentifier === subscriber?.tokenIdentifier) {
      return false;
    }
    const subscription = await db
      .query("subscription")
      .withIndex("by_channel", (q) =>
        q.eq("channelId", channelId).eq("subscriberId", subscriberId)
      )
      .first();
    if (subscription) {
      return false;
    }
    return Promise.allSettled([
      await db.insert("subscription", {
        channelId,
        subscriberId: subscriberId ?? "",
      }),
      await db.patch(channel._id, {
        subscribers: channel.subscribers! + 1,
      }),
    ]);
  },
});
export const unsubscribe = mutation({
  args: {
    channelId: v.id("channel"),
    subscriberId: v.id("channel"),
  },
  async handler({ db }, { channelId, subscriberId }) {
    const channel = await db.get(channelId);

    if (!channel) {
      return;
    }
    const subscription = await db
      .query("subscription")
      .withIndex("by_channel", (q) =>
        q.eq("channelId", channelId).eq("subscriberId", subscriberId)
      )
      .first();
    if (!subscription) {
      return;
    }
    return Promise.allSettled([
      await db.delete(subscription._id),
      await db.patch(channel._id, {
        subscribers: channel.subscribers! - 1,
      }),
    ]);
  },
});
