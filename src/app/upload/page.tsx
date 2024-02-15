"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { useMutation } from "convex/react";
import {
  CldUploadButton,
  type CldUploadWidgetInfo,
  type CldUploadWidgetResults,
} from "next-cloudinary";
import { api } from "../../../convex/_generated/api";
import useStoreUserEffect from "@/hooks/use-store-user-effect";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UploadVideoSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { FileVideo2Icon, UploadIcon } from "lucide-react";
export default function UploadPage() {
  const [resource, setResource] = useState<CldUploadWidgetInfo>();
  const uploadVideo = useMutation(api.videos.upload);
  const { userId } = useStoreUserEffect();
  const form = useForm<z.infer<typeof UploadVideoSchema>>({
    resolver: zodResolver(UploadVideoSchema),
    defaultValues: {
      description: "",
    },
  });
  function onSubmit(values: z.infer<typeof UploadVideoSchema>) {
    uploadVideo({
      channelId: userId!,
      cldFilePath: resource?.url!,
      description: values.description,
      title: values.title,
      likes: 0,
      tags: values.tags.split(", "),
      thumbnail: resource?.thumbnail_url!,
      views: 0,
      cldPublicId: resource?.public_id!,
    });
  }
  function onSuccess(result: CldUploadWidgetResults) {
    const vidInfo = result.info as CldUploadWidgetInfo;
    setResource(vidInfo);
  }
  return (
    <main className="flex flex-col min-h-screen max-w-xl mx-auto mt-8">
      <h1 className="scroll-m-20 text-3xl pb-8 font-semibold tracking-tight first:mt-0">
        Upload a video
      </h1>
      <Form {...form}>
        <form
          className="flex flex-col w-full space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Rick Astley - Never Gonna Give You Up"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <Input
                    placeholder="rick astley, music, pop, meme"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  These are keywords that will be used to help users find your
                  video
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <CldUploadButton
            uploadPreset="ml_default"
            options={{
              sources: ["local"],
              resourceType: "video",
              thumbnailTransformation: [
                { width: 1280, height: 720, crop: "fit" },
              ],
            }}
            onSuccess={(result, { widget }) => {
              onSuccess(result);
              widget.close();
            }}
            className={buttonVariants({
              variant: "secondary",
              className: "py-8",
            })}
          >
            <FileVideo2Icon className="mr-2 h-4 w-4" />
            Select File
          </CldUploadButton>
          <Button type="submit" className="w-max">
            Upload
          </Button>
        </form>
      </Form>
    </main>
  );
}
