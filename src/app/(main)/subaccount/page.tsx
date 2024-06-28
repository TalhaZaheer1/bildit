import Unauthorized from "@/components/global/Unauthorized";
import dbConnect from "@/lib/db";
import { getUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import { PermissionInterface } from "@/models/Permission";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  searchParams: { state: string; code: string };
};

const page = async ({ searchParams }: Props) => {
  await dbConnect()
  const agencyId = await verifyAndAcceptInvitation();
    if(!agencyId) return <Unauthorized />
    const user =  await getUserDetails()
    const firstSubAccountId = user.permissions.find((p:PermissionInterface) => p.access)?.subAccount
    console.log(searchParams)
    if(searchParams.state){
        if(!firstSubAccountId)
            return <Unauthorized />
    const statePath = searchParams.state?.split("___")[0];
    const stateSubAccountId = searchParams.state?.split("___")[1];
    if(!stateSubAccountId)
        return <Unauthorized />
    return redirect(`/subaccount/${stateSubAccountId}/${statePath}?code=${searchParams.code}`)
    }
    if(firstSubAccountId)
        return redirect(`/subaccount/${firstSubAccountId}`);
  return <Unauthorized />;
};

export default page;
