"use client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TicketDetailsInterface } from "@/lib/types";
import { Edit, Ellipsis, Link2, Trash2, UserRound } from "lucide-react";
import React, { forwardRef } from "react";
import TicketForm, { TagButton } from "@/components/forms/TicketForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/providers/ModalProvider";
import CustomModal from "@/components/global/CustomModal";
import { TagInterface } from "@/models/Tag";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { deleteTicket, getTeamMembersAndContacts, saveActivityLogsNotifications } from "@/lib/queries";
import { DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd";
import { createPortal } from "react-dom";

type Props = {
  ticketDetails: TicketDetailsInterface;
  subAccountId: string;
  laneId: string;
  tags: TagInterface[];
  provided:DraggableProvided;
  snapshot:DraggableStateSnapshot
};

const TicketUnit = ({ provided,snapshot, ticketDetails, subAccountId, laneId, tags}: Props) => {
  const { setOpen } = useModal();
  const { toast } = useToast()
  const router = useRouter()
  const usePortal:boolean = snapshot.isDragging;
  const deleteT = async () => {
    try{
      await deleteTicket(ticketDetails._id,ticketDetails.lane as string);
      await saveActivityLogsNotifications({
        description:`deleted ticket with name | ${ticketDetails.name}`,
        subAccountId:subAccountId
      })
      toast({
        title:"Success!",
        description:"Ticket Deleted"
      })
      router.refresh()
    }catch(err){
      toast({
        variant:"destructive",
        title:"Failed!",
        description:" Could not delete Ticket"
      })
    }
  }
  const Child =  (
    <Card {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}  className={`w-[300px] max-w-[300px] bg-white/60 z-50 relative dark:bg-slate-950 py-3
      ${
        usePortal
          ? " after:absolute after:bottom-0 after:right-0 after:content-['in portal']"
          : ""
      }
      `}>
      <CardHeader className="mb-[-1rem] pt-4">
        <CardTitle className="flex justify-between">
          {ticketDetails.name}
          <Popover>
            <PopoverTrigger>
              <Ellipsis />
            </PopoverTrigger>
            <PopoverContent>
              <AlertDialog>
                <div className="flex flex-col gap-2">
                  <div
                    onClick={async () =>
                      setOpen(
                        <CustomModal
                          title="Update Ticket"
                          subheading="You can change ticket order by dragging it"
                          defaultOpen={false}
                        >
                          <TicketForm
                            ticketData={ticketDetails}
                            subAccountId={subAccountId}
                            laneId={laneId}
                            tags={tags}
                          />
                        </CustomModal>,
                        await getTeamMembersAndContacts(subAccountId)
                      )
                    }
                    className="hover:bg-white/5 rounded-md pt-2 pl-2"
                  >
                    <div className="flex gap-2 items-center">
                      <Edit size={20} />
                      Edit
                    </div>
                    <Separator className="mt-2" />
                  </div>
                  <AlertDialogTrigger asChild>
                    <div className="hover:bg-white/10 rounded-md pt-2 pl-2">
                      <div className="flex gap-2 items-center">
                        <Trash2 size={20} />
                        Delete
                      </div>
                    </div>
                  </AlertDialogTrigger>
                </div>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteT}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </PopoverContent>
          </Popover>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-muted-foreground text-[.78rem] font-semibold flex pb-0 flex-col gap-2">
        <p>{ticketDetails.createdAt.toString().slice(0, 10)}</p>
        <div className="flex gap-2 w-full flex-wrap">
          {ticketDetails.tags.map((tag,index) => (
            <TagButton key={index} className="w-fit" tag={tag} />
          ))}
        </div>
        <p>{ticketDetails.description}</p>
        <div className="flex my-2 pl-3 items-center gap-2 font-bold ">
          <Link2 />
          CONTACT
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center font-medium text-sm pb-0 pt-2 px-3 border-muted-foreground/20 border-t-[2px]">
        {ticketDetails.assignedUser ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={ticketDetails.assignedUser?.avatarUrl} />
              <AvatarFallback>
                {ticketDetails.assignedUser.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex text-muted-foreground text-base font-bold flex-col">
            Assigned To
            <span className="text-sm font-medium mt-[-2px]">{ticketDetails.assignedUser.name}</span>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <div className="flex h-[2rem] w-[2rem] items-center justify-center rounded-full bg-primary">
              <UserRound size={15} />
            </div>
            <p className="text-muted-foreground">Not Assigned</p>
          </div>
        )}
        <p className="font-extrabold">${ticketDetails.value}</p>
      </CardFooter>
    </Card>
  );
  if(!usePortal) return Child
  return createPortal(Child,document.body)
};

export default TicketUnit;
