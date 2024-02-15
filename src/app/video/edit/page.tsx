"use client";
import { useMutation, useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import React from "react";
import { api } from "$c/_generated/api";
import { Id } from "$c/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { EditVideoSchema } from "@/schemas";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
export default function EditVideoPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("v") as Id<"video">;
  const video = useQuery(api.videos.getById, {
    id,
  });
  const editVideo = useMutation(api.videos.edit);

  const form = useForm<z.infer<typeof EditVideoSchema>>({
    resolver: zodResolver(EditVideoSchema),
    defaultValues: {
      description: video?.[0]?.description,
      title: video?.[0]?.title,
      tags: video?.[0]?.tags?.join(", "),
    },
  });
  const router = useRouter();
  function onSubmit(values: z.infer<typeof EditVideoSchema>) {
    editVideo({ id, ...values, tags: values.tags?.split(", ") })
      .then(() => {
        router.push(`/dashboard?channel=${video?.[1]?._id}`);
      })
      .then(() => toast.success("Saved changes!"));
  }
  return (
    <main className="flex flex-col min-h-screen max-w-xl mx-auto mt-8">
      <h1 className="scroll-m-20 text-3xl pb-8 font-bold tracking-tight first:mt-0">
        Edit video details
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    defaultValue={video?.[0]?.title}
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
                  <Textarea defaultValue={video?.[0]?.description} {...field} />
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
                    defaultValue={video?.[0]?.tags?.join(", ")}
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
          <Button type="submit">
            <SaveIcon className="w-4 h-4 mr-2" />
            Save
          </Button>
        </form>
      </Form>
    </main>
  );
}
