import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerActionTypes } from "../redux/actions/playerActions";
import { CourtActionTypes } from "../redux/actions/courtActions";
import { PLAYER_STATUS } from "../utils/players/constants";
import { formatTimeDifference } from "../utils/common/functions";
import {
  selectInitialPlayers,
  balancePlayerLevels,
  adjustPlayerGroups,
} from "../utils/courts/functions";
import PlayerCard from "./PlayerCard";
import RandomIcon from "../images/icon-random.png";
import DeleteIcon from "../images/icon-delete.svg";
import ResetIcon from "../images/icon-reset.png";
import ConfirmIcon from "../images/icon-confirm.svg";
import CancelIcon from "../images/icon-cancel.png";
import ScoreIcon from "../images/icon-21.png";
import NextIcon from "../images/icon-next.svg";

export default function Court({ number, virtual }) {
  const dispatch = useDispatch();
  const { courts } = useSelector((state) => state.courts);
  const { players } = useSelector((state) => state.players);
  const [courtPlayers, setCourtPlayers] = useState([]);
  const [timer, setTimer] = useState();
  const intervalRef = useRef();

  const handleRandom = () => {
    const restPlayers = players
      ?.filter(
        (player) =>
          player.name &&
          (player.status === PLAYER_STATUS.REST ||
            (player.status === PLAYER_STATUS.SELECTED &&
              player.court === number))
      )
      .sort((a, b) => a.count - b.count || (a.time || 0) - (b.time || 0));

    if (!restPlayers || restPlayers.length < 4) {
      alert("人數不足，無法排場");
      return;
    }

    let selectedPlayers = selectInitialPlayers(restPlayers);
    selectedPlayers = balancePlayerLevels(selectedPlayers, restPlayers);
    selectedPlayers = adjustPlayerGroups(selectedPlayers);

    updateCourtPlayers(selectedPlayers);
  };

  const updateCourtPlayers = (selectedPlayers) => {
    setCourtPlayers(selectedPlayers);

    players
      .filter(
        (item) =>
          item.court === number && item.status === PLAYER_STATUS["SELECTED"]
      )
      .forEach((item) => {
        dispatch({
          type: PlayerActionTypes["UPDATE"],
          payload: {
            ...item,
            status: PLAYER_STATUS["REST"],
            court: undefined,
            playNo: undefined,
          },
        });
      });

    selectedPlayers.forEach((item, index) => {
      dispatch({
        type: PlayerActionTypes["UPDATE"],
        payload: {
          ...item,
          status: PLAYER_STATUS["SELECTED"],
          court: number,
          playNo: index,
        },
      });
    });
  };

  const handleFinished = () => {
    clearInterval(intervalRef?.current);
    setCourtPlayers([]);
    courtPlayers.forEach((item, _index) => {
      dispatch({
        type: PlayerActionTypes["UPDATE"],
        payload: {
          ...item,
          status: PLAYER_STATUS["REST"],
          time: new Date().getTime(),
          count: item.count + 1,
          court: undefined,
          playNo: undefined,
        },
      });
    });
  };

  const handleConfirm = () => {
    courtPlayers.forEach((item, _index) => {
      dispatch({
        type: PlayerActionTypes["UPDATE"],
        payload: {
          ...item,
          status: PLAYER_STATUS["GAME"],
          time: new Date().getTime(),
          court: number,
        },
      });
    });
  };

  const handleCancelRandom = () => {
    setCourtPlayers([]);
    courtPlayers.forEach((item, _index) => {
      dispatch({
        type: PlayerActionTypes["UPDATE"],
        payload: {
          ...item,
          status: PLAYER_STATUS["REST"],
          time: new Date().getTime(),
          court: undefined,
          playNo: undefined,
        },
      });
    });
  };

  const handleCreateCourt = () =>
    dispatch({
      type: CourtActionTypes["CREATE"],
    });

  const handleDeleteCourt = (number) => {
    const userConfirmed = window.confirm("確定要刪除嗎?");
    if (userConfirmed) {
      dispatch({
        type: CourtActionTypes["DELETE"],
        payload: number,
      });
    }
  };

  useEffect(() => {
    if (!virtual && players?.length > 0) {
      const selectedPlayers = players?.filter((item) => item.court === number);
      if (selectedPlayers.length === 4) {
        setCourtPlayers(selectedPlayers.sort((a, b) => a.playNo - b.playNo));
      }
    }
  }, [number, players, virtual]);

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
          <PlayerCard player={courtPlayers[0]} players={players} />
          <PlayerCard player={courtPlayers[1]} players={players} />
          <div className="col-1"></div>
        </div>
        <div className="court-block court-middle">
          <div className="d-flex align-items-center gap-2">
            {virtual ? (
              <button
                onClick={handleCreateCourt}
                className="fw-bold btn btn-virtual"
              >
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
          <PlayerCard player={courtPlayers[2]} players={players} />
          <PlayerCard player={courtPlayers[3]} players={players} />
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
            <div className="mt-3 d-flex justify-content-center gap-2">
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
                      <img src={NextIcon} alt="random" width="20" height="20" />
                      <div>下一場</div>
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
              {courts?.length > 1 && (
                <button
                  className="btn btn-court-outline rounded-pill"
                  onClick={() => handleDeleteCourt(number)}
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
      {/* <div className="fw-bold text-light">
        <hr />
        <span>
          下一場: <span className="text-beginner">A</span>、
          <span className="text-upper-intermediate">B</span>
          <span className="mx-2">vs</span>
          <span className="text-novice">C</span>、
          <span className="text-beginner">D</span>
        </span>
      </div> */}
    </div>
  );
}
