import { AgencyInterface } from "@/models/Agency";
import { getUserWithPermissions } from "./queries";
import { UserInterface } from "@/models/User";
import { PermissionInterface } from "@/models/Permission";
import { SubAccountInterface } from "@/models/SubAccount";
import { MediaInterface } from "@/models/Media";
import { z } from "zod";
import { PipelineInterface } from "@/models/Pipeline";
import { LaneInterface } from "@/models/Lane";
import { TicketInterface } from "@/models/Ticket";
import { TagInterface } from "@/models/Tag";
import { ContactInterface } from "@/models/Contact";

interface AgencyInterfaceForTable extends AgencyInterface {
  subAccounts: SubAccountInterface[];
}
interface PermissionInterfaceForTable extends PermissionInterface {
  subAccount: SubAccountInterface;
}

export interface TicketDetailsInterface extends TicketInterface {
  assignedUser:UserInterface;
  tags: TagInterface[];
  customer:ContactInterface
}

export interface LaneDetailsInterface extends LaneInterface {
  tickets: TicketDetailsInterface[];
}

export interface SubAccountInterfaceWithMedia extends SubAccountInterface {
  media: MediaInterface[];
}

export interface UserInterfaceForTable extends UserInterface {
  agency: AgencyInterfaceForTable;
  permissions: PermissionInterfaceForTable[];
}

export interface PipelineDetailsInterface extends PipelineInterface {
  lanes: LaneDetailsInterface[];
}

export type Role =
  | "AGENCY_OWNER"
  | "AGENCY_ADMIN"
  | "SUBACCOUNT_USER"
  | "SUBACCOUNT_GUEST";

export type Plan =
  | "price_1OYxkqFj9oKEERu1NbKUxXxN"
  | "price_1OYxkqFj9oKEERu1KfJGWxgN";

export type SidebarOption = {
  name: string;
  link: string;
  icon: string;
};

export type Address = {
  city: string;
  country: string;
  line1: string;
  postal_code: string;
  state: string;
};

export type ShippingInfo = {
  address: Address;
  name: string;
};

export type StripeCustomerType = {
  email: string;
  name: string;
  shipping: ShippingInfo;
  address: Address;
};

export const laneFormSchema = z.object({
  name:z.string().min(1,"Please provide a name"),
})

export const pipeLineFormSchema = z.object({
  name: z.string().min(1, "How will you create it without a name"),
});
