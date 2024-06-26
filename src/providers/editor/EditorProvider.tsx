"use client";
import { ElementTypes } from "@/lib/constants";
import { Dispatch, createContext, useContext, useReducer } from "react";
import { EditorAction, editorReducer } from "./EditorActions";
import { FunnelPageInterface } from "@/models/FunnelPage";

export type DeviceTypes = "Desktop" | "Mobile" | "Tablet";

export type Element = {
  id: string;
  name: string;
  type: ElementTypes;
  styles: React.CSSProperties;
  content: Element[] | {href?:string,innerText?:string,src?:string};
};

export type Editor = {
  liveMode: boolean;
  previewMode: boolean;
  elements: Element[];
  selectedElement: Element;
  funnelPageId: string;
  device: DeviceTypes;
};

export type EditorHistory = {
  stack: Editor[];
  currentIndex: number;
};

export type EditorState = {
  editor: Editor;
  history: EditorHistory;
};

export type EditorContextType = {
  state: EditorState;
  dispatch: Dispatch<EditorAction>;
  subAccountId: string;
  funnelId: string;
  pageDetails: FunnelPageInterface | null;
};

export const initialEditorUnitState: EditorState["editor"] = {
  liveMode: false,
  previewMode: false,
  elements: [
    { content: [], id: "__body", name: "body", styles: {}, type: "__body" },
  ],
  selectedElement: { content: [], id: "", name: "", styles: {}, type: null },
  funnelPageId: "",
  device: "Desktop",
};

const initialHistoryState: EditorState["history"] = {
  stack: [initialEditorUnitState],
  currentIndex: 0,
};

export const initialEditorState = {
  editor: initialEditorUnitState,
  history: initialHistoryState,
};

// const editorContext = createContext<EditorState>({
//   editor: initialEditorState,
//   history: initialHistoryState,
// });

export function addElement(editorArray: Element[], action: EditorAction): Element[] {
  if (action.type !== "ADD_ELEMENT")
    throw Error(
      "You sent the wrong action type to the Add Element editor State"
    );
  const newElementDetails = action.payload.elementDetails;
  const containerId = action.payload.containerId;
  return editorArray.map((item) => {
    if (item.id === containerId && Array.isArray(item.content)) {
      return {
        ...item,
        content: [...item.content, newElementDetails],
      };
    } else if (item.content && Array.isArray(item.content)) {
      return {
        ...item,
        content: addElement(item.content, action),
      };
    }
    return item;
  });
}

export function updateElement(
  editorArray: Element[],
  action: EditorAction
): Element[] {
  if (action.type !== "UPDATE_ELEMENT") {
    throw Error(
      "You sent the wrong action type to the Update Element editor State"
    );
  }
  const elementDetails = action.payload.elementDetails;
  return editorArray.map((item) => {
    if (item.id === elementDetails.id) {
      return {
        ...item,
        ...elementDetails,
      };
    } else if (Array.isArray(item.content)) {
      return {
        ...item,
        content: updateElement(item.content, action),
      };
    }
    return item;
  });
}

export function deleteElement(
  editorArray: Element[],
  action: EditorAction
): Element[] {
  if (action.type !== "DELETE_ELEMENT")
    throw Error(
      "You sent the wrong action type to the Delete Element editor State"
    );
  const elementId = action.payload.elementId;
  return editorArray.filter((item) => {
    if (item.id === elementId) {
      return false;
    } else if (item.content && Array.isArray(item.content)) {
      item.content = deleteElement(item.content, action);
    }
    return true;
  });
}


const EditorContext = createContext<EditorContextType>({
  state: initialEditorState,
  dispatch: () => undefined,
  subAccountId: "",
  funnelId: "",
  pageDetails: null,
});

export default function EditorContextProvider({
  subAccountId,
  funnelId,
  pageDetails,
  children,
}: {
  subAccountId: string;
  funnelId: string;
  pageDetails: FunnelPageInterface;
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState);

  return (
    <EditorContext.Provider
      value={{
        state: state,
        dispatch,
        subAccountId,
        funnelId,
        pageDetails,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const editorValue = useContext(EditorContext);
  if(!editorValue)
    throw Error("You are using useEditor hook outside the EditorProvider")
  return editorValue
}
