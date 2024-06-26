"use client"
import { FunnelPageInterface } from '@/models/FunnelPage'
import EditorContextProvider from '@/providers/editor/EditorProvider'
import React from 'react'
import EditorNav from './EditorNav'
import EditorSideBar from './_sidebar'
import { createPortal } from 'react-dom'
import FunnelEditor from './FunnelEditor'

type Props = {
    id:string,
    funnelId:string,
    funnelPageId:string,
    pageDetails:FunnelPageInterface
}

const body = document.querySelector("body");

const Main = ({id,funnelId,pageDetails,funnelPageId}: Props) => {
  
    const child = <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
    <EditorContextProvider subAccountId={id} funnelId={funnelId} pageDetails={pageDetails}>
      <EditorNav
      subAccountId={id}
      funnelId={funnelId}
      pageDetails={pageDetails}
      />
      <EditorSideBar subAccountId={id} />
      <FunnelEditor funnelPageId={funnelPageId} />
    </EditorContextProvider>
    </div>
  // @ts-ignore
    return createPortal(child,body)
    
  
}

export default Main