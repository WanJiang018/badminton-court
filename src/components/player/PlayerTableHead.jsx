import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerActionTypes } from "../../redux/actions/playerActions";
import { PLAYER_STATUS } from "../../utils/players/constants";
import {
  isActiveStatus,
  isReadOnlyStatus,
} from "../../utils/players/functions";

export default function PlayerTableHead({ columns, onSort }) {
  const dispatch = useDispatch();
  const { players } = useSelector((state) => state.players);
  const [sortOrders, setSortOrders] = useState({});

  const handleSort = (field) => {
    const newOrder = sortOrders[field] === "desc" ? "asc" : "desc";
    setSortOrders((prevOrders) => ({ ...prevOrders, [field]: newOrder }));
    onSort(field, newOrder);
  };

  const statusCounts = useMemo(() => {
    const activeCount = players.filter((item) =>
      isActiveStatus(item.status)
    ).length;
    const totalCount = players.length;
    return {
      isAllActive: activeCount === totalCount,
      isAllInactive: activeCount === 0,
      isInterminate: activeCount > 0 && activeCount < totalCount,
    };
  }, [players]);

  const handleCheckAll = () => {
    players
      .filter((item) => !isReadOnlyStatus(item.status))
      .forEach((item) => {
        let status = item.status;
        if (statusCounts.isInterminate) {
          if (!isActiveStatus(status)) {
            status = PLAYER_STATUS["REST"];
          }
        } else if (statusCounts.isAllActive) {
          status = PLAYER_STATUS["ABSENT"];
        } else if (statusCounts.isAllInactive) {
          status = PLAYER_STATUS["REST"];
        }
        dispatch({
          type: PlayerActionTypes["UPDATE"],
          payload: {
            ...item,
            status,
          },
        });
      });
  };

  return (
    <thead>
      <tr>
        {columns.map((item) =>
          item.key === "checkbox" ? (
            <th key={item.key}>
              <input
                type="checkbox"
                class={`form-check-input ${
                  statusCounts.isInterminate ? "indeterminate" : ""
                }`}
                onClick={handleCheckAll}
                checked={players.some((item) => isActiveStatus(item.status))}
              />
            </th>
          ) : (
            <th
              key={item.key}
              className={
                item.sort
                  ? `sort ${sortOrders[item.key] ? sortOrders[item.key] : ""}`
                  : ""
              }
              onClick={() => item.sort && handleSort(item.key)}
            >
              {item.name}
            </th>
          )
        )}
      </tr>
    </thead>
  );
}
