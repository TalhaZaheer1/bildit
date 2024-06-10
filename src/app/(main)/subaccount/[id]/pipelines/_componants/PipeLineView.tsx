"use client";
import {
  LaneDetailsInterface,
  PipelineDetailsInterface,
  TicketDetailsInterface,
} from "@/lib/types";
import { useModal } from "@/providers/ModalProvider";
import { useRouter } from "next/navigation";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CustomModal from "@/components/global/CustomModal";
import LaneForm from "@/components/forms/LaneForm";
import { Plus } from "lucide-react";
import LaneUnit from "./LaneUnit";

type Props = {
  pipeLineDetails: PipelineDetailsInterface;
  subAccountId: string;
  updateLaneOrder: (lanes: LaneDetailsInterface[]) => Promise<void>;
  updateTicketOrder: (tickets: TicketDetailsInterface[]) => Promise<void>;
};

const PipeLineView = ({
  pipeLineDetails,
  subAccountId,
  updateLaneOrder,
  updateTicketOrder,
}: Props) => {
  const { setOpen } = useModal();
  const router = useRouter();
  const [allLanes, setAllLanes] = useState(pipeLineDetails.lanes);

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

  const onDragEnd = (result:DropResult) => {
    if(!result.destination) return
    const lanes = Array.from<LaneDetailsInterface>(allLanes) 
    const removedArray = lanes.splice(result.source.index,1)
    lanes.splice(result.destination.index,0,removedArray[0])
    setAllLanes(lanes)
  }
  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <div className="bg-white/60 dark:bg-background/60 rounded-xl p-4 use-animation-zoom-in overflow-x-auto">
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-2xl">{pipeLineDetails.name}</h1>
          <Button className="flex items-center gap-4" onClick={handleAddLane}>
            <Plus size={15} /> Create
          </Button>
        </div>
        <Droppable direction="horizontal" droppableId="columnParent">
          {(provided) => (
            <div
              className="flex gap-6"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {allLanes.map((lane, index) => (
                <LaneUnit
                  index={index}
                  lane={lane}
                  subAccountId={subAccountId}
                  pipeLineId={pipeLineDetails._id}
                />
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
