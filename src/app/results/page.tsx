"use client";
import { api } from "$c/_generated/api";
import VideoLink from "@/components/video-link";
import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q");
  const searchResults = useQuery(api.videos.search, {
    search: search ?? "",
  });

  return (
    <div>
      {searchResults?.map((res) => (
        <VideoLink
          date={res._creationTime}
          id={res._id}
          key={res._id}
          thumbnail={res.thumbnail}
          title={res.title!}
          views={res.views}
        />
      ))}
    </div>
  );
}
