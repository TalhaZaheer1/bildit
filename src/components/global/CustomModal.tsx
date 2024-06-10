import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'

type Props = {
    title:string,
    subheading:string,
    defaultOpen:boolean,
    children:React.ReactNode
}

const CustomModal = ({title,subheading,defaultOpen,children}: Props) => {
    const { isOpen, setClose } = useModal()
    return (
        <Dialog
        open={isOpen || defaultOpen}
        onOpenChange={setClose}
        >
            <DialogContent className='overflow-y-scroll md:max-h-[700px] md:h-fit h-screen bg-card'>
                <DialogHeader className='pt-8 text-left' >
                    <DialogTitle className='text-2xl font-bold'>
                        {title}
                    </DialogTitle>
                    <DialogDescription>{subheading}</DialogDescription>
                {children}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}


export default CustomModal