"use client";
import { saveActivityLogsNotifications, upsertLane } from "@/lib/queries";
import { LaneDetailsInterface, laneFormSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useModal } from "@/providers/ModalProvider";

type Props = {
  pipeLineId: string;
  laneData?: LaneDetailsInterface;
  subAccountId: string;
};

const LaneForm = ({ pipeLineId, laneData, subAccountId }: Props) => {
  const form = useForm<z.infer<typeof laneFormSchema>>({
    defaultValues: {
      name: laneData?.name || "",
    },
    mode: "onChange",
    resolver: zodResolver(laneFormSchema),
  });
  const router = useRouter();
  const { toast } = useToast();
  const { setClose } = useModal()

  const handleSubmit = async (values: z.infer<typeof laneFormSchema>) => {
    try {
      await upsertLane(
        {
          _id: laneData?._id,
          ...values,
          order: laneData?.order,
        },
        pipeLineId
      );
      await saveActivityLogsNotifications({
        description: `Lane ${laneData ? "updated" : "created"} | ${
          values.name
        }`,
        subAccountId: subAccountId,
      });
      toast({
        title: "Success!",
        description: `Lane created with name ${values.name}`,
      });
      setClose()
      router.refresh();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "Could not create lane",
      });
    }
  };

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>{!laneData ? "Create" : "Update"} Lane</CardTitle>
        <CardDescription>
          {laneData
            ? "This lane will have the same order as before"
            : "This lane be ordered after other lanes"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              disabled={form.formState.isSubmitting}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter a name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-20 mt-4" type="submit">
              {laneData ? "Save" : "Create"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default LaneForm;
