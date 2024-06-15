import React from "react";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useModal } from "@/providers/ModalProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTag } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { colorMappings } from "@/lib/constants";
import { Button } from "../ui/button";
import { Loader, Loader2 } from "lucide-react";

type Props = {
  subAccountId: string;
};

const formSchema = z.object({
  name: z.string().min(1, "Please provide a name"),
  color: z.string().min(1, "Please select a color"),
});

const TagForm = ({ subAccountId }: Props) => {
  const { toast } = useToast();
  const router = useRouter();
  const { setClose } = useModal();
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });
  const isLoading = form.formState.isSubmitting;
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const tag = await createTag(values, subAccountId);
      toast({
        title: "Success!",
        description: "Tag created",
      });
      setClose()
      router.refresh()
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "Could not create tag",
      });
    }
  };
  return (
    <Card className="max-w-[400px] overflow-auto">
      <CardHeader>
        <CardTitle>Tag Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-3" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              name="name"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="color"
              disabled={isLoading}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag Color</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {colorMappings.map((color) => (
                            <SelectItem value={color.code}>
                              <div className="flex gap-2">
                                <div
                                  style={{
                                    backgroundColor: `#${color.code}1A`,
                                    border: `1px solid #${color.code}`,
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "5px",
                                  }}
                                ></div>
                                {color.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-fit px-7 flex gap-2 " type="submit">
              {isLoading ? <Loader2 /> : null}
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TagForm;
