import funnelPageModel from "@/models/FunnelPage";
import EditorContextProvider from "@/providers/editor/EditorProvider";
import { redirect } from "next/navigation";
import React from "react";
import Main from "./_components/Main";
type Props = {
  params: {
    id: string;
    funnelId: string;
    funnelPageId: string;
  };
};

const FunnelPage = async ({ params }: Props) => {
  const { id, funnelId, funnelPageId } = params;
  console.log(funnelId);
  const funnelPageDetails = await funnelPageModel.findById(funnelPageId);
  if (!funnelPageId) redirect(`/subaccount/${id}/funnels/${funnelId}`);

  return <Main id={id} funnelId={funnelId} pageDetails={funnelPageDetails} funnelPageId={funnelPageId} />;
};

export default FunnelPage;
