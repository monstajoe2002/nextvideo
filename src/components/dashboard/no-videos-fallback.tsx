import { UploadIcon } from "lucide-react";
import React from "react";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
const NoVideosFallback = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-y-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        No Videos Found
      </h1>
      <p>
        It looks like you haven&apos;t uploaded any videos yet. Start sharing
        your content with the world today!
      </p>
      <Link
        className={buttonVariants({
          variant: "secondary",
        })}
        href="/upload"
      >
        <UploadIcon className="mr-2 h-4 w-4" />
        <b className="uppercase">Upload</b>
      </Link>
    </div>
  );
};

export default NoVideosFallback;
