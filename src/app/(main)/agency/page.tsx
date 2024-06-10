import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Plan } from "@/lib/types";
import dbConnect from "@/lib/db";
import { verifyAndAcceptInvitation, getUserDetails } from "@/lib/queries";
import AgencyDetails from "@/components/forms/AgencyDetails";

async function Agency({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) {
  await dbConnect()
  await verifyAndAcceptInvitation();
  const teamUser = await getUserDetails();
  if (teamUser) {
    if (
      teamUser.role === "SUBACCOUNT_USER" ||
      teamUser.role === "SUBACCOUNT_GUEST"
    ) {
      return redirect("/subaccount");
    }
    if (teamUser.role === "AGENCY_OWNER" || teamUser.role === "AGENCY_ADMIN") {
      if (searchParams.plan) {
        return redirect(
          `/agency/${teamUser.agency._id}?plan=${searchParams.plan}`
        );
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split("___")[0];
        const stateAgencyId = searchParams.state.split("___")[1];
        if (!stateAgencyId) return <div>Not Authorized</div>;
        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        );
      } else {
        return redirect(`/agency/${teamUser.agency._id}`);
      }
    } else {
      return <div>Not Authorized</div>;
    }
  }
  const authUser = await currentUser();
  return (
    <div className= "flex justify-center mt-4">
      <div className="max-w-[850px] w-full border-[1px] p-4 rounded-xl">
        <h1 className="text-4xl mb-3">Create An Agency</h1>
        <AgencyDetails
          data={{ companyEmail: authUser?.emailAddresses[0].emailAddress }}
        />
      </div>
    </div>
  );
}

export default Agency;
