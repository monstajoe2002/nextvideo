"use client";

import { useMutation, useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { Button, buttonVariants } from "@/components/ui/button";
import { EditIcon, TrashIcon } from "lucide-react";
import VideoLink from "@/components/video-link";
import Link from "next/link";
import NoVideosFallback from "@/components/dashboard/no-videos-fallback";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const channelId = searchParams.get("channel")!;
  const videos = useQuery(api.videos.getByChannelId, {
    channelId,
  });
  const deleteVideo = useMutation(api.videos.del);
  return (
    <main className="m-8">
      <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">
        Dashboard
      </h2>
      {videos?.length ? (
        videos?.map((vid) => (
          <div className="flex justify-between" key={vid._id}>
            <VideoLink
              date={vid._creationTime}
              thumbnail={vid.thumbnail}
              views={vid.views}
              title={vid.title!}
              id={vid._id}
            />
            <div className="grid md:grid-cols-2 sm:grid-cols-1 space-x-2">
              <Link
                href={`/video/edit?v=${vid._id}`}
                className={buttonVariants({
                  variant: "ghost",
                })}
              >
                <EditIcon className="mr-2 w-4 h-4" />
                Edit
              </Link>
              <Button
                onClick={() => {
                  deleteVideo({ id: vid._id });
                }}
                variant={"destructive"}
              >
                <TrashIcon className="mr-2 w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        ))
      ) : (
        <NoVideosFallback />
      )}
    </main>
  );
}
