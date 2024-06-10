import { pipeLineFormSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { saveActivityLogsNotifications, upsertPipeLine } from "@/lib/queries";
import { PipelineInterface } from "@/models/Pipeline";
import { useToast } from "../ui/use-toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/providers/ModalProvider";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type props = {
  pipeLineId?: string;
  subAccountId: string;
  defaultData?: Partial<PipelineInterface>;
};

const PipelineForm = ({ pipeLineId, subAccountId, defaultData }: props) => {
  const form = useForm<z.infer<typeof pipeLineFormSchema>>({
    mode: "onChange",
    resolver: zodResolver(pipeLineFormSchema),
    defaultValues: {
      name: defaultData?.name || "",
    },
  });
  const { toast } = useToast();
  const { setClose } = useModal();
  const router = useRouter();

  const handleSubmit = async (values: Partial<PipelineInterface>) => {
    try {
      const newPipeLine = await upsertPipeLine(
        {
          id: pipeLineId || false,
          ...values,
        },
        subAccountId
      );
      await saveActivityLogsNotifications({
        description: `Pipeline ${pipeLineId ? "updated" : "created"} | ${
          values.name
        }`,
        subAccountId: subAccountId,
      });
      toast({
        title: "Success",
        description: `Pipeline ${pipeLineId ? "updated" : "created"}`,
      });
      setClose();
      router.refresh();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed",
        description: `Could not ${pipeLineId ? "update" : "create"} pipeline`,
      });
    }
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pipeline Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              name="name"
              disabled={form.formState.isSubmitting}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-20 mt-4" disabled={form.formState.isSubmitting} type="submit">
              {pipeLineId ? "Update" : "Create"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PipelineForm;
