import { createContext, useContext } from "react";

const GameCourtContext = createContext();
export const useGameCourtContext = () => useContext(GameCourtContext);

export default GameCourtContext;
