import React, { useState, useEffect, useRef } from "react";
import { PLAYER_STATUS, SPECIAL_NAME } from "../utils/constants";
import {
  convertLevelItem,
  formatTimeDifference,
  getRandomItem,
} from "../utils/functions";
import ConfirmIcon from "../images/icon-confirm.svg";

export default function PlayerCard({ player, players }) {
  const [editMode, setEditMode] = useState(false);

  const playerOptions = players?.filter(
    (item) =>
      item.status === PLAYER_STATUS["REST"] ||
      (item.status === PLAYER_STATUS["SELECTED"] &&
        item.court === player?.court)
  );

  useEffect(() => {
    setEditMode(false);
  }, [player]);

  return (
    <div className="col-5 d-flex justify-content-center align-items-center">
      {player && (
        <>
          {!editMode ? (
            <span
              className={`d-flex align-items-center gap-2 ${
                player?.status === PLAYER_STATUS["SELECTED"] &&
                !editMode &&
                "float"
              } player ${convertLevelItem(player?.level)?.level}`}
            >
              {SPECIAL_NAME.includes(player?.name) ? "🐶 " : ""}
              {player?.name}
              {/* <img
                  src={EditIcon}
                  class="cursor-pointer"
                  alt="edit"
                  width="12"
                  onClick={() => setEditMode(true)}
                /> */}
            </span>
          ) : (
            <div className="d-flex justify-content-center align-items-center gap-2">
              <select
                className="form-select form-select-sm"
                value={player?.id}
                // onChange={(e) => setEditLevel(e.target.value)}
              >
                {playerOptions?.map((item) => (
                  <option
                    value={item.id}
                    className={convertLevelItem(item)?.level}
                  >
                    {item?.name}
                  </option>
                ))}
              </select>
              <img
                src={ConfirmIcon}
                class="cursor-pointer svg-icon-white"
                alt="edit"
                width="20"
                onClick={() => setEditMode(false)}
              />
            </div>
          )}
        </>
      )}
      {/* <img src={PeopleChangeIcon} alt="change" width="20" height="20" /> */}
    </div>
  );
}
