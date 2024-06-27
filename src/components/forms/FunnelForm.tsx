"use client";
import React, { useEffect } from "react";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { Button } from "../ui/button";
import Loading from "../global/loading";
import { saveActivityLogsNotifications, upsertFunnel } from "@/lib/queries";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FunnelInterface } from "@/models/Funnel";
import mongoose from "mongoose";
import { useModal } from "@/providers/ModalProvider";
import FileUpload from "../global/FileUpload";

interface CreateFunnelProps {
  defaultData?: FunnelInterface;
  subAccountId: string;
}

//CHALLENGE: Use favicons
const CreateFunnelFormSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  subDomainName: z.string().optional(),
  favicon: z.string().optional(),
});

const FunnelForm: React.FC<CreateFunnelProps> = ({
  defaultData,
  subAccountId,
}) => {
  const { setClose } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof CreateFunnelFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(CreateFunnelFormSchema),
    defaultValues: {
      name: defaultData?.name || "",
      description: defaultData?.description || "",
      favicon: defaultData?.favicon || "",
      subDomainName: defaultData?.subDomainName || "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        description: defaultData.description || "",
        favicon: defaultData.favicon || "",
        name: defaultData.name || "",
        subDomainName: defaultData.subDomainName || "",
      });
    }
  }, [defaultData]);

  const isLoading = form.formState.isLoading;

  const onSubmit = async (values: z.infer<typeof CreateFunnelFormSchema>) => {
    console.log(subAccountId,"1")
    if (!subAccountId) return;
    console.log(subAccountId,"2")
    const response = await upsertFunnel(
      subAccountId,
      { ...values, liveProducts: defaultData?.liveProducts || "[]" },
      defaultData?._id || new mongoose.Types.ObjectId()
    );
    await saveActivityLogsNotifications({
      agencyId: undefined,
      description: `Update funnel | ${response?.name}`,
      subAccountId: subAccountId,
    });
    if (response)
      toast({
        title: "Success",
        description: "Saved funnel details",
      });
    else
      toast({
        variant: "destructive",
        title: "Oppse!",
        description: "Could not save funnel details",
      });
    setClose();
    router.refresh();
  };
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Funnel Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funnel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funnel Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit more about this funnel."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="subDomainName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub domain</FormLabel>
                  <FormControl>
                    <Input placeholder="Sub domain for funnel" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="favicon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favicon</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="subAccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-20 mt-4" disabled={isLoading} type="submit">
              {form.formState.isSubmitting ? <Loading /> : "Save"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FunnelForm;
