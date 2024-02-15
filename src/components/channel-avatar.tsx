import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon } from "lucide-react";
type ChannelAvatarProps = {
  image?: string;
};

const ChannelAvatar = ({ image }: ChannelAvatarProps) => {
  return (
    <Avatar className="mr-2">
      <AvatarImage src={image} />
      <AvatarFallback className="bg-primary">
        <UserIcon className="text-secondary" />
      </AvatarFallback>
    </Avatar>
  );
};

export default ChannelAvatar;
