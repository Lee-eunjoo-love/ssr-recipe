import { useDispatch, useSelector } from "react-redux";
import Users from "../components/Users";
import { getUsers } from "../modules/users";
import { useEffect } from "react";
import { Preloader } from "../lib/PreloadContext";

const UsersContainer = () => {
  const users = useSelector((state) => state.users.users);
  const dispatch = useDispatch();

  useEffect(() => {
    if (users) return; // #. users 가 이미 유효하다면 요청하지 않음
    dispatch(getUsers());
  }, [dispatch, users]);

  return (
    <>
      <Users users={users} />
      <Preloader resolve={() => dispatch(getUsers)} />
    </>
  );
};

export default UsersContainer;
