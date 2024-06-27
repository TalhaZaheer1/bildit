import { getDomainDetails } from '@/lib/queries'
import funnelPageModel from '@/models/FunnelPage'
import { notFound } from 'next/navigation'
import React from 'react'
import FunnelEditor from '../(main)/subaccount/[id]/funnels/[funnelId]/editor/[funnelPageId]/_components/FunnelEditor'
import EditorContextProvider from '@/providers/editor/EditorProvider'

type Props = {
    params:{
        domain:string
    }
}

const Domain = async ({params}: Props) => {
    const funnelDetails = await getDomainDetails(params.domain.split(".")[0])
    console.log(funnelDetails)
    if(!funnelDetails) return notFound()
    const indexPage = funnelDetails.funnelPages.find(page => !page.pathName);
    if(!indexPage) return notFound()
    await funnelPageModel.findByIdAndUpdate(indexPage._id,{
        $inc:{visits:1}
    })
  return (
        <EditorContextProvider subAccountId={funnelDetails.subAccount.toString()} funnelId={funnelDetails._id.toString()} pageDetails={JSON.parse(JSON.stringify(indexPage))}>
        <FunnelEditor funnelPageId={indexPage._id.toString()} liveMode={true} />
        </EditorContextProvider>
  )
}

export default Domain