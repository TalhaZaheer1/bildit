"use client";
import PipelineForm from "@/components/forms/PipelineForm";
import CustomModal from "@/components/global/CustomModal";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PipelineInterface } from "@/models/Pipeline";
import { useModal } from "@/providers/ModalProvider";
import { Check, ChevronsUpDown, CirclePlus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

type Props = {
  pipeLineId: string;
  allPipelines: Partial<PipelineInterface>[];
  subAccountId: string;
};

const PipeLineInfoBar = ({ pipeLineId, allPipelines, subAccountId }: Props) => {
  const { setOpen: setModalOpen, setClose } = useModal();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(pipeLineId);
  const selectedPipeLine = allPipelines.find(
    (pipeLine) => pipeLine._id === pipeLineId
  );
  console.log(allPipelines)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-expanded={open}
          className="w-[200px] justify-between"
          variant="outline"
        >
          {selectedPipeLine?.name}{" "}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
          <CommandEmpty>No results found...</CommandEmpty>
          <CommandGroup>
            {allPipelines.map((pipeLine) => (
              <Link
                key={pipeLine._id}
                href={`/subaccount/${subAccountId}/pipelines/${pipeLine._id}`}
                
              >
                <CommandItem
                  value={pipeLine?._id}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === pipeLine._id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {pipeLine?.name}
                </CommandItem>
              </Link>
            ))}

            <Button
              variant="secondary"
              className="flex gap-2 w-full mt-4"
              onClick={() =>
                setModalOpen(
                  <CustomModal
                    title="Create Pipeline"
                    subheading="Lets get organized"
                    defaultOpen={false}
                  >
                    <PipelineForm subAccountId={subAccountId} />
                  </CustomModal>
                )
              }
            >
              <CirclePlus /> Create Pipeline
            </Button>
          </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PipeLineInfoBar;
