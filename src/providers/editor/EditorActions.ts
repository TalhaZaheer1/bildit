import { DeviceTypes, EditorState, Element, addElement, deleteElement, initialEditorState, initialEditorUnitState, updateElement } from "./EditorProvider";

export type EditorAction =
  | {
      type: "ADD_ELEMENT";
      payload: {
        containerId: string;
        elementDetails: Element;
      };
    }
  | {
      type: "UPDATE_ELEMENT";
      payload: {
        elementDetails: Element;
      };
    }
  | {
      type: "DELETE_ELEMENT";
      payload: {
        elementId: string;
      };
    }
  | {
      type: "CHANGE_SELECTED_ELEMENT";
      payload: {
        elementDetails?:
          | Element
          | {
              id: "";
              type: null;
              content: [];
              styles: {};
              name: "";
            };
      };
    }
  | {
      type: "CHANGE_DEVICE";
      payload: {
        device: DeviceTypes;
      };
    }
  | {
      type: "TOGGLE_PREVIEW_MODE";
    }
  | {
      type: "TOGGLE_LIVE_MODE";
      payload?: {
        value: boolean;
      };
    }
  | {
      type: "REDO";
    }
  | {
      type: "UNDO";
    }
  | {
      type: "LOAD_DATA";
      payload: {
        elements: Element[];
        withLive: boolean;
      };
    }
  | {
      type: "SET_FUNNELPAGE_ID";
      payload: {
        funnelPageId: string;
      };
    };


    export const editorReducer = (
      state: EditorState = initialEditorState,
      action: EditorAction
    ): EditorState => {
      switch (action.type) {
        case "ADD_ELEMENT":
          const updatedElements = addElement(state.editor.elements, action);
          console.log(updatedElements,"ADDED")
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
          const isItSelected = state.editor.selectedElement.id === action.payload.elementDetails.id
          const updatedEditorUnitState = {
            ...state.editor,
            elements: updates,
            selectedElement: isItSelected ?  action.payload.elementDetails : state.editor.selectedElement
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