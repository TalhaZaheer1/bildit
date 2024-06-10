"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { createMedia } from "@/lib/queries";
import { useToast } from "../ui/use-toast";
import FileUpload from "../global/FileUpload";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useModal } from "@/providers/ModalProvider";
import { useRouter } from "next/navigation";

type Props = {
  subAccountId: string;
};

const formSchema = z.object({
  name: z.string().min(1),
  link: z.string().min(1),
});

const MediaUploadForm = ({ subAccountId }: Props) => {
  const { setClose } = useModal()
  const router = useRouter()
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await createMedia({
        name: values.name,
        link: values.link,
        subAccount: subAccountId,
      });
      if (res?.created)
        toast({
          title: "Success",
          description:"Uploaded media"
        });
        setClose()
        router.refresh()
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed",
        description:"Could not upload media"
      });
    }
  };
  return (
    <Card className="w-full">
        <CardHeader>
            <CardTitle>Media Information</CardTitle>
            <CardDescription>
                Please enter the details for your file
            </CardDescription>
        </CardHeader>
        <CardContent>
    <Form {...form}>
      <form  className="flex flex-col gap-5" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Media</FormLabel>
              <FormControl>
                <FileUpload
                  apiEndpoint="media"
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting} type="submit">Add Media</Button>
      </form>
    </Form>
    </CardContent>
    </Card>

  );
};

export default MediaUploadForm;
