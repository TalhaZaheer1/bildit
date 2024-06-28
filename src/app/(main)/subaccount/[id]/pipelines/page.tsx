import dbConnect from "@/lib/db";
import pipelineModel from "@/models/Pipeline";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: { id: string };
};

const Pipeline = async ({ params }: Props) => {
  await dbConnect()
  const firstPipeLineExists = await pipelineModel
    .findOne({ subAccount: params.id })
    .lean();
  if (firstPipeLineExists)
    redirect(
  // @ts-ignore
      `/subaccount/${params.id}/pipelines/${firstPipeLineExists._id.toString()}`
    );
   const firstPipeline = await pipelineModel.create({
    name:"Lead cycle"
   })
   redirect(`/subaccount/${params.id}/pipelines/${firstPipeline._id}`)
};

export default Pipeline;
