import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import {
  getAll,
  getManyFrom,
  getManyVia,
  getOneFrom,
} from "convex-helpers/server/relationships";
import { authMutation } from "./util";
export const upload = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    thumbnail: v.string(),
    channelId: v.id("channel"),
    views: v.number(),
    likes: v.number(),
    tags: v.array(v.string()),
    cldFilePath: v.string(),
    cldPublicId: v.string(),
  },
  async handler(ctx, args) {
    const existingUser = await ctx.auth.getUserIdentity();
    if (!existingUser) {
      throw new Error("User not logged in");
    }
    return await ctx.db.insert("video", args);
  },
});

export const get = query({
  args: {},
  async handler({ db }) {
    const videoIds = (await db.query("video").collect()).map((vid) => vid._id);

    const videos = await getAll(db, videoIds);
    return videos;
  },
});
export const getByChannelId = query({
  args: {
    channelId: v.union(v.id("channel"), v.string()),
  },
  async handler({ db }, { channelId }) {
    const videos = await getManyFrom(
      db,
      "video",
      "by_channel",
      channelId as Id<"channel">,
      "channelId"
    );
    return videos;
  },
});

export const getById = query({
  args: {
    id: v.id("video"),
  },
  async handler({ db }, args) {
    const video = await db.get(args.id);
    return await Promise.all([video, await db.get(video?.channelId!)]);
  },
});
export const watch = mutation({
  args: {
    id: v.id("video"),
  },
  async handler({ db }, args) {
    const currentVideo = await db.get(args.id);
    const views = currentVideo?.views! + 1;

    await db.patch(args.id, {
      views,
    });
  },
});
export const like = mutation({
  args: {
    videoId: v.id("video"),
    viewerId: v.union(v.id("channel"), v.string()),
  },
  async handler({ db }, { videoId, viewerId }) {
    const video = await db.get(videoId);

    if (!video) {
      return;
    }
    const like = await db
      .query("like")
      .withIndex("by_video", (q) =>
        q.eq("videoId", videoId).eq("viewerId", viewerId)
      )
      .first();
    if (like) {
      return false;
    }
    return Promise.allSettled([
      await db.insert("like", {
        videoId,
        viewerId,
      }),
      await db.patch(videoId, {
        likes: video.likes + 1,
      }),
    ]);
  },
});
export const unlike = mutation({
  args: {
    videoId: v.id("video"),
    viewerId: v.union(v.id("channel"), v.string()),
  },
  async handler({ db }, { videoId, viewerId }) {
    const video = await db.get(videoId);

    if (!video) {
      return;
    }
    const like = await db
      .query("like")
      .withIndex("by_video", (q) =>
        q.eq("videoId", videoId).eq("viewerId", viewerId)
      )
      .first();
    if (!like) {
      return false;
    }
    return Promise.allSettled([
      await db.delete(like._id),
      await db.patch(videoId, {
        likes: video.likes - 1,
      }),
    ]);
  },
});

export const del = authMutation({
  args: {
    id: v.id("video"),
  },
  async handler({ db, auth }, { id }) {
    const identity = auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Not authenticated");
    }
    await db.delete(id);
  },
});

export const edit = mutation({
  args: {
    id: v.id("video"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  async handler({ db }, { id, description, tags, title }) {
    await db.patch(id, {
      title,
      description,
      tags,
    });
  },
});

export const search = query({
  args: {
    search: v.string(),
  },
  async handler({ db }, { search }) {
    const results = db
      .query("video")
      .withSearchIndex("by_title", (q) => q.search("title", search))
      .collect();
    return results;
  },
});
