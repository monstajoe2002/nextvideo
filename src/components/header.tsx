"use client";
import { Input } from "@/components/ui/input";
import Logo from "./logo";
import Sidebar from "@/components/sidebar";
import ChannelDropdown from "@/components/channel-dropdown";
import { Button } from "@/components/ui/button";
import { UserCircle2Icon } from "lucide-react";
import useStoreUserEffect from "@/hooks/use-store-user-effect";
import { SignInButton } from "@clerk/clerk-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "$c/_generated/api";
import { useRouter } from "next/navigation";

const Header = () => {
  const { user, userId } = useStoreUserEffect();
  const [search, setSearch] = useState<string>();
  const router = useRouter();

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target?.value);
  };
  return (
    <header>
      <div className="flex justify-between my-4 mx-6">
        <div className="flex">
          <Sidebar />
          <Logo />
        </div>
        <Input
          className="rounded-full max-w-sm lg:max-w-lg md:max-w-sm sm:max-w-[250px]"
          placeholder="Search"
          type="search"
          value={search ?? ""}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              router.push(`/results?q=${search}`);
            }
          }}
          onChange={handleInputChange}
        />
        {user ? (
          <ChannelDropdown
            channelId={userId!}
            avatar={user.imageUrl}
            channelName={user.fullName!}
          />
        ) : (
          <SignInButton>
            <Button variant={"outline"}>
              <UserCircle2Icon className="mr-2" />
              Sign In
            </Button>
          </SignInButton>
        )}
      </div>
    </header>
  );
};

export default Header;
