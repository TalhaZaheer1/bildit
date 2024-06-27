"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Element, useEditor } from "@/providers/editor/EditorProvider";
import { Link2Icon, TypeIcon } from "lucide-react";
import React from "react";

type Props = {
  elements: Element[];
  padding: number;
};

const RecursiveAccordion = ({ elements, padding }: Props) => {
  const { dispatch } = useEditor();
  const handleChangeSelected = (e: React.MouseEvent, elementFoo: Element) => {
    e.stopPropagation();
    dispatch({
      type: "CHANGE_SELECTED_ELEMENT",
      payload: {
        elementDetails: elementFoo,
      },
    });
  };
  return (
    <Accordion type="multiple">
      {elements.map((item) =>
        Array.isArray(item.content) && item.content.length ? (
          <AccordionItem className="!border-none" value={item.id}>
            <AccordionTrigger
              style={{
                paddingLeft: padding + "px",
              paddingRight:"10px"
            }}
              onClick={(e) => handleChangeSelected(e, item)}
              className="!no-underline bg-background hover:bg-white/20"
            >
              <div className="flex gap-3 items-center">
                <div className="border-[1px] border-dashed w-4 h-4 rounded-sm border-white bg-background" />
                {item.name}
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <RecursiveAccordion
                padding={padding + 10}
                elements={item.content}
              />
            </AccordionContent>
          </AccordionItem>
        ) : (
          <div
            style={{
              paddingLeft: padding + "px",
              paddingRight:"10px"
            }}
            className="flex gap-3 items-center text-sm bg-background py-4 hover:bg-white/10 cursor-pointer"
            onClick={(e) => handleChangeSelected(e, item)}
          >
            {item.type === "text" ? (
              <TypeIcon size={17} />
            ) : item.type === "link" ? (
              <Link2Icon />
            ) : (
              <div className="border-[1px] border-dashed w-4 h-4 rounded-sm border-white bg-background" />
            )}
            {item.name}
          </div>
        )
      )}
    </Accordion>
  );
};
export default RecursiveAccordion;
