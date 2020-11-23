import React from "react";

import Card from '../../shared/components/UIElements/Card'
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import './auth.css'

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook.js";

const Authenticate = () => {
  const [formState, inputHandler] = useForm(
    {
      email: { value: "", isValid: false },
      password: { value: "", isValid: false },
    },
    false
  );

  const handleLogin = e => {
    e.preventDefault()
    console.log(formState.inputs)
  }

  return (
    <Card class="authentication"> 
      <h2>Login Required</h2>
      <hr />
      <form>
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
          LOGIN
        </Button>
      </form>
    </Card>
  );
};

export default Authenticate;
