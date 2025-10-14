import { /*Outlet, */ Route, Routes } from "react-router-dom";
import UsersContainer from "../containers/UsersContainer";
import UserPage from "./UserPage";
//import RedPage from "./RedPage";

const UsersPage = () => {
  return (
    <>
      <UsersContainer />
      <Routes>
        <Route path=":id" element={<UserPage />} />
        {/*<Route path=":id" element={<RedPage />} />*/}
      </Routes>
      {/*<Outlet />*/}
    </>
  );
};

export default UsersPage;
