import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { PLAYER_TABLE_COLUMNS } from "../../utils/players/constants";
import PlayerTableHead from "./PlayerTableHead";
import PlayerRow from "./PlayerRow";

export default function PlayerTable() {
  const [list, setList] = useState([]);
  const { players } = useSelector((state) => state.players);

  const onSort = (key, order = "desc") => {
    setList((p) =>
      [...p].sort((a, b) => {
        // Handle multiple keys
        if (Array.isArray(key)) {
          for (let k of key) {
            let compareResult = 0;

            // Handle Chinese characters
            if (typeof a[k] === "string" && /[\u4e00-\u9fa5]/.test(a[k])) {
              compareResult = a[k].localeCompare(b[k], "zh-TW");
            } else {
              // Handle non-Chinese values
              if (a[k] < b[k]) compareResult = -1;
              if (a[k] > b[k]) compareResult = 1;
            }

            // If current key comparison is not equal, return result
            if (compareResult !== 0) {
              return order === "desc" ? compareResult : -compareResult;
            }
          }
          return 0;
        }

        // Handle single key (backwards compatible)
        if (typeof a[key] === "string" && /[\u4e00-\u9fa5]/.test(a[key])) {
          return order === "desc"
            ? a[key].localeCompare(b[key], "zh-TW")
            : b[key].localeCompare(a[key], "zh-TW");
        }

        if (a[key] < b[key]) return order === "desc" ? -1 : 1;
        if (a[key] > b[key]) return order === "desc" ? 1 : -1;
        return 0;
      })
    );
  };

  useEffect(() => {
    setList(players);
  }, [players]);

  return (
    list?.length > 0 && (
      <div
        style={{
          "overflow-x": "scroll",
        }}
      >
        <table className="table table-striped">
          <PlayerTableHead columns={PLAYER_TABLE_COLUMNS} onSort={onSort} />
          <tbody>
            {list.map((player) => (
              <PlayerRow key={player.id} data={player} />
            ))}
          </tbody>
        </table>
      </div>
    )
  );
}
