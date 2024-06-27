"use client"
import { UserInterface } from '@/models/User'
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { Button } from '../ui/button'
import { twMerge } from 'tailwind-merge'
import CustomModal from './CustomModal'
import SubAccountDetails from '../forms/SubAccountDetails'
import { AgencyInterface } from '@/models/Agency'
import { PlusCircleIcon } from 'lucide-react'

type Props = {
    user:UserInterface,
    id:string,
    className:string
}

const CreateSubAccount = ({className,user,id}: Props) => {  
  const { setOpen } = useModal()
    return (
    <Button
    className={twMerge("w-full flex gap-1",className)}
    onClick={() => {
      setOpen(<CustomModal
      title='Create Sub Account'
      subheading='Fill out the details'
      defaultOpen={false}
      >
        <SubAccountDetails 
        userId={user?._id as string}
        agency={user?.agency as AgencyInterface}
        userName={user?.name}
        />
      </CustomModal>)
    }}
    >
        <PlusCircleIcon size={17}/>
        Create Sub Account
    </Button>
  )
}

export default CreateSubAccount