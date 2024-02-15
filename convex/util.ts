import {
  ActionCtx,
  MutationCtx,
  QueryCtx,
  mutation,
} from "./_generated/server";
import {
  customQuery,
  customCtx,
  customMutation,
} from "convex-helpers/server/customFunctions";
import { query } from "./_generated/server";
import { ConvexError } from "convex/values";

export const authQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    try {
      return { channel: await getUserOrThrow(ctx) };
    } catch (err) {
      return { channel: null };
    }
  })
);

export const authMutation = customMutation(
  mutation,
  customCtx(async (ctx) => ({ channel: await getUserOrThrow(ctx) }))
);

async function getUserOrThrow(ctx: QueryCtx | MutationCtx) {
  const userId = (await ctx.auth.getUserIdentity())?.subject;
  if (!userId) {
    throw new ConvexError("must be logged in");
  }

  const channel = await ctx.db
    .query("channel")
    .filter((q) => q.eq("channelId", userId))
    .first();

  if (!channel) {
    throw new ConvexError("user not found");
  }

  return channel;
}

export const getChannel = async (ctx: QueryCtx | MutationCtx | ActionCtx) => {
  return await ctx.auth.getUserIdentity();
};

export const getChannelById = async (
  ctx: QueryCtx | MutationCtx,
  userId: string
) => {
  return ctx.db;
};
