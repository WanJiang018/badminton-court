import React, { useEffect, useState, useRef, useMemo } from "react";
import { PLAYER_STATUS, SPECIAL_NAME } from "../../utils/players/constants";
import {
  convertLevelItem,
  formatTimeDifference,
} from "../../utils/common/functions";
import { LEVEL_DEF } from "../../utils/common/constants";

export default function PlayerCard({ player, size = "medium" }) {
  const intervalRef = useRef();
  const [timer, setTimer] = useState();
  const levelItem = convertLevelItem(player?.level)?.level;
  const textColor = useMemo(
    () =>
      levelItem === LEVEL_DEF["PROFESSIONAL"] ? "text-light" : "text-muted",
    [levelItem]
  );

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (player?.time) {
        setTimer(formatTimeDifference(player.time));
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [player, intervalRef]);

  return (
    player && (
      <div
        className={`${
          player?.status === PLAYER_STATUS["SELECTING"] ? "float" : ""
        }  ${size === "small" ? "small" : ""} ${levelItem} player shadow-sm`}
        style={{
          "user-select": "none",
          "-webkit-user-select": "none",
          "-moz-user-select": "none",
        }}
      >
        <div className="position-relative">
          <div>
            {SPECIAL_NAME.includes(player?.name) ? "🐶 " : ""}
            {player?.name}
          </div>
          {timer &&
            (player?.status === PLAYER_STATUS["REST"] ||
              player?.status === PLAYER_STATUS["TEMP_LEAVE"]) && (
              <div className={`fs-8 ${textColor}`}>{timer}</div>
            )}
          <div
            className="position-absolute"
            style={{
              top: size === "small" ? "-6px" : "-12px",
              right: size === "small" ? "-2px" : "-6px",
            }}
          >
            <span className={`fs-8 ${textColor}`}>{player?.count}</span>
          </div>
        </div>
      </div>
    )
  );
}
