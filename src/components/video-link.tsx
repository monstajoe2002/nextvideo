"use client";
import Image from "next/image";
import ChannelAvatar from "@/components/channel-avatar";
import Link from "next/link";
import { formatRelativeDate } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "$c/_generated/api";
import { Id } from "$c/_generated/dataModel";

type VideoProps = {
  id: string;
  title: string;
  channelName?: string;
  views: number;
  date: number;
  thumbnail: string;
  channelAvatar?: string;
};

const VideoLink = ({ title, views, date, id, thumbnail }: VideoProps) => {
  const channel = useQuery(api.channels.getByVideoId, {
    videoId: id as Id<"video">,
  });
  return (
    <Link href={`/video/${id}`} className="justify-self-center">
      <Image
        alt="Thumbnail"
        className="aspect-video rounded-lg object-cover hover:rounded-none transition-all duration-200 mb-4"
        width={320}
        height={200}
        quality={75}
        priority
        src={thumbnail}
      />
      <div className="flex">
        <div>{channel?.avatar && <ChannelAvatar image={channel.avatar} />}</div>
        <div>
          <p className="font-bold line-clamp-2 text-md">{title}</p>
          <p className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">
            {channel?.name}
          </p>
          <p className="text-xs text-gray-500 line-clamp-1 dark:text-gray-400">
            {views} {views === 1 ? "view" : "views"} |{" "}
            {formatRelativeDate(new Date(date))}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoLink;
