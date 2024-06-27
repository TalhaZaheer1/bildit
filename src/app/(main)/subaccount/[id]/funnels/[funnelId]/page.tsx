import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getFunnel } from '@/lib/queries'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import FunnelSettings from './_components/FunnelSettings'
import FunnelSteps from './_components/FunnelSteps'
type Props = {
    params:{
        id:string,
        funnelId:string
    }
}

const Funnel = async ({params}: Props) => {
    const { id,funnelId } = params
    const funnel = await getFunnel(funnelId)
    if(!funnel)
        redirect(`/subaccount/${id}/funnels`);
  return (
    <section>
        <Link
        className="flex justify-between gap-4 mb-4 text-muted-foreground"
        href={`/subaccount/${id}/funnels`}>Back</Link>
        <h1 className="text-3xl mb-8">{funnel.name}</h1>
        <Tabs defaultValue='details' className="w-full">
            <TabsList className="grid  grid-cols-2 w-[50%] bg-transparent ">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
                <FunnelSteps 
                funnel={funnel}
                pages={funnel.funnelPages || []}
                subaccountId={params.id}
                funnelId={funnelId}      
                />
            </TabsContent>
            <TabsContent value="settings">
                <FunnelSettings funnelData={funnel} subAccountId={id} />
            </TabsContent>
        </Tabs>
    </section>
  )
}

export default Funnel