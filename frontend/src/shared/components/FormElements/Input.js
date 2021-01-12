import React, { useReducer, useEffect } from "react";

import { validate } from "../../util/validators";
import "./Input.css";

// Value of the input component is bound to it's internal state
// However that value is also passed to onInput, a prop that was passed from the useForm hook which manages the state of the form
// When the value of the input changes, input's reducer updates the value in state. useEffect then fires off and passes the value to useForm

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  // useReducer hook takes a callback function and initial state as arguments
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false,
  });

  const { onInput, id } = props;
  const { value, isValid } = inputState;

  // useEffect will always get called on component mount, onInput is always called on mount
  // when called dispatch from useForm is called, which will check the validity of the form. if initialized with valid form and invalid input, the form will
  // be changed to invalid because dispatch is called in useEffect
  useEffect(() => {
    onInput(id, value, isValid);
  }, [onInput, id, value, isValid]);

  const changeHandler = (event) => {
    // argument inside of dispatch is the action object that is passed to inputReducer
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        // onBlur is when element loses focus. eg., use clicks into input and then clicks out
        // without onBlur handler to change isTouched, the form will load in error state before user has a chance to interact with the form
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        row={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
