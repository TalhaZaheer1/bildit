"use client";
import { ElementTypes } from "@/lib/constants";
import { Dispatch, createContext, useContext, useReducer } from "react";
import { EditorAction } from "./EditorActions";
import { FunnelPageInterface } from "@/models/FunnelPage";

export type DeviceTypes = "Desktop" | "Mobile" | "Tablet";

export type Element = {
  id: string;
  name: string;
  type: ElementTypes;
  styles: React.CSSProperties;
  content: Element[] | {};
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

const initialEditorUnitState: EditorState["editor"] = {
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

const initialEditorState = {
  editor: initialEditorUnitState,
  history: initialHistoryState,
};

// const editorContext = createContext<EditorState>({
//   editor: initialEditorState,
//   history: initialHistoryState,
// });

function addElement(editorArray: Element[], action: EditorAction): Element[] {
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

function updateElement(
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

function deleteElement(
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
const editorReducer = (
  state: EditorState = initialEditorState,
  action: EditorAction
): EditorState => {
  switch (action.type) {
    case "ADD_ELEMENT":
      const updatedElements = addElement(state.editor.elements, action);
      const updatedEditorUnitState = {
        ...state.editor,
        elements: updatedElements,
      };
      const updatedHistoryStack = [
        ...state.history.stack.slice(0, state.history.currentIndex + 1),
        updatedEditorUnitState,
      ];
      const updatedHistoryState = {
        stack: updatedHistoryStack,
        currentIndex: updatedHistoryStack.length - 1,
      };
      return {
        ...state,
        editor: updatedEditorUnitState,
        history: updatedHistoryState,
      };
    case "UPDATE_ELEMENT": {
      const updates = updateElement(state.editor.elements, action);
      const updatedEditorUnitState = {
        ...state.editor,
        elements: updates,
      };
      const updatedHistoryStack = [
        ...state.history.stack.slice(0, state.history.currentIndex + 1),
        updatedEditorUnitState,
      ];
      return {
        ...state,
        editor: updatedEditorUnitState,
        history: {
          stack: updatedHistoryStack,
          currentIndex: updatedHistoryStack.length - 1,
        },
      };
    }
    case "DELETE_ELEMENT": {
      const updates = deleteElement(state.editor.elements, action);
      const updatedEditorUnitState = {
        ...state.editor,
        elements: updates,
      };
      const updatedHistoryStack = [
        ...state.history.stack.slice(0, state.history.currentIndex + 1),
        updatedEditorUnitState,
      ];
      return {
        ...state,
        editor: updatedEditorUnitState,
        history: {
          stack: updatedHistoryStack,
          currentIndex: updatedHistoryStack.length - 1,
        },
      };
    }
    case "CHANGE_SELECTED_ELEMENT":
      return {
        ...state,
        editor: {
          ...state.editor,
          selectedElement: action.payload.elementDetails || {
            id: "",
            content: [],
            name: "",
            styles: {},
            type: null,
          },
        },
      };
    case "CHANGE_DEVICE":
      return {
        ...state,
        editor: {
          ...state.editor,
          device: action.payload.device,
        },
      };
    case "TOGGLE_PREVIEW_MODE":
      return {
        ...state,
        editor: {
          ...state.editor,
          previewMode: !state.editor.previewMode,
        },
      };
    case "TOGGLE_LIVE_MODE":
      return {
        ...state,
        editor: {
          ...state.editor,
          liveMode: action?.payload?.value || !state.editor.liveMode,
        },
      };
    case "REDO":
      if (state.history.currentIndex < state.history.stack.length - 1)
        return {
          ...state,
          editor: state.history.stack[state.history.currentIndex + 1],
          history: {
            ...state.history,
            currentIndex: state.history.currentIndex + 1,
          },
        };
      return state;
    case "UNDO":
      if (state.history.currentIndex > 0)
        return {
          ...state,
          editor: state.history.stack[state.history.currentIndex - 1],
          history: {
            ...state.history,
            currentIndex: state.history.currentIndex - 1,
          },
        };
      return state;
    case "LOAD_DATA":
      return {
        ...initialEditorState,
        editor: {
          ...initialEditorUnitState,
          elements: action.payload.elements || initialEditorUnitState.elements,
          liveMode: action.payload.withLive,
        },
      };
    case "SET_FUNNELPAGE_ID": {
      const updatedEditorUnitState = {
        ...state.editor,
        funnelPageId: action.payload.funnelPageId,
      };
      return {
        ...state,
        editor: updatedEditorUnitState,
        history: {
          stack: [
            ...state.history.stack.slice(0, state.history.currentIndex + 1),
            updatedEditorUnitState,
          ],
          currentIndex: state.history.currentIndex + 1,
        },
      };
    }
    default:
      return state;
  }
};

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
