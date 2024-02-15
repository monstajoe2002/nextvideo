"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChannelAvatar from "@/components/channel-avatar";
import {
  LayoutDashboardIcon,
  LogOutIcon,
  SettingsIcon,
  UploadIcon,
} from "lucide-react";
import { MoonIcon, SunIcon, MonitorIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { SignOutButton } from "@clerk/clerk-react";
import { Id } from "../../convex/_generated/dataModel";
type ChannelDropdownProps = {
  channelName: string;
  avatar?: string;
  channelId: string | Id<"channel">;
};
const ChannelDropdown = ({
  channelName,
  avatar,
  channelId,
}: ChannelDropdownProps) => {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ChannelAvatar image={avatar} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4">
        <DropdownMenuLabel>{channelName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <Link href="/upload">
            <UploadIcon className="mr-2 h-4 w-4" />
            <b>Upload</b>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <Link href={`/dashboard?channel=${channelId}`}>
            <LayoutDashboardIcon className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <Link href="#">
            <SettingsIcon className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <SignOutButton>
          <DropdownMenuItem className="hover:cursor-pointer">
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>Log Out</span>
          </DropdownMenuItem>
        </SignOutButton>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <SunIcon className="mr-2 h-4 w-4" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <MoonIcon className="mr-2 h-4 w-4" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <MonitorIcon className="mr-2 h-4 w-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChannelDropdown;
