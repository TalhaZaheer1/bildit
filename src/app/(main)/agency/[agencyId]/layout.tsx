import Unauthorized from "@/components/global/Unauthorized";
import dbConnect from "@/lib/db";
import { verifyAndAcceptInvitation, getUserDetails, getNotificationsAndUser } from "@/lib/queries";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/sidebar/Sidebar";
import InfoBar from "@/components/global/InfoBar";

type Props = {
  children: React.ReactNode;
  params: { agencyId: string };
};

const layout = async ({ children, params: { agencyId } }: Props) => {
  await dbConnect();
  const authUser = await currentUser();
  if (!authUser) redirect("/");
  const userAgencyId = await verifyAndAcceptInvitation();
  if (!userAgencyId || userAgencyId.toString() !== agencyId)
    redirect("/agency");
  if (
    authUser.privateMetadata.role !== "AGENCY_OWNER" &&
    authUser.privateMetadata.role !== "AGENCY_ADMIN"
  )
    return <Unauthorized />;
  const notifications = await getNotificationsAndUser(userAgencyId)

  return (
    <div>
      <Sidebar id={userAgencyId} type="agency" />
      <div className="md:pl-[300px]">
        <InfoBar  notifications={notifications}/>
      <div className="relative">
        <div 
        id="blur-page"
        className="h-screen overflow-auto backdrop-blur-[35px] dark:bg-muted/40 bg-muted/60 dark:shadow-2xl dark:shadow-black  mx-auto pt-24 p-4 absolute top-0 right-0 left-0 botton-0 z-0 md:z-[11]">
      {children}
      </div>
      </div>
      
      </div>
    </div>
  );
};

export default layout;
