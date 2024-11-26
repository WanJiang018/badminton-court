import { CourtActionTypes } from "../actions/courtActions";
import { DEFAULT_COURT } from "../../utils/courts/constants";

const initialState = {
  courts: [],
};

const courtReducer = (state = initialState, action) => {
  switch (action.type) {
    case CourtActionTypes["GET"]: {
      const courts = JSON.parse(localStorage.getItem("courts"));
      return {
        ...state,
        courts:
          courts || Array.from({ length: DEFAULT_COURT }, (_, i) => i + 1),
      };
    }
    case CourtActionTypes["CREATE"]: {
      const maxCourt = Math.max(...state.courts);
      const result = [...state.courts, maxCourt + 1];
      storeCourtsData(result);
      return { ...state, courts: result };
    }
    case CourtActionTypes["DELETE"]: {
      const result = state.courts.filter(
        (courtNo) => courtNo !== action.payload
      );
      storeCourtsData(result);
      return { ...state, courts: result };
    }
    default:
      return state;
  }
};

const storeCourtsData = (courts) =>
  localStorage.setItem("courts", JSON.stringify(courts));

export default courtReducer;
