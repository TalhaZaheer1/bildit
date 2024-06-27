"use client"
import { useEditor } from '@/providers/editor/EditorProvider'
import React, { useState } from 'react'
import RecursiveAccordion from './RecursiveAccordian'

type Props = {}

const LayersTab = (props: Props) => {
    const { state} = useEditor()
  return (
    <RecursiveAccordion elements={state.editor.elements} padding={10}/>
  )
}

export default LayersTab