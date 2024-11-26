import { combineReducers } from "redux";
import playerReducer from "./playerReducer";
import courtReducer from "./courtReducer";

const rootReducer = combineReducers({
  players: playerReducer,
  courts: courtReducer,
});

export default rootReducer;
