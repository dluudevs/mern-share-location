import React, { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import "./auth.css";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook.js";
import { AuthContext } from "../../shared/context/auth-context"

const Authenticate = () => {
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  const [isLoginMode, setIsLoginMode] = useState(true);

  const auth = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();
    auth.login()
    console.log(formState.inputs);
  };

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

  return (
    <Card class="authentication">
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
          onClick={handleLogin}
        >
          {isLoginMode ? "LOGIN" : "SIGNUP"}
        </Button>
        <Button inverse type="button" onClick={switchModeHandler}>
          {isLoginMode ? "SWITCH TO SIGN UP" : "SWITCH TO LOGIN"}
        </Button>
      </form>
    </Card>
  );
};

export default Authenticate;
