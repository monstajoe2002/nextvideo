import React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  HistoryIcon,
  HomeIcon,
  MenuIcon,
  PlaySquareIcon,
  RssIcon,
  ThumbsUpIcon,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const Sidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <div className="flex flex-col items-start gap-y-4">
          <Link
            href="/"
            className={buttonVariants({
              variant: "link",
            })}
          >
            <HomeIcon className="mr-2" />
            Home
          </Link>
          <Link
            href="/"
            className={buttonVariants({
              variant: "link",
            })}
          >
            <RssIcon className="mr-2" />
            Subscriptions
          </Link>
          <Separator />
          <SheetTitle>You</SheetTitle>
          <Link
            href="/"
            className={buttonVariants({
              variant: "link",
            })}
          >
            <HistoryIcon className="mr-2" />
            History
          </Link>{" "}
          <Link
            href="/"
            className={buttonVariants({
              variant: "link",
            })}
          >
            <PlaySquareIcon className="mr-2" />
            Your Videos
          </Link>
          <Link
            href="/"
            className={buttonVariants({
              variant: "link",
            })}
          >
            <ThumbsUpIcon className="mr-2" />
            Liked Videos
          </Link>
          <Separator />
          <SheetTitle>Subscriptions</SheetTitle>
          {/* TODO: add subscriptions list */}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
