"use server";
//mongo models
import "@clerk/nextjs"
import mongoose, { Types, ClientSession } from "mongoose";
import permissionModel, { PermissionInterface } from "@/models/Permission";
import invitationModel from "@/models/Invitation";
import userModel, { UserInterface } from "@/models/User";
import notificationModel from "@/models/Notification";
import subAccountModel, { SubAccountInterface } from "@/models/SubAccount";
import agencyModel, { AgencyInterface } from "@/models/Agency";
import { redirect } from "next/navigation";
import pipelineModel, { PipelineInterface } from "@/models/Pipeline";
import { InvitationInterface } from "@/models/Invitation";
import mediaModel, { MediaInterface } from "@/models/Media";
import { LaneDetailsInterface, TicketDetailsInterface } from "./types";
import laneModel, { LaneInterface } from "@/models/Lane";
import ticketModel, { TicketInterface } from "@/models/Ticket";
import TagModal, { TagInterface } from "@/models/Tag";
import contactModel, { ContactInterface } from "@/models/Contact";
import funnelModel from "@/models/Funnel";
import { FunnelInterface } from "@/models/Funnel";
import funnelPageModel, { FunnelPageInterface } from "@/models/FunnelPage";
import { revalidatePath } from "next/cache";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { isRedirectError } from "next/dist/client/components/redirect";

async function createTeamUser(user: any) {
  if (user.role === "AGENCY_OWNER") return;
  try {
    const authUser = await currentUser();
    const newUser = await userModel.create(user);
    const res = await agencyModel.updateOne(
      { _id: user.agency },
      { $push: { users: newUser._id } }
    );
    await clerkClient.users.updateUserMetadata(authUser?.id, {
      privateMetadata: {
        role: user.role || "SUBACCOUNT_USER",
      },
    });
    return newUser;
  } catch (err) {
    console.log("user error", err);
  }
}

async function saveActivityLogsNotifications({
  agencyId,
  description,
  subAccountId,
}: {
  agencyId?: string;
  description: string;
  subAccountId?: string;
}) {
  try{
    const authUser = await currentUser();
  let userDetails;
  if (!authUser) {
    //in case of contacts(leads) since they are not signed in
    const res = await userModel.aggregate([
      {
        $lookup: {
          from: "Agency",
          localField: "agency",
          foreignField: "_id",
          as: "joinedAgency",
        },
      },
      {
        $unwind: "$joinedAgency",
      },
      {
        $match: {
          "joinedAgency.subAccounts": { $in: [subAccountId] },
        },
      },
      {
        $limit: 1,
      },
    ]);
    if (res) userDetails = res[0];
  } else {
    userDetails = await userModel.findOne(
      {
        email: authUser.emailAddresses[0].emailAddress,
      },
      { _id: 1, name: 1 }
    );
  }
  if (!userDetails) {
    console.log("Could not find a user | notification API");
    return;
  }
  let subAccount: any;
  let foundAgencyId;
  if (!agencyId) {
    if (!subAccountId) {
      throw new Error("provide atleast one of two:agencyId or subAccountId");
    }
    subAccount = await subAccountModel.findOne({
      _id: subAccountId,
    });
    foundAgencyId = subAccount.agency;
    const newNotification = await notificationModel.create({
      notification: `${userDetails.name} | ${description}`,
      user: userDetails._id,
      agency: foundAgencyId,
      subAccount: subAccountId,
    });
    const agency: any = await agencyModel.findOne({
      _id: foundAgencyId,
    });
    const isUpdated = await userModel.updateOne(
      { _id: userDetails._id },
      {
        $push: { notifications: newNotification._id },
      }
    );
    if (subAccount.notifications)
      subAccount.notifications.push(newNotification._id);
    else subAccount.notifications = [newNotification._id];
    await subAccount.save();
    if (agency.notifications) agency.notifications.push(newNotification._id);
    else agency.notifications = [newNotification._id];
    await agency.save();
  } else {
    const newNotification = await notificationModel.create({
      notification: description || userDetails.name,
      user: userDetails._id,
      agency: agencyId,
    });
    const agency: any = await agencyModel.findOne({
      _id: agencyId,
    });
    const isUpdated = await userModel.updateOne(
      { _id: userDetails._id },
      {
        $push: { notifications: newNotification._id },
      }
    );
    if (agency.notifications) agency.notifications.push(newNotification._id);
    else agency.notifications = [newNotification._id];
    await agency.save();
  }
}catch(err){
  console.log(err)
}
}

async function verifyAndAcceptInvitation() {
  const authUser = await currentUser();
  if (!authUser) return redirect("/sign-in");
  const invitation = await invitationModel.findOne({
    email: authUser.emailAddresses[0].emailAddress,
    status: "PENDING",
  });
  if (invitation) {
    const newUser = await createTeamUser({
      agency: invitation.agency,
      name: `${authUser.firstName} ${authUser.lastName}`,
      email: invitation.email,
      role: invitation.role,
      avatarUrl: authUser.imageUrl,
    });
    await saveActivityLogsNotifications({
      description: `${authUser.firstName} ${authUser.lastName} joined as ${invitation.role}`,
      agencyId: invitation.agency.toString(),
      subAccountId: undefined,
    });

    const deleted = await invitationModel.deleteOne({
      _id: invitation._id,
    });

    return newUser?.agency;
  }
  const user = (await userModel
    .findOne({
      email: authUser.emailAddresses[0].emailAddress,
    })
    .lean()) as Partial<UserInterface>;
  return user?.agency;

}

async function getUserDetails() {
  try{
  const authUser = await currentUser();
  if (!authUser) return;
  const userDetails = await userModel
    .findOne({
      email: authUser.emailAddresses[0].emailAddress,
    })
    .populate([
      {
        path: "agency",
        populate: {
          path: "subAccounts",
        },
      },
      {
        path: "permissions",
      },
    ]);

  return JSON.parse(JSON.stringify(userDetails)) || null;
  }catch(err){
    console.log(err)
  }
}

async function updateAgencyDetails(
  agencyId: string,
  updates: Partial<AgencyInterface>
) {
  const isUpdated = await agencyModel.updateOne(
    { _id: agencyId },
    { ...updates }
  );
}

async function deleteAgency(agencyId: string): Promise<any> {
  try {
    const isAgencyDeleted = await agencyModel.deleteOne({ _id: agencyId });
    const isSubAccountsDeleted = await subAccountModel.deleteMany({
      agency: agencyId,
    });
    return isSubAccountsDeleted;
  } catch (err) {
    return err;
  }
}

async function initUser(user: Partial<UserInterface>) {
  const authUser = await currentUser();
  if (!authUser) return;
  const newOrUpdatedUser = await userModel.updateOne(
    { email: authUser.emailAddresses[0].emailAddress },
    {
      email: authUser.emailAddresses[0].emailAddress,
      name: `${authUser.firstName} ${authUser.lastName}`,
      avatarUrl: authUser.imageUrl,
      role: user.role || "SUBACCOUNT_USER",
    },
    {
      upsert: true,
      returnOriginal: false,
    }
  );
  await clerkClient.users.updateUserMetadata(authUser.id, {
    privateMetadata: {
      role: user.role || "SUBACCOUNT_USER",
    },
  });
  return {
    matchCount: newOrUpdatedUser.matchedCount,
    upsertedCount: newOrUpdatedUser.upsertedCount,
  };
}

async function upsertAgency(
  agencyDetails: Partial<AgencyInterface>,
  price?: string
) {
  if (!agencyDetails.companyEmail) return null;
  try {
    const updateDetails = await agencyModel.updateOne(
      { companyEmail: agencyDetails.companyEmail },
      agencyDetails,
      {
        upsert: true,
      }
    );
    if (updateDetails.matchedCount > 0) return updateDetails;
    const user = await userModel.findOne({ email: agencyDetails.companyEmail });
    const newAgency = await agencyModel.findOne({
      companyEmail: agencyDetails.companyEmail,
    });
    const updatedUser = await userModel.updateOne(
      { email: agencyDetails.companyEmail },
      { agency: newAgency._id }
    );
    newAgency.users.push(user._id);
    const sideBarOptions = [
      { name: "Dashboard", icon: "category", link: `/agency/${newAgency._id}` },
      {
        name: "Launchpad",
        icon: "clipboardIcon",
        link: `/agency/${newAgency._id}/launchpad`,
      },
      {
        name: "Billing",
        icon: "payment",
        link: `/agency/${newAgency._id}/billing`,
      },
      {
        name: "Settings",
        icon: "settings",
        link: `/agency/${newAgency._id}/settings`,
      },
      {
        name: "Sub Accounts",
        icon: "person",
        link: `/agency/${newAgency._id}/all-subaccounts`,
      },
      { name: "Team", icon: "shield", link: `/agency/${newAgency._id}/team` },
    ];
    newAgency.sidebarOptions = sideBarOptions;
    const res = await newAgency.save();
    if (res)
      return {
        msg: "agency created",
      };
  } catch (err) {
    console.log(err);
    return {
      err: "internal error",
    };
  }
}

async function upsertSubAccount(subAccount: Partial<SubAccountInterface>) {
  const agencyOwner = (await userModel.findOne({
    agency: subAccount.agency,
    role: "AGENCY_OWNER",
  })) as UserInterface;
  if (!agencyOwner) return;
  const res = await subAccountModel.findOneAndUpdate(
    { companyEmail: subAccount.companyEmail },
    subAccount,
    {
      upsert: true,
      new: true,
    }
  );
  if (res.matchedCount > 0) return;
  const createdSubAccount = await subAccountModel.findOne(
    { companyEmail: subAccount.companyEmail },
    { _id: 1 }
  );
  const createdPermission = await permissionModel.create({
    email: agencyOwner.email,
    subAccount: createdSubAccount._id,
    access: true,
  });
  const createdPipeline = await pipelineModel.create({
    name: "Lead Cycle",
    subAccount: createdSubAccount._id,
  });
  if (createdSubAccount.permissions)
    createdSubAccount.permissions.push(createdPermission._id);
  else createdSubAccount.permissions = [createdPermission._id];
  if (createdSubAccount.pipelines)
    createdSubAccount.pipelines.push(createdPermission._id);
  else createdSubAccount.pipelines = [createdPipeline._id];
  const defaultSidebarOptions = [
    {
      name: "Launchpad",
      icon: "clipboardIcon",
      link: `/subaccount/${createdSubAccount._id}/launchpad`,
    },
    {
      name: "Settings",
      icon: "settings",
      link: `/subaccount/${createdSubAccount._id}/settings`,
    },
    {
      name: "Funnels",
      icon: "pipelines",
      link: `/subaccount/${createdSubAccount._id}/funnels`,
    },
    {
      name: "Media",
      icon: "database",
      link: `/subaccount/${createdSubAccount._id}/media`,
    },
    {
      name: "Automations",
      icon: "chip",
      link: `/subaccount/${createdSubAccount._id}/automations`,
    },
    {
      name: "Pipelines",
      icon: "flag",
      link: `/subaccount/${createdSubAccount._id}/pipelines`,
    },
    {
      name: "Contacts",
      icon: "person",
      link: `/subaccount/${createdSubAccount._id}/contacts`,
    },
    {
      name: "Dashboard",
      icon: "category",
      link: `/subaccount/${createdSubAccount._id}`,
    },
  ];
  createdSubAccount.sidebarOptions = defaultSidebarOptions;
  await createdSubAccount.save();
  const isUserUpdated = await userModel.findByIdAndUpdate(agencyOwner._id, {
    $push: { permissions: createdPermission._id },
  });
  const agency = await agencyModel.updateOne(
    { _id: subAccount.agency },
    {
      $push: { subAccounts: createdSubAccount._id },
    }
  );
  return createdSubAccount.toObject({ flattenObjectIds: true });
}

async function getNotificationsAndUser(agencyId: string) {
  try {
    const notifications = await notificationModel
      .find(
        {
          agency: agencyId,
        },
        { _id: 0, __v: 0 }
      )
      .populate("user")
      .sort([["createdAt", -1]])
      .lean();
    return JSON.parse(JSON.stringify(notifications));
  } catch (err) {
    console.log(err);
  }
}

async function getUserWithPermissions(userId: string) {
  try {
    const userWithPermissions = await userModel
      .findOne({ _id: userId })
      .populate([
        {
          path: "permissions",
          populate: {
            path: "subAccount",
          },
        },
      ])
      .lean();
    return JSON.parse(JSON.stringify(userWithPermissions));
  } catch (err) {
    console.log(err);
  }
}

async function upsertPermission(
  permissionId: string,
  permissionUpdates: Partial<PermissionInterface>
) {
  try {
    const isUpserted = await permissionModel
      .findByIdAndUpdate(
        permissionId,
        {
          ...permissionUpdates,
        },
        {
          upsert: true,
          includeResultMetadata: true,
          new: true,
        }
      )
      .lean();
    console.log(isUpserted);
    if (!isUpserted.lastErrorObject.updatedExisting) {
      const notif = isUpserted.value;
      await userModel
        .updateOne(
          { email: notif.email },
          {
            $push: { permissions: notif._id },
          }
        )
        .lean();
      const subAccount = (await subAccountModel
        .findByIdAndUpdate(notif.subAccount, {
          $push: { permissions: notif._id },
        })
        .lean()) as Partial<SubAccountInterface>;
      return subAccount?.name?.toString();
    }
    const subAccount = (await subAccountModel
      .findById(isUpserted.value.subAccount, { name: 1 })
      .lean()) as Partial<SubAccountInterface>;
    console.log(subAccount);
    return subAccount?.name;
  } catch (err) {
    console.log(err);
  }
}

async function updateUser(userUpdates: Partial<UserInterface>) {
  try {
    const isUpdated = await userModel
      .updateOne(
        { email: userUpdates.email },
        {
          ...userUpdates,
        },
        {
          upsert: true,
        }
      )
      .lean();
    return isUpdated;
  } catch (err) {
    console.log(err);
  }
}

async function deleteSubAccount(subAccountId: string) {
  try {
    const isAccDeleted = await subAccountModel.deleteOne({ _id: subAccountId });
    const isNotificationDeleted = await notificationModel.deleteMany({
      subAccount: subAccountId,
    });
    const isPermissionDeleted = await permissionModel.deleteMany({
      subAccount: subAccountId,
    });
    return {
      isDeleted: true,
    };
  } catch (err) {
    console.log(err);
    return {
      isDeleted: false,
    };
  }
}

async function getUserById(userId: string) {
  try {
    const user = await userModel.findOne({ _id: userId }).lean();
    return JSON.parse(JSON.stringify(user));
  } catch (err) {
    console.log(err);
  }
}

async function deleteUser(userId: string) {
  try {
    const authUser = await currentUser();
    if (
      authUser?.privateMetadata.role !== "AGENCY_ADMIN" &&
      authUser?.privateMetadata.role !== "AGENCY_OWNER"
    )
      return;
    const isDeleted = await userModel.deleteOne({ _id: userId });
    if (isDeleted.deletedCount > 0)
      return {
        isDeleted: true,
      };
    else
      return {
        isDeleted: false,
      };
  } catch (err) {
    console.log(err);
  }
}

async function sendInvitation(data: Partial<InvitationInterface>) {
  try {
    const newInvitation = await invitationModel.create({
      ...data,
      email: data.email?.toLowerCase(),
    });
    const invitations = await clerkClient.invitations.getInvitationList();
    console.log(invitations);
    await clerkClient.invitations.createInvitation({
      emailAddress: data.email as string,
      redirectUrl: process.env.NEXT_PUBLIC_URL,
      publicMetadata: {
        throughInvitation: true,
        role: data.role,
      },
    });
  } catch (err) {
    console.log(err);
  }
}

async function getMedia(subAccountId: string) {
  try {
    const subAccountWithMedia = await subAccountModel
      .findOne({ _id: subAccountId }, { media: 1, _id: 0 })
      .populate("media")
      .lean();
    return JSON.parse(JSON.stringify(subAccountWithMedia));
  } catch (err) {
    console.log(err);
  }
}

async function createMedia(mediaData: Partial<MediaInterface>) {
  try {
    const newMediaFile = await mediaModel.create(mediaData);
    if (newMediaFile)
      await subAccountModel.updateOne(
        { _id: mediaData.subAccount },
        { $push: { media: newMediaFile._id } }
      );
    return { created: true };
  } catch (err) {
    console.log(err);
    return { created: false };
  }
}

async function deleteMedia(mediaId: string, subAccountId: string) {
  try {
    const deleted = await mediaModel.deleteOne({ _id: mediaId });
    await subAccountModel.updateOne(
      { _id: subAccountId },
      { $pull: { media: mediaId } }
    );
  } catch (err) {
    console.log(err);
  }
}

async function getPipelineDetails(pipelineId: string) {
  try {
    const pipeline = await pipelineModel
      .findOne({ _id: pipelineId })
      .populate({
        path: "lanes",
        options: {
          sort: { order: 1 },
        },
        populate: {
          path: "tickets",
          options: { sort: { order: 1 } },
          populate: [
            {
              path: "assignedUser",
            },
            {
              path: "customer",
            },
            {
              path: "tags",
            },
          ],
        },
      })
      .lean();
    return pipeline;
  } catch (err) {
    console.log(err);
  }
}

const upsertPipeLine = async (
  newPipeLine: Partial<PipelineInterface>,
  subAccountId?: string
) => {
  try {
    const isUpserted = await pipelineModel
      .findByIdAndUpdate(
        newPipeLine.id || new Types.ObjectId(),
        {
          ...newPipeLine,
          subAccount: subAccountId,
        },
        {
          includeResultMetadata: true,
          upsert: true,
          new: true,
        }
      )
      .lean();
    if (!isUpserted?.lastErrorObject.updatedExisting) {
      const createdPipeLine = isUpserted.value;
      await subAccountModel.updateOne(
        { _id: subAccountId },
        { $push: { pipelines: createdPipeLine._id } }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const deletePipeLine = async (pipeLineId: string, subAccountId: string) => {
  try {
    const deleted = await pipelineModel.deleteOne({ _id: pipeLineId });
    if (deleted)
      await subAccountModel.updateOne(
        { _id: subAccountId },
        { $pull: { pipelines: pipeLineId } }
      );
  } catch (err) {
    console.log(err);
  }
};

const upsertLane = async (lane: Partial<LaneInterface>, pipeLineId: string) => {
  try {
    let order: number;
    if (!lane.order) {
      const allLanes = await laneModel.find({ pipeline: pipeLineId }).lean();
      order = allLanes.length;
    } else {
      order = lane.order;
    }
    const isUpserted = await laneModel.findByIdAndUpdate(
      lane._id || new Types.ObjectId(),
      {
        ...lane,
        pipeline: pipeLineId,
        order: order,
      },
      {
        upsert: true,
        includeResultMetadata: true,
        new: true,
      }
    );
    console.log(isUpserted);
    if (!isUpserted.lastErrorObject?.updatedExisting) {
      const newLane = isUpserted.value;
      await pipelineModel.findByIdAndUpdate(pipeLineId, {
        $push: { lanes: newLane._id },
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteLaneById = async (laneId: string, pipeLineId: string) => {
  try {
    const isDeleted = await laneModel.deleteOne({ _id: laneId });
    if (isDeleted.deletedCount === 1)
      await pipelineModel.findByIdAndUpdate(pipeLineId, {
        $pull: { lanes: laneId },
      });
  } catch (err) {
    console.log(err, "LANE DELETE ERRROR");
  }
};

const upsertTicket = async (
  newTicket: Partial<TicketInterface>,
  laneId: string
) => {
  try {
    let order: number;
    if (!newTicket.order) {
      const allTickets = await ticketModel.find({ lane: laneId }).lean();
      order = allTickets.length;
    } else {
      order = newTicket.order;
    }
    const isUpserted = await ticketModel.findByIdAndUpdate(
      newTicket.id || new Types.ObjectId(),
      {
        ...newTicket,
        customer: newTicket.customer || undefined,
        assignedUser: newTicket.assignedUser || undefined,
        order: order,
      },
      {
        new: true,
        upsert: true,
        includeResultMetadata: true,
      }
    );
    if (!isUpserted.lastErrorObject?.updatedExisting) {
      await laneModel.findByIdAndUpdate(
        { _id: laneId },
        {
          $push: { tickets: isUpserted.value._id },
        }
      );
    }
    console.log(isUpserted.value);
  } catch (err) {
    console.log(err);
  }
};

const updateLaneOrder = async (lanes: LaneDetailsInterface[]) => {
  const session: ClientSession = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      for (let i = 0; i < lanes.length; i++) {
        await laneModel.findByIdAndUpdate(
          lanes[i]._id,
          {
            order: lanes[i].order,
          },
          { session: session }
        );
      }
    });
    await session.endSession();
  } catch (err) {
    console.log(err);
    console.log(
      "ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRROR"
    );
  }
};

const updateTicketOrder = async (
  tickets: TicketDetailsInterface[],
  draggableId?: string,
  sourceLaneId?: string,
  destinationLaneId?: string
) => {
  const session: ClientSession = await mongoose.startSession();
  try {
    if (sourceLaneId) {
      await laneModel.findByIdAndUpdate(sourceLaneId, {
        $pull: { tickets: draggableId },
      });
    }
    if (destinationLaneId) {
      await laneModel.findByIdAndUpdate(destinationLaneId, {
        $push: { tickets: draggableId },
      });
    }
    await session.withTransaction(async () => {
      for (let i = 0; i < tickets.length; i++) {
        await ticketModel.findByIdAndUpdate(
          tickets[i]._id,
          {
            order: tickets[i].order,
            lane: tickets[i].lane,
          },
          { session: session }
        );
      }
    });
    await session.endSession();
  } catch (err) {
    console.log(err);
  }
};

const createTag = async (
  newTag: Partial<TagInterface>,
  subAccountId: string
) => {
  try {
    const createdTag = await TagModal.create({
      ...newTag,
      subAccount: subAccountId,
    });
    return JSON.parse(JSON.stringify(createdTag));
  } catch (err) {
    console.log(err);
  }
};

const getTags = async (subAccountId: string) => {
  try {
    const tags = JSON.parse(
      JSON.stringify(await TagModal.find({ subAccount: subAccountId }).lean())
    );
    return tags;
  } catch (err) {
    console.log(err);
  }
};

const getTeamMembersAndContacts = async (subAccountId: string) => {
  const foo = async () => {
    "use server";
    try {
      const teamMembers = (
        await permissionModel
          .find({ subAccount: subAccountId })
          .populate("user")
      ).map((p) => p.user);
      const contacts = (
        await subAccountModel
          .findOne({ _id: subAccountId }, { _id: 0, contacts: 1 })
          .populate("contacts")
      ).contacts;
      console.log(contacts);
      return {
        users: JSON.parse(JSON.stringify(teamMembers)),
        contacts: JSON.parse(JSON.stringify(contacts)),
      };
    } catch (err) {
      console.log(err);
    }
  };

  return foo;
};

const deleteTicket = async (ticketId: string, laneId: string) => {
  try {
    const deleted = await ticketModel.findByIdAndDelete(ticketId);
    if (deleted)
      await laneModel.findByIdAndUpdate(laneId, {
        $pull: { tickets: ticketId },
      });
  } catch (err) {
    console.log(err);
  }
};

const upsertContact = async (newContact: Partial<ContactInterface>) => {
  try {
    const isUpserted = await contactModel.findByIdAndUpdate(
      newContact._id || new Types.ObjectId(),
      {
        ...newContact,
      },
      {
        upsert: true,
        new: true,
        includeResultMetadata: true,
      }
    );
    if (!isUpserted.lastErrorObject?.updatedExisting) {
      await subAccountModel.findByIdAndUpdate(newContact.subAccount, {
        $push: { contacts: isUpserted.value._id },
      });
    }
    return JSON.parse(JSON.stringify(isUpserted.value))
  } catch (err) {
    console.log(err);
  }
};

export const getFunnels = async (subacountId: string) => {
  const funnels = await funnelModel
    .find({
      subAccount: subacountId,
    })
    .populate("funnelPages");

  return JSON.parse(JSON.stringify(funnels));
};

const upsertFunnel = async (
  subAccountId: string,
  updates: Partial<FunnelInterface>,
  funnelId: string
) => {
  try {
    const isUpserted = await funnelModel.findByIdAndUpdate(funnelId, {...updates,subAccount:subAccountId}, {
      new: true,
      upsert: true,
      includeResultMetadata: true,
    });
    if (!isUpserted.lastErrorObject?.updatedExisting) {
      await subAccountModel.findByIdAndUpdate(subAccountId, {
        $push: { funnels: isUpserted.value._id },
      });
    }
    console.log(isUpserted)
    return JSON.parse(JSON.stringify(isUpserted.value));
  } catch (err) {
    console.log(err);

  }
};

const getFunnel = async (funnelId:string) => {
  try{
    const funnel = await funnelModel.findById(funnelId).populate({
      path:"funnelPages",
      options:{
        sort:{
          order:1
        }
      }
    });
    return JSON.parse(JSON.stringify(funnel))
  }catch(err){
    console.log(err)
  }
}

const updateFunnelProducts = async (liveProducts:string,funnelId:string) => {
try{
  await funnelModel.findByIdAndUpdate(funnelId,{
    liveProducts
  });
}catch(err){
  console.log(err)
}
}

const upsertFunnelPage = async (subAccountId:string,updates:Partial<FunnelPageInterface>,funnelId:string,funnelPageId?:string) => {
  if(!subAccountId || !funnelId) return
  try{
    const isUpserted = await funnelPageModel.findByIdAndUpdate(funnelPageId || new mongoose.Types.ObjectId(),{
      ...updates,
      content:updates.content ?  updates.content : JSON.stringify([{
        
          content: [],
          id: '__body',
          name: 'Body',
          styles: { backgroundColor: 'white' },
          type: '__body',
        
      }]),
      funnel:funnelId
    },{
      upsert:true,
      new:true,
      includeResultMetadata:true
    })
    if(!isUpserted?.lastErrorObject?.updatedExisting){
      await funnelModel.findByIdAndUpdate(funnelId,{$push:{funnelPages:isUpserted.value._id}})
    }
    revalidatePath(`/subaccount/${subAccountId}/funnels/${funnelId}`,"page")
    return JSON.parse(JSON.stringify(isUpserted.value))
  }catch(err){
    console.log(err)
  }
}

const deleteFunnelPage = async (funnelPageId:string,funnelId:string) =>{
  try{
    const deleted = await funnelPageModel.deleteOne({_id:funnelPageId});
    if(deleted.deletedCount > 0)[
      await funnelModel.findByIdAndUpdate(funnelId,{$pull:{funnelPages:funnelPageId}})
    ]
    
  }catch(err){
    console.log(err,"NEW FUNNEL PAGE ERROR")
  }
}

const getFunnelPageDetails = async (funnelPageId:string) => {
  try{
    const funnelPage = await funnelPageModel.findById(funnelPageId);
    return JSON.parse(JSON.stringify(funnelPage));
  }catch(err){
    console.log(err)
  }
}


const getSubaccountDetails = async (subAccountId: string) => {
  const response = await subAccountModel.findById(subAccountId).lean()
  return JSON.parse(JSON.stringify(response))
}

const getDomainDetails = async (domainName:string) => {
  try{
    const funnel = await funnelModel.findOne({
      subDomainName:domainName
    }).populate("funnelPages")
    return funnel
  }catch(err){
    console.log(err)
  }
}

const getPipelines = async (subAccountId: string) => {
  const response = await pipelineModel.find({
    subAccount:subAccountId
  }).populate({
    path:"lanes",
    populate:{
      path:"tickets"
    }
  })
  return JSON.parse(JSON.stringify(response));
}

export {
  verifyAndAcceptInvitation,
  getUserDetails,
  updateAgencyDetails,
  saveActivityLogsNotifications,
  deleteAgency,
  deleteSubAccount,
  initUser,
  upsertAgency,
  upsertSubAccount,
  getNotificationsAndUser,
  getUserWithPermissions,
  upsertPermission,
  updateUser,
  getUserById,
  deleteUser,
  sendInvitation,
  getMedia,
  createMedia,
  deleteMedia,
  getPipelineDetails,
  upsertPipeLine,
  deletePipeLine,
  upsertLane,
  upsertTicket,
  updateLaneOrder,
  updateTicketOrder,
  deleteLaneById,
  getTags,
  createTag,
  getTeamMembersAndContacts,
  deleteTicket,
  upsertContact,
  upsertFunnel,
  getFunnel,
  updateFunnelProducts,
  upsertFunnelPage,
  deleteFunnelPage,
  getFunnelPageDetails,
  getSubaccountDetails,
  getDomainDetails,
  getPipelines
};
  