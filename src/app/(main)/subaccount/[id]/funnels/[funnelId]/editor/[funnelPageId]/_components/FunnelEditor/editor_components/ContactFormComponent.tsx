'use client'
import FunnelContactForm, { ContactUserFormSchema } from '@/components/forms/FunnelContactForm'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { EditorBtns } from '@/lib/constants'
import {
  getFunnel,
saveActivityLogsNotifications,
  upsertContact,
} from '@/lib/queries'
import { FunnelPageInterface } from '@/models/FunnelPage'
import { Element, useEditor } from '@/providers/editor/EditorProvider'

import clsx from 'clsx'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

import React from 'react'
import { z } from 'zod'

type Props = {
  element: Element
}

const ContactFormComponent = (props: Props) => {
  const { dispatch, state, subAccountId, funnelId, pageDetails } = useEditor()
  const router = useRouter()

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('component', JSON.stringify({type:"contactForm"}))
  }

  const handleOnClickBody = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_SELECTED_ELEMENT',
      payload: {
        elementDetails: props.element,
      },
    })
  }

  const styles = props.element.styles

  const goToNextPage = async () => {
    if (!state.editor.liveMode) return
    const funnelPages = await getFunnel(funnelId)
    if (!funnelPages || !pageDetails) return
    if (funnelPages.funnelPages.length > pageDetails.order + 1) {
      const nextPage = funnelPages.funnelPages.find(
        (page:FunnelPageInterface) => page.order === pageDetails.order + 1
      )
      if (!nextPage) return
      console.log("NEXTPAGECOMP")
      router.replace(
        `${process.env.NEXT_PUBLIC_SCHEME}${funnelPages.subDomainName}.${process.env.NEXT_PUBLIC_DOMAIN}/${nextPage.pathName}`
      )
    }
  }

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { elementId: props.element.id },
    })
  }

  const onFormSubmit = async (
    values: z.infer<typeof ContactUserFormSchema>
  ) => {
    if (!state.editor.liveMode && !state.editor.previewMode) return

    try {
      const response = await upsertContact({
        ...values,
        subAccount: subAccountId,
      })
      //WIP Call trigger endpoint
      await saveActivityLogsNotifications({
        agencyId: undefined,
        description: `A New contact signed up | ${response?.name}`,
        subAccountId: subAccountId,
      })
      toast({
        title: 'Success',
        description: 'Successfully Saved your info',
      })
      await goToNextPage()
      console.log("CONTACT SAVED")
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: 'Could not save your information',
      })
    }
  }

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e)}
      onClick={handleOnClickBody}
      className={clsx(
        'p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center',
        {
          '!border-blue-500':
            state.editor.selectedElement.id === props.element.id,

          '!border-solid': state.editor.selectedElement.id === props.element.id,
          'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
        }
      )}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      <FunnelContactForm
        subTitle="Contact Us"
        title="Want a free quote? We can help you"
        apiCall={onFormSubmit}
      />
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
            <Trash
              className="cursor-pointer"
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  )
}

export default ContactFormComponent