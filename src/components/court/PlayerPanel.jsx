import React, { useState } from "react";
import { useSelector } from "react-redux";
import { PLAYER_STATUS } from "../../utils/players/constants";
import PlayerCard from "./PlayerCard";
import DropSection from "../common/DropSection";
import MoveableItem from "../common/MoveableItem";
import ArrowUpIcon from "../../images/icon-arrow-up.svg";
import ArrowDownIcon from "../../images/icon-arrow-down.svg";

export default function PlayerPanel() {
  const { players } = useSelector((state) => state.players);
  const [expand, setExpand] = useState(true);

  return (
    <div
      className="fixed-bottom p-2 bg-main-light"
      style={{
        height: expand ? "auto" : "36px",
      }}
    >
      <div className="text-end">
        <img
          src={expand ? ArrowDownIcon : ArrowUpIcon}
          alt="edit"
          onClick={() => setExpand(!expand)}
          className="cursor-pointer"
          width="16"
        />
      </div>
      <div className="row">
        <div className="col-sm-8">
          <span className="fs-6 fw-bold">休息區</span>
          <DropSection props={{ status: PLAYER_STATUS["REST"] }}>
            <div className="player-block d-flex flex-wrap gap-2">
              {players
                .filter(
                  (item) =>
                    item.name !== "" && item.status === PLAYER_STATUS["REST"]
                )
                .sort(
                  (a, b) => a.count - b.count || (a.time || 0) - (b.time || 0)
                )
                .map((item) => (
                  <MoveableItem props={item}>
                    <PlayerCard size="small" key={item.id} player={item} />
                  </MoveableItem>
                ))}
            </div>
          </DropSection>
        </div>
        <div className="col-sm-4">
          <span className="fs-6 fw-bold">暫離區</span>
          <DropSection props={{ status: PLAYER_STATUS["TEMP_LEAVE"] }}>
            <div className="player-block d-flex flex-wrap gap-2">
              {players
                .filter((item) => item.status === PLAYER_STATUS["TEMP_LEAVE"])
                .map((item) => (
                  <MoveableItem props={item}>
                    <PlayerCard size="small" key={item.id} player={item} />
                  </MoveableItem>
                ))}
            </div>
          </DropSection>
        </div>
      </div>
    </div>
  );
}
