import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import Card from '../../shared/components/UIElements/Card'


import { useForm } from '../../shared/hooks/form-hook'
import './PlaceForm.css'

const DUMMY_PLACES = [
  {
    id: "pl",
    title: "Empire State Building",
    description: "One of the most famous skyscrapers in the world!",
    imageUrl:
      "https://www.esbnyc.com/sites/default/files/styles/small_feature/public/2019-10/home_banner-min.jpg?itok=uZt-03Vw",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: { lat: 40.7484, lng: -73.9857 },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous skyscrapers in the world!",
    imageUrl:
      "https://www.esbnyc.com/sites/default/files/styles/small_feature/public/2019-10/home_banner-min.jpg?itok=uZt-03Vw",
    address: "20 W 34th St, New York, NY 10001, United States",
    location: { lat: 40.7484, lng: -73.9857 },
    creator: "u2",
  },
];

const UpdatePlace = () => {
  // placeId property is identifier for dynamic portion of route
  const placeId = useParams().placeId;
  const [ isLoading, setIsLoading ] = useState(true)
  
  const [ formState, inputHandler, setFormData ] = useForm({ title: { value: '', isValid: false }, description: { value: '', isValid: false }}, true)

  // This logic will run and return the same object every time. This will not trigger useEffect. This is only the case if we're using DUMMY PLACES as the array
  // However when a function is assigned to a variable it is being created every time. Since it is a new object every time, it triggers a re render 
  const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  useEffect(() => {
    if(identifiedPlace){
      setFormData(
        {
          title: { value: identifiedPlace.title, isValid: true },
          description: { value: identifiedPlace.description, isValid: true },
        },
        true
      );
    }
    setIsLoading(false)
  }, [setFormData, identifiedPlace]) // setFormData because it is provided by a hook, prop functions would have to be included here as well
  

  const placeUpdateSubmitHandler = (e) => {
    e.preventDefault()
    console.log(formState.inputs)
  }

  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  // Only render form when identifiedPlace has a value, this is a temp fix until we hook up a backend 
  if (isLoading){
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    )
  }

  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}> 
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min. 5 characters)."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
