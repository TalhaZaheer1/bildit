import SubAccountDetails from "@/components/forms/SubAccountDetails";
import { AgencyInterface } from "@/models/Agency";
import subAccountModel, { SubAccountInterface } from "@/models/SubAccount";
import userModel, { UserInterface } from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: { id: string };
};

const Settings = async ({ params }: Props) => {
  const authUser = await currentUser();
  if (!authUser) redirect("/");
  const userWithName = await userModel.findOne(
    { email: authUser.emailAddresses[0].emailAddress },
    { _id: 0, name: 1 }
  ).lean() as Partial<UserInterface>;
  const subAccount = await subAccountModel
    .findOne({ _id: params.id })
    .populate("agency", "_id")
    .lean() as SubAccountInterface;

  return <div>
    <SubAccountDetails 
    userName={userWithName.name as string}
    details={JSON.parse(JSON.stringify(subAccount))}
    agency={JSON.parse(JSON.stringify(subAccount.agency as Partial<AgencyInterface>))}
    />
  </div>;
};

export default Settings;
