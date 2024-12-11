import React, { useState, useEffect } from "react";
import { useGameCourtContext } from "../../context/GameCourtContext";
import { PLAYER_STATUS } from "../../utils/players/constants";
import { formatTimeDifference } from "../../utils/common/functions";

export default function GameCourtMiddle() {
  const { number, courtPlayers, intervalRef } = useGameCourtContext();
  const [timer, setTimer] = useState();

  useEffect(() => {
    if (courtPlayers?.some((item) => item.status === PLAYER_STATUS["GAME"])) {
      intervalRef.current = setInterval(() => {
        if (courtPlayers[0]?.time) {
          setTimer(formatTimeDifference(courtPlayers[0].time));
        }
      }, 1000);
    } else {
      setTimer();
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [courtPlayers, intervalRef]);

  return (
    <div className="d-flex align-items-center gap-2">
      <div className="court-no fw-bold fs-5">{number}</div>
      {courtPlayers?.every((item) => item.status === PLAYER_STATUS["GAME"]) && (
        <div className="fs-6 text-white">{timer}</div>
      )}
    </div>
  );
}
