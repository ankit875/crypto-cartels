import { Route, HashRouter, Routes } from "react-router-dom";
import { StartScreen, GameScreen } from "./screens";

const RouteConfiguration = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={"/"} Component={StartScreen} />
        <Route path={"/game"} Component={GameScreen} />
      </Routes>
    </HashRouter>
  );
};

export default RouteConfiguration;
