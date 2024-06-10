import { getUserDetails } from "@/lib/queries";
import MenuOptions from "./Menu-Options";
type Props = {
  id: string;
  type: "agency" | "subaccount";
};

const Sidebar = async ({ id, type }: Props) => {
  const user = await getUserDetails()
  if (!user) return;
  if (!user.agency) return;
  const details =
    type === "agency"
      ? user.agency
      : user.agency.subAccounts.find((subAccount) => subAccount._id === id);
  let logo;
  if (!user.agency.whiteLabel) {
    if (type === "subaccount") {
      logo = details.subAccountLogo;
    } else {
      logo = details.agencyLogo;
    }
  } else {
    logo = details.agencyLogo;
  }
  const subAccounts = user.agency.subAccounts.filter((subAccount) =>
    user.permissions.find(
      (permission) => permission.subAccount === subAccount._id
    )
  );

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        subAccounts={subAccounts}
        logo={logo}
        details={details}
        sidebarOptions={details.sidebarOptions}
        user={user}
      />
      <MenuOptions
        subAccounts={subAccounts}
        logo={logo}
        details={details}
        sidebarOptions={details.sidebarOptions}
        user={user}
      />
    </>
  );
};

export default Sidebar;
