import axios from "axios";
import { call, put, takeEvery } from "redux-saga/effects";

// #. 액션 타입
const GET_USERS_PENDING = "users/GET_USERS";
const GET_USERS_SUCCESS = "users/GET_USERS_SUCCESS";
const GET_USERS_FIALURE = "users/GET_USERS_FAILURE";

const GET_USER = "users/GET_USER";
const GET_USER_SUCCESS = "users/GET_USER_SUCCESS";
const GET_USER_FAILURE = "users/GET_USER_FAILURE";

// #. 액션 생성 함수
const getUsersPending = () => ({ type: GET_USERS_PENDING });
const getUsersSuccess = (payload) => ({ type: GET_USERS_SUCCESS, payload });
const getUsersFailure = (payload) => ({
  type: GET_USERS_FIALURE,
  error: true,
  payload,
});

export const getUsers = () => async (dispatch) => {
  try {
    dispatch(getUsersPending());
    const response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    dispatch(getUsersSuccess(response.data));
  } catch (e) {
    dispatch(getUsersFailure(e));
    throw e;
  }
};

export const getUser = (id) => ({ type: GET_USER, payload: id });
const getUserSuccess = (payload) => ({ type: GET_USER_SUCCESS, payload });
const getUserFailure = (payload) => ({
  type: GET_USER_FAILURE,
  payload,
  error: true,
});

const getUserById = (id) =>
  axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);

function* getUserSaga(action) {
  try {
    const response = yield call(getUserById, action.payload);
    yield put(getUserSuccess(response.data));
  } catch (e) {
    yield put(getUserFailure(e));
  }
}
export function* usersSaga() {
  yield takeEvery(GET_USER, getUserSaga);
}

// #. 초기 상태
const initialState = {
  users: null,
  user: null,
  loading: {
    users: false,
    user: false,
  },
  error: {
    users: null,
    user: null,
  },
};

// #. 리듀서
function users(state = initialState, action) {
  switch (action.type) {
    case GET_USERS_PENDING:
      return {
        ...state,
        loading: {
          ...state.loading,
          users: true,
        },
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        loading: {
          ...state.loading,
          users: false,
        },
        users: action.payload,
      };
    case GET_USERS_FIALURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          users: false,
        },
        error: {
          ...state.error,
          users: action.payload,
        },
      };
    case GET_USER:
      return {
        ...state,
        loading: {
          ...state.loading,
          user: true,
        },
        error: {
          ...state.error,
          user: null,
        },
      };
    case GET_USER_SUCCESS:
      return {
        ...state,
        loading: {
          ...state.loading,
          user: false,
        },
        user: action.payload,
      };
    case GET_USER_FAILURE:
      return {
        ...state,
        loading: {
          ...state.loading,
          user: false,
        },
        error: {
          ...state.error,
          user: action.payload,
        },
      };
    default:
      return state;
  }
}

export default users;
