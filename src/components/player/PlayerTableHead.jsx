import React, { useState } from "react";

export default function PlayerTableHead({ columns, onSort }) {
  const [sortOrders, setSortOrders] = useState({});

  const handleSort = (field) => {
    const newOrder = sortOrders[field] === "desc" ? "asc" : "desc";
    setSortOrders((prevOrders) => ({ ...prevOrders, [field]: newOrder }));
    onSort(field, newOrder);
  };

  return (
    <thead className="table-main">
      <tr>
        {columns.map((item) => (
          <th
            key={item.key}
            className={item.sort && `sort ${sortOrders[item.key]}`}
            onClick={() => item.sort && handleSort(item.key)}
          >
            {item.name}
          </th>
        ))}
      </tr>
    </thead>
  );
}
