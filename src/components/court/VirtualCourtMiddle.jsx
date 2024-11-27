import React from "react";
import { useDispatch } from "react-redux";
import { CourtActionTypes } from "../../redux/actions/courtActions";

export default function VirtualCourtMiddle() {
  const dispatch = useDispatch();
  const handleCreateCourt = () =>
    dispatch({ type: CourtActionTypes["CREATE"] });

  return (
    <div className="d-flex align-items-center gap-2">
      <button onClick={handleCreateCourt} className="fw-bold btn btn-virtual">
        新增場地
      </button>
    </div>
  );
}
