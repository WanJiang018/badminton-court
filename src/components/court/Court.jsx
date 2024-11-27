import React from "react";

export default function Court({ virtual, middle, players, footer }) {
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
          <div className="col-5">{players?.[0]}</div>
          <div className="col-5">{players?.[1]}</div>
          <div className="col-1"></div>
        </div>
        <div className="court-block court-middle">
          <div className="d-flex align-items-center gap-2">{middle}</div>
        </div>
        <div className="court-block court-front row g-0">
          <div className="col-1"></div>
          <div className="col-5">{players?.[2]}</div>
          <div className="col-5">{players?.[3]}</div>
          <div className="col-1"></div>
        </div>
        <div className="court-block court-back row g-0">
          <div className="col-1"></div>
          <div className="col-5"></div>
          <div className="col-5"></div>
          <div className="col-1"></div>
        </div>
      </div>
      {footer}
    </div>
  );
}
