"use client"
import { useModal } from '@/providers/ModalProvider'
import React from 'react'
import { Button } from '../ui/button'
import CustomModal from '../global/CustomModal'
import MediaUploadForm from '../forms/MediaUploadForm'

type Props = {
    subAccountId:string
}

const MediaUploadButton = ({subAccountId}: Props) => {
    const { isOpen, setOpen } = useModal()
  return (
    <Button onClick={() => setOpen(<CustomModal title='Upload Media' subheading='You can use these in your funnels' defaultOpen={false}>
        <MediaUploadForm  subAccountId={subAccountId} />
    </CustomModal>)}>Upload</Button>
  )
}

export default MediaUploadButton