import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';

// by default router parses routes from top to bottom
// switch component will only render matched route (exclusively)
// without switch component anything that matches the route will render. 
// this is a problem especially when you have children routes
// since react router does partial matching, exact will match exact path only (eg., /places and /places/new)

function App() {
  return (
    <Router>
      {/* Not wrapped in switch, MainNavigation will always render */}
      <MainNavigation />
      <main>
        <Switch>
          <Route path="/" exact>
            <Users />
          </Route>
          {/* semi colon for dynamic value, like express */}
          <Route path="/:userId/places" exact>
            <UserPlaces />
          </Route>
          <Route path="/places/new" exact>
            <NewPlace />
          </Route>
          <Redirect to="/" />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
