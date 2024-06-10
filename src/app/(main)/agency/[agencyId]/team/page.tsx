import agencyModel from "@/models/Agency";
import userModel, { UserInterface } from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";
import UserTable from "./UserTable";
import SendInvitation from "@/components/forms/SendInvitation";
import { coulumnDef } from "./columns";
import { UserInterfaceForTable } from "@/lib/types";
import { Plus } from "lucide-react";

type Props = {
  params: { agencyId: string };
};

const page = async ({ params }: Props) => {
  const authUser = await currentUser();
  if (!authUser) return;
  const agencyUsers = await userModel.find({ agency: params.agencyId }).populate([
      {
        path: "agency",
        populate: {
          path: "subAccounts",
        },
      },
      {
        path: "permissions",
        populate: {
          path: "subAccount",
        },
      },
    ]).lean()
  
  if (!agencyUsers) return;

  return (
    <div>
      <UserTable<UserInterfaceForTable, any>
        data={JSON.parse(JSON.stringify(agencyUsers)) as UserInterfaceForTable[]}
        modularComponent={<SendInvitation agencyId={params.agencyId} />}
        actionButtonText={
          <>
            <Plus size={15} />
            Add
          </>
        }
        filterValue="name"
        columns={coulumnDef}
      />
    </div>
  );
};

export default page;
