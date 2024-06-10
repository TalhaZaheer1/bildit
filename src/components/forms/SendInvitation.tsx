"use client"
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveActivityLogsNotifications, sendInvitation } from "@/lib/queries";
import { InvitationInterface } from "@/models/Invitation";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type props = {
  agencyId: string;
};

const formSchema = z.object({
  email: z.string().min(1, "How do i send invitation with no email?"),
  role: z.enum([
    "AGENCY_OWNER",
    "AGENCY_ADMIN",
    "SUBACCOUNT_GUEST",
    "SUBACCOUNT_USER",
  ]),
});

const SendInvitation = ({ agencyId }: props) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });
  const handleSubmit = async ({
    email,
    role,
  }: Partial<InvitationInterface>) => {
    try {
      await sendInvitation({
        email,
        role,
        agency: agencyId as string,
      });
      await saveActivityLogsNotifications({
        agencyId,
        description: `Invitation sent to ${email}`,
        subAccountId: undefined,
      });
      toast({
        title: "Invitation sent",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Oopsie...",
        description: "Could not send invitation",
      });
    }
  };
  const isLoading = form.formState.isSubmitting;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitation</CardTitle>
        <CardDescription>
          An invitation will be sent to the user. Users who already have an
          invitation sent out to their email, will not receive another
          invitation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              disabled={isLoading}
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role..." />
                      </SelectTrigger>
                    </FormControl>
                      <SelectContent>
                        <SelectItem value="AGENCY_ADMIN">
                          AGENCY ADMIN
                        </SelectItem>
                        <SelectItem value="SUBACCOUNT_USER">
                          SUBACCOUNT USER
                        </SelectItem>
                        <SelectItem value="SUBACCOUNT_GUEST">
                          SUBACCOUNT GUEST
                        </SelectItem>
                      </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isLoading} type="submit">
              {isLoading && <Loader />} Send Invitation!
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SendInvitation;
