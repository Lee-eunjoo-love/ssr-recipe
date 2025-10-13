import { startLoading, finishLoading } from "./loading";

export default function createRequestThunk(type, request) {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;

  return (params) => async (dispatch) => {
    dispatch({ type }); // #. 요청 시작됨
    dispatch(startLoading(type));

    try {
      const response = await request(params);
      dispatch({
        type: SUCCESS,
        payload: response.data,
      }); // #. 성공
      dispatch(finishLoading(type));
    } catch (e) {
      dispatch({
        type: FAILURE,
        payload: e,
        error: true,
      }); // #. 에러 발생
      dispatch(startLoading(type));
      throw e;
    }
  };
}

// #. 사용법: createRequestThunk('GET_USERS', api.getUsers);
// #. 사용법: createRequestThunk('GET_USER', api.getUser);
