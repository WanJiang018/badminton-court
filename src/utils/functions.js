import { LEVELS, PLAYER_STATUS } from "./constants";

export function convertLevelItem(level) {
  return LEVELS.find((r) => level >= r.min && level <= r.max);
}

export const isActiveStatus = (status) =>
  [
    PLAYER_STATUS["GAME"],
    PLAYER_STATUS["REST"],
    PLAYER_STATUS["SELECTED"],
    PLAYER_STATUS["TEMP_LEAVE"],
  ].includes(status);

export const isReadOnlyStatus = (status) =>
  [PLAYER_STATUS["GAME"], PLAYER_STATUS["SELECTED"]].includes(status);

export const getRandomItem = (arr) => {
  if (!arr || arr.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};

export const formatTimeDifference = (pastTime) => {
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - pastTime;

  const hours = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
