import React, { useState } from "react";
import { MENU_DEF } from "../utils/common/constants";
import Arrange from "./Arrange";
import Player from "./Player";
import History from "./History";
import Menu from "../components/common/Menu";
import BadmintonIcon from "../images/icon-badminton.png";

function App() {
  const [tab, setTab] = useState(MENU_DEF["ARRANGE"]);

  function onChangeTab(tab) {
    setTab(tab);
  }

  return (
    <>
      <header className="header d-flex justify-content-center align-items-center gap-2">
        <img src={BadmintonIcon} alt="badminton" />
        <h1>羽球排場小工具</h1>
      </header>
      <Menu tab={tab} onChangeTab={onChangeTab} />
      <div className="px-3 px-lg-5 pb-5">
        {tab === MENU_DEF["ARRANGE"] && <Arrange />}
        {tab === MENU_DEF["PLAYER"] && <Player />}
        {/* {tab === MENU_DEF["HISTORY"] && <History />} */}
      </div>
    </>
  );
}

export default App;
