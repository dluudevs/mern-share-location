import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // there may be a time when sendRequest is being called but the component that called it is no longer mounted, this would create an error
  // workaround is to cancel the http request
  // the value assigned to useRef's current property will not be reinitialized (stored across re-render cycles)when the component using this hook re-renders, calling this hook again (similar to useCallback)
  const activeHttpRequests = useRef([]); // initial value passed to useRef, assign value to .current

  // prevent infinite loop. function does not get recreated when the component that uses this hook re-renders
  // otherwise when the component re-renders and runs this hook again this function will be recreated trigger an inifinite loop
  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true); // this will update state immediately and not get batched with other state updates because it is inside an async function (async functions wrap everything inside of a promise, everything is executed asychronusly)
      const httpAbortCtrlr = new AbortController(); // object that allows you to abort web requests
      activeHttpRequests.current.push(httpAbortCtrlr);
      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrlr.signal, // AbortController signal required to use .abort in useEffect
        });

        // acitveHttpRequests is an array of requests (other components can use this hook and the state is stored within this hook)
        // since httpAbortCtrl is an instance of AbortController (object)it is stored by reference - which is why the below code works
        // this removes the request when it is complete - the useEffect function removes the request when the component is unmounted
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrlr
        );

        const responseData = await response.json();

        // 400 * 500 status code from response (non-JSONIFY response) is not an error, but login is not successful. Response Ok is for all other status codes
        if (!response.ok) {
          throw new Error(responseData.message); // triggers catch block
        }
        setIsLoading(false);
        return responseData;
      } catch (e) {
        console.log(e);
        setError(e.message);
        setIsLoading(false);
        throw error;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    // returned function is executed as a cleanup function. runs before the next cycle of useEffect or when component unmounts (in this case when the component using this hook unmounts)
    const abort = activeHttpRequests.current;
    return () => {
      abort.forEach((abortCtrl) => abortCtrl.abort()); // abort each request. abort is associated with signal, signal property is required in web request for abort to work
    };
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
    clearError,
  };
};
