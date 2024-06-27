"use server"
import InfoBar from '@/components/global/InfoBar'
import Unauthorized from '@/components/global/Unauthorized'
import Sidebar from '@/components/sidebar/Sidebar'
import dbConnect from '@/lib/db'
import { getNotificationsAndUser, getUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import notificationModel, { NotificationInterface } from '@/models/Notification'
import { PermissionInterface } from '@/models/Permission'
import { SubAccountInterface } from '@/models/SubAccount'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {
    params:{id:string},
    children:React.ReactNode
}

const layout = async ({params,children}: Props) => {
    await dbConnect()
    let authUser = {}
    try{
  // @ts-ignore
        authUser = await currentUser()
    }catch(err){
        console.log(err)
    }
    if(!authUser) return redirect("/")
    const agencyId = await verifyAndAcceptInvitation()
    if(!agencyId) return <Unauthorized />
    const user = await getUserDetails()
    const isAllowed = user.permissions.find((p:PermissionInterface) => p.subAccount === params.id && p.access)
    if(!isAllowed) return <Unauthorized />
    const subAccount = user.agency.subAccounts.find((subAccount:SubAccountInterface) => subAccount._id === params.id)
    let notifications:NotificationInterface[]
    if(user.role === "AGENCY_ADMIN" || user.role === "AGENCY_OWNER")
    notifications= await getNotificationsAndUser(agencyId)
    else
    notifications = JSON.parse(JSON.stringify(await notificationModel.find({subAccount:params.id}).populate("user").lean()))
  return (
    <div>
        <Sidebar id={params.id} type="subaccount"/>
        <div className='md:pl-[300px]'>

            <InfoBar subAccountId={params.id} role={user.role}  notifications={notifications} /> 
            
            <div className='relative'>
            <div 
        id="blur-page"
        className="h-screen overflow-auto backdrop-blur-[35px] dark:bg-muted/40 bg-muted/60 dark:shadow-2xl dark:shadow-black  mx-auto pt-24  p-4 absolute top-0 right-0 left-0 botton-0 z-0 md:z-[11]">
                    {children}
                </div>
            </div>
        </div>
    </div>
  )
}

export default layout