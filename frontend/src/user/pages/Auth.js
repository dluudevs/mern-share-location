import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook.js";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./auth.css";

const Authenticate = () => {
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // pass in context object to hook to object from this context's provider
  // value retrieved is the value property passed to the context's provider
  // changes to the provider's value will cause a re render wherever that context is used
  const auth = useContext(AuthContext);

  // If there is more than one state setter in a synchronous code block, react will batch these state changes and make one state update / re-render cycle
  const switchModeHandler = () => {
    // if form is not in login mode, the setter below will switch it to login mode. logic inside of if block will be for form in login mode
    if (!isLoginMode) {
      // form is set to valid if email and password are valid. without this the form will never be valid in login mode because name needs to be valid for the form to be valid
      setFormData(
        { ...formState.inputs, name: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      // form is false because by switching to sign up mode, the name input is introduced
      setFormData(
        { ...formState.inputs, name: { value: "", isValid: false } },
        false
      );
    }
    // pass in function to setter if you want to access previous state value
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      // run signup authentication if app is NOT in login mode
      const responseData = await sendRequest(
        "http://localhost:5000/api/users/login",
        "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value,
        }),
        {
          "Content-Type": "application/json",
        }
      )
      // if the request fails (network issue), the above function (from http-hook) will return undefined. At this point, the user should not be logged in
      if ( responseData ) {
        auth.login();
        console.log(responseData)
      }
    } else {
      // try {
      //   setIsLoading(true); // this will update state immediately and not get batched with other state updates because it is inside an async function (async functions wrap everything inside of a promise, everything is executed asychronusly)
      //   const response = await fetch("http://localhost:5000/api/users/signup", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       name: formState.inputs.name.value,
      //       email: formState.inputs.email.value,
      //       password: formState.inputs.password.value,
      //     }),
      //   });
      //   const responseData = await response.json();
      //   setIsLoading(false); // restore state to neutral before login as login will change context the state change may occur for a component that isn't being rendered
      //   // 400 * 500 status code from response is not an error, but login is not successful. Response Ok is for all other status codes
      //   if (!response.ok) {
      //     throw new Error(responseData.message); // triggers catch block
      //   }
      //   auth.login();
      // } catch (error) {
      //   setError(error.message || "Something went wrong, please try again");
      //   setIsLoading(false);
      // }
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card class="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              label="Name"
              type="text"
              placeholder="Name"
              errorText="Please enter a name"
              validators={[VALIDATOR_REQUIRE()]}
              onInput={inputHandler}
            />
          )}
          <Input
            element="input"
            id="email"
            label="Email"
            type="text"
            placeholder="email"
            errorText="Please enter a valid email"
            validators={[VALIDATOR_EMAIL()]}
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            label="Password"
            type="password"
            placeholder="password"
            errorText="Your password needs to be at least 6 characters"
            validators={[VALIDATOR_MINLENGTH(6)]}
            onInput={inputHandler}
          />
          <Button
            type="submit"
            disabled={!formState.isValid}
            onClick={authSubmitHandler}
          >
            {isLoginMode ? "LOGIN" : "SIGNUP"}
          </Button>
          <Button inverse type="button" onClick={switchModeHandler}>
            {isLoginMode ? "SWITCH TO SIGN UP" : "SWITCH TO LOGIN"}
          </Button>
        </form>
      </Card>
    </>
  );
};

export default Authenticate;
