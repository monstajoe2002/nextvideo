import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Doc } from "../../../convex/_generated/dataModel";
import { formatUploadDate } from "@/lib/utils";

type DescriptionProps = {
  video: Doc<"video">;
};

const Description = ({ video }: DescriptionProps) => {
  return (
    <Collapsible>
      <div className="flex justify-between mt-10">
        <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {video.title}
        </h2>
        <CollapsibleTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <ChevronsUpDownIcon />
          </Button>
        </CollapsibleTrigger>
      </div>
      <b className="text-sm">
        {video.views}{" "}
        {video.views === 1 ? <span>view</span> : <span>views</span>} | Uploaded
        on {formatUploadDate(new Date(video._creationTime))}
      </b>
      <CollapsibleContent>
        <section className="bg-secondary p-4 rounded-lg mt-4">
          <p>{video.description}</p>
          <div className="mt-4">
            <b>Tags: </b>
            {video.tags?.join(", ")}
          </div>
        </section>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Description;
