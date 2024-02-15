import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  channel: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    avatar: v.optional(v.string()),
    tokenIdentifier: v.string(),
    subscribers: v.optional(v.number()),
  }).index("by_token", ["tokenIdentifier"]),
  video: defineTable({
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    thumbnail: v.string(),
    channelId: v.id("channel"),
    views: v.number(),
    likes: v.number(),
    tags: v.optional(v.array(v.string())),
    cldFilePath: v.string(),
    cldPublicId: v.string(),
  })
    .index("by_channel", ["channelId"])
    .searchIndex("by_title", { searchField: "title" })
    .searchIndex("by_tag", { searchField: "tags" }),
  comment: defineTable({
    text: v.string(),
    videoId: v.id("video"),
    channelId: v.union(v.id("channel"), v.string()),
  })
    .index("by_video", ["videoId"])
    .index("by_channel", ["channelId"]),
  like: defineTable({
    videoId: v.id("video"),
    viewerId: v.union(v.id("channel"), v.string()),
  }).index("by_video", ["videoId", "viewerId"]),

  subscription: defineTable({
    channelId: v.id("channel"),
    subscriberId: v.union(v.id("channel"), v.string()),
  }).index("by_channel", ["channelId", "subscriberId"]),
  playlist: defineTable({
    name: v.string(),
    channelId: v.id("channel"),
    videos: v.array(v.id("video")),
  }),
});
