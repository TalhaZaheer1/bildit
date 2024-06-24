import { useModal } from "@/providers/ModalProvider";
import { useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import { useForm } from "react-hook-form";
import { ContactInterface } from "@/models/Contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { pulsar } from "ldrs";
import { upsertContact } from "@/lib/queries";

pulsar.register();

type Props = {
  contactData?: Partial<ContactInterface>;
  subAccountId: string;
};

const formSchema = z.object({
  name: z.string().min(1, "Please provide a name"),
  email: z.string().min(1, "Please provide an email"),
});

const ContactForm = ({ subAccountId, contactData }: Props) => {
  const { setClose } = useModal();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: contactData?.name || "",
      email: contactData?.email || "",
    },
  });
  const isLoading = form.formState.isSubmitting;
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const tag = await upsertContact({
        ...values,
        subAccount:subAccountId
      });
      toast({
        title: "Success!",
        description: `Comtact ${contactData ? "updated" : "created"}`,
      });
      setClose()
      router.refresh()
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed!",
        description: `Could not ${contactData ? "update" : "create"} contact`,
      });
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              disabled={isLoading}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button className="flex gap-1 w-fit px-8" disabled={isLoading} type="submit">
              {isLoading ? (
                <l-pulsar size="20" speed="1.75" color="white"></l-pulsar>
              ) : null}
              Save
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
