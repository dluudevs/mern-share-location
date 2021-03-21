import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest("http://localhost:5000/api/users"); // by default this function is a get request
        setLoadedUsers(responseData.users);
      } catch (e) {}
    };
    fetchUsers();
  }, [ sendRequest ]); // dependency because this function is coming from outside of the useEffect hook (doesn't matter if it lives in the same component)

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      { !isLoading && loadedUsers && <UsersList items={loadedUsers} /> }
    </>
  );
};

export default Users;
