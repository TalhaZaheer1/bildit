import { Element } from '@/providers/editor/EditorProvider'
import clsx from 'clsx'
import React from 'react'

type Props = {
    element:Element
}

const Container = ({element:{id,styles,type,content,name}}: Props) => {
  
  
    return (
    <div
    style={styles}
    className={clsx("realtive p-4 transition-all group",{
        "max-w-full w-full": type === "container" || type === "2Col"
    })}
    >Container</div>
  )


export default Container