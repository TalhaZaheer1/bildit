import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPipelineDetails, getTags, updateLaneOrder, updateTicketOrder } from "@/lib/queries";
import pipelineModel from "@/models/Pipeline";
import { redirect } from "next/navigation";
import React from "react";
import PipeLineInfoBar from "../_componants/PipeLineInfoBar";
import PipeLineSettings from "../_componants/PipeLineSettings";
import PipeLineView from "../_componants/PipeLineView";

type Props = {
  params: {
    pipelineId: string;
    id: string;
  };
};

const page = async ({ params }: Props) => {
  const pipelineDetails = JSON.parse(JSON.stringify(await getPipelineDetails(params.pipelineId)));
  if (!pipelineDetails) redirect(`/subaccount/${params.id}/pipelines`);
  const allPipelines = await pipelineModel.find({ subAccount: params.id });
  const tags = await getTags(params.id);
  return <Tabs defaultValue="view" className="w-full">
    <TabsList className="bg-transparent border-b-2 h-16 w-full justify-between mb-4">
        <PipeLineInfoBar pipeLineId={params.pipelineId} allPipelines={JSON.parse(JSON.stringify(allPipelines))} subAccountId={params.id} />
        <div>
          <TabsTrigger value="view">Details</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </div>
    </TabsList>
    <TabsContent value="view">
      <PipeLineView tags={tags} pipeLineDetails={pipelineDetails} subAccountId={params.id} updateTicketOrder={updateTicketOrder} updateLaneOrder={updateLaneOrder}/>
    </TabsContent>
    <TabsContent value="settings">
      <PipeLineSettings currentPipeLine={({name:pipelineDetails.name,_id:pipelineDetails._id})} subAccountId={params.id} />
    </TabsContent>
  </Tabs>
};

export default page;
