import axios from "axios";

// #. 액션 타입
const GET_USERS_PENDING = "users/GET_USERS_PENDING";
const GET_USERS_SUCCESS = "users/GET_USERS_SUCCESS";
const GET_USERS_FIALURE = "users/GET_USERS_FAILURE";

// #. 액션 생성 함수
const getUsersPending = () => ({ type: GET_USERS_FIALURE });
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
    default:
      return state;
  }
}

export default users;
