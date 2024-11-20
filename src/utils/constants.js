export const DEFAULT_COURT = 1;
export const SPECIAL_NAME = ["加加", "Josie", "josie"];
export const MENU_DEF = {
  ARRANGE: "arrange",
  PLAYER: "player",
  HISTORY: "history",
};

export const MENU_ITEMS = [
  { value: MENU_DEF["ARRANGE"], name: "場地安排" },
  { value: MENU_DEF["PLAYER"], name: "球友列表" },
  { value: MENU_DEF["HISTORY"], name: "歷史對戰" },
];

export const PLAYER_STATUS = {
  GAME: "game",
  REST: "rest",
  ABSENT: "absent",
  SELECTED: "selected",
  TEMP_LEAVE: "temp-leave",
};

export const PLAYER_ACTION = {
  SWITCH_ACTIVE: "switch-active",
  SWITCH_LEAVE: "switch-leave",
  DELETE: "delete",
};

export const LEVEL_DEF = {
  BEGINNER: "beginner",
  NOVICE: "novice",
  LOW_INTERMEDIATE: "low-intermediate",
  INTERMEDIATE: "intermediate",
  UPPER_INTERMEDIATE: "upper-intermediate",
  ADVANCED: "advanced",
  PROFESSIONAL: "professional",
  COACH: "coach",
};

export const LEVELS = [
  {
    level: LEVEL_DEF["BEGINNER"],
    name: "新手",
    min: 1,
    max: 3,
  },
  {
    level: LEVEL_DEF["NOVICE"],
    name: "初階",
    min: 4,
    max: 5,
  },
  {
    level: LEVEL_DEF["LOW_INTERMEDIATE"],
    name: "初中階",
    min: 6,
    max: 7,
  },
  {
    level: LEVEL_DEF["INTERMEDIATE"],
    name: "中階",
    min: 8,
    max: 9,
  },
  {
    level: LEVEL_DEF["UPPER_INTERMEDIATE"],
    name: "中進階",
    min: 10,
    max: 12,
  },
  {
    level: LEVEL_DEF["ADVANCED"],
    min: 13,
    max: 15,
    name: "高階",
  },
  {
    level: LEVEL_DEF["PROFESSIONAL"],
    min: 16,
    max: 18,
    name: "職業",
  },
  {
    level: LEVEL_DEF["COACH"],
    min: 99,
    max: 99,
    name: "教練",
  },
];

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
