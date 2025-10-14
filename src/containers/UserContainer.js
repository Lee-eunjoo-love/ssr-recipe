import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import User from "../components/User";
import { Preloader, usePreloader } from "../lib/PreloadContext";
import { getUser } from "../modules/users";

const UserContainer = ({ id }) => {
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();

  // #. 사용자정의 usePreloader Hook 사용하기
  usePreloader(() => dispatch(getUser(id)));

  useEffect(() => {
    if (user && user.id === parseInt(id, 10)) return; // 이미 유효한 사용자이면 요청하지 않음

    dispatch(getUser(id));
  }, [dispatch, id, user]);

  // #. 유효성 검사 후 null 반환해야 하는 경우 null 대신 Preloader 반환
  /*if (!user) {
    return <Preloader resolve={() => dispatch(getUser(id))} />;
  }*/
  // #. 유효성 검사 후 null 반환해야 하는 경우 null 대신 Preloader 반환하는 로직을 사용자정의 usePreloader Hook 사용시 null 반환
  if (!user) return null;

  return <User user={user} />;
};

export default UserContainer;
