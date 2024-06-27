import FunnelEditor from '@/app/(main)/subaccount/[id]/funnels/[funnelId]/editor/[funnelPageId]/_components/FunnelEditor'
import { getDomainDetails } from '@/lib/queries'
import funnelPageModel from '@/models/FunnelPage'
import EditorContextProvider from '@/providers/editor/EditorProvider'
import { notFound } from 'next/navigation'
import React from 'react'

type Props = {
    params:{
        domain:string,
        path:string
    }
}

const page = async ({params}: Props) => {
    const funnelDetails = await getDomainDetails(params.domain.split(".")[0])
    if(!funnelDetails) return notFound()
    const selectedPage = funnelDetails.funnelPages.find(page => page.pathName === params.path);
    if(!selectedPage) return notFound()
    await funnelPageModel.findByIdAndUpdate(selectedPage._id,{
        $inc:{visits:1}
    })
  return (
        <EditorContextProvider subAccountId={funnelDetails.subAccount.toString()} funnelId={funnelDetails._id.toString()} pageDetails={JSON.parse(JSON.stringify(selectedPage))}>
        <FunnelEditor funnelPageId={selectedPage._id.toString()} liveMode={true} />
        </EditorContextProvider>
  )
}

export default page