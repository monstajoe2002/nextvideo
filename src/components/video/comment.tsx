"use client";
import React from "react";
import { Doc } from "../../../convex/_generated/dataModel";
import ChannelAvatar from "../channel-avatar";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import useStoreUserEffect from "@/hooks/use-store-user-effect";

type CommentsProps = {
  comment: Partial<Doc<"comment">>;
};

const Comment = ({ comment }: CommentsProps) => {
  const { user } = useStoreUserEffect();
  const channel = useQuery(api.channels.getById, {
    channelId: comment.channelId ?? "",
  });
  return (
    <div className="flex my-6">
      <ChannelAvatar image={channel?.avatar ?? user?.imageUrl} />
      <div className="grid grid-rows-2 ml-2">
        <b>{channel?.name ?? user?.fullName}</b>
        <p>{comment.text}</p>
      </div>
    </div>
  );
};

export default Comment;
