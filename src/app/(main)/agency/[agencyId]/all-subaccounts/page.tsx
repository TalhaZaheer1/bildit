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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { getUserDetails } from "@/lib/queries";
import { SubAccountInterface } from "@/models/SubAccount";
import CreateSubAccountButton from "@/components/global/CreateSubAccountButton";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import DeleteSubAccountButton from "@/components/global/DeleteSubAccountButton";
import dbConnect from "@/lib/db";

type Props = {
  params: { agencyId: string };
};

const SubAccountsPage = async ({ params }: Props) => {
  await dbConnect()
  const user = await getUserDetails();
  if (!user) return;

  return (
    <AlertDialog>
      <div className="flex flex-col">
        <CreateSubAccountButton 
        user={user}
        id={params.agencyId}
        className="w-[200px] self-end m-6"
        />
        <Command className="rounded-lg bg-transparent">
          <CommandInput placeholder="Search Account..." />
          <CommandList>
          {user?.agency?.subAccounts.length > 0 && <CommandEmpty>No results found...</CommandEmpty>}
            <CommandGroup heading="Sub Accounts">
              {user?.agency?.subAccounts.length > 0 ? user?.agency?.subAccounts.map(
                (subAccount: SubAccountInterface) => (
                  <CommandItem
                    key={subAccount._id}
                    className="h-32 !bg-background my-2 text-primary border-[1px] border-border p-4 rounded-lg hover:!bg-background cursor-pointer transition-all"
                  >
                    <Link
                      href={`/subaccount/${subAccount?._id}`}
                      className="flex gap-4 w-full h-full"
                    >
                      <div className="relative w-32">
                        <Image
                          alt="sub account logo"
                          src={subAccount.subAccountLogo as string}
                          className="rounded-md object-contain bg-muted/50 p-4"
                          fill
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <div className="flex flex-col">
                          {subAccount.name}
                          <span className="text-muted-foreground text-xs">
                            {subAccount.address}
                          </span>
                        </div>
                      </div>
                    </Link>
                    <AlertDialogTrigger>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="w-20 hover:bg-red-600 hover:text-white !text-white"
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-left">
                          Are you absolutely sure
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-left">
                          This action cannot be undon. This will delete the
                          subaccount and all data related to the subaccount.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex items-center">
                        <AlertDialogCancel className="mb-2">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive">
                          <DeleteSubAccountButton subAccountId={subAccount._id}/>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </CommandItem>
                )
              ) : (
                <div className="text-muted-foreground text-center p-4">
                  No sub accounts
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </AlertDialog>
  );
};

export default SubAccountsPage;
