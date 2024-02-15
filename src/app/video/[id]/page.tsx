"use client";
import { useMutation, useQuery } from "convex/react";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Description from "@/components/video/description";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useKey } from "@mvdlei/hooks";
import { toast } from "sonner";
import useStoreUserEffect from "@/hooks/use-store-user-effect";
import Comment from "@/components/video/comment";
import { Skeleton } from "@/components/ui/skeleton";
import ChannelAvatar from "@/components/channel-avatar";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
export default function VideoPage({
  params: { id },
}: {
  params: { id: Id<"video"> };
}) {
  const [comment, setComment] = useState("");
  const { userId } = useStoreUserEffect();
  const video = useQuery(api.videos.getById, { id });
  const watchVideo = useMutation(api.videos.watch);
  const postComment = useMutation(api.comments.post);
  const videoComments = useQuery(api.comments.get, {
    videoId: id,
    channelId: userId ?? "",
  });
  const channel = useQuery(api.channels.getById, {
    channelId: userId ?? "",
  });
  const postBtnRef = useRef<HTMLButtonElement>(null);
  const doesVideoBelongToUser = video?.[0]?.channelId === userId;
  const subscribe = useMutation(api.channels.subscribe);
  const unsubscribe = useMutation(api.channels.unsubscribe);
  const like = useMutation(api.videos.like);
  const unlike = useMutation(api.videos.unlike);
  const likedVideo = useQuery(api.likes.getByVideoId, {
    videoId: video?.[0]?._id!,
  });
  const subscription = useQuery(api.subscriptions.get, {
    channelId: video?.[1]?._id!,
  });
  function handlePost() {
    if (!userId) {
      return;
    }
    postComment({ videoId: id, text: comment!, channelId: userId })
      .then(() => {
        setComment("");
      })
      .then(() => {
        toast.success("Comment posted!");
      })
      .catch(() => {
        toast.error("You must be signed in to comment on this video.");
      });
  }
  async function handleSubscribe() {
    subscribe({
      channelId: video?.[1]?._id!,
      subscriberId: userId!,
    })
      .then(() => {
        toast.success("Subscribed to channel!");
      })
      .catch(() => {
        toast.error("You must be signed in to subscribe to this channel.");
      });
  }
  async function handleUnsubscribe() {
    unsubscribe({
      channelId: video?.[1]?._id!,
      subscriberId: userId!,
    })
      .then(() => {
        toast("Unsubscribed from channel.");
      })
      .catch(() => {
        toast.error("An error occurred while unsubscribing");
      });
  }
  async function handleLike() {
    like({
      videoId: video?.[0]?._id!,
      viewerId: userId ?? "",
    })
      .then(() => {
        toast.success("Liked video");
      })
      .catch(() => {
        toast.error("You must be signed in to like this video.");
      });
  }
  async function handleUnlike() {
    unlike({
      videoId: video?.[0]?._id!,
      viewerId: userId ?? "",
    })
      .then(() => {
        toast("Unliked");
      })
      .catch(() => {
        toast.error("Error while unliking");
      });
  }
  useKey("Enter", () => postBtnRef.current?.click());

  if (!video?.[0]?.cldPublicId) return;
  return (
    <div className="grid lg:grid-cols-2 gap-x-8">
      {video ? (
        <section className="max-w-7xl">
          <CldVideoPlayer
            id={crypto.randomUUID()}
            width="320px"
            height="240px"
            src={video[0]?.cldPublicId!}
            transformation={{
              streaming_profile: "hd",
            }}
            autoplay
            sourceTypes={["hls"]}
            showJumpControls
            playbackRates={[1, 1.5, 2]}
            onDataLoad={() => watchVideo({ id })}
          />
          <Description video={video[0]} />
          <div className="mt-4">
            {likedVideo ? (
              <Button
                variant={"secondary"}
                onClick={handleUnlike}
                className={doesVideoBelongToUser ? "hidden" : ""}
              >
                <ThumbsDownIcon className="w-4 h-4 mr-2" />
                {video[0].likes}
              </Button>
            ) : (
              <Button
                onClick={handleLike}
                className={doesVideoBelongToUser ? "hidden" : ""}
              >
                <ThumbsUpIcon className="w-4 h-4 mr-2" />
                {video[0].likes}
              </Button>
            )}
          </div>
          {!doesVideoBelongToUser && (
            <div className="flex mt-4 justify-between space-x-4">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Type your comment here..."
              />
              <Button ref={postBtnRef} onClick={handlePost} disabled={!comment}>
                Post
              </Button>
            </div>
          )}
          <div className="my-8 flex justify-between">
            <ChannelAvatar image={video[1]?.avatar} />
            <div className="flex flex-col ml-2 flex-1">
              <b>{video[1]?.name}</b>
              <p className="text-sm">
                {video[1]?.subscribers}{" "}
                {video[1]?.subscribers === 1 ? "subscriber" : "subscribers"}
              </p>
            </div>
            {subscription ? (
              <Button
                variant={"unsubscribe"}
                onClick={handleUnsubscribe}
                className={doesVideoBelongToUser ? "hidden" : ""}
              >
                Unsubscribe
              </Button>
            ) : (
              <Button
                variant={"subscribe"}
                onClick={handleSubscribe}
                className={doesVideoBelongToUser ? "hidden" : ""}
              >
                Subscribe
              </Button>
            )}
          </div>
        </section>
      ) : (
        <section className="max-w-7xl">
          <Skeleton className="max-w-7xl" />
        </section>
      )}
      {videoComments ? (
        <section>
          <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {videoComments?.length}{" "}
            {videoComments.length === 1 ? "comment" : "comments"}
          </h2>
          {videoComments.map((comment) => (
            <Comment key={comment?._id} comment={comment} />
          ))}
        </section>
      ) : (
        <Skeleton className="max-w-7xl h-20" />
      )}
    </div>
  );
}
