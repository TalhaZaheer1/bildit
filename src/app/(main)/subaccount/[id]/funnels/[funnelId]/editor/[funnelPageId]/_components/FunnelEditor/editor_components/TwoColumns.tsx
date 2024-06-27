'use client'
import React from 'react'

import { v4 } from 'uuid'
import clsx from 'clsx'
import { Badge } from '@/components/ui/badge'
import { EditorBtns, defaultStyles } from '@/lib/constants'
import { Element, useEditor } from '@/providers/editor/EditorProvider'
import Recursive from './Recursive'
import { changeIds } from './Container'

type Props = {
  element: Element
}

const TwoColumns = (props: Props) => {
  const { id, content, type, styles } = props.element
  const { dispatch, state } = useEditor()

  const handleOnDrop = (e: React.DragEvent) => {
    e.stopPropagation()
    const component = JSON.parse(e.dataTransfer.getData('component'));
    let newComponent = component;
    if(newComponent.id)
        newComponent = changeIds(component);
    switch (newComponent.type) {
        case "text":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: newComponent.id ? newComponent :{
                id: v4(),
                type: "text",
                name: "Text",
                styles: {
                  color: "black",
                  ...defaultStyles,
                },
                content: {
                  innerText: "Text Element",
                },
              },
            },
          });
          break;
        case "link":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: newComponent.id ? newComponent : {
                id: v4(),
                type: "link",
                name: "Link",
                styles: {
                  color: "black",
                  ...defaultStyles,
                },
                content: {
                  href: "",
                  innerText: "Link Element",
                },
              },
            },
          });
          break;
        case "container":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails:  newComponent.id ? newComponent : {
                id: v4(),
                type: "container",
                name: "Container",
                styles: { ...defaultStyles },
                content: [],
              },
            },
          });
          break;
        case "video":
          console.log(newComponent,"VIDEO")
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: newComponent.id ? newComponent : {
                id: v4(),
                type: "video",
                name: "Video",
                styles: {},
                content: {
                  src: "https://www.youtube.com/embed/GMZt_JwLA",
                }
              }
            }
          });
          break;
        case "paymentForm":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: {
                id: v4(),
                type: "paymentForm",
                name: "Payment Form",
                styles: {},
                content: [],
              },
            },
          });
          break;
        case "contactForm":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails: {
                id: v4(),
                type: "contactForm",
                name: "Contact Form",
                styles: {},
                content: [],
              },
            },
          });
          break;
        case "2Col":
          dispatch({
            type: "ADD_ELEMENT",
            payload: {
              containerId: id,
              elementDetails:  {
                id: v4(),
                type: "2Col",
                name: "Two Columns",
                styles: {
                  ...defaultStyles,
                  display: "flex",
                },
                content: [
                  {
                    id: v4(),
                    type: "container",
                    name: "Container",
                    styles: { ...defaultStyles, width: "100%" },
                    content: [],
                  },
                  {
                    id: v4(),
                    type: "container",
                    name: "Container",
                    styles: { ...defaultStyles, width: "100%" },
                    content: [],
                  },
                ],
              },
            },
          });
          break;
      }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }
  const handleDragStart = (e: React.DragEvent) => {
    if (type === '__body') return
    e.dataTransfer.setData('component', JSON.stringify(props.element))
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

  return (
    <div
      style={{
        ...styles,
        width:isNaN(Number(styles.width)) ?  styles.width  : !styles.width ? "100%" : styles.width + "px",
        height:isNaN(Number(styles.height)) ?  styles.height  : !styles.height ? "fit-content" : styles.height + "px", 
        paddingTop:isNaN(Number(styles.paddingTop)) ?  styles.paddingTop  : !styles.paddingTop ? "16px" : styles.paddingTop + "px",
        paddingBottom:isNaN(Number(styles.paddingBottom)) ?  styles.paddingBottom  : !styles.paddingBottom ? "16px" : styles.paddingBottom + "px", 
        paddingLeft:isNaN(Number(styles.paddingLeft)) ?  styles.paddingLeft  : !styles.paddingLeft ? "16px" : styles.paddingLeft + "px", 
        paddingRight:isNaN(Number(styles.paddingRight)) ?  styles.paddingRight  : !styles.paddingRight ? "16px" : styles.paddingRight + "px", 
        marginTop:isNaN(Number(styles.marginTop)) ?  styles.marginTop  : !styles.marginTop ? "0" : styles.marginTop + "px", 
        marginBottom:isNaN(Number(styles.marginBottom)) ?  styles.marginBottom  : !styles.marginBottom ? "0" : styles.marginBottom + "px", 
        marginLeft:isNaN(Number(styles.marginLeft)) ?  styles.marginLeft  : !styles.marginLeft ? "0" : styles.marginLeft + "px", 
        marginRight:isNaN(Number(styles.marginRight)) ?  styles.marginRight  : !styles.marginRight ? "0" : styles.marginRight + "px", 

    }}
      className={clsx('relative p-4 transition-all', {
        'h-fit': type === 'container',
        'h-full': type === '__body',
        'm-4': type === 'container',
        '!border-blue-500':
          state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode,
        '!border-solid':
          state.editor.selectedElement.id === props.element.id &&
          !state.editor.liveMode,
        'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
      })}
      id="innerContainer"
      onDrop={(e) => handleOnDrop(e)}
      onDragOver={handleDragOver}
      draggable={type !== '__body'}
      onClick={handleOnClickBody}
      onDragStart={(e) => handleDragStart(e)}
    >
      {state.editor.selectedElement.id === props.element.id &&
        !state.editor.liveMode && (
          <Badge className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg ">
            {state.editor.selectedElement.name}
          </Badge>
        )}
      {Array.isArray(content) &&
        content.map((childElement) => (
          <Recursive
            key={childElement.id}
            element={childElement}
          />
        ))}
    </div>
  )
}

export default TwoColumns