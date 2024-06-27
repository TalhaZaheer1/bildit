"use client"
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import { UserInterfaceForTable } from "@/lib/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useModal } from "@/providers/ModalProvider";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import CustomModal from "@/components/global/CustomModal";
import UserDetails from "@/components/forms/UserDetails";
import { deleteUser, getUserById } from "@/lib/queries";

export const coulumnDef: ColumnDef<UserInterfaceForTable>[] = [
  {
    accessorKey: "_id",
    header: "",
    cell: () => null,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 relative flex-none">
            <Image
              alt="profile pic"
              src={row.getValue("avatarUrl")}
              className="rounded-full object-contain"
              fill
            />
          </div>
          <span>{row.getValue("name")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "avatarUrl",
    header: "",
    cell: () => null,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "SubAccount",
    header: "Own Accounts",
    cell: ({ row }) => {
      const isAgencyOwner = row.getValue("role") === "AGENCY_OWNER";
      const truePermissions = row.original?.permissions.filter((p) => p.access);
      if (isAgencyOwner)
        return (
          <div className="flex flex-col items-start">
            <div className="flex flex-col gap-2">
              <Badge>Agency - {row.original?.agency.name}</Badge>
            </div>
          </div>
        );
      return (
        <div>
          <div>
            {truePermissions.length ? (
              truePermissions.map((p,index) => (
                <Badge key={index}>Sub Account - {p?.subAccount.name}</Badge>
              ))
            ) : (
              <div className="text-muted-foreground">No Access yet</div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge
          className={clsx({
            "bg-emerald-500": role === "AGENCY_OWNER",
            "bg-orange-400": role === "AGENCY_ADMIN",
            "bg-primary": role === "SUBACCOUNT_USER",
            "bg-muted": role === "SUBACCOUNT_GUEST",
          })}
        >
          {role}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <CellAction rowData={row.original} />;
    },
  },
];

function CellAction({ rowData }: { rowData: UserInterfaceForTable }) {
  const { setOpen } = useModal();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  if (!rowData) return;
  if (!rowData.agency) return;
  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(rowData.email)}
          >
            <Copy size={15} /> Copy Email
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              setOpen(
                <CustomModal
                  title="Edit user details"
                  subheading="You can also change permissions"
                  defaultOpen={false}
                >
                  <UserDetails
                    type="agency"
                    id={rowData.agency._id}
                    subAccounts={rowData.agency.subAccounts}
                  />
                </CustomModal>,
                async () => {
                  return { user: await getUserById(rowData._id as string) };
                }
              )
            }
          >
            <Edit /> Edit details
          </DropdownMenuItem>
          {rowData.role !== "AGENCY_OWNER" && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
              className="flex gap-2"
              >
                <Trash size={15}/> Remove User
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
            </AlertDialogDescription>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                disabled={loading}
                onClick={async () => {
                    try{
                        setLoading(true)
                        const res = await deleteUser(rowData?._id as string)
                        setLoading(false)
                        if(res?.isDeleted)
                            toast({
                                title:"User Deleted"
                            })
                        else toast({
                            variant:"destructive",
                            title:"Oopsie...",
                            description:"Could not delete user"
                        })
                        router.refresh()
                    }catch(err){
                        setLoading(false)
                        toast({
                            variant:"destructive",
                            title:"Oopsie...",
                            description:"Could not delete user"
                        })
                    }
                }}
                >
                    DELETE
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
