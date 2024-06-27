"use client";
import { SubAccountInterface } from "@/models/SubAccount";
import { UserInterface } from "@/models/User";
import { useModal } from "@/providers/ModalProvider";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  getUserDetails as getAuthUserDetails,
  getUserWithPermissions,
  saveActivityLogsNotifications,
  updateUser,
  upsertPermission,
} from "@/lib/queries";
import { AgencyInterface } from "@/models/Agency";
import permissionModel, { PermissionInterface } from "@/models/Permission";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import FileUpload from "../global/FileUpload";
import { Button } from "../ui/button";
import Loading from "../global/loading";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Loader2 } from "lucide-react";

type Props = {
  type: "agency" | "subaccount";
  subAccounts?: SubAccountInterface[];
  userData?: Partial<UserInterface>;
  id: string | null;
};

const formSchema = z.object({
  name: z.string().min(1, "dont have a name? weird"),
  email: z.string(),
  avatarUrl: z.string(),
  role: z.enum([
    "AGENCY_OWNER",
    "AGENCY_ADMIN",
    "SUBACCOUNT_USER",
    "SUBACCOUNT_GUEST",
  ]),
});

const UserDetails = ({ type, subAccounts, userData, id }: Props) => {
  const [userWithPermissions, setUserWithPermissions] =
    useState<UserInterface | null>(null);
  const { data, setClose } = useModal();
  const [roleState, setRoleState] = useState();
  const [authUserDetails, setAuthUserDetails] = useState<UserInterface | null>(
    null
  );
  const [loadingPermission, setLoadingPermission] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const userRole = userData ? userData?.role : data?.user?.role;

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userData?.name || data?.user?.name,
      email: userData?.email || data?.user?.email,
      avatarUrl: userData?.avatarUrl || data?.user?.avatarUrl,
      role: userData?.role || data?.user?.role,
    },
  });

  useEffect(() => {
    if (data?.user) {
      const getAuthUser = async () => {
        const authUser = await getAuthUserDetails();
        setAuthUserDetails(authUser as UserInterface);
      };
      getAuthUser();
    }
  }, [data]);

  useEffect(() => {
    if (
      !data?.user &&
      (userRole === "AGENCY_ADMIN" || userRole === "AGENCY_OWNER")
    )
      return;
    const getPermissions = async () => {
      const user = await getUserWithPermissions(
        userData?._id || data?.user?._id
      );
      setUserWithPermissions(user as UserInterface);
    };
    getPermissions();
  }, [data, form]);

  const onPermissionChange = async (
    permissionUpdates: Partial<PermissionInterface>,
    permissionId: string
  ) => {
    try {
      if (authUserDetails?.role !== "AGENCY_OWNER") return;
      setLoadingPermission(true);
      const subAccountName = await upsertPermission(
        permissionId,
        permissionUpdates
      );
      await saveActivityLogsNotifications({
        agencyId: undefined,
        description: `Access changed to ${
          permissionUpdates.access ? "'granted'" : "'denied'"
        } for ${data?.user.name} | ${subAccountName}`,
        subAccountId: permissionUpdates.subAccount as string,
      });
      setLoadingPermission(false);
      toast({
        title: "Permission changed successfully",
      });
      const user = await getUserWithPermissions(
        data?.user?._id
      );
      setUserWithPermissions(user as UserInterface);
    } catch (err) {
      setLoadingPermission(false);
      console.log(err);
      toast({
        variant: "destructive",
        title: "Oopsie...",
        description: "could not change permission",
      });
    }
  };

  const handleSubmit = async (values: Partial<UserInterface>) => {
    try {
      if (!userData && !data?.user) return;
      const isUpdated = await updateUser(values);
      const userName = userData ? userData?.name : data?.user.name;
      if (userRole === "AGENCY_ADMIN" || userRole === "AGENCY_OWNER") {
        await saveActivityLogsNotifications({
          agencyId: id as string,
          description: `Updated ${values.name} information`,
          subAccountId: undefined,
        });
      } else if (
        userRole === "SUBACCOUNT_USER" ||
        userRole === "SUBACCOUNT_GUEST"
      ) {
        const permissions =
          userWithPermissions?.permissions as PermissionInterface[];
        permissions.forEach(async (perm) => {
          const subAccount = perm.subAccount as SubAccountInterface;
          await saveActivityLogsNotifications({
            agencyId: undefined,
            description: `Updated ${userName} information`,
            subAccountId: subAccount?._id,
          });
        });
      }
      if (isUpdated) {
        toast({
          title: `${userName} details updated`,
        });
        router.refresh();
      }
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Oopsie...",
        description: "Could not update user details",
      });
    }
  };
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User details</CardTitle>
        <CardDescription>Update user information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              disabled={form.formState.isSubmitting}
              name="avatarUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="avatar"
                      onChange={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              name="name"
              control={form.control}
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
              disabled={form.formState.isSubmitting}
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input readOnly={true} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              name="role"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Role</FormLabel>
                  <Select
                    disabled={
                      field.value === "AGENCY_OWNER" || userData ? true : false
                    }
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data?.user?.role === "AGENCY_OWNER" ||
                        (userData?.role === "AGENCY_OWNER" && (
                          <SelectItem value="AGENCY_OWNER">
                            AGENCY_OWNER
                          </SelectItem>
                        ))}
                      <SelectItem value="AGENCY_ADMIN">AGENCY_ADMIN</SelectItem>
                      <SelectItem value="SUBACCOUNT_GUEST">
                        SUBACCOUNT_GUEST
                      </SelectItem>
                      <SelectItem value="SUBACCOUNT_USER">
                        SUBACCOUNT_USER
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? <Loader2 /> : "Save user detials"}
            </Button>
            {authUserDetails?.role === "AGENCY_OWNER" && (
              <div>
                <Separator className="my-4" />
                <FormLabel> User Permissions</FormLabel>
                <FormDescription className="mb-4">
                  You can give Sub Account access to team member by turning on
                  access control for each Sub Account. This is only visible to
                  agency owners
                </FormDescription>
                <div className="flex flex-col gap-4">
                  {subAccounts?.map((subAccount,index) => {
                    const permissions =
                      userWithPermissions?.permissions as PermissionInterface[];
                      console.log(permissions)
                    const relevantPermission = permissions?.find((perm) => {
                      const permSubAccount =
                        perm.subAccount as SubAccountInterface;
                      return permSubAccount._id === subAccount._id;
                    });
                    return (
                      <div key={index} className="flex justify-between items-center p-4 rounded-lg border">
                        <p>{subAccount.name}</p>
                        <Switch
                          disabled={loadingPermission}
                          checked={
                            relevantPermission
                              ? relevantPermission.access
                              : false
                          }
                          onCheckedChange={(value: boolean) =>
                            onPermissionChange(
                              {
                                email: data?.user?.email,
                                subAccount: subAccount?._id,
                                access: value,
                              },
                              relevantPermission?._id ||
                                "7E0D7D586CBA45DA52EDE0AE"
                            )
                          } //random 24 character hex string to be used as objectId value when nothing is provided
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UserDetails;
