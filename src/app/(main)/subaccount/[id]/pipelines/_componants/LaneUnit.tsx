"use client";
import LaneForm from "@/components/forms/LaneForm";
import CustomModal from "@/components/global/CustomModal";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { deleteLaneById } from "@/lib/queries";
import { LaneDetailsInterface, TicketDetailsInterface } from "@/lib/types";
import { useModal } from "@/providers/ModalProvider";
import {
  CirclePlus,
  Delete,
  Edit,
  EllipsisVertical,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

type Props = {
  subAccountId: string;
  pipeLineId: string;
  lane: LaneDetailsInterface;
  index: number;
};

const LaneUnit = ({ lane, index, subAccountId, pipeLineId }: Props) => {
  const { toast } = useToast();
  const { setOpen, setClose } = useModal();
  const router = useRouter();
  const [tickets, setTickets] = useState(lane.tickets);
  const [circleColor, setCirleColor] = useState();
  const totalValue = lane?.tickets?.reduce(
    (total, ticket) => total + ticket.value,
    0
  );
  useEffect(() => {
    
  },[])
  const editLane = () => {
    setOpen(
      <CustomModal
        defaultOpen={false}
        title={`Edit ${lane.name}`}
        subheading="Lanes allow you to group tickets"
      >
        <LaneForm
          subAccountId={subAccountId}
          pipeLineId={pipeLineId}
          laneData={lane}
        />
      </CustomModal>
    );
  };
  const deleteLane = async () => {
    try {
      await deleteLaneById(lane._id, pipeLineId);
      toast({
        title: "Success!",
        description: "Lane deleted",
      });
      setClose();
      router.refresh();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: "Could not delete lane",
      });
    }
  };

  return (
    <Draggable draggableId={lane._id} index={index}>
      {(provided) => (
        <div
          className="min-w-full sm:min-w-[300px] bg-white/60 dark:bg-background rounded-md p-3"
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: circleColor }}
              ></div>
              <h1>{lane.name}</h1>
            </div>
            <div className="flex items-center">
              <Badge className="bg-white text-black font-semibold">
                ${totalValue}
              </Badge>
              <Popover>
                <PopoverTrigger>
                  <EllipsisVertical />
                </PopoverTrigger>
                <PopoverContent className="max-w-[200px]">
                  <AlertDialog>
                    <div className="flex flex-col gap-2">
                      <div
                        onClick={editLane}
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
                          <Separator className="mt-2" />
                        </div>
                      </AlertDialogTrigger>
                      <div className="hover:bg-white/10 rounded-md pt-2 pl-2">
                        <div className="flex gap-2 items-center">
                          <CirclePlus size={20} />
                          Create
                        </div>
                        <Separator className="mt-2" />
                      </div>
                    </div>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete this lane from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={deleteLane}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Separator className="my-2" />
          <Droppable droppableId={lane._id}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}></div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default LaneUnit;
