"use client"
import PipelineForm from "@/components/forms/PipelineForm";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { deletePipeLine, saveActivityLogsNotifications } from "@/lib/queries";
import { PipelineInterface } from "@/models/Pipeline";
import { Description } from "@radix-ui/react-toast";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  currentPipeLine: Partial<PipelineInterface>;
  subAccountId: string;
};

const PipeLineSettings = ({ currentPipeLine, subAccountId }: Props) => {
    const { toast } = useToast();
    const router = useRouter()
  return (
    <AlertDialog>
      <div>
        <div className="flex items-center justify-between mb-4">
          <AlertDialogTrigger>
            <Button variant="destructive">Delete Pipeline</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                onClick={async () => {
                    try{
                        await deletePipeLine(currentPipeLine._id,subAccountId)
                        await saveActivityLogsNotifications({
                            subAccountId:subAccountId,
                            description:`Pipeline Deleted | ${currentPipeLine.name}`
                        })
                        toast({
                            title:"Success!",
                            description:`"${currentPipeLine.name}" deleted`
                        })
                        router.refresh()
                    }catch(err){
                        toast({
                            variant:"destructive",
                            title:"Failed!",
                            description:"Could not delete pipeline"
                        })
                    }
                }}
                >Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </div>
        <PipelineForm defaultData={currentPipeLine} pipeLineId={currentPipeLine._id} subAccountId={subAccountId} />
      </div>
    </AlertDialog>
  );
};

export default PipeLineSettings;
