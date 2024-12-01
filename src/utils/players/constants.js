export const DEFAULT_CREATE_LEVEL = 4;
export const SPECIAL_NAME = ["加加", "Josie", "josie"];

export const PLAYER_STATUS = {
  GAME: "game",
  REST: "rest",
  ABSENT: "absent",
  SELECTING: "selecting",
  TEMP_LEAVE: "temp-leave",
  PREPARE_NEXT: "prepare-next",
};

export const ACTIVE_PLAYER_TABLE_COLUMNS = [
  { name: "姓名", key: "name" },
  { name: "等級", key: "level", sort: true },
  { name: "狀態", key: ["status", "court"], sort: true },
  { name: "上場次數", key: "count", sort: true },
  { name: "", key: "action" },
];

export const INACTIVE_PLAYER_TABLE_COLUMNS = [
  { name: "姓名", key: "name" },
  { name: "等級", key: "level", sort: true },
  { name: "", key: "action" },
];
