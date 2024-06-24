import funnelPageModel from '@/models/FunnelPage'
import EditorContextProvider from '@/providers/editor/EditorProvider'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params:{
        id:string,
        funnelId:string,
        funnelPageId:string
    }
}

const FunnelPage = async ({params}: Props) => {
    const {id,funnelId,funnelPageId} = params
    const funnelPageDetails = await funnelPageModel.findById(funnelPageId);
    if(!funnelPageId)
        redirect(`/subaccount/${id}/funnels/${funnelId}`)
    
  return (
    <EditorContextProvider subAccountId={id} funnelId={funnelId} pageDetails={funnelPageDetails}>
      <div></div>
    </EditorContextProvider>
  )
}

export default FunnelPage