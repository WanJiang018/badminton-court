import React from "react";
import { PLAYER_STATUS, SPECIAL_NAME } from "../../utils/players/constants";
import { convertLevelItem } from "../../utils/common/functions";

export default function PlayerCard({ player, size = "medium" }) {
  return (
    player && (
      <div
        className={`${
          player?.status === PLAYER_STATUS["SELECTING"] ? "float" : ""
        }  ${size === "small" ? "small" : ""} ${
          convertLevelItem(player?.level)?.level
        } player`}
      >
        {SPECIAL_NAME.includes(player?.name) ? "🐶 " : ""}
        {player?.name}
      </div>
    )
  );
}
