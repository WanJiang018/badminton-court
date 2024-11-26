import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlayerActionTypes } from "../redux/actions/playerActions";
import { CourtActionTypes } from "../redux/actions/courtActions";
import Court from "../components/Court";

export default function Arrange() {
  const dispatch = useDispatch();
  const { courts } = useSelector((state) => state.courts);
  const [courtList, setCourtList] = useState([]);

  useEffect(() => {
    dispatch({ type: PlayerActionTypes["GET"] });
    dispatch({ type: CourtActionTypes["GET"] });
  }, [dispatch]);

  useEffect(() => {
    setCourtList(courts);
  }, [courts]);

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
