import AgencyDetails from "@/components/forms/AgencyDetails";
import UserDetails from "@/components/forms/UserDetails";
import agencyModel, { AgencyInterface } from "@/models/Agency";
import { SubAccountInterface } from "@/models/SubAccount";
import userModel, { UserInterface } from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

type Props = {
  params: { agencyId: string };
};

const Page = async ({ params }: Props) => {
  const authUser = await currentUser();
  if (!authUser) return null;
  const agencyId = params.agencyId;
  const agencyDetails = (await agencyModel
    .findOne({ _id: agencyId })
    .populate("subAccounts")).toObject({flattenObjectIds:true}) as AgencyInterface;
  if (!agencyDetails) return null;
  const userDetails = (await userModel
    .findOne({
      email: authUser.emailAddresses[0].emailAddress,
    })).toObject({flattenObjectIds:true}) as UserInterface;
  if (!userDetails) return null;

  const subAccounts = agencyDetails.subAccounts as SubAccountInterface[]
  return (
    <div className="flex lg:!flex-row flex-col gap-4">
      <AgencyDetails data={agencyDetails} />
      <UserDetails
        type="agency"
        userData={userDetails}
        subAccounts={subAccounts}
        id={agencyId}
      />
    </div>
  );
};

export default Page;
