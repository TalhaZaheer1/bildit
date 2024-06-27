"use client";
import { Badge } from "@/components/ui/badge";
import { Element, useEditor } from "@/providers/editor/EditorProvider";
import clsx from "clsx";
import { Trash } from "lucide-react";
import React from "react";

type Props = {
  element: Element;
};

const Text = ({ element }: Props) => {
  const { dispatch, state } = useEditor();
  const {styles} = element;
  const handleChangeSelected = (e:React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: "CHANGE_SELECTED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };
  const handleDeleteElement = () => {
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementId: element.id,
      },
    })
  };
  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()
    e.dataTransfer.setData('component', JSON.stringify(element))
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
      className={clsx(
        "p-[2px] m-[5px] relative text-[16px] transition-all w-full",
        {
          "!border-blue-500 !border-solid":
            state.editor.selectedElement.id === element.id &&
            !state.editor.liveMode,
          "border-slate-500 border-dashed border-[1px]": !state.editor.liveMode,
        }
      )}
      onClick={handleChangeSelected}
      onDragStart={(e) => handleDragStart(e,)}
    >
      {state.editor.selectedElement.id === element.id &&
        !state.editor.liveMode && (
          <span className="absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg">
            <Badge>{state.editor.selectedElement.name}</Badge>
          </span>
        )}
        <span
        contentEditable={!state.editor.liveMode}
        onBlur={(e) => {
            dispatch({
                type:"UPDATE_ELEMENT",
                payload:{
                    elementDetails:{
                        ...element,
                        content:{
                            innerText:e.target.innerText
                        }
                    }
                }
            })
        }}
        >
            {!Array.isArray(element.content) && 
            element.content.innerText
            }
        </span>
        {
            state.editor.selectedElement.id === element.id && !state.editor.liveMode && (
                <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
                    <Trash 
                    className="cursor-pointer"
                    size={16}
                    onClick={handleDeleteElement}
                    />
                    </div>
            )
        }
    </div>
  );
};

export default Text;
