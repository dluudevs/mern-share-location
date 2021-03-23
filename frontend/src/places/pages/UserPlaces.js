import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import PlaceList from "../components/PlaceList";
const UserPlaces = () => {
  // hook returns an object with dynamic segments (eg., the colon in the route path="/:userId/places")
  // since this component's parent route has a dynamic element in the route, it is used here
  const userId = useParams().userId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [ loadedPlaces, setLoadedPlaces ] = useState([]);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
        setLoadedPlaces(responseData.places);
      } catch (e) {}
    }
    fetchPlaces()
  }, [ sendRequest, userId ])

  console.log(loadedPlaces);

  return (
    <>
      {isLoading && (
        <div className="center">
          <LoadingSpinner useOverlay />
        </div>
      )}
      { !isLoading && loadedPlaces && <PlaceList items={loadedPlaces} /> }
      {error && <ErrorModal error={error} onClear={clearError} />}
    </>
  );
};

export default UserPlaces;
