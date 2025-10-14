import Menu from "./components/Menu";
import { Route, Routes } from "react-router-dom";
import RedPage from "./pages/RedPage";
import BluePage from "./pages/BluePage";
import UsersPage from "./pages/UsersPage";
import NotFoundPage from "./pages/NotFoundPage";
import SamplePage from "./pages/SamplePage";
import CounterPage from "./pages/CounterPage";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <div>
      <Menu />
      <hr />
      <Routes>
        <Route path="/red" element={<RedPage />} />
        <Route path="/blue" element={<BluePage />} />
        <Route path="/users/*" element={<UsersPage />}>
          {/*<Route path=":id" element={<UserPage />} />*/}
        </Route>
        <Route path="/sample" element={<SamplePage />} />
        <Route path="/counter" element={<CounterPage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App;
