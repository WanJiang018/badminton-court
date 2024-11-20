import React, { useState, useEffect, useRef } from "react";
import { PLAYER_STATUS, SPECIAL_NAME } from "../utils/constants";
import {
  convertLevelItem,
  formatTimeDifference,
  getRandomItem,
} from "../utils/functions";
import RandomIcon from "../images/icon-random.png";
import DeleteIcon from "../images/icon-delete.svg";
import ResetIcon from "../images/icon-reset.png";
import ConfirmIcon from "../images/icon-confirm.png";
import CancelIcon from "../images/icon-cancel.png";
import ScoreIcon from "../images/icon-21.png";

export default function Court({
  players,
  number,
  virtual,
  onCreate,
  onDelete,
  onUpdatePlayer,
}) {
  const [courtPlayers, setCourtPlayers] = useState([]);
  const [timer, setTimer] = useState();
  const intervalRef = useRef();

  const handleRandom = () => {
    const restPlayers = players
      ?.filter(
        (item) =>
          item.status === PLAYER_STATUS["REST"] ||
          (item.status === PLAYER_STATUS["SELECTED"] && item.court === number)
      )
      .sort((a, b) => a.count - b.count)
      .sort((a, b) => {
        // If both times are undefined, maintain current order
        if (!a.time && !b.time) return 0;
        // If a.time is undefined, put a first
        if (!a.time) return -1;
        // If b.time is undefined, put b first
        if (!b.time) return 1;
        // Otherwise sort by time
        return a.time - b.time;
      });

    if (!restPlayers || restPlayers?.length < 4) {
      alert("人數不足，無法排場");
      return;
    }

    const player0 = getRandomItem(restPlayers.slice(0, 4));
    const similarLevelPlayers = getPlayers(player0, restPlayers).slice(0, 3);
    let selectedPlayers = [player0, ...similarLevelPlayers];
    const levelsWithinRange = checkAllSimilarLevelsWithinRange(selectedPlayers);

    if (!levelsWithinRange) {
      const player2 = getPlayers(player0, restPlayers)[0];

      const pairPlayer = restPlayers?.filter((item) => item.id !== player0.id);
      const player1 = getPlayers(player2, pairPlayer)[0];

      const team1Level = player0?.level + player1?.level;

      const team2Players = restPlayers?.filter(
        (item) => item.id !== player0.id && item.id !== player1.id
      );
      const team2Candidates = getTeam2Candidates(
        team2Players,
        team1Level
      ).filter(
        (item) => item[0].id === player2.id || item[1].id === player2.id
      );
      const team2BestPair = findClosestPair(player0, player1, team2Candidates);
      const player3 = team2BestPair.find((item) => item.id !== player2.id);

      selectedPlayers = [player0, player1, player2, player3];
    }

    const { maxPlayer, minPlayer } = findMaxMinLevelPlayers(selectedPlayers);
    const group1 = [selectedPlayers[0].id, selectedPlayers[1].id];
    const group2 = [selectedPlayers[2].id, selectedPlayers[3].id];
    if (
      (group1.includes(maxPlayer.id) && group2.includes(minPlayer.id)) ||
      (group2.includes(maxPlayer.id) && group1.includes(minPlayer.id))
    ) {
      selectedPlayers = [
        maxPlayer,
        minPlayer,
        ...selectedPlayers.filter(
          (item) => item.id !== maxPlayer.id && item.id !== minPlayer.id
        ),
      ];
    }
    updateCourtPlayers(selectedPlayers);
  };

  const updateCourtPlayers = (selectedPlayers) => {
    setCourtPlayers(selectedPlayers);
    onUpdatePlayer(
      number,
      PLAYER_STATUS["SELECTED"],
      selectedPlayers.map((item) => item.id)
    );
  };

  const handleFinished = () => {
    clearInterval(intervalRef?.current);
    setCourtPlayers([]);
    onUpdatePlayer(number, PLAYER_STATUS["REST"], [
      courtPlayers[0].id,
      courtPlayers[1].id,
      courtPlayers[2].id,
      courtPlayers[3].id,
    ]);
  };

  const handleConfirm = () => {
    onUpdatePlayer(
      number,
      PLAYER_STATUS["GAME"],
      courtPlayers.map((item) => item.id)
    );
  };

  const handleCancelRandom = () => {
    setCourtPlayers([]);
    onUpdatePlayer(number, PLAYER_STATUS["REST"], [
      courtPlayers[0].id,
      courtPlayers[1].id,
      courtPlayers[2].id,
      courtPlayers[3].id,
    ]);
  };

  const checkAllSimilarLevelsWithinRange = (players) => {
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        if (Math.abs(players[i].level - players[j].level) > 1) {
          return false;
        }
      }
    }
    return true;
  };

  const findClosestPair = (player0, player1, team2Candidates) => {
    const levelDifferenceA = Math.abs(player0.level - player1.level);
    let closestPair = null;
    let closestDifference = Infinity;

    team2Candidates.forEach((pair) => {
      const [player2, player3] = pair;
      const levelDifferenceB = Math.abs(player2.level - player3.level);
      const difference = Math.abs(levelDifferenceA - levelDifferenceB);

      if (difference < closestDifference) {
        closestDifference = difference;
        closestPair = pair;
      }
    });

    return closestPair;
  };

  const findMaxMinLevelPlayers = (players) => {
    if (!players || players.length === 0)
      return { maxPlayer: null, minPlayer: null };

    let maxPlayer = players[0];
    let minPlayer = players[0];

    players.forEach((player) => {
      if (player.level > maxPlayer.level) {
        maxPlayer = player;
      }
      if (player.level < minPlayer.level) {
        minPlayer = player;
      }
    });

    return { maxPlayer, minPlayer };
  };

  const getPlayers = (player0, players) =>
    players
      ?.filter((item) => item?.id !== player0?.id)
      ?.sort((a, b) => {
        const diff =
          Math.abs(player0?.level - a?.level) -
          Math.abs(player0?.level - b?.level);
        return diff;
      })
      .sort((a, b) => a?.count - b?.count);

  const getTeam2Candidates = (players, level) => {
    const result = [];
    for (let i = 0; i < players?.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        const sum = players[i].level + players[j].level;
        result.push({ pair: [players[i], players[j]], sum });
      }
    }
    return result
      .sort((a, b) => Math.abs(a.sum - level) - Math.abs(b.sum - level))
      .map((item) => item.pair);
  };

  useEffect(() => {
    if (players?.length > 0) {
      const selectedPlayers = players?.filter((item) => item.court === number);
      if (selectedPlayers.length === 4) {
        setCourtPlayers([
          selectedPlayers.find((item) => item.playNo === 0),
          selectedPlayers.find((item) => item.playNo === 1),
          selectedPlayers.find((item) => item.playNo === 2),
          selectedPlayers.find((item) => item.playNo === 3),
        ]);
      }
    }
  }, [number, players]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (courtPlayers[0]?.time) {
        setTimer(formatTimeDifference(courtPlayers[0].time));
      }
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [courtPlayers]);

  return (
    <div className={`court-outter ${virtual && "virtual"}`}>
      <div className="court">
        <div className="court-block court-back row g-0">
          <div className="col-1"></div>
          <div className="col-5"></div>
          <div className="col-5"></div>
          <div className="col-1"></div>
        </div>
        <div className="court-block court-front row g-0">
          <div className="col-1"></div>
          <PlayerCard player={courtPlayers[0]} />
          <PlayerCard player={courtPlayers[1]} />
          <div className="col-1"></div>
        </div>
        <div className="court-block court-middle">
          <div className="d-flex align-items-center gap-2">
            {virtual ? (
              <button onClick={onCreate} className="fw-bold btn btn-virtual">
                新增場地
              </button>
            ) : (
              <>
                <div className="court-no fw-bold fs-5">{number}</div>
                {courtPlayers?.length === 4 &&
                  courtPlayers?.every(
                    (item) => item.status === PLAYER_STATUS["GAME"]
                  ) && <div className="fs-6 text-white">{timer}</div>}
              </>
            )}
          </div>
        </div>
        <div className="court-block court-front row g-0">
          <div className="col-1"></div>
          <PlayerCard player={courtPlayers[2]} />
          <PlayerCard player={courtPlayers[3]} />
          <div className="col-1"></div>
        </div>
        <div className="court-block court-back row g-0">
          <div className="col-1"></div>
          <div className="col-5"></div>
          <div className="col-5"></div>
          <div className="col-1"></div>
        </div>
      </div>
      {!virtual && (
        <>
          {courtPlayers?.length > 0 ? (
            <div className="mt-3 d-flex justify-content-center gap-3">
              {courtPlayers?.every(
                (item) => item.status === PLAYER_STATUS["GAME"]
              ) ? (
                <>
                  <button
                    onClick={handleFinished}
                    className="btn btn-court-outline rounded-pill"
                  >
                    <div className="d-flex align-items-center gap-1">
                      <img
                        src={ScoreIcon}
                        alt="score"
                        width="20"
                        height="20"
                        className="svg-icon-white"
                      />
                      <div>結束比賽</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      handleFinished();
                      handleRandom();
                    }}
                    className="btn btn-court rounded-pill"
                  >
                    <div className="d-flex align-items-center gap-1">
                      <img
                        src={RandomIcon}
                        alt="random"
                        width="20"
                        height="20"
                      />
                      <div>再來一場</div>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-court-outline rounded-pill"
                    onClick={handleCancelRandom}
                  >
                    <div className="d-flex align-items-center gap-1">
                      <img
                        src={CancelIcon}
                        alt="cancel"
                        width="20"
                        height="20"
                        className="svg-icon-white"
                      />
                      <div>取消排場</div>
                    </div>
                  </button>
                  <button
                    className="btn btn-court-outline rounded-pill"
                    onClick={handleRandom}
                  >
                    <div className="d-flex align-items-center gap-1">
                      <img
                        src={ResetIcon}
                        alt="reset"
                        width="20"
                        height="20"
                        className="svg-icon-white"
                      />
                      <div>重新排場</div>
                    </div>
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="btn btn-court rounded-pill"
                  >
                    <div className="d-flex align-items-center gap-1">
                      <img
                        src={ConfirmIcon}
                        alt="confirm"
                        width="20"
                        height="20"
                      />
                      <div>確定排場</div>
                    </div>
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="mt-3 d-flex justify-content-center gap-3">
              {onDelete && localStorage.getItem("courts")?.length > 1 && (
                <button
                  className="btn btn-court-outline rounded-pill"
                  onClick={() => onDelete(number)}
                >
                  <div className="d-flex align-items-center gap-1">
                    <img
                      src={DeleteIcon}
                      alt="delete"
                      width="20"
                      height="20"
                      className="svg-icon-white"
                    />
                    <div>刪除場地</div>
                  </div>
                </button>
              )}
              {courtPlayers?.length === 0 && (
                <button
                  onClick={handleRandom}
                  className="btn btn-court rounded-pill"
                >
                  <div className="d-flex align-items-center gap-1">
                    <img src={RandomIcon} alt="random" width="20" height="20" />
                    <div>隨機排場</div>
                  </div>
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function PlayerCard({ player }) {
  return (
    <div className="col-5 d-flex justify-content-center align-items-center">
      <span className={`player ${convertLevelItem(player?.level)?.level}`}>
        {SPECIAL_NAME.includes(player?.name) ? "🐶" : ""}
        {player?.name}
      </span>
      {/* <img src={PeopleChangeIcon} alt="change" width="20" height="20" /> */}
    </div>
  );
}
