import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getManyFrom } from "convex-helpers/server/relationships";

export const post = mutation({
  args: {
    text: v.string(),
    videoId: v.id("video"),
    channelId: v.id("channel"),
  },
  async handler({ db, auth }, { text, videoId, channelId }) {
    const identity = await auth.getUserIdentity();
    const newComment = {
      text,
      channelId,
      videoId,
    };
    if (!identity) {
      throw new Error("Not authenticated");
    }
    return await db.insert("comment", newComment);
  },
});

export const get = query({
  args: {
    videoId: v.id("video"),
    channelId: v.union(v.id("channel"), v.string()),
  },
  async handler({ db }, { videoId }) {
    const comments = await getManyFrom(
      db,
      "comment",
      "by_video",
      videoId,
      "videoId"
    );
    const sortedComments = comments.sort((a, b) => {
      return b._creationTime - a._creationTime;
    });
    return sortedComments;
  },
});
