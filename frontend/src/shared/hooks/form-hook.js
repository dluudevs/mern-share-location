import { useCallback, useReducer } from 'react'

const formReducer = (state, action) => {
  switch (action.type){
    case "INPUT_CHANGE": 
      let formIsValid = true;
      // for the below logic to work, it must be used in a loop and formIsValid must be used with double ampersand especially in the else statement
      for (const inputId in state.inputs){
        // if input has a falsey value (eg., name: undefined when toggle form mode)
        if(!state.inputs[inputId]){
          // continues loop without running the code below it
          continue;
        }
        if (inputId === action.inputId){
          // checks isValid of input that just changed
          // if the action's inputId matches the current inputId in the loop check if the action isValid. Form is only valid if formIsValid and action isValid
          // formIsValid's value can change until the loop is completed
          formIsValid = formIsValid && action.isValid
        } else {
          // checks isValid of input in state
          // if the action's inputID does not match the current inputId in the loop, refer to the state to retrieve value of isValid - every input's isValid is set inside of state on inputChange
          // all it takes is one input to be invalid for the form to be invalid, once formIsValid is set to false there is no code to set it to true again
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
    case 'SET_DATA':
      return {
        inputs: action.inputs,
        isValid: action.isValid,
      }
    default: 
      return state
  }
}

export const useForm = (initialInputs, initialFormValidity) => {
  // useReducer for managing multiple states
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    // form validity, when form is invalid display error messages
    isValid: initialFormValidity,
  });

  // this function must not trigger a re-render, re-render will run this functional component again, creatiing inputHandler again
  // thus triggering the useEffect hook inside of the input component creating an infinite loop. where useEffect will run every time the inputHandler changes
  // useCallback solves that with second argument which is an array of dependencies for when the function inside should be re-created (re-render). when the function recreates the inputHandler prop will have been deemed changed inside of the input component
  // since there are no dependencies, when this functional component re-renders this function will be reused and not re-created. Breaks the potential infinite loop
  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value,
      isValid,
      inputId: id,
    });
  }, []);

  // used to explicitly set state of hook
  // ie., when api call is completed call this function. As React does not allow you to call hook inside of another block (ie., calling useForm hook inside of .then() or another function)
  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      isValid: formValidity,
    })
  }, [])

  return [ formState, inputHandler, setFormData]
}