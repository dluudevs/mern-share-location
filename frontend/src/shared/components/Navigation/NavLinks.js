import React, { useContext } from "react";
// slightly different from link, selected element will get active class
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import Button from '../FormElements/Button';

import "./NavLinks.css";

const NavLinks = (props) => {
  // returns object that holds latest context
  // component will re-render whenever context changes
  const auth = useContext(AuthContext);

  const handleLogout = (e) => {
    e.preventDefault()
    auth.logout()
  }

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/u1/places">MY PLACES</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">ADD PLACES</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <Button onClick={handleLogout}>Logout</Button>
      )}
    </ul>
  );
};

export default NavLinks;
