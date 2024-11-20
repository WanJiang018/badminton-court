import React, { useState, useEffect } from "react";
import Court from "../components/Court";
import {
  DEFAULT_COURT,
  PLAYER_STATUS,
  PLAYER_ACTION,
} from "../utils/constants";
import { storeCourtsData, storePlayersData } from "../utils/functions";

export default function Arrange() {
  const [players, setPlayers] = useState();
  const [courts, setCourts] = useState(
    Array.from({ length: DEFAULT_COURT }, (_, i) => i + 1)
  );

  const onCreate = () => {
    setCourts((c) => {
      const maxCourt = Math.max(...c);
      const result = [...c, maxCourt + 1];
      storeCourtsData(result);
      return result;
    });
  };

  const onDelete = (number) => {
    const userConfirmed = window.confirm("確定要刪除嗎?");
    if (userConfirmed) {
      setCourts((c) => {
        const result = c.filter((item) => item !== number);
        storeCourtsData(result);
        return result;
      });
    }
  };

  const onUpdatePlayer = (court, status, playerIds) => {
    setPlayers((p) => {
      const result = p.map((item) => {
        let result = { ...item };

        if (item.court === court && status === PLAYER_ACTION["SELECTED"]) {
          result = {
            ...item,
            status: PLAYER_STATUS["REST"],
            court: undefined,
            playNo: undefined,
          };
        }
        if (playerIds.includes(item.id)) {
          if (status === PLAYER_ACTION["GAME"]) {
            result = {
              ...item,
              status: PLAYER_STATUS["GAME"],
              time: new Date().getTime(),
              court,
            };
          } else if (status === PLAYER_ACTION["FINISH"]) {
            result = {
              ...item,
              status: PLAYER_STATUS["REST"],
              time: new Date().getTime(),
              count: item.count + 1,
              court: undefined,
              playNo: undefined,
            };
          } else if (status === PLAYER_ACTION["CANCEL_SELECTED"]) {
            result = {
              ...item,
              status: PLAYER_STATUS["REST"],
              time: new Date().getTime(),
              court: undefined,
              playNo: undefined,
            };
          } else if (status === PLAYER_ACTION["SELECTED"]) {
            result = {
              ...item,
              status: PLAYER_STATUS["SELECTED"],
              court: court,
              playNo: playerIds.indexOf(item.id),
            };
          }
        }
        return result;
      });
      storePlayersData(result);
      return result;
    });
  };

  useEffect(() => {
    localStorage.getItem("players") &&
      setPlayers(JSON.parse(localStorage.getItem("players")));
    localStorage.getItem("courts") &&
      setCourts(JSON.parse(localStorage.getItem("courts")));
  }, []);

  return (
    <div className="row row-cols-1 row-cols-lg-3 g-4 g-lg-4">
      {courts.map((number) => (
        <div key={number} className="col">
          <Court
            number={number}
            players={players}
            onDelete={courts.length > 1 && onDelete}
            onUpdatePlayer={onUpdatePlayer}
          />
        </div>
      ))}
      <div className="col">
        <Court virtual onCreate={onCreate} />
      </div>
    </div>
  );
}
