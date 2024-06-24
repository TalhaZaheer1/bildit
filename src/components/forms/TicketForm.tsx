"use client";
import { TicketDetailsInterface } from "@/lib/types";
import { TagInterface } from "@/models/Tag";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { saveActivityLogsNotifications, upsertTicket } from "@/lib/queries";
import { useModal } from "@/providers/ModalProvider";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CirclePlus, Loader, Loader2, Search, Trash, UserRound, X } from "lucide-react";
import Image from "next/image";
import { UserInterface } from "@/models/User";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../ui/command";
import { CommandInput } from "cmdk";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import CustomModal from "../global/CustomModal";
import TagForm from "./TagForm";

type Props = {
  ticketData?: TicketDetailsInterface;
  laneId: string;
  subAccountId: string;
  tags: TagInterface[];
};

const formSchema = z.object({
  name: z.string().min(1, "Please provide a name"),
  description: z.string().min(1, "What is the purpose of this ticket"),
  value: z.number(),
  customer: z.string(),
  assignedUser: z.string(),
});

const TicketForm = ({ ticketData, laneId, subAccountId, tags }: Props) => {
  const [selectedTags, setSelectedTags] = useState<TagInterface[]>(ticketData?.tags || []);
  const router = useRouter();
  const { toast } = useToast();
  const { setClose,setOpen, data } = useModal();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      name: ticketData?.name || "",
      customer: ticketData?.customer?._id || "",
      description: ticketData?.description || "",
      value: ticketData?.value || 0,
      assignedUser: ticketData?.assignedUser?._id as string || "",
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await upsertTicket(
        {
          id: ticketData?._id,
          ...values,
          tags: selectedTags,
          lane: laneId,
          order: ticketData?.order || 0,
        },
        laneId
      );
      await saveActivityLogsNotifications({
        description: `${ticketData ? "update" : "created"} ticket`,
        subAccountId: subAccountId,
      });
      toast({
        title: "Success!",
        description: `${ticketData ? "Updated" : "Created"} ticket`,
      });
      setClose();
      router.refresh();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed!",
        description: `Could not ${ticketData ? "update" : "create"} ticket`,
      });
    }
  };
  const changeTagState = (tag: TagInterface) => {
    if (selectedTags.find((t) => t._id === tag._id)) return;
    return (e) => {
      e.preventDefault();
      setSelectedTags((prev) => [...prev, tag]);
    };
  };
  console.log(data)
  return (
    <Card className="max-w-[500px]">
      <CardHeader>
        <CardTitle>Ticket Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-2"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              name="name"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="description"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="value"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ticket Value</FormLabel>
                  <FormControl>
                    <Input  {...field} onChange={(e) => {
                      console.log(Number(e.target.value))
                  isNaN(Number(e.target.value)) ? null : field.onChange(Number(e.target.value))}} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/*TODO:                                                                TAGS COMPONANT */}
            <div className="mt-1">
              <h1 className="mb-2">Add tags</h1>
              <div
                className={`flex gap-3 ${
                  selectedTags.length > 0 ? "border mb-2 border-input" : ""
                } bg-background rounded-lg px-2`}
              >
                {selectedTags?.map((tag: TagInterface) => (
                  <div className="flex items-center my-2">
                    <TagButton tag={tag} />
                    <X
                      size={15}
                      onClick={() => {
                        const newTags = selectedTags.filter(
                          (innerTag: TagInterface) => tag._id !== innerTag._id
                        );
                        setSelectedTags(newTags);
                      }}
                    />
                  </div>
                ))}
              </div>
              <Command>
                <div className="relative">
                  <Label 
                  className="absolute top-[24%] left-[2%]"
                  htmlFor="tagS">
                    <Search
                      
                      size={18}
                    />
                  </Label>
                  <CommandInput
                    id="tagS"
                    className="flex h-10 w-full pl-8 rounded-md border bg-accent border-input bg px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-none  disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Search for tag..."
                  />
                    <div
                    onClick={() => setOpen(<CustomModal defaultOpen={false} title="Create a Tag" subheading="You can add these tags to tickets">
                      <TagForm subAccountId={subAccountId} />
                    </CustomModal>)}
                  className="absolute top-[24%] right-[2%]"
                    >
                  <CirclePlus size={18} />
                    </div>
                </div>
                <CommandList>
                  <CommandEmpty>No results found...</CommandEmpty>
                 {tags?.length > 0 ? <CommandGroup heading="Tags">
                    {tags?.map((tag) => (
                      <CommandItem className="aria-selected:bg-transparent flex justify-between">
                        <TagButton tag={tag} onClick={changeTagState(tag)} />
                        <Trash size={15} />
                      </CommandItem>
                    ))}
                  </CommandGroup> : null}
                </CommandList>
              </Command>
            </div>
            <FormField
              name="assignedUser"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To Team Member</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        {field.value === "" && <div className="flex gap-2 items-center">
                          <div className="flex h-[2rem] w-[2rem] items-center justify-center rounded-full bg-primary">
                            <UserRound size={15} />
                          </div>
                          <p className="text-muted-foreground">
                            Not Assigned...
                          </p>
                        </div>}
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {data?.users?.map((user: UserInterface) => (
                            <SelectItem value={user._id as string}>
                              <div className="flex items-center gap-x-2">
                                <Avatar className="h-7 w-7">
                                  <AvatarImage src={user?.avatarUrl} />
                                  <AvatarFallback>
                                    {user.name.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                {user.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="customer"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>choose a customer....</SelectLabel>
                          {data?.contacts?.map((contact: UserInterface) => (
                            <SelectItem value={contact._id as string}>
                              {contact.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="w-fit px-7 flex gap-2 mt-4" type="submit">
              {isLoading ? <Loader2 /> : null}
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export function TagButton({
  tag,
  onClick,
  className,
}: {
  tag: TagInterface;
  onClick?: (e: any) => void;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        color: `#${tag.color}`,
        background: `#${tag.color}12`,
      }}
      className={`text-xs py-2 font-bold px-4 rounded-md ${className}`}
    >
      {tag.name}
    </div>
  );
}

export default TicketForm;
