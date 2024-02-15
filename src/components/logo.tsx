import { VideoIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const Logo = (props: Props) => {
  return (
    <Link className="flex gap-2 font-bold items-center text-xl" href="/">
      <VideoIcon className="w-8 h-8 text-red-500" />
      NextVideo
    </Link>
  );
};

export default Logo;
