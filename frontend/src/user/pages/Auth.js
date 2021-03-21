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
      try {
        await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login();
        // if the request fails (network issue), the above function (from http-hook) will return undefined. At this point, the user should not be logged in. 
        // All errors are handled by the hook, we simply have to catch it and prevent further code execution
      } catch (e) {}
    } else {
      try {
        await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );
        auth.login();
        console.log('signup successful')
      } catch (e) {}
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
