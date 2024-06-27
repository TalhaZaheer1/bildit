"use client";
import { Element, useEditor } from "@/providers/editor/EditorProvider";
import clsx from "clsx";
import { v4 } from "uuid";
import { defaultStyles } from "@/lib/constants";
import React from "react";
import { Badge } from "@/components/ui/badge";
import Recursive from "./Recursive";
import { Trash } from "lucide-react";

type Props = {
  element: Element;
};

export const changeIds = (element:Element) => {
    if(Array.isArray(element.content)){
        element.content = element.content.map(item => changeIds(item))
    }
    return {
        ...element,
        id:v4()
    }
}

const Container = ({ element }: Props) => {
    const { id, styles, type, content, name } = element;
  const { state, dispatch } = useEditor();
  const elementContent = content as Element[];
  const handleOnDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    const componant = JSON.parse(e.dataTransfer.getData("component"));
    let newComponent = componant; 
    if(componant.content)
        newComponent= changeIds(componant)
      console.log(newComponent)
    
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
            elementDetails: newComponent.id ? newComponent : {
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
        console.log("CHALA")
        dispatch({
          type: "ADD_ELEMENT",
          payload: {
            containerId: id,
            elementDetails: newComponent.id ? newComponent : {
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
  };

  const handleChangeSelected = (e:React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: "CHANGE_SELECTED_ELEMENT",
      payload: {
        elementDetails: element
      },
    });
  };


  const handleDeleteElement = (e:React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementId: id,
      },
    });
  };


  return (
    <div
    id="containerdiv"
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
      className={clsx("relative p-4 transition-all h-fit group", {
        "max-w-full w-full": type === "container" || type === "2Col",
        "h-fit": type === "container",
        "min-h-full h-fit": type === "__body",
        "overflow-scroll": type === "__body",
        "flex flex-col !md:flex-row": type === "2Col",
        "!border-blue-500":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          type !== "__body",
        "!border-yellow-400 !border-4":
          state.editor.selectedElement.id === id &&
          !state.editor.liveMode &&
          type === "__body",
        "!border-solid":
          state.editor.selectedElement.id === id && !state.editor.liveMode,
        "border-slate-500 border-dashed border-[1px]": !state.editor.liveMode,
      })}
      onDrop={(e) => handleOnDrop(e)}
      onDragOver={(e) => e.preventDefault()}
      draggable={type !== "__body"}
      onDragStart={(e) =>
        type !== "__body" &&
        e.dataTransfer.setData("component", JSON.stringify(element))
      }
      onClick={handleChangeSelected}
    >
      <Badge
        className={clsx(
          "absolute -top-[23px] -left-[1px] rounded-none rounded-t-lg hidden",
          {
            block:
              state.editor.selectedElement.id === id && !state.editor.liveMode,
          }
        )}
      >
        {name}
      </Badge>
      {Array.isArray(elementContent) &&
        elementContent.map((element) => <Recursive element={element} />)}
      {state.editor.selectedElement.id === id &&
        !state.editor.liveMode &&
        state.editor.selectedElement.type !== '__body' && (
          <div className="absolute bg-primary px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg ">
            <Trash
              size={16}
              onClick={handleDeleteElement}
            />
          </div>
        )}
    </div>
  );
};

export default Container;
