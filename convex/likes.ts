import { v } from "convex/values";
import { query } from "./_generated/server";
import { getOneFrom } from "convex-helpers/server/relationships";

export const getByVideoId = query({
  args: {
    videoId: v.id("video"),
  },
  async handler(ctx, args) {
    const like = await getOneFrom(
      ctx.db,
      "like",
      "by_video",
      args.videoId,
      "videoId"
    );
    return like;
  },
});
