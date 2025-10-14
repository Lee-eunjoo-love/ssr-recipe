import { createContext, useContext } from "react";

// #. 클라이언트 환경 : null
// #. 서버 환경: { done: false, promises: [] }
const PreloadContext = createContext(null);
export default PreloadContext;

// #. resolve : 함수 타입
export const Preloader = ({ resolve }) => {
  const preloadContext = useContext(PreloadContext);
  if (!preloadContext) return null; // #. context 값이 유효하지 않으면 아무것도 하지 않음
  if (preloadContext.done) return null; // #. 이미 작업이 끝났다면 아무것도 하지 않음

  // #. promises 배열에 프로미스 등록
  //    (resolve 함수가 프로미스를 반환하지 않더라도 프로미스로 취급하기 위해 Promise.resolve 함수 사용하여 등록)
  preloadContext.promises.push(Promise.resolve(resolve()));
  return null;
};

// #. 사용자 정의 usePreloader Hook
export const usePreloader = (resolve) => {
  const preloadContext = useContext(PreloadContext);
  if (!preloadContext) return null; // #. context 값이 유효하지 않으면 아무것도 하지 않음
  if (preloadContext.done) return null; // #. 이미 작업이 끝났다면 아무것도 하지 않음

  // #. promises 배열에 프로미스 등록
  //    (resolve 함수가 프로미스를 반환하지 않더라도 프로미스로 취급하기 위해 Promise.resolve 함수 사용하여 등록)
  preloadContext.promises.push(Promise.resolve(resolve()));
};

/**
 * PreloadContext : 서버 사이드 렌더링을 하는 과정에서 처리해야 할 작업들을 실행하고 만약 기다려야 하는 프로미스가 있으면 수집한다.
 *                  모든 프로미스를 수집한 뒤 수집된 프로미스들이 끝날때까지 기다렸다가 그 다음에 다시 렌더링하면 데이터가 채워진 상태로 컴포넌트들이 나타나게 된다.
 *
 * Preloader 컴포넌트 : resolve 함수를 props로 받아 오며 컴포넌트가 렌더링될 때 서버 환경에서만 resolve 함수를 호출해 준다.
 *
 * 사용자 정의 usePreloader Hook :
 *   Preloader 컴포넌트를 사용하여 서버 사이드 렌더링을 하기 전 데이터가 필요한 상황에서 API 를 요청하는 작업을 사용자 정의 usePreloader Hook 을 사용하여 대체 가능.
 */
