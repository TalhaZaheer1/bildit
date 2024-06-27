"use client";
import {
  LaneDetailsInterface,
  PipelineDetailsInterface,
  TicketDetailsInterface,
} from "@/lib/types";
import { useModal } from "@/providers/ModalProvider";
import { useRouter } from "next/navigation";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/global/CustomModal";
import LaneForm from "@/components/forms/LaneForm";
import { Plus } from "lucide-react";
import LaneUnit from "./LaneUnit";
import NoSSR from "@/components/global/NoSSR";
import { resetServerContext } from "@hello-pangea/dnd";
import { useToast } from "@/components/ui/use-toast";
import TicketForm from "@/components/forms/TicketForm";
import { TagInterface } from "@/models/Tag";
import TagForm from "@/components/forms/TagForm";

type Props = {
  pipeLineDetails: PipelineDetailsInterface;
  subAccountId: string;
  updateLaneOrder: (lanes: LaneDetailsInterface[]) => Promise<void>;
  updateTicketOrder: (tickets: TicketDetailsInterface[],  draggableId?: string,
    sourceLaneId?: string,
    destinationLaneId?: string) => Promise<void>;
  tags: TagInterface[];
};

const PipeLineView = ({
  pipeLineDetails,
  subAccountId,
  updateLaneOrder,
  updateTicketOrder,
  tags,
}: Props) => {
  const { setOpen } = useModal();
  const router = useRouter();
  const [allLanes, setAllLanes] = useState(pipeLineDetails.lanes);
  const { toast } = useToast();
  const handleAddLane = () => {
    setOpen(
      <CustomModal
        defaultOpen={false}
        title="Create A Lane"
        subheading="Lanes allow you to group tickets"
      >
        <LaneForm
          pipeLineId={pipeLineDetails._id}
          subAccountId={subAccountId}
        />
      </CustomModal>
    );
  };
  useEffect(() => {
    setAllLanes(pipeLineDetails.lanes);
  }, [pipeLineDetails]);

  const changeLaneOrder = async (
    source: number,
    destination: number,
    draggableId: string
  ) => {
    const lanes: LaneDetailsInterface[] = Array.from(pipeLineDetails.lanes);
    if (source - destination < 0) {
      lanes.forEach((lane) => {
        if (lane._id === draggableId) {
          lane.order = destination;
        } else if (lane.order > source && lane.order <= destination) {
          lane.order -= 1;
        }
      });
    } else if (source - destination > 0) {
      lanes.forEach((lane) => {
        if (lane._id === draggableId) {
          lane.order = destination;
        } else if (lane.order < source && lane.order >= destination) {
          lane.order += 1;
        }
      });
    }
    try {
      await updateLaneOrder(lanes);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "Could not update lanes",
      });
    }
  };

  const changeTicketOrder = async (
    source: any,
    destination: any,
    draggableId: string,
    sourceTickets: TicketDetailsInterface[],
    destinationTickets: TicketDetailsInterface[]
  ) => {
    try {
      if (source.droppableId === destination.droppableId) {
        if (source.index - destination.index < 0) {
          sourceTickets.forEach((ticket: TicketDetailsInterface) => {
            if (ticket._id === draggableId) {
              ticket.order = destination.index;
            } else if (
              ticket.order > source.index &&
              ticket.order <= destination.index
            ) {
              ticket.order -= 1;
            }
          });
        } else if (source.index - destination.index > 0) {
          sourceTickets.forEach((ticket: TicketDetailsInterface) => {
            if (ticket._id === draggableId) {
              ticket.order = destination.index;
            } else if (
              ticket.order < source.index &&
              ticket.order >= destination.index
            ) {
              ticket.order += 1;
            }
          });
        console.log(sourceTickets)
        }
        await updateTicketOrder(sourceTickets);
      } else {
        sourceTickets.forEach((ticket: TicketDetailsInterface) => {
          let changedTicketId: string;
          if (ticket._id === draggableId) {
            ticket.order = destination.index;
            ticket.lane = destination.droppableId;
          }
          if (ticket.order > source.index) {
            ticket.order -= 1;
          }
        });
        console.log(sourceTickets, source.droppableId);
        await updateTicketOrder(
          sourceTickets,
          draggableId,
          source.droppableId,
          undefined
        );
        destinationTickets.forEach((ticket: TicketDetailsInterface) => {
          if (ticket.order >= destination.index) {
            ticket.order += 1;
          }
        });
        await updateTicketOrder(
          destinationTickets,
          draggableId,
          undefined,
          destination.droppableId
        );
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed!",
        description: "Could not update ticket order",
      });
    }
  };

  const onDragEnd = async (result: DropResult) => {
    console.log(result);
    const { source, destination } = result;
    if (!destination) return;
    const lanes = Array.from<LaneDetailsInterface>(allLanes);
    if (result.type === "columnParent") {
      const removedArray = lanes.splice(source.index, 1);
      lanes.splice(destination.index, 0, removedArray[0]);
      setAllLanes(lanes);
      await changeLaneOrder(
        source.index,
        destination.index,
        result.draggableId
      );
    } else if (result.type === "ticketParent") {
      let removedTicket: TicketDetailsInterface;
      let sourceTickets: TicketDetailsInterface[];
      let destinationTickets: TicketDetailsInterface[];
      const editedLanesWithTicketRemoved = lanes.map((lane) => {
        if (lane._id === source.droppableId) {
          sourceTickets = Array.from(lane.tickets);
          removedTicket = lane.tickets.splice(source.index, 1)[0];
        }
        return lane;
      });
      const editedLanes = editedLanesWithTicketRemoved.map((lane) => {
        if (lane._id === destination.droppableId) {
          destinationTickets = Array.from(lane.tickets);
          lane.tickets.splice(destination.index, 0, removedTicket);
        }
        return lane;
      });
      console.log(editedLanes);
      setAllLanes(editedLanes);
      changeTicketOrder(
        source,
        destination,
  // @ts-ignore
        removedTicket._id,
  // @ts-ignore
        sourceTickets,
  // @ts-ignore
        destinationTickets
      );
    }
  };
  resetServerContext();
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-animation-zoom-in ">
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-2xl">{pipeLineDetails.name}</h1>
          <Button className="flex items-center gap-4" onClick={handleAddLane}>
            <Plus size={15} /> Create
          </Button>
        </div>
        <Droppable
          type="columnParent"
          direction="horizontal"
          droppableId="columnParent"
        >
          {(provided) => (
            <div
              className="flex overflow-x-auto overflow-y-hidden h-full transform-none"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {allLanes.map((lane, index) => (
                <Draggable draggableId={lane._id} key={lane._id} index={index}>
                  {(provided, snapShot) => (
                    <LaneUnit
                      tags={tags}
                      lane={lane}
                      provided={provided}
                      snapshot={snapShot}
                      subAccountId={subAccountId}
                      pipeLineId={pipeLineDetails._id}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default PipeLineView;
