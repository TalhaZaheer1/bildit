"use client"
import * as z from "zod";

import React, { useEffect } from "react";
import { SubAccountInterface } from "@/models/SubAccount";
import { useModal } from "@/providers/ModalProvider";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import FileUpload from "../global/FileUpload";
import { toast } from "../ui/use-toast";
import { AgencyInterface } from "@/models/Agency";
import { saveActivityLogsNotifications, upsertSubAccount } from "@/lib/queries";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  agency: Partial<AgencyInterface>;
  details?: Partial<SubAccountInterface>;
  userId?: string;
  userName: string;
};

const formSchema = z.object({
  name: z.string().min(2, "Sub Account name should be atleast two characters"),
  subAccountLogo: z.string().min(1, "Logo is required"),
  companyEmail: z.string().min(1, "Email is required"),
  companyPhone: z.string().min(1, "Phone Number is required"),
  address: z.string().min(1, "Correct address is required"),
  city: z.string().min(1, "Provide a city name"),
  country: z.string().min(1, "Provide a country name"),
  zipCode: z.string().min(1, "Provide a Zip Code"),
  state: z.string().min(1, "Provide a state name"),
});

const SubAccountDetails: React.FC<Props> = ({
  agency,
  details,
  userId,
  userName,
}: Props) => {
  const { setClose } = useModal();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    defaultValues: {
      name: details?.name || "",
      subAccountLogo: details?.subAccountLogo || "",
      companyEmail: details?.companyEmail || "",
      companyPhone: details?.companyPhone || "",
      address: details?.address || "",
      city: details?.city || "",
      country: details?.country || "",
      zipCode: details?.zipCode || "",
      state: details?.state || "",
    },
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (details) form.reset(details);
  }, [details]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formSubAccountData: Partial<SubAccountInterface> = {
        ...values,
        agency: agency._id,
        goal: 5,
      };
      const response = await upsertSubAccount(formSubAccountData);
      if (!response) throw new Error("no response from server");
      await saveActivityLogsNotifications({
        agencyId: response.agency,
        description: `${userName} | updated sub account | ${response.name}`,
        subAccountId: response._id,
      });
      toast({
        title: "Sub Account Created",
        description: "Successfully saved your subaccount details.",
      });
      setClose()
      router.refresh();
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Oopsi..",
        description: "Could not create/update sub account",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sub Account information</CardTitle>
        <CardDescription>Please enter business details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form 
            className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              disabled={isLoading}
              name="subAccountLogo"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Logo</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="subAccountLogo"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="md:flex justify-between gap-2">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Sub Account Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="companyEmail"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Sub Account Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="companyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Account Phone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2 md:space-y-0 md:flex md:justify-between md:items-center gap-6">
              <FormField
                disabled={isLoading}
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Zipcode</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              disabled={isLoading}
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-blue-700" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Sub Account Information
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SubAccountDetails;
