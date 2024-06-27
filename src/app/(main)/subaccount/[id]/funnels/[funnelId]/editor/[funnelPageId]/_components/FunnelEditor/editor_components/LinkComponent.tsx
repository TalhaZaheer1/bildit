'use client'
import { Badge } from '@/components/ui/badge'
import { EditorBtns } from '@/lib/constants'
import { Element, useEditor } from '@/providers/editor/EditorProvider'

import clsx from 'clsx'
import { Trash } from 'lucide-react'
import Link from 'next/link'

import React, { useRef } from 'react'

type Props = {
  element: Element
}

const LinkComponent = (props: Props) => {
  const { dispatch, state } = useEditor()

  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return
    e.dataTransfer.setData('component', JSON.stringify(state.editor.selectedElement))
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

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { elementId: props.element.id },
    })
  }

  return (
    <div
      style={{...styles,
        width:isNaN(Number(styles.width)) ?  styles.width  : !styles.width ? "100%" : styles.width + "px",
        height:isNaN(Number(styles.height)) ?  styles.height  : !styles.height ? "fit-content" : styles.height + "px", 
        paddingTop:isNaN(Number(styles.paddingTop)) ?  styles.paddingTop  : !styles.paddingTop ? "2px" : styles.paddingTop + "px",
        paddingBottom:isNaN(Number(styles.paddingBottom)) ?  styles.paddingBottom  : !styles.paddingBottom ? "2px" : styles.paddingBottom + "px", 
        paddingLeft:isNaN(Number(styles.paddingLeft)) ?  styles.paddingLeft  : !styles.paddingLeft ? "2px" : styles.paddingLeft + "px", 
        paddingRight:isNaN(Number(styles.paddingRight)) ?  styles.paddingRight  : !styles.paddingRight ? "2px" : styles.paddingRight + "px", 
        marginTop:isNaN(Number(styles.marginTop)) ?  styles.marginTop  : !styles.marginTop ? "5px" : styles.marginTop + "px", 
        marginBottom:isNaN(Number(styles.marginBottom)) ?  styles.marginBottom  : !styles.marginBottom ? "5px" : styles.marginBottom + "px", 
        marginLeft:isNaN(Number(styles.marginLeft)) ?  styles.marginLeft  : !styles.marginLeft ? "5px" : styles.marginLeft + "px", 
        marginRight:isNaN(Number(styles.marginRight)) ?  styles.marginRight  : !styles.marginRight ? "5px" : styles.marginRight + "px", 

      }}
      draggable
      onDragStart={(e) => handleDragStart(e, 'text')}
      onClick={handleOnClickBody}
      className={clsx(
        'p-[2px] w-full m-[5px] relative text-[16px] transition-all',
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
      {!Array.isArray(props.element.content) &&
        (state.editor.previewMode || state.editor.liveMode) && (
          <Link href={props.element.content.href || '#'}>
            {props.element.content.innerText}
          </Link>
        )}
      {!state.editor.previewMode && !state.editor.liveMode && (
        <span
          contentEditable={!state.editor.liveMode}
          onBlur={(e) => {
            const spanElement = e.target as HTMLSpanElement
            dispatch({
              type: 'UPDATE_ELEMENT',
              payload: {
                elementDetails: {
                  ...props.element,
                  content: {
                    innerText: spanElement.innerText,
                  },
                },
              },
            })
          }}
        >
          {!Array.isArray(props.element.content) &&
            props.element.content.innerText}
        </span>
      )}
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

export default LinkComponent