import { DndActionTypes } from "../actions/dndActions";

const initialState = {
  isDragging: false,
  activeId: null,
  parent: null,
};

const dndReducer = (state = initialState, action) => {
  switch (action.type) {
    case DndActionTypes["DRAG_START"]: {
      return {
        ...state,
        isDragging: true,
        activeId: action.payload,
      };
    }
    case DndActionTypes["DRAG_END"]: {
      return {
        ...state,
        isDragging: false,
      };
    }
    case DndActionTypes["DRAG_OVER"]: {
      return {
        ...state,
        parent: action.payload,
      };
    }
    default:
      return state;
  }
};

export default dndReducer;
