import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import Users from './user/pages/Users'
import NewPlace from './places/pages/NewPlace'
import MainNavigation from './shared/components/Navigation/MainNavigation';

// by default router parses routes from top to bottom
// without switch component, all paths that are not '/' will get redirected
// with switch, once a path matches. router will stop evaluating for other routes (no redirect)

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
          <Route path="/places/new" exact>
            <NewPlace />
          </Route>
          <Redirect to="/" />
        </Switch>
      </main>   
    </Router>
  )
}

export default App;
