import { DeviceTypes, Element } from "./EditorProvider";

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
