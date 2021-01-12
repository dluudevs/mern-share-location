import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace";
import Authenticate from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/auth-context";

// by default router parses routes from top to bottom
// switch component will only render matched route (exclusively)
// without switch component anything that matches the route will render.
// this is a problem especially when you have children routes
// since react router does partial matching, exact will match exact path only (eg., /places and /places/new)

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // avoid recreating this function unnecessarily to avoid infinite loops
  const login = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  let routes;

  if (isLoggedIn) {
    routes = (
      // Put switch component here, otherwise using a react fragment messes with the route handling
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        {/* semi colon for dynamic value, like express */}
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        {/* this route must be rendered before /place/:placeId otherwise new would be interpreted as a :placeid */}
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId" exact>
          <UpdatePlace />
        </Route>
        {/* any route that doesn't match the above will redirect to home page. eg., post login /auth route doesnt exist */}
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth" exact>
          <Authenticate />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
    >
      <Router>
        {/* Not wrapped in switch, MainNavigation will always render */}
        <MainNavigation />
        <main>
          { routes }
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
