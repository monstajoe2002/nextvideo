"use client";
import { Separator } from "@/components/ui/separator";
import VideoLink from "@/components/video-link";
import useStoreUserEffect from "@/hooks/use-store-user-effect";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { userId, user } = useStoreUserEffect();
  const videos = useQuery(api.videos.getByChannelId, {
    channelId: userId ?? "",
  });
  const allVideos = useQuery(api.videos.get);

  return (
    <>
      <div className="grid 2xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
        {!videos ? (
          <Skeleton className="aspect-video" aria-hidden />
        ) : (
          videos?.map((video) => (
            <VideoLink
              id={video._id}
              key={video._id}
              thumbnail={video.thumbnail}
              title={video.title!}
              date={video._creationTime}
              views={video.views}
            />
          ))
        )}
        {videos && !videos?.length ? <p>No videos</p> : null}
      </div>
      <Separator className="my-6" aria-hidden />
      <h4 className="scroll-m-20 text-xl font-bold tracking-tight mb-4">
        Recommended
      </h4>
      <div className="grid 2xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-6">
        {allVideos?.map((video) => (
          <VideoLink
            id={video?._id!}
            key={video?._id}
            thumbnail={video?.thumbnail!}
            title={video?.title!}
            date={video?._creationTime!}
            views={video?.views!}
          />
        ))}
      </div>
      <Separator className="mt-6" aria-hidden />
    </>
  );
}
