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
  const handleChangeSelected = () => {
    dispatch({
      type: "CHANGE_SELECTED_ELEMENT",
      payload: {
        elementDetails: element,
      },
    });
  };
  const handleDeleteElement = () => [
    dispatch({
      type: "DELETE_ELEMENT",
      payload: {
        elementId: element.id,
      },
    }),
  ];
  return (
    <div
      style={element.styles}
      className={clsx(
        "p-[2px] m-[5px] relative text-[16px] transition-all w-full",
        {
          "!border-blue-500 !border-solid":
            state.editor.selectedElement.id === element.id &&
            !state.editor.liveMode,
          "border-slate-500 border-dashed border-[1px]": !state.editor.liveMode,
        }
      )}
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
