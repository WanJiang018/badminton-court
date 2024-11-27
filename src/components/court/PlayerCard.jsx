import React from "react";
import { PLAYER_STATUS, SPECIAL_NAME } from "../../utils/players/constants";
import { convertLevelItem } from "../../utils/common/functions";

export default function PlayerCard({ player }) {
  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      {player && (
        <span
          className={`d-flex align-items-center gap-2 ${
            player?.status === PLAYER_STATUS["SELECTED"] && "float"
          } player ${convertLevelItem(player?.level)?.level}`}
        >
          {SPECIAL_NAME.includes(player?.name) ? "🐶 " : ""}
          {player?.name}
        </span>
      )}
    </div>
  );
}
