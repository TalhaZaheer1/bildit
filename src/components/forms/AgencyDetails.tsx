"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";

import FileUpload from "../global/FileUpload";
import { useEffect, useState } from "react";
import { AgencyInterface } from "@/models/Agency";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Form,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { NumberInput } from "@tremor/react";
import {
  deleteAgency,
  saveActivityLogsNotifications,
  updateAgencyDetails,
  initUser,
  upsertAgency,
} from "@/lib/queries";

const formSchema = z.object({
  name: z.string().min(2, "Agency name should be atleast two characters"),
  companyEmail: z.string().min(1),
  companyPhone: z.string().min(1),
  whiteLabel: z.boolean(),
  agencyLogo: z.string(),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
});

type Props = {
  data?: Partial<AgencyInterface>;
};

const AgencyDetails = ({ data }: Props) => {
  console.log(data)
  const { toast } = useToast();
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    defaultValues: {
      name: data?.name || "",
      companyEmail: data?.companyEmail || "",
      companyPhone: data?.companyPhone || "",
      whiteLabel: data?.whiteLabel,
      agencyLogo: data?.agencyLogo || "" ,
      address: data?.address || "",
      city: data?.city || "",
      zipCode: data?.zipCode || "",
      state: data?.state || "",
      country: data?.country || "",
    },
    resolver: zodResolver(formSchema),
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) form.reset(data);
  }, [data]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      let newUserData;
      let custId="sakd";
      if (!data?._id) {
        // const stripeData = {
        //   name: values.name,
        //   email: values.companyEmail,
        //   shipping: {
        //     address: {
        //       city: values.city,
        //       country: values.country,
        //       line1: values.address,
        //       state: values.zipCode,
        //       postal_code: values.zipCode,
        //     },
        //     name: values.name,
        //   },
        //   address: {
        //     city: values.city,
        //     country: values.country,
        //     line1: values.address,
        //     state: values.zipCode,
        //     postal_code: values.zipCode,
        //   },
        // };
        // const res = await axios.post("/api/strip/create-customer", stripeData);
        // custId = res.data.customerId;
        newUserData = await initUser({ role: "AGENCY_OWNER" });
      }
      if (!data?.customerId && !custId) return;
      console.log("asdhjasdkjdahs")
      const response = await upsertAgency(
        {
          name: values.name,
          companyEmail: values.companyEmail,
          customerId: data?.customerId || custId || "",
          agencyLogo: values.agencyLogo,
          companyPhone: values.companyPhone,
          whiteLabel: values.whiteLabel,
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country,
          goal: 5,
          zipCode: values.zipCode,
        },
      );
      toast({
        title:"Agency Created",
      })
      if(data?.id) return router.refresh()
      if(response) return router.refresh()
    } catch (err) {
      toast({
        variant: "destructive",
        title:"Oppse!",
        description:"could not create your agency"
      });
    }
  };

  async function handleDeleteAgency() {
    if (!data?._id) return;
    try {
      setDeletingAgency(true);
      const res = await deleteAgency(data?._id);
      toast({
        title: "Deleted Agency",
        description: "Deleted your Agency and all subAccounts",
      });
      router.refresh();
    } catch (err) {
      setDeletingAgency(false);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong",
        description: "Could not delete agency",
      });
    }
  }

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>Provide details for your agency</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="agencyLogo"
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
                      <FormLabel>Agency Name</FormLabel>
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
                      <FormLabel>Agency Email</FormLabel>
                      <FormControl>
                        <Input
                        readOnly={true}
                        {...field} />
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
                    <FormLabel>Agency Phone</FormLabel>
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
                name="whiteLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>White Label</FormLabel>
                    <div className="flex justify-between">
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
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
              {data?._id && (
                <div className="flex flex-col gap-2">
                  <FormLabel>Create a goal</FormLabel>
                  <FormDescription>
                    ✨ Create a goal for your agency. As your business grows
                    your goals grow too so dont forget to set the bar higher!
                  </FormDescription>
                  <NumberInput
                    defaultValue={data?.goal}
                    onValueChange={async (val: number) => {
                      if (!data?._id) return;
                      await updateAgencyDetails(data?._id, { goal: val });
                      await saveActivityLogsNotifications({
                        agencyId: data?._id,
                        description: `Agency goal updated | ${val} is the new goal`,
                        subAccountId: undefined,
                      });
                    }}
                    min={1}
                    className="bg-background !border !border-input"
                    placeholder="Sub Account Goal"
                  />
                </div>
              )}
              <Button
                type="submit"
                className="bg-blue-700"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Agency Information
              </Button>
            </form>
          </Form>
          {data?._id && (
            <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
              <div>
                <div>Danger Zone</div>
              </div>
              <div className="text-muted-foreground">
                Deleting your agency cannpt be undone. This will also delete all
                sub accounts and all data related to your sub accounts. Sub
                accounts will no longer have access to funnels, contacts etc.
              </div>
              <AlertDialogTrigger
                disabled={isLoading || deletingAgency}
                className="text-red-600 p-2 text-center mt-2 rounded-md hove:bg-red-600 hover:text-white whitespace-nowrap"
              >
                {deletingAgency ? "Deleting" : "Delete Agency"}
              </AlertDialogTrigger>
            </div>
          )}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-left">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                Agency account and all related sub accounts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={deletingAgency}
                className="bg-destructive hover:bg-destructive"
                onClick={handleDeleteAgency}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default AgencyDetails;
