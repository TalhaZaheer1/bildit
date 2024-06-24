import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SubAccountWithContacts } from "@/lib/types";
import subAccountModel from "@/models/SubAccount";
import { TicketInterface } from "@/models/Ticket";
import format from "date-fns/format";
import React from "react";
import CreateContactButton from "./_componants/CreateContactButton";

type Props = {
  params: { id: string };
};

const Contacts = async ({ params }: Props) => {
  const subAccountWithContact: SubAccountWithContacts = await subAccountModel
    .findById(params.id)
    .populate({
      path: "contacts",
      populate: {
        path: "tickets",
      },
      options: {
        sort: { createdAt: 1 },
      },
    });
  const allContacts = subAccountWithContact?.contacts;
  console.log(subAccountWithContact)
  const formatTotal = (tickets: TicketInterface[]) => {
    const usdFormat = Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    });
    const sumOfValues = tickets.reduce(
      (sum, ticket) => ticket?.value || 0 + sum,
      0
    );
    return usdFormat.format(sumOfValues);
  };
  return (
    <>
      <h1 className="text-4xl p-4">Contact</h1>
      <CreateContactButton subAccountId={params.id} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[300px]">Email</TableHead>
            <TableHead className="w-[200px]">Active</TableHead>
            <TableHead className="w-[200px]">Created Date</TableHead>
            <TableHead className="text-right">Total Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allContacts?.map((contact) => (
            <TableRow>
              <TableCell>
                <Avatar>
                    <AvatarImage alt="profile" />
                    <AvatarFallback className="bg-primary text-white">
                        {contact.name.slice(0,2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>
                {formatTotal(contact.tickets) === "$0.00" ? 
                <Badge variant="destructive">Inactive</Badge> :
                <Badge className="bg-emerald-700">Active</Badge>
            }
              </TableCell>
              <TableCell>{format(contact.createdAt,"MM/dd/yyyy")}</TableCell>
              <TableCell className="text-right">{formatTotal(contact.tickets)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default Contacts;
