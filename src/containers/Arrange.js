import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerActionTypes } from "../redux/actions/playerActions";
import { CourtActionTypes } from "../redux/actions/courtActions";
import Court from "../components/Court";

export default function Arrange() {
  const dispatch = useDispatch();
  const { courts } = useSelector((state) => state.courts);
  const [courtList, setCourtList] = useState([]);
  console.log("courts", courts);
  useEffect(() => {
    dispatch({ type: PlayerActionTypes["GET"] });
    dispatch({ type: CourtActionTypes["GET"] });
  }, [dispatch]);

  useEffect(() => {
    setCourtList(courts);
  }, [courts]);

  // const onUpdatePlayer = (court, status, playerIds) => {
  //   setPlayers((p) => {
  //     const result = p.map((item) => {
  //       let result = { ...item };

  //       if (item.court === court && status === PLAYER_ACTION["SELECTED"]) {
  //         result = {
  //           ...item,
  //           status: PLAYER_STATUS["REST"],
  //           court: undefined,
  //           playNo: undefined,
  //         };
  //       }
  //       if (playerIds.includes(item.id)) {
  //         if (status === PLAYER_ACTION["GAME"]) {
  //           result = {
  //             ...item,
  //             status: PLAYER_STATUS["GAME"],
  //             time: new Date().getTime(),
  //             court,
  //           };
  //         } else if (status === PLAYER_ACTION["FINISH"]) {
  //           result = {
  //             ...item,
  //             status: PLAYER_STATUS["REST"],
  //             time: new Date().getTime(),
  //             count: item.count + 1,
  //             court: undefined,
  //             playNo: undefined,
  //           };
  //         } else if (status === PLAYER_ACTION["CANCEL_SELECTED"]) {
  //           result = {
  //             ...item,
  //             status: PLAYER_STATUS["REST"],
  //             time: new Date().getTime(),
  //             court: undefined,
  //             playNo: undefined,
  //           };
  //         } else if (status === PLAYER_ACTION["SELECTED"]) {
  //           result = {
  //             ...item,
  //             status: PLAYER_STATUS["SELECTED"],
  //             court: court,
  //             playNo: playerIds.indexOf(item.id),
  //           };
  //         }
  //       }
  //       return result;
  //     });
  //     storePlayersData(result);
  //     return result;
  //   });
  // };

  return (
    <div className="row row-cols-1 row-cols-lg-3 g-4 g-lg-4">
      {courtList?.map((number) => (
        <div key={number} className="col">
          <Court number={number} />
        </div>
      ))}
      <div className="col">
        <Court virtual />
      </div>
    </div>
  );
}
