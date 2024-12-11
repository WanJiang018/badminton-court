import { combineReducers } from "redux";
import playerReducer from "./playerReducer";
import courtReducer from "./courtReducer";
import dndReducer from "./dndReducer";

const rootReducer = combineReducers({
  players: playerReducer,
  courts: courtReducer,
  dnd: dndReducer,
});

export default rootReducer;
