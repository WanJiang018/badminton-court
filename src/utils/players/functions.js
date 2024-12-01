import { PLAYER_STATUS } from "./constants";

export const isActiveStatus = (status) =>
  [
    PLAYER_STATUS["GAME"],
    PLAYER_STATUS["REST"],
    PLAYER_STATUS["SELECTING"],
    PLAYER_STATUS["TEMP_LEAVE"],
    PLAYER_STATUS["PREPARE_NEXT"],
  ].includes(status);

export const isReadOnlyStatus = (status) =>
  [
    PLAYER_STATUS["GAME"],
    PLAYER_STATUS["SELECTING"],
    PLAYER_STATUS["PREPARE_NEXT"],
  ].includes(status);
