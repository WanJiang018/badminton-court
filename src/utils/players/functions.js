import { PLAYER_STATUS } from "./constants";

export const isActiveStatus = (status) =>
  [
    PLAYER_STATUS["GAME"],
    PLAYER_STATUS["REST"],
    PLAYER_STATUS["SELECTED"],
    PLAYER_STATUS["TEMP_LEAVE"],
  ].includes(status);

export const isReadOnlyStatus = (status) =>
  [PLAYER_STATUS["GAME"], PLAYER_STATUS["SELECTED"]].includes(status);
