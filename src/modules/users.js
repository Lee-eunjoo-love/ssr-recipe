import { handleActions } from "redux-actions";
import * as api from "../lib/api";
import createRequestThunk from "../lib/createRequestThunk";

// #. 액션 타입
const GET_USERS = "users/GET_USERS";
const GET_USERS_SUCCESS = "users/GET_USERS_SUCCESS";

const GET_USER = "users/GET_USER";
const GET_USER_SUCCESS = "users/GET_USER_SUCCESS";

// #. 액션 생성 함수
export const getUsers = createRequestThunk(GET_USERS, api.getUsers);
export const getUser = createRequestThunk(GET_USER, api.getUser);

// #. 초기 상태
const initialState = {
  users: null,
  user: null,
  error: null,
};

// #. 리듀서
const users = handleActions(
  {
    [GET_USERS_SUCCESS]: (state, action) => ({
      ...state,
      users: action.payload,
    }),
    [GET_USER_SUCCESS]: (state, action) => ({
      ...state,
      user: action.payload,
    }),
  },
  initialState
);

export default users;
