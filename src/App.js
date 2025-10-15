import Menu from "./components/Menu";
import { Route, Routes } from "react-router-dom";
import loadable from "@loadable/component";
//import RedPage from "./pages/RedPage";
//import BluePage from "./pages/BluePage";
//import UsersPage from "./pages/UsersPage";
//import NotFoundPage from "./pages/NotFoundPage";
//import CounterPage from "./pages/CounterPage";

// #. 라우트 컴포넌트 스플리팅
const RedPage = loadable(() => import("./pages/RedPage"));
const BluePage = loadable(() => import("./pages/BluePage"));
const UsersPage = loadable(() => import("./pages/UsersPage"));
const NotFoundPage = loadable(() => import("./pages/NotFoundPage"));
const CounterPage = loadable(() => import("./pages/CounterPage"));

function App() {
  return (
    <div>
      <Menu />
      <hr />
      <Routes>
        <Route path="/red" element={<RedPage />} />
        <Route path="/blue" element={<BluePage />} />
        <Route path="/users/*" element={<UsersPage />} />
        <Route path="/counter" element={<CounterPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
