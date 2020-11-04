import React, { useCallback, useReducer } from "react";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button"
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from "../../shared/util/validators";
import "./PlaceForm.css";

const formReducer = (state, action) => {
  switch (action.type){
    case "INPUT_CHANGE": 
      let formIsValid = true;
      // for the below logic to work, it must be used in a loop and formIsValid must be used with double ampersand especially in the else statement
      for (const inputId in state.inputs){
        if (inputId === action.inputId){
          // first value of the loop wont always be the same as inputId, if a stored inputId's isValid is false then formIsValid becomes false
          // update formIsValid based on input's isValid value
          formIsValid = formIsValid && action.isValid
        } else {
          // use inputId's stored isValid in state to set value of formIsValid
          // because there will always be a value in state.inputs that will not strictly equal actions.inputId, this else statement will always run
          // since this condition runs with the loop, all inputIds will be checked. formIsValid is only true if all isValid values are true
          formIsValid = formIsValid && state.inputs[inputId].isValid
        }
      }
      return { 
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid }
        },
        isValid: formIsValid 
      }
    default: 
      return state
  }
}

const NewPlace = () => {
  // useReducer for managing multiple states
  const [ formState, dispatch] = useReducer(formReducer, {
    inputs: {
      title: { value: '', isValid: false },
      description: { value: '', isValid: false },
      address: { value: '', isValid: false }
    },
    // form validity, when form is invalid display error messages
    isValid: false
  })


  // this function must not trigger a re-render, re-render will run this functional component again, creatiing titleInput handler again
  // thus triggering the useEffect hook inside of the input component creating an infinite loop
  // useCallback solves that with second argument which is an array of dependencies for when the function inside should be re-created (re-render)
  // since there are no dependencies, when this functional component re-renders this function will be reused and not re-created. Breaks the potential infinite loop
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: 'INPUT_CHANGE',
      value,
      isValid,
      inputId: id
    })
  }, []);

  const placeSubmitHandler = event => {
    event.preventDefault()
    console.log(formState.inputs)
  }

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        type="text"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="textarea"
        type="text"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address"
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>ADD PLACE</Button>
    </form>
  );
};

export default NewPlace;
